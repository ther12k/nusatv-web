import { Search, Star } from "lucide-react";
import type { Channel } from "../../data";
import { useEffect, useRef } from "react";
import { ChannelBug, Chip, cx, Eyebrow, LiveDot } from "../../components/ui";
import { useChannelStatus } from "../../live/useChannelStatus";
import { Activity } from "lucide-react";

type Props = {
  list: Channel[];
  activeId: string;
  cat: string;
  /** Bundled categories + any groups the user's playlist carries. */
  cats: readonly string[];
  query: string;
  favs: string[];
  density: "comfortable" | "compact";
  showNumbers: boolean;
  countLabel: string;
  onCat: (c: string) => void;
  onQuery: (q: string) => void;
  onSelect: (id: string) => void;
  onToggleFav: (id: string) => void;
};

export default function ChannelList({
  list,
  activeId,
  cat,
  cats,
  query,
  favs,
  density,
  showNumbers,
  countLabel,
  onCat,
  onQuery,
  onSelect,
  onToggleFav,
}: Props) {
  const compact = density === "compact";
  const { statusMap } = useChannelStatus();
  const activeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeId]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-line px-3 py-3 sm:px-4">
        <div className="flex items-baseline justify-between gap-3">
          <Eyebrow>Live television</Eyebrow>
          <span className="flex items-center gap-1 font-mono text-[10px] text-dim tnum"><Activity size={10} className="text-emerald-400 animate-pulse" /> {countLabel}</span>
        </div>
        <label className="relative mt-3 block">
          <Search size={13} className="absolute top-1/2 left-2.5 -translate-y-1/2 text-dim" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Filter or type a number…"
            aria-label="Filter channels"
            className="h-8 w-full rounded-md bg-raised pl-8 pr-3 text-[12px] outline-none ring-1 ring-line transition placeholder:text-dim focus:ring-signal"
          />
        </label>
        <div className="no-bar -mx-1 mt-2.5 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
          {cats.map((c) => (
            <Chip key={c} active={c === cat} onClick={() => onCat(c)}>
              {c}
            </Chip>
          ))}
        </div>
      </div>

      <div className="thin-bar min-h-0 flex-1 divide-y divide-line overflow-y-auto">
        {list.slice(0, 400).map((c) => {
          const active = c.id === activeId;
          const faved = favs.includes(c.id);
          return (
            <div
              key={c.id}
              ref={active ? activeRef : undefined}
              className={cx(
                "group relative flex w-full items-center gap-2.5 text-left transition-colors duration-150",
                compact ? "px-3 py-1.5" : "px-3 py-2.5 sm:px-4",
                active ? "bg-signal/14" : "hover:bg-raised",
              )}
            >
              {active && <span className="absolute inset-y-0 left-0 w-[3px] bg-signal" />}
              <button
                onClick={() => onSelect(c.id)}
                aria-current={active ? "true" : undefined}
                className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
              >
                {showNumbers && (
                  <span className={cx("w-7 shrink-0 font-mono text-[10px] tnum", active ? "text-signal-lt" : "text-dim")}>
                    {c.num}
                  </span>
                )}
                {/* Live Channel Thumbnail / Poster */}
                {(() => {
                  const stat = statusMap[c.id];
                  const hasThumb = !!stat?.thumb;
                  const isOnline = stat?.status === "online";
                  const isDegraded = stat?.status === "degraded";
                  const isOffline = stat?.status === "offline";

                  return (
                    <div className="relative shrink-0 overflow-hidden rounded bg-ink/80 ring-1 ring-white/10" style={{ width: compact ? 42 : 54, aspectRatio: "16/9" }}>
                      {hasThumb ? (
                        <img src={stat.thumb!} alt="" className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-raised">
                          <ChannelBug ch={c} size="sm" className="opacity-75" />
                        </div>
                      )}
                      {/* Signal Dot */}
                      <span
                        className={cx(
                          "absolute top-1 right-1 h-2 w-2 rounded-full border border-black/60 shadow-sm",
                          isOnline ? "bg-emerald-500 shadow-emerald-500/50" : isDegraded ? "bg-amber-500" : isOffline ? "bg-red-500" : "bg-white/40"
                        )}
                        title={stat ? `${stat.status.toUpperCase()} (${stat.latencyMs}ms)` : "Checking signal..."}
                      />
                    </div>
                  );
                })()}

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className={cx("truncate font-semibold", compact ? "text-[12px]" : "text-[13px]", active ? "text-white" : "text-fg/90")}>
                      {c.name}
                    </span>
                    {c.hd && (
                      <span className="shrink-0 rounded-sm bg-raised px-1 py-px font-mono text-[8px] text-mute ring-1 ring-line">
                        HD
                      </span>
                    )}
                  </span>
                  {!compact && (
                    <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px]">
                      {(() => {
                        const stat = statusMap[c.id];
                        if (!stat) return <span className="truncate text-mute">{c.now}</span>;
                        const online = stat.status === "online";
                        const offline = stat.status === "offline";
                        return (
                          <span className={cx("flex items-center gap-1 truncate font-medium", online ? "text-emerald-400" : offline ? "text-red-400" : "text-amber-400")}>
                            <span className={cx("inline-block h-1.5 w-1.5 rounded-full", online ? "bg-emerald-400" : offline ? "bg-red-400" : "bg-amber-400")} />
                            {online ? `${stat.latencyMs}ms` : stat.status.toUpperCase()}
                            {stat.resolution && <span className="text-dim">· {stat.resolution.split('x')[1]}p</span>}
                          </span>
                        );
                      })()}
                    </div>
                  )}
                </span>
                {active && !compact && <LiveDot />}
              </button>
              <button
                onClick={() => onToggleFav(c.id)}
                aria-label={faved ? `Unfavourite ${c.name}` : `Favourite ${c.name}`}
                aria-pressed={faved}
                className={cx(
                  "shrink-0 rounded p-1 transition",
                  faved ? "text-ember" : "text-dim opacity-0 hover:text-fg group-hover:opacity-100 focus-visible:opacity-100",
                )}
              >
                <Star size={13} fill={faved ? "currentColor" : "none"} />
              </button>
            </div>
          );
        })}
        {list.length > 400 && (
          <p className="px-1 py-3 text-[11.5px] text-mute">
            Showing the first 400 of {list.length} — use the filter above to find the rest.
          </p>
        )}
        {list.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-semibold">No channels in {cat}</p>
            <button onClick={() => onCat("All")} className="mt-2 font-mono text-[11px] text-signal-lt">
              Show all →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
