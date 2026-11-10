/**
 * BitTV-style live channel feed.
 *
 * BitTV (com.live_streaming_tv.online_tv, the Bang-Yadi / Duktek mod) ships no
 * channel list in its APK — its lineup is a JSON feed fetched at runtime from
 * the mod author's server (`https://duktetek.id/?device=<id>`). We mimic that
 * capability: on boot we try to fetch a third-party JSON channel feed and, when
 * it succeeds, it REPLACES the built-in 164-channel lineup (just as BitTV shows
 * only its feed). Any failure (network, DNS, unparseable, zero channels) falls
 * back to the built-in list so the app is never empty.
 *
 * The exact payload shape could not be inspected while the domain is down
 * (it is NXDOMAIN at the .id registry), so `parseFeedText` is deliberately
 * tolerant: it accepts an array, or an object carrying the array under a small
 * set of common keys, and reads each channel's fields from a set of aliases.
 *
 * The fetched entries are unverified for CORS (BitTV gets away with direct
 * play only because it is a native FFmpeg player), so they are marked
 * `relay: true` and play through this host's own `/stream` passthrough.
 */
import { customColor } from "./model";
import type { Channel } from "../data";

/** Where the feed is fetched from by default (overridable in Settings). */
export const FEED_URL = "https://duktetek.id/?device=bittv";

const FEED_KEY = "nusatv.feed.v1";
const FEED_URL_KEY = "nusatv.feed.url.v1";
const FEED_OFF_KEY = "nusatv.feed.off.v1";

export type FeedEntry = {
  title: string;
  url: string;
  group: string;
  logo?: string;
};

export type FeedCache = {
  url: string;
  fetchedAt: number;
  entries: FeedEntry[];
};

/** The live source the UI is currently showing. */
export type FeedStatus = {
  /** "feed" = third-party feed is live; "builtin" = built-in 164 list. */
  mode: "feed" | "builtin";
  /** The URL we last tried / are using. */
  url: string;
  /** When the currently-shown feed was fetched (null when on built-in). */
  fetchedAt: number | null;
  /** Human-readable reason we are on built-in (null when feed is live). */
  reason: string | null;
  /** Number of channels in the currently-shown lineup. */
  count: number;
  /** True while a refresh is in flight. */
  loading: boolean;
  /** True when the user forced the built-in lineup (feed fetching paused). */
  disabled: boolean;
};

/* ---------------------------------------------------------------- storage */

