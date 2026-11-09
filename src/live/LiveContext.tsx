import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CHANNELS, type Channel, type StreamSource } from "../data";
import { parsePlaylist } from "../playlist";
import { customColor, loadPlaylistStore, loadProxy, savePlaylistStore, saveProxy, type StoredPlaylist } from "./model";
import {
  DEFAULT_CONFIG,
  LAYOUTS,
  loadConfig,
  loadFavs,
  loadLast,
  saveConfig,
  saveFavs,
  saveLast,
  type LayoutId,
  type LiveConfig,
} from "./model";

type PlaylistResult = { ok: boolean; count: number; message?: string };

type LiveState = {
  config: LiveConfig;
  patch: (p: Partial<LiveConfig>) => void;
  applyPreset: (id: LayoutId) => void;
  reset: () => void;
  activeId: string;
  setActiveId: (id: string) => void;
  favs: string[];
  toggleFav: (id: string) => void;
  /** The bundled channels plus the user's loaded playlist (if any). */
  channels: Channel[];
  playlistUrl: string | null;
  /** Loads an m3u/m3u8 the user legitimately holds (direct fetch,
   *  CORS-blocked files fall back to this host's /fetch relay). */
  loadPlaylist: (url: string) => Promise<PlaylistResult>;
  /** Imports raw playlist text (file upload / pasted). */
  importText: (text: string, label: string) => PlaylistResult;
  /** Xtream Codes panel login (host + user + password → live streams). */
  loadXtream: (host: string, user: string, pass: string) => Promise<PlaylistResult>;
  removePlaylist: () => void;
  /** Route non-CORS stream playback through this host's /stream relay. */
  proxy: boolean;
  setProxy: (on: boolean) => void;
};

