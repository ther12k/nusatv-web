import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { List, Pause, Settings2, SkipForward } from "lucide-react";
import { CHANNELS, hhmm, type Channel } from "../data";
import { useLive } from "../live/LiveContext";
import { CATS, LAYOUTS, type LayoutId } from "../live/model";
import { ChannelBug, cx, Eyebrow } from "../components/ui";
import PlayerStage from "./live/PlayerStage";
import ChannelList from "./live/ChannelList";
import BroadcastEpg from "./live/BroadcastEpg";
import MosaicGrid from "./live/MosaicGrid";
import LayoutPanel from "./live/LayoutPanel";

type Props = { now: Date };

export default function Live({ now }: Props) {
  const { config, patch, applyPreset, reset, activeId, setActiveId, favs, toggleFav, channels, proxy } = useLive();
  const [cat, setCat] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [panel, setPanel] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [zap, setZap] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const zapTimer = useRef<number | null>(null);
  const toastTimer = useRef<number | null>(null);

  const list = useMemo(() => {
    const term = query.trim().toLowerCase();
    return channels.filter((c) => {
      const okCat =
        cat === "All"
          ? true
          : cat === "Favourites"
            ? favs.includes(c.id)
            : c.cat === cat;
      const okQ =
        !term ||
        c.name.toLowerCase().includes(term) ||
        c.abbr.toLowerCase().includes(term) ||
        c.now.toLowerCase().includes(term) ||
        String(c.num).includes(term);
      return okCat && okQ;
    });
  }, [cat, query, favs]);

  const cats = [...CATS, ...[...new Set(channels.map((c) => c.cat))].filter((g) => !(CATS as readonly string[]).includes(g))];
  const ch = channels.find((c) => c.id === activeId) ?? channels[0];
  const idx = Math.max(0, list.findIndex((c) => c.id === ch.id));

  const flash = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1600);
  }, []);

  const select = useCallback(
    (id: string) => {
      setActiveId(id);
      setZap("");
    },
    [setActiveId],
  );

  const step = useCallback(
    (dir: 1 | -1) => {
      if (!list.length) return;
      const i = list.findIndex((c) => c.id === activeId);
      const next = list[(i < 0 ? 0 : i + dir + list.length) % list.length];
      select(next.id);
    },
    [list, activeId, select],
  );

  // The Maximize button fullscreens the real stage (the stream keeps
  // playing — no fake overlay player).
  const openPlayer = useCallback((_c: Channel) => {
    const el = document.getElementById("live-stage");
    if (el && el.requestFullscreen) void el.requestFullscreen().catch(() => {});
  }, []);

  const commitZap = useCallback(
    (digits: string) => {
      const n = Number(digits);
      const hit = channels.find((c) => c.num === n);
      if (hit) {
        select(hit.id);
        flash(`${hit.abbr} · ${hit.num}`);
      } else {
        flash(`No channel ${digits}`);
      }
      setZap("");
    },
    [select, flash],
  );

  const cinema = config.layout === "cinema";

  /** Layout switching that owns real fullscreen: entering cinema
   *  requests it (from the click/keypress gesture), leaving exits it,
   *  and the browser's own Esc (fullscreenchange) drops cinema back to
   *  studio so state never desyncs. */
  const applyLayout = useCallback(
    (id: LayoutId) => {
      const fsEl = document.fullscreenElement;
      if (id === "cinema" && !fsEl) {
        void document.documentElement.requestFullscreen?.().catch(() => {});
      }
      if (id !== "cinema" && fsEl) {
        void document.exitFullscreen?.().catch(() => {});
      }
      applyPreset(id);
      flash(`Layout · ${LAYOUTS.find((l) => l.id === id)?.label ?? id}`);
    },
    [applyPreset, flash],
  );

  useEffect(() => {
    const onFs = () => {
      if (!document.fullscreenElement && config.layout === "cinema") {
        applyPreset("studio"); // browser-left fullscreen → leave cinema
      }
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, [config.layout, applyPreset]);

  // Cinema chrome (the overlay buttons) shows on mouse move only.
  const [chromeUp, setChromeUp] = useState(true);
  useEffect(() => {
    if (!cinema) return;
    setChromeUp(true);
    let t: number | undefined;
    const poke = () => {
      setChromeUp(true);
      if (t) window.clearTimeout(t);
      t = window.setTimeout(() => setChromeUp(false), 2600);
    };
    poke();
    window.addEventListener("mousemove", poke);
    return () => {
      window.removeEventListener("mousemove", poke);
      if (t) window.clearTimeout(t);
    };
  }, [cinema, activeId]);
  // keyboard: zap, channel up/down, layout presets, cinema list, favourite
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (e.altKey && ["1", "2", "3", "4"].includes(e.key)) {
        e.preventDefault();
        applyLayout(LAYOUTS[Number(e.key) - 1]!.id);
        return;
      }
      if (typing) return;
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        setZap((z) => {
          const next = (z + e.key).slice(0, 4);
          if (zapTimer.current) window.clearTimeout(zapTimer.current);
          zapTimer.current = window.setTimeout(() => commitZap(next), 750);
          return next;
        });
        return;
      }
      if (e.key === "Enter" && zap) {
        e.preventDefault();
        if (zapTimer.current) window.clearTimeout(zapTimer.current);
        commitZap(zap);
        return;
      }
      if (e.key === "Enter") {
        // OK on a remote: toggle cinema (real fullscreen)
        e.preventDefault();
        applyLayout(cinema ? "studio" : "cinema");
      } else if (e.key === "Backspace") {
        // remote Back: close overlays first, then leave cinema
        e.preventDefault();
        if (panel) setPanel(false);
        else if (listOpen) setListOpen(false);
        else if (cinema) applyLayout("studio");
      } else if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key.toLowerCase() === "m") {
        document.querySelectorAll("video").forEach((v) => {
          v.muted = !v.muted;
        });
        flash("Sound toggled");
      } else if (e.key.toLowerCase() === "l") {
        setListOpen((v) => !v);
      } else if (e.key.toLowerCase() === "f") {
        toggleFav(ch.id);
        flash(favs.includes(ch.id) ? "Removed from favourites" : "Added to favourites");
      } else if (e.key.toLowerCase() === "c") {
        setPanel((v) => !v);
      } else if (e.key === "Escape") {
        if (panel) setPanel(false);
        else if (listOpen) setListOpen(false);
        else if (zap) setZap("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [applyLayout, commitZap, step, zap, panel, listOpen, ch.id, favs, toggleFav, flash, cinema]);

  const countLabel = `${list.length} CH`;

  const listFirst = config.listSide === "left";

  const listProps = {
    list,
    cats,
    activeId: ch.id,
    cat,
    query,
    favs,
    density: config.density,
    showNumbers: config.showChannelNumbers,
    countLabel,
    onCat: setCat,
    onQuery: setQuery,
    onSelect: select,
    onToggleFav: toggleFav,
  };

  const stage = (
    <PlayerStage
      proxy={proxy}
      ch={ch}
      now={now}
      muted={muted}
      playing={playing}
      zap={zap}
      fill={cinema}
      cinema={cinema}
      onMute={() => setMuted((m) => !m)}
      onTogglePlay={() => setPlaying((p) => !p)}
      onOpen={() => openPlayer(ch)}
      onPrev={() => step(-1)}
      onNext={() => step(1)}
    />
  );

  return (
    <div
      className={cx(
        "relative animate-rise",
        cinema ? "h-screen" : "pb-20 lg:h-[calc(100vh-2.75rem)] lg:pb-0",
      )}
    >
      {/* toolbar merged into the compact TopBar (layout select) */}

      {/* ---------------- STUDIO ---------------- */}
      {config.layout === "studio" && (
        <div
          className={cx(
            "grid min-h-0 lg:h-[calc(100vh-2.75rem)]",
            listFirst ? "lg:grid-cols-[minmax(280px,360px)_1fr]" : "lg:grid-cols-[1fr_minmax(280px,360px)]",
          )}
        >
          <aside
            className={cx(
              "order-2 flex min-h-0 flex-col border-line lg:max-h-full",
              listFirst ? "lg:order-1 lg:border-r" : "lg:order-2 lg:border-l",
            )}
          >
            <div className="min-h-0 flex-1 lg:max-h-full">
              <div className="flex h-[min(58vh,520px)] flex-col lg:h-full">
                <ChannelList {...listProps} />
              </div>
            </div>
          </aside>

          <section className={cx("order-1 min-w-0 lg:overflow-y-auto thin-bar", listFirst ? "lg:order-2" : "lg:order-1")}>
            <div className="p-2.5 sm:p-3.5 lg:p-4">
              {stage}
              {config.showNowNext && (
                <NowNext ch={ch} now={now} playing={playing} onOpen={() => openPlayer(ch)} onSelect={select} />
              )}
            </div>
          </section>
        </div>
      )}

      {/* ---------------- BROADCAST ---------------- */}
      {config.layout === "broadcast" && (
        <div className="flex min-h-0 flex-col lg:h-[calc(100vh-2.75rem)]">
          <div className="shrink-0 px-3 pt-3 sm:px-5 sm:pt-4">
            <div className="mx-auto max-w-[1400px]">{stage}</div>
          </div>
          {config.showEpgStrip ? (
            <BroadcastEpg now={now} activeId={ch.id} onSelect={select} channels={list} />
          ) : (
            <div className="p-4">
              <NowNext ch={ch} now={now} playing={playing} onOpen={() => openPlayer(ch)} onSelect={select} />
            </div>
          )}
        </div>
      )}

      {/* ---------------- MOSAIC ---------------- */}
      {config.layout === "mosaic" && (
        <div className="flex min-h-0 flex-col lg:h-[calc(100vh-2.75rem)] lg:flex-row">
          <div className="min-w-0 flex-1 overflow-y-auto thin-bar">
            <MosaicGrid
              proxy={proxy}
              channels={list.length ? list : channels}
              activeId={ch.id}
              count={config.mosaicCount}
              favs={favs}
              onSelect={select}
              onOpen={(id) => {
                const c = channels.find((x) => x.id === id);
                if (c) openPlayer(c);
              }}
            />
            {config.showNowNext && (
              <div className="px-4 pb-6 sm:px-5">
                <NowNext ch={ch} now={now} playing={playing} onOpen={() => openPlayer(ch)} onSelect={select} />
              </div>
            )}
          </div>
          <aside className="hidden w-[300px] shrink-0 border-l border-line lg:block">
            <div className="h-full">
              <ChannelList {...listProps} />
            </div>
          </aside>
        </div>
      )}

      {/* ---------------- CINEMA ---------------- */}
      {config.layout === "cinema" && (
        <div className="relative h-full">
          {stage}
          <div
            className={cx(
              "absolute top-4 left-4 z-20 flex items-center gap-2 transition-opacity duration-300",
              !chromeUp && "pointer-events-none opacity-0",
            )}
          >
            <button
              onClick={() => setListOpen((v) => !v)}
              className="flex h-9 items-center gap-2 rounded-md bg-ink/70 px-3 text-[12px] font-semibold text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-signal"
            >
              <List size={14} /> Channels
            </button>
            <button
              onClick={() => setPanel(true)}
              className="flex h-9 w-9 items-center justify-center rounded-md bg-ink/70 text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-signal"
              aria-label="Layout config"
            >
              <Settings2 size={14} />
            </button>
            <button
              onClick={() => applyLayout("studio")}
              className="flex h-9 items-center rounded-md bg-ink/70 px-3 font-mono text-[10px] tracking-wider text-white/80 uppercase ring-1 ring-white/15 backdrop-blur transition hover:bg-signal hover:text-white"
            >
              Exit cinema
            </button>
          </div>

          {listOpen && (
            <>
              <button className="absolute inset-0 z-20 bg-black/40" aria-label="Close channel list" onClick={() => setListOpen(false)} />
              <aside className="absolute inset-y-0 left-0 z-30 w-[min(92vw,360px)] border-r border-line bg-ink/96 shadow-2xl backdrop-blur-md animate-rise">
                <ChannelList {...listProps} />
              </aside>
            </>
          )}
        </div>
      )}

      {/* config drawer */}
      {panel && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/55 animate-fade" onClick={() => setPanel(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="h-full w-[min(100vw,420px)] border-l border-line bg-ink shadow-2xl animate-sheet"
            role="dialog"
            aria-label="Live TV layout config"
          >
            <LayoutPanel
              config={config}
              onPatch={patch}
              onPreset={(id) => applyLayout(id)}
              onReset={() => {
                reset();
                flash("Layout reset");
              }}
              onClose={() => setPanel(false)}
            />
          </div>
        </div>
      )}

      {toast && (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-md bg-panel px-3.5 py-2 font-mono text-[11px] tracking-[0.14em] text-fg uppercase ring-1 ring-signal animate-zap lg:bottom-8">
          {toast}
        </div>
      )}

      {idx >= 0 && !cinema && (
        <span className="sr-only">
          Channel {idx + 1} of {list.length}
        </span>
      )}
    </div>
  );
}

