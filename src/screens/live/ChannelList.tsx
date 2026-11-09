import { Search, Star } from "lucide-react";
import type { Channel } from "../../data";
import { useEffect, useRef } from "react";
import { Bar, ChannelBug, Chip, cx, Eyebrow, LiveDot } from "../../components/ui";

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
          <span className="font-mono text-[10px] text-dim tnum">{countLabel}</span>
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
                <ChannelBug ch={c} size={active && !compact ? "md" : "sm"} className={active ? "" : "opacity-80"} />
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
                    <>
                      <span className="mt-0.5 block truncate font-mono text-[10px] text-mute">{c.now}</span>
                      <Bar pct={c.prog} className="mt-1.5 max-w-[180px]" tone={active ? "signal" : "fg"} />
                    </>
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