export function loadFeedCache(): FeedCache | null {
  try {
    const raw = localStorage.getItem(FEED_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as FeedCache;
    return v && Array.isArray(v.entries) && v.entries.length > 0 ? v : null;
  } catch {
    return null;
  }
}

export function saveFeedCache(c: FeedCache | null): void {
  try {
    if (c) localStorage.setItem(FEED_KEY, JSON.stringify(c));
    else localStorage.removeItem(FEED_KEY);
  } catch {
    /* private mode */
  }
}

/** User's chosen feed URL (defaults to FEED_URL when unset). */
export function loadFeedUrl(): string {
  try {
    const v = localStorage.getItem(FEED_URL_KEY);
    return v && v.trim() ? v.trim() : FEED_URL;
  } catch {
    return FEED_URL;
  }
}

export function saveFeedUrl(url: string): void {
  try {
    if (url.trim() === FEED_URL) localStorage.removeItem(FEED_URL_KEY);
    else localStorage.setItem(FEED_URL_KEY, url.trim());
  } catch {
    /* private mode */
  }
}

/** "Always use the built-in lineup" override (survives reloads, default off). */
export function loadFeedOff(): boolean {
  try {
    return localStorage.getItem(FEED_OFF_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveFeedOff(off: boolean): void {
  try {
    if (off) localStorage.setItem(FEED_OFF_KEY, "1");
    else localStorage.removeItem(FEED_OFF_KEY);
  } catch {
    /* private mode */
  }
}

/* ---------------------------------------------------------------- fetch */

/**
 * Fetch the feed text: try a direct browser fetch, then fall back to this
 * host's `/fetch?url=` relay (which is unrestricted and dodges CORS), exactly
 * like the m3u preset loader. Returns the body text, or null when both fail.
 */
export async function fetchFeedText(url: string): Promise<string | null> {
  let note = "";
  for (const target of [url, `/fetch?url=${encodeURIComponent(url)}`]) {
    try {
      const res = await fetch(target);
      if (!res.ok) {
        note = `HTTP ${res.status}`;
        continue;
      }
      const text = await res.text();
      if (text.trim()) return text;
      note = "empty body";
    } catch {
      note = "network/CORS blocked";
    }
  }
  void note; // surfaced by the caller via its own reason string
  return null;
}

/* ---------------------------------------------------------------- parse */

const CONTAINER_KEYS = ["channels", "data", "list", "result", "items", "streams"] as const;
const TITLE_KEYS = ["name", "title", "channel_name", "channel", "tv_name"] as const;
const URL_KEYS = ["source", "url", "stream", "link", "stream_url"] as const;
const GROUP_KEYS = ["group", "country", "menu_name", "group_title", "category", "genre"] as const;
const LOGO_KEYS = ["logo", "image", "icon", "logo_url", "img"] as const;

function firstString(obj: Record<string, unknown>, keys: readonly string[]): string {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

function isTruthy(v: unknown): boolean {
  return v === true || v === 1 || v === "1" || v === "true";
}

/**
 * Parse a BitTV-shaped feed into live channel entries. Tolerant of the common
 * container shapes and key aliases; live-only (skips movie/VOD entries).
 * Returns null for non-JSON or zero valid entries (fail-closed).
 */
export function parseFeedText(text: string): FeedEntry[] | null {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }

  let arr: unknown[] = [];
  if (Array.isArray(data)) {
    arr = data;
  } else if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of CONTAINER_KEYS) {
      if (Array.isArray(obj[key])) {
        arr = obj[key] as unknown[];
        break;
      }
    }
  }
  if (arr.length === 0) return null;

  const out: FeedEntry[] = [];
  for (const item of arr) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    if (isTruthy(o.is_movie)) continue; // live lineup only
    const title = firstString(o, TITLE_KEYS);
    const url = firstString(o, URL_KEYS);
    if (!title || !url) continue;
    const group = firstString(o, GROUP_KEYS) || "BitTV";
    const logo = firstString(o, LOGO_KEYS) || undefined;
    out.push({ title, url, group, logo });
    if (out.length >= 2000) break;
  }
  return out.length > 0 ? out : null;
}

/* ---------------------------------------------------------------- channels */

/**
 * Map parsed feed entries onto the app's Channel model. Feed channels are
 * numbered from 200 (the user's m3u playlist uses 100+), grouped by their feed
 * `group`, and marked `relay: true` so unverified third-party streams play via
 * the `/stream` passthrough.
 */
export function feedToChannels(entries: FeedEntry[]): Channel[] {
  const map = new Map<string, Channel>();
  let nextNum = 200;
  for (const e of entries) {
    const key = e.title
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();
    if (key && map.has(key)) continue; // de-dupe by normalized title
    const ch: Channel = {
      id: `f${nextNum}`,
      num: nextNum,
      name: e.title.slice(0, 48),
      abbr: (e.title.replace(/[^A-Za-z0-9 ]/g, "").trim().split(/\s+/)[0] ?? "CH").slice(0, 6).toUpperCase(),
      bg: customColor(e.title + e.url),
      fg: "#ffffff",
      cat: e.group,
      pool: "live",
      hd: true,
      now: "Live broadcast",
      next: "Programme follows",
      prog: 50,
      src: e.url,
      relay: true,
    };
    map.set(key || `id_${nextNum}`, ch);
    nextNum++;
  }
  return Array.from(map.values());
}