function NowNext({
  ch,
  now,
  playing,
  onOpen,
  onSelect,
}: {
  ch: Channel;
  now: Date;
  playing: boolean;
  onOpen: () => void;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mt-5 grid gap-5 lg:grid-cols-[1.45fr_1fr]">
      <div>
        <Eyebrow>Now playing</Eyebrow>
        <h1 className="mt-2.5 text-[26px] leading-[1.02] font-black tracking-tight sm:text-[34px]">{ch.name}</h1>
        <p className="mt-1.5 text-[14px] font-semibold text-signal-lt">{ch.now}</p>
        <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-mute">
          Broadcasting live in {ch.cat.toLowerCase()} · {ch.hd ? "1080p HD" : "SD"} · English 5.1. Catch-up is
          available for the last 7 days on this channel.
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            onClick={onOpen}
            className="flex h-10 items-center gap-2 rounded-md bg-signal px-5 text-[13px] font-bold text-white transition hover:bg-signal-lt"
          >
            {playing ? <Pause size={15} fill="currentColor" strokeWidth={0} /> : null}
            Watch live
          </button>
          <button className="flex h-10 items-center gap-2 rounded-md px-4 text-[13px] font-semibold ring-1 ring-line transition hover:bg-raised hover:ring-dim">
            <SkipForward size={15} /> Restart programme
          </button>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-4 font-mono text-[11px] sm:grid-cols-4">
          {[
            ["NEXT", ch.next],
            ["CATEGORY", ch.cat],
            ["SOURCE", ch.hd ? "1080p · 8 Mbps" : "576p · 2.4 Mbps"],
            ["TUNED", hhmm(now)],
          ].map(([k, v]) => (
            <div key={k} className="min-w-0">
              <dt className="text-dim">{k}</dt>
              <dd className="mt-1 truncate text-fg/90">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="border-t border-line pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
        <div className="flex items-baseline justify-between">
          <Eyebrow>Up next on TV</Eyebrow>
          <span className="font-mono text-[10px] text-dim tnum">{hhmm(now)}</span>
        </div>
        <ul className="mt-3 space-y-2">
          {CHANNELS.filter((c) => c.id !== ch.id)
            .slice(0, 4)
            .map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => onSelect(c.id)}
                  className="group flex w-full items-center gap-3 rounded-md bg-panel p-2.5 text-left ring-1 ring-line transition hover:ring-signal"
                >
                  <ChannelBug ch={c} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-semibold group-hover:text-signal-lt">{c.next}</span>
                    <span className="block truncate font-mono text-[10px] text-mute">{c.name}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[10px] text-dim">+{c.prog % 30}m</span>
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
