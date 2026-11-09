import { useMemo, useState } from "react";
import { History as HistoryIcon, Play, Search, Trash2, X } from "lucide-react";
import { HISTORY, type HistoryItem } from "../data";
import { Bar, Chip, Eyebrow, ScreenHead, cx } from "../components/ui";
import type { PlayItem } from "../components/Player";

const FILTERS = ["All", "Movies", "Series", "Live"];

export default function History({ onPlay }: { onPlay: (item: PlayItem) => void }) {
  const [items, setItems] = useState<HistoryItem[]>(HISTORY);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter((i) => {
      const okQ = !term || i.title.toLowerCase().includes(term) || i.sub.toLowerCase().includes(term);
      const okF =
        filter === "All" ||
        (filter === "Movies" && !i.title.includes("S0") && !i.sub.includes("Sky")) ||
        (filter === "Series" && i.title.includes("S0")) ||
        (filter === "Live" && i.sub.includes("Sky"));
      return okQ && okF;
    });
  }, [items, q, filter]);

  return (
    <div className="animate-rise pb-24 lg:pb-10">
      <ScreenHead
        eyebrow={`${items.length} titles watched recently`}
        title="Watching history"
        sub="Resume points sync across devices — pick up exactly where the app left off."
        right={
          <div className="flex gap-2.5">
            <label className="relative">
              <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-dim" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search history"
                aria-label="Search history"
                className="h-10 w-full rounded-md bg-panel pl-8 pr-3 text-[13px] outline-none ring-1 ring-line transition placeholder:text-dim focus:ring-signal sm:w-[210px]"
              />
            </label>
            <button
              onClick={() => setItems([])}
              disabled={items.length === 0}
              className="flex h-10 shrink-0 items-center gap-2 rounded-md px-3.5 text-[13px] font-semibold text-mute ring-1 ring-line transition hover:bg-live hover:text-white hover:ring-live disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-mute disabled:hover:ring-line"
            >
              <Trash2 size={15} /> <span className="hidden sm:inline">Clear history</span>
            </button>
          </div>
        }
      />

      <div className="flex items-center gap-2 overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
        {FILTERS.map((f) => (
          <Chip key={f} active={f === filter} onClick={() => setFilter(f)}>
            {f}
          </Chip>
        ))}
        <span className="ml-auto hidden font-mono text-[10px] tracking-[0.14em] text-dim uppercase sm:block">
          {list.length} shown
        </span>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <div className="rounded-lg bg-panel px-6 py-20 text-center ring-1 ring-line">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-raised text-dim ring-1 ring-line">
              <HistoryIcon size={22} />
            </span>
            <p className="mt-5 text-base font-bold">Your history is empty</p>
            <p className="mx-auto mt-2 max-w-sm text-[13px] text-mute">
              Everything you watch is logged here with a resume point. Nothing has been watched on this account yet.
            </p>
            <button
              onClick={() => {
                setItems(HISTORY);
                setQ("");
                setFilter("All");
              }}
              className="mt-6 rounded-md bg-signal px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-signal-lt"
            >
              Restore sample history
            </button>
          </div>
        ) : list.length === 0 ? (
          <div className="rounded-lg bg-panel py-16 text-center ring-1 ring-line">
            <p className="text-[15px] font-bold">No matches for “{q}”</p>
            <p className="mt-2 font-mono text-[11px] text-mute">Try another title or switch the filter</p>
            <button
              onClick={() => {
                setQ("");
                setFilter("All");
              }}
              className="mt-5 font-mono text-[11px] tracking-wider text-signal-lt uppercase"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {list.map((h, i) => (
              <li
                key={h.id}
                style={{ animationDelay: `${i * 45}ms` }}
                className="group animate-rise overflow-hidden rounded-lg bg-panel ring-1 ring-line transition hover:ring-signal"
              >
                <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-3.5">
                  <button
                    onClick={() => onPlay({ title: h.title, sub: h.sub, img: h.img, dur: 6000 })}
                    className="relative aspect-video w-full shrink-0 overflow-hidden rounded-md bg-ink sm:w-[168px]"
                    aria-label={`Play ${h.title}`}
                  >
                    <img src={h.img} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute inset-0 flex items-center justify-center bg-ink/45 opacity-0 transition group-hover:opacity-100">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-signal text-white">
                        <Play size={16} fill="currentColor" strokeWidth={0} />
                      </span>
                    </span>
                    <span className="absolute right-1.5 bottom-1.5 rounded bg-ink/85 px-1.5 py-px font-mono text-[9.5px] text-white/90 tnum">
                      {h.pct}%
                    </span>
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-[15px] font-bold">{h.title}</h3>
                        <p className="mt-1 truncate font-mono text-[11px] text-mute">{h.sub}</p>
                      </div>
                      <button
                        onClick={() => setItems((l) => l.filter((x) => x.id !== h.id))}
                        aria-label={`Remove ${h.title} from history`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-dim opacity-0 ring-1 ring-line transition hover:bg-live hover:text-white hover:ring-live group-hover:opacity-100 focus-visible:opacity-100"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    <div className="mt-3 max-w-md">
                      <Bar pct={h.pct} tone={h.pct === 100 ? "fg" : "signal"} />
                      <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-dim tnum">
                        <span>{h.when}</span>
                        <span>{h.pct === 100 ? "COMPLETED" : `${100 - h.pct}% REMAINING`}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onPlay({ title: h.title, sub: h.sub, img: h.img, dur: 6000 })}
                    className={cx(
                      "hidden h-10 shrink-0 items-center gap-2 rounded-md px-4 text-[13px] font-semibold ring-1 ring-line transition sm:flex",
                      "hover:bg-signal hover:text-white hover:ring-signal",
                    )}
                  >
                    <Play size={14} fill="currentColor" strokeWidth={0} /> Resume
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
            <Eyebrow>History is stored locally for 90 days</Eyebrow>
            <button
              onClick={() => setItems([])}
              className="font-mono text-[10px] tracking-[0.14em] text-dim uppercase transition hover:text-live"
            >
              Delete all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
