import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import {
  Maximize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Settings,
  SkipForward,
  Subtitles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { cx, LiveDot } from "./ui";

export type PlayItem = { title: string; sub: string; img: string; live?: boolean; dur?: number };

const fmt = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  return `${h > 0 ? `${h}:` : ""}${mm}:${String(sec).padStart(2, "0")}`;
};

export default function Player({ item, onClose }: { item: PlayItem; onClose: () => void }) {
  const dur = item.dur ?? 6360;
  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(item.live ? Math.round(dur * 0.62) : 0);
  const [vol, setVol] = useState(72);
  const [muted, setMuted] = useState(false);
  const [chrome, setChrome] = useState(true);
  const [cc, setCc] = useState(true);
  const hideRef = useRef<number | null>(null);

  const poke = () => {
    setChrome(true);
    if (hideRef.current) window.clearTimeout(hideRef.current);
    hideRef.current = window.setTimeout(() => setChrome(false), 3400);
  };

  useEffect(() => {
    poke();
    document.body.style.overflow = "hidden";
    return () => {
      if (hideRef.current) window.clearTimeout(hideRef.current);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setT((v) => (v >= dur ? dur : v + 1)), 1000);
    return () => window.clearInterval(id);
  }, [playing, dur]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === " " || e.key === "k") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === "ArrowRight") setT((v) => Math.min(dur, v + 10));
      else if (e.key === "ArrowLeft") setT((v) => Math.max(0, v - 10));
      else if (e.key.toLowerCase() === "m") setMuted((m) => !m);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [dur, onClose]);

  const pct = (t / dur) * 100;
  const seek = (e: ReactMouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setT(Math.max(0, Math.min(dur, Math.round(((e.clientX - r.left) / r.width) * dur))));
  };

  const fade = cx("transition-opacity duration-300", chrome ? "opacity-100" : "pointer-events-none opacity-0");

  return (
    <div
      className="fixed inset-0 z-50 bg-black animate-fade"
      onMouseMove={poke}
      onTouchStart={poke}
      style={{ cursor: chrome ? "default" : "none" }}
    >
      <img src={item.img} alt="" className="absolute inset-0 h-full w-full object-cover animate-drift" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/65" />
      <button className="absolute inset-0 cursor-default" aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying((p) => !p)} />

      {/* top chrome */}
      <div className={cx("absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-4 sm:p-6", fade)}>
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            {item.live && <LiveDot />}
            <span className="font-mono text-[10px] tracking-[0.16em] text-white/60 uppercase">
              {item.live ? "On air" : "Now playing"}
            </span>
          </div>
          <h2 className="mt-2 truncate text-lg font-black tracking-tight sm:text-2xl">{item.title}</h2>
          <p className="mt-1 truncate font-mono text-[11px] text-white/60">{item.sub}</p>
        </div>
        <button
          onClick={onClose}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/50 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-black/80"
          aria-label="Close player"
        >
          <X size={18} />
        </button>
      </div>

      {/* centre transport */}
      <div className={cx("pointer-events-none absolute inset-0 z-10 flex items-center justify-center", fade)}>
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play"}
          className="pointer-events-auto flex h-20 w-20 items-center justify-center rounded-full bg-black/45 text-white ring-1 ring-white/25 backdrop-blur-md transition duration-200 hover:scale-105 hover:bg-signal hover:ring-signal sm:h-24 sm:w-24"
        >
          {playing ? <Pause size={30} fill="currentColor" strokeWidth={0} /> : <Play size={30} fill="currentColor" strokeWidth={0} className="ml-1" />}
        </button>
      </div>

      {/* skip intro */}
      {!item.live && t > 24 && t < 110 && (
        <button
          onClick={() => setT(120)}
          className="absolute right-4 bottom-40 z-20 rounded-md bg-white px-5 py-2.5 text-[13px] font-bold text-ink transition hover:bg-signal hover:text-white sm:right-8 sm:bottom-44"
        >
          Skip Intro
        </button>
      )}

      {/* bottom chrome */}
      <div className={cx("absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 to-transparent pt-16", fade)}>
        <div className="mx-auto w-full max-w-6xl px-4 pb-5 sm:px-8 sm:pb-7">
          <div className="group cursor-pointer py-3" onClick={seek} role="slider" aria-label="Seek" aria-valuenow={Math.round(pct)} tabIndex={0}>
            <div className="relative h-[5px] w-full rounded-full bg-white/20 transition-all group-hover:h-[7px]">
              <div className="absolute inset-y-0 left-0 rounded-full bg-signal" style={{ width: `${pct}%` }} />
              <span
                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal opacity-0 ring-2 ring-white transition-opacity group-hover:opacity-100"
                style={{ left: `${pct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between font-mono text-[11px] text-white/70 tnum">
            <span>{fmt(t)}</span>
            <span className={item.live ? "text-live" : ""}>
              {item.live ? "LIVE" : `−${fmt(dur - t)}`}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3 sm:gap-5">
            <button onClick={() => setPlaying((p) => !p)} className="text-white transition hover:text-signal-lt" aria-label={playing ? "Pause" : "Play"}>
              {playing ? <Pause size={22} fill="currentColor" strokeWidth={0} /> : <Play size={22} fill="currentColor" strokeWidth={0} />}
            </button>
            <button onClick={() => setT((v) => Math.max(0, v - 10))} className="hidden text-white/80 transition hover:text-signal-lt sm:block" aria-label="Back 10 seconds">
              <RotateCcw size={19} />
            </button>
            <button onClick={() => setT((v) => Math.min(dur, v + 10))} className="hidden text-white/80 transition hover:text-signal-lt sm:block" aria-label="Forward 10 seconds">
              <RotateCw size={19} />
            </button>
            <button className="text-white/80 transition hover:text-signal-lt" aria-label="Next episode">
              <SkipForward size={19} />
            </button>

            <div className="flex items-center gap-2">
              <button onClick={() => setMuted((m) => !m)} className="text-white/80 transition hover:text-signal-lt" aria-label={muted ? "Unmute" : "Mute"}>
                {muted || vol === 0 ? <VolumeX size={19} /> : <Volume2 size={19} />}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={muted ? 0 : vol}
                onChange={(e) => {
                  setVol(Number(e.target.value));
                  setMuted(false);
                }}
                aria-label="Volume"
                className="hidden h-1 w-20 cursor-pointer accent-signal sm:block"
              />
            </div>

            <span className="ml-auto flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setCc((c) => !c)}
                className={cx("font-mono text-[11px] tracking-widest transition", cc ? "text-signal-lt" : "text-white/70 hover:text-white")}
                aria-pressed={cc}
                aria-label="Subtitles"
              >
                <Subtitles size={19} />
              </button>
              <button className="hidden text-white/70 transition hover:text-white sm:block" aria-label="Audio track" title="Audio: English 5.1">
                <span className="font-mono text-[11px] tracking-widest">EN</span>
              </button>
              <button className="hidden text-white/70 transition hover:text-white sm:block" aria-label="Settings" title="Settings">
                <Settings size={19} />
              </button>
              <button className="text-white/70 transition hover:text-white" aria-label="Fullscreen" title="Fullscreen">
                <Maximize size={19} />
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