function storedToChannels(p: StoredPlaylist): Channel[] {
  const map = new Map<string, { channel: Channel; sources: StreamSource[] }>();
  let nextNum = 100;

  for (const e of p.entries.slice(0, 2000)) {
    const rawTitle = e.title.trim();
    // Normalize key: remove parens like (Alt ...), (DensTV), (Flashcon), etc.
    const cleanKey = rawTitle
      .replace(/\(.*?\)/g, "")
      .replace(/\b(HD|FHD|SD|4K|720p|1080p|Web|Stream|Channel)\b/gi, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();

    const tagMatch = /\((.*?)\)/.exec(rawTitle);
    const sourceLabel = tagMatch ? tagMatch[1].trim().slice(0, 20) : "";

    const existing = cleanKey.length >= 3 ? map.get(cleanKey) : undefined;
    if (existing) {
      const idx = existing.sources.length + 1;
      existing.sources.push({
        label: sourceLabel ? sourceLabel : `Server ${idx}`,
        url: e.url,
      });
    } else {
      const ch: Channel = {
        id: `x${nextNum}`,
        num: nextNum,
        name: rawTitle.slice(0, 48),
        abbr: (rawTitle.replace(/[^A-Za-z0-9 ]/g, "").trim().split(/\s+/)[0] ?? "CH").slice(0, 6).toUpperCase(),
        bg: customColor(rawTitle + e.url),
        fg: "#ffffff",
        cat: e.group?.trim() || "My Playlist",
        pool: "live",
        hd: true,
        now: "Live broadcast",
        next: "Programme follows",
        prog: 50,
        src: e.url,
        sources: [{ label: sourceLabel ? sourceLabel : "Server 1", url: e.url }],
      };
      map.set(cleanKey.length >= 3 ? cleanKey : `id_${nextNum}`, { channel: ch, sources: ch.sources! });
      nextNum++;
    }
  }

  return Array.from(map.values()).map(({ channel, sources }) => ({
    ...channel,
    sources: sources.length > 1 ? sources : undefined,
  }));
}

const Ctx = createContext<LiveState | null>(null);

export function LiveProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<LiveConfig>(() => loadConfig());
  const [favs, setFavs] = useState<string[]>(() => loadFavs());
  const [activeId, setActiveIdState] = useState<string>(() => {
    const last = loadLast();
    const all = [...CHANNELS, ...storedToChannels(loadPlaylistStore() ?? { url: "", addedAt: 0, entries: [] })];
    return last && all.some((c) => c.id === last) ? last : CHANNELS[0].id;
  });
  const [store, setStore] = useState<StoredPlaylist | null>(() => loadPlaylistStore());
  const custom = useMemo(() => (store ? storedToChannels(store) : []), [store]);
  const channels = useMemo(() => [...CHANNELS, ...custom], [custom]);

  useEffect(() => saveConfig(config), [config]);
  useEffect(() => saveFavs(favs), [favs]);
  useEffect(() => saveLast(activeId), [activeId]);

  const patch = useCallback((p: Partial<LiveConfig>) => {
    setConfig((c) => ({ ...c, ...p }));
  }, []);

  const applyPreset = useCallback((id: LayoutId) => {
    const preset = LAYOUTS.find((l) => l.id === id);
    if (!preset) return;
    setConfig((c) => ({ ...c, ...preset.apply, layout: id }));
  }, []);

  const reset = useCallback(() => setConfig(DEFAULT_CONFIG), []);

  const setActiveId = useCallback((id: string) => setActiveIdState(id), []);

  const toggleFav = useCallback((id: string) => {
    setFavs((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
  }, []);

  const importText = useCallback((text: string, label: string): PlaylistResult => {
    const entries = parsePlaylist(text).map((e) => ({ title: e.title, url: e.url, group: e.group }));
    if (entries.length === 0) return { ok: false, count: 0, message: "no #EXTINF entries found" };
    const next: StoredPlaylist = { url: label, addedAt: Date.now(), entries: entries.slice(0, 2000) };
    savePlaylistStore(next);
    setStore(next);
    return { ok: true, count: next.entries.length };
  }, []);

  const loadPlaylist = useCallback(async (url: string): Promise<PlaylistResult> => {
    let text: string | null = null;
    let note = "";
    for (const target of [url, `/fetch?url=${encodeURIComponent(url)}`]) {
      try {
        const res = await fetch(target);
        if (!res.ok) {
          note = `HTTP ${res.status}`;
          continue;
        }
        text = await res.text();
        break;
      } catch {
        note = "network/CORS blocked";
      }
    }
    if (text === null) return { ok: false, count: 0, message: note || "fetch failed" };
    return importText(text, url);
  }, [importText]);

  const loadXtream = useCallback(async (hostRaw: string, user: string, pass: string): Promise<PlaylistResult> => {
    const host = hostRaw.trim().replace(/\/+$/, "");
    if (!host || !user || !pass) return { ok: false, count: 0, message: "host, user and password required" };
    const base = /^https?:\/\//.test(host) ? host : `http://${host}`;
    const api = (action: string) =>
      `/fetch?url=${encodeURIComponent(`${base}/player_api.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&action=${action}`)}`;
    try {
      const info = (await (await fetch(api(""))).json()) as { user_info?: { auth?: number; status?: string } };
      if (!info?.user_info?.auth) {
        return { ok: false, count: 0, message: info?.user_info?.status ?? "auth failed" };
      }
      const [cats, streams] = await Promise.all([
        (await fetch(api("get_live_categories"))).json() as Promise<Array<{ category_id: string | number; category_name: string }>>,
        (await fetch(api("get_live_streams"))).json() as Promise<Array<{ name?: string; stream_id?: string | number; group_id?: string | number }>>,
      ]);
      const catName = new Map((Array.isArray(cats) ? cats : []).map((c) => [String(c.category_id), c.category_name]));
      const entries = (Array.isArray(streams) ? streams : [])
        .filter((s) => s.stream_id !== undefined)
        .map((s) => ({
          title: String(s.name ?? "channel"),
          url: `${base}/live/${user}/${pass}/${s.stream_id}.m3u8`,
          group: catName.get(String(s.group_id ?? "")) ?? "Xtream",
        }));
      if (entries.length === 0) return { ok: false, count: 0, message: "no live streams on this account" };
      const next: StoredPlaylist = { url: `Xtream · ${base}`, addedAt: Date.now(), entries: entries.slice(0, 2000) };
      savePlaylistStore(next);
      setStore(next);
      return { ok: true, count: next.entries.length };
    } catch {
      return { ok: false, count: 0, message: "panel unreachable (check host)" };
    }
  }, []);

  const removePlaylist = useCallback(() => {
    savePlaylistStore(null);
    setStore(null);
  }, []);

  const [proxy, setProxyState] = useState<boolean>(() => loadProxy());
  const setProxy = useCallback((on: boolean) => {
    saveProxy(on);
    setProxyState(on);
  }, []);

  const value = useMemo(
    () => ({
      config, patch, applyPreset, reset, activeId, setActiveId, favs, toggleFav,
      channels, playlistUrl: store?.url ?? null, loadPlaylist, importText, loadXtream, removePlaylist,
      proxy, setProxy,
    }),
    [config, patch, applyPreset, reset, activeId, setActiveId, favs, toggleFav, channels, store, loadPlaylist, importText, loadXtream, removePlaylist, proxy, setProxy],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLive() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLive must be used within LiveProvider");
  return v;
}
