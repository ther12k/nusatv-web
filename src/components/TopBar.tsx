import { Signal, Star } from "lucide-react";
import { CHANNELS, clock } from "../data";
import { LAYOUTS, type LayoutId } from "../live/model";
import { useLive } from "../live/LiveContext";
import { cx } from "./ui";

export default function TopBar({ now }: { now: Date; onSearch?: () => void }) {
  const { activeId, config, applyPreset, favs, toggleFav } = useLive();
  const ch = CHANNELS.find((c) => c.id === activeId) ?? CHANNELS[0];
  const faved = favs.includes(ch.id);

  /** Entering cinema asks the browser for real fullscreen from this
   *  click/keypress (the gesture the Fullscreen API requires); leaving
   *  any cinema state exits it. */
  const onLayout = (id: LayoutId) => {
    const fs = document.fullscreenElement;
    if (id === "cinema" && !fs) void document.documentElement.requestFullscreen?.().catch(() => {});
    if (id !== "cinema" && fs) void document.exitFullscreen?.().catch(() => {});
    applyPreset(id);
  };

  return (
    <header className="sticky top-0 z-30 flex h-11 shrink-0 items-center gap-2.5 border-b border-line bg-ink/85 px-3 backdrop-blur-md sm:gap-3 sm:px-4">
      {/* brand lockup — NU white / TV in signal blue */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex shrink-0 items-center gap-1.5"
        aria-label="Nusa·TV"
      >
        <span className="text-[19px] leading-none font-black tracking-tighter">NU</span>
        <span className="rounded-[4px] bg-signal px-1.5 py-0.5 text-[13px] leading-none font-black tracking-tighter text-white">
          TV
        </span>
      </button>

      {/* what is on right now, broadcast-ticker style */}
      <div className="hidden min-w-0 items-center gap-2 border-l border-line pl-3 lg:flex">
        <span className="flex h-5 items-center gap-1.5 rounded-sm bg-live px-1.5 font-mono text-[8.5px] font-semibold tracking-[0.14em] text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-blink" />
          ON AIR
        </span>
        <span className="truncate text-[12px] font-semibold text-fg/90">{ch.now}</span>
        <span className="shrink-0 font-mono text-[10.5px] text-dim tnum">{ch.name}</span>
      </div>

      {/* layout select — one compact control instead of an icon row */}
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <label className="sr-only" htmlFor="layout-select">Layout</label>
        <select
          id="layout-select"
          value={config.layout}
          onChange={(e) => onLayout(e.target.value as LayoutId)}
          className="h-7 cursor-pointer rounded-md bg-raised px-2 font-mono text-[10.5px] tracking-wider text-fg uppercase outline-none ring-1 ring-line transition hover:ring-dim focus:ring-signal"
          title="Layout — Alt+1…4 on a keyboard or remote"
        >
          {LAYOUTS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => toggleFav(ch.id)}
          aria-pressed={faved}
          aria-label="Favourite channel"
          className={cx(
            "flex h-7 w-7 items-center justify-center rounded-md ring-1 ring-line transition hover:ring-signal",
            faved ? "text-ember" : "text-dim hover:text-fg",
          )}
        >
          <Star size={13} fill={faved ? "currentColor" : "none"} />
        </button>

        <span className="hidden items-center gap-1.5 rounded-md bg-panel px-2 py-1 ring-1 ring-line sm:flex">
          <Signal size={11} className="text-signal-lt" />
          <span className="font-mono text-[9px] tracking-wider text-mute">4K</span>
        </span>

        <span className="font-mono text-[12px] font-medium text-fg tnum" title={now.toDateString()}>
          {clock(now)}
        </span>
      </div>
    </header>
  );
}
