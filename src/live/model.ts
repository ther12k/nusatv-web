export type LayoutId = "studio" | "broadcast" | "mosaic" | "cinema";
export type ListSide = "left" | "right";
export type Density = "comfortable" | "compact";
export type MosaicCount = 4 | 6 | 9;

export type LiveConfig = {
  layout: LayoutId;
  listSide: ListSide;
  density: Density;
  mosaicCount: MosaicCount;
  showEpgStrip: boolean;
  showNowNext: boolean;
  showChannelNumbers: boolean;
  autoHideChrome: boolean;
  /** Hide channels the server probe marked offline (unknown stays visible). */
  hideOffline: boolean;
};

export const DEFAULT_CONFIG: LiveConfig = {
  layout: "studio",
  listSide: "left",
  density: "comfortable",
  mosaicCount: 6,
  showEpgStrip: true,
  showNowNext: true,
  showChannelNumbers: true,
  autoHideChrome: false,
  hideOffline: false,
};

export type LayoutPreset = {
  id: LayoutId;
  label: string;
  kicker: string;
  blurb: string;
  keys: string;
  apply: Partial<LiveConfig>;
};

export const LAYOUTS: LayoutPreset[] = [
  {
    id: "studio",
    label: "Studio",
    kicker: "Master control",
    blurb: "Channel list beside the player — the rack-room default.",
    keys: "Alt+1",
    apply: { layout: "studio", listSide: "left", showNowNext: true, autoHideChrome: false },
  },
  {
    id: "broadcast",
    label: "Broadcast",
    kicker: "Player + day grid",
    blurb: "Player on top, programme grid by day underneath.",
    keys: "Alt+2",
    apply: { layout: "broadcast", showEpgStrip: true, autoHideChrome: false },
  },
  {
    id: "mosaic",
    label: "Mosaic",
    kicker: "Multi-view",
    blurb: "Several channels at once. Tap a tile to focus it.",
    keys: "Alt+3",
    apply: { layout: "mosaic", mosaicCount: 6, autoHideChrome: false },
  },
  {
    id: "cinema",
    label: "Cinema",
    kicker: "Player fills the room",
    blurb: "Chrome tucks away. List slides in on L or hover.",
    keys: "Alt+4",
    apply: { layout: "cinema", autoHideChrome: true, showNowNext: true },
  },
];

const CONFIG_KEY = "iptv.live.config.v1";
const FAV_KEY = "iptv.live.favs.v1";
const LAST_KEY = "iptv.live.last.v1";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode */
  }
}

export function loadConfig(): LiveConfig {
  const stored = read<Partial<LiveConfig>>(CONFIG_KEY, {});
  return { ...DEFAULT_CONFIG, ...stored };
}

export function saveConfig(config: LiveConfig) {
  write(CONFIG_KEY, config);
}

export function loadFavs(): string[] {
  const v = read<string[]>(FAV_KEY, ["sky", "bbc1", "hbo"]);
  return Array.isArray(v) ? v : [];
}

export function saveFavs(ids: string[]) {
  write(FAV_KEY, ids);
}

export function loadLast(): string | null {
  try {
    return localStorage.getItem(LAST_KEY);
  } catch {
    return null;
  }
}

export function saveLast(id: string) {
  try {
    localStorage.setItem(LAST_KEY, id);
  } catch {
    /* private mode */
  }
}

export const CATS = ["All", "Favourites", "Indonesia", "Daerah", "Religius", "Musik", "Internasional", "Sains", "Olahraga", "Film", "Dokumenter", "Lifestyle", "TVRI", "Test"] as const;
export type CatId = (typeof CATS)[number];

/* ------------------------------------------------- user playlist (m3u) */

const PLAYLIST_KEY = "nusatv.playlist.v1";
const PROXY_KEY = "nusatv.proxy.v1";

export type StoredPlaylist = { url: string; addedAt: number; entries: { title: string; url: string; group: string }[] };

export function loadPlaylistStore(): StoredPlaylist | null {
  try {
    const raw = localStorage.getItem(PLAYLIST_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as StoredPlaylist;
    return v && Array.isArray(v.entries) ? v : null;
  } catch {
    return null;
  }
}

export function savePlaylistStore(p: StoredPlaylist | null): void {
  try {
    if (p) localStorage.setItem(PLAYLIST_KEY, JSON.stringify(p));
    else localStorage.removeItem(PLAYLIST_KEY);
  } catch {
    /* private mode */
  }
}

/** A stable tile colour per custom channel (hash of its title). */
const CUSTOM_COLORS = ["#7C5CBF", "#0E7C7B", "#B3541E", "#5B6C8F", "#8F5B63", "#4F6B45", "#6B4F8F"];
export function customColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return CUSTOM_COLORS[h % CUSTOM_COLORS.length]!;
}

/** "Route streams through my server" — survives reloads, default off. */
export function loadProxy(): boolean {
  try { return localStorage.getItem(PROXY_KEY) === "1"; } catch { return false; }
}
export function saveProxy(on: boolean): void {
  try {
    if (on) localStorage.setItem(PROXY_KEY, "1");
    else localStorage.removeItem(PROXY_KEY);
  } catch { /* private mode */ }
}