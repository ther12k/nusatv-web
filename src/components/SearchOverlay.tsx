import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Clapperboard, MonitorPlay, Play, Search, Tv, X } from "lucide-react";
import { CHANNELS, IMG, MOVIES, RECENT, SERIES, TOP10, type Movie } from "../data";
import { ChannelBug, Eyebrow } from "./ui";
import type { PlayItem } from "./Player";

type Props = {
  open: boolean;
  onClose: () => void;
  onPlay: (item: PlayItem) => void;
  onMovie: (m: Movie) => void;
  onNav: (s: "live" | "guide" | "series") => void;
};

export default function SearchOverlay({ open, onClose, onPlay, onMovie, onNav }: Props) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQ("");
    const id = window.setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const term = q.trim().toLowerCase();
  const results = useMemo(() => {
    if (!term) return null;
    const ch = CHANNELS.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.abbr.toLowerCase().includes(term) ||
        c.now.toLowerCase().includes(term) ||
        c.cat.toLowerCase().includes(term),
    );
    const mo = MOVIES.filter(
      (m) =>
        m.title.toLowerCase().includes(term) ||
        m.genres.some((g) => g.toLowerCase().includes(term)) ||
        m.director.toLowerCase().includes(term),
    );
    const se = SERIES.episodes.filter(
      (e) => e.title.toLowerCase().includes(term) || e.desc.toLowerCase().includes(term),
    );
    const seriesHit = SERIES.title.toLowerCase().includes(term) ? [SERIES] : [];
    return { ch, mo, se, seriesHit, total: ch.length + mo.length + se.length + seriesHit.length };
  }, [term]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/96 backdrop-blur-xl animate-fade">
      <div className="mx-auto w-full max-w-3xl px-4 pt-6 pb-24 sm:px-6 sm:pt-10">
        <div className="flex items-center gap-3">
          <div className="flex h-14 min-w-0 flex-1 items-center gap-3 rounded-lg bg-panel px-4 ring-1 ring-line transition focus-within:ring-signal sm:h-16 sm:px-5">
            <Search size={20} className="shrink-0 text-signal-lt" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search channels, movies, series…"
              className="min-w-0 flex-1 bg-transparent text-base font-semibold outline-none placeholder:font-normal placeholder:text-dim sm:text-lg"
              aria-label="Search"
            />
            {q && (
              <button onClick={() => setQ("")} className="text-mute hover:text-fg" aria-label="Clear">
                <X size={18} />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="hidden h-14 shrink-0 rounded-lg px-4 font-mono text-[11px] tracking-[0.14em] text-mute ring-1 ring-line transition hover:text-fg hover:ring-dim sm:block sm:h-16"
          >
            ESC
          </button>
          <button
            onClick={onClose}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-mute ring-1 ring-line transition hover:text-fg sm:hidden"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        {!results && (
          <div className="mt-8">
            <Eyebrow>Recent searches</Eyebrow>
            <div className="mt-3 flex flex-wrap gap-2">
              {RECENT.map((r) => (
                <button
                  key={r}
                  onClick={() => setQ(r)}
                  className="rounded-full bg-raised px-3.5 py-1.5 text-[12px] font-medium text-mute ring-1 ring-line transition hover:text-fg hover:ring-signal"
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="mt-9 flex items-baseline justify-between">
              <Eyebrow>Trending tonight</Eyebrow>
              <span className="font-mono text-[10px] text-dim tnum">TOP 6</span>
            </div>
            <ul className="mt-3 divide-y divide-line rounded-lg bg-panel/60 ring-1 ring-line">
              {TOP10.map((t) => (
                <li key={t.rank}>
                  <button
                    onClick={() => onNav("series")}
                    className="group flex w-full items-center gap-4 px-4 py-3 text-left transition hover:bg-raised"
                  >
                    <span className="w-8 shrink-0 font-mono text-lg font-semibold text-dim tnum transition group-hover:text-signal-lt">
                      {String(t.rank).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{t.title}</span>
                      <span className="block truncate font-mono text-[10px] text-mute">{t.meta}</span>
                    </span>
                    <Play size={15} className="shrink-0 text-dim transition group-hover:text-signal-lt" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {results && results.total === 0 && (
          <div className="mt-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-raised ring-1 ring-line">
              <Search size={22} className="text-dim" />
            </div>
            <p className="mt-5 text-base font-bold">No results for “{q.trim()}”</p>
            <p className="mt-2 font-mono text-[11px] text-mute">
              Try a channel name, a film title or a genre
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {RECENT.slice(0, 4).map((r) => (
                <button
                  key={r}
                  onClick={() => setQ(r)}
                  className="rounded-full bg-raised px-3.5 py-1.5 text-[12px] text-mute ring-1 ring-line hover:text-fg"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {results && results.total > 0 && (
          <div className="mt-8 space-y-8">
            <div className="flex items-center justify-between">
              <Eyebrow>
                {results.total} result{results.total > 1 ? "s" : ""} for “{q.trim()}”
              </Eyebrow>
              <span className="font-mono text-[10px] text-dim">0.04s</span>
            </div>

            {results.ch.length > 0 && (
              <section>
                <SectionLabel icon={<Tv size={13} />} label={`Channels · ${results.ch.length}`} />
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {results.ch.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onPlay({ title: c.now, sub: `${c.name} · Ch ${c.num}`, img: IMG.sports, live: true, dur: 7200 });
                        onClose();
                      }}
                      className="group flex items-center gap-3 rounded-md bg-panel p-3 text-left ring-1 ring-line transition hover:ring-signal"
                    >
                      <ChannelBug ch={c} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold">{c.name}</span>
                        <span className="block truncate font-mono text-[10px] text-mute">{c.now}</span>
                      </span>
                      <span className="font-mono text-[11px] text-dim tnum">{c.num}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {results.mo.length > 0 && (
              <section>
                <SectionLabel icon={<Clapperboard size={13} />} label={`Movies · ${results.mo.length}`} />
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {results.mo.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        onMovie(m);
                        onClose();
                      }}
                      className="group flex items-center gap-3 rounded-md bg-panel p-2.5 text-left ring-1 ring-line transition hover:ring-signal"
                    >
                      <img
                        src={m.poster}
                        alt=""
                        className="h-14 w-10 shrink-0 rounded-sm object-cover"
                        loading="lazy"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold">{m.title}</span>
                        <span className="block truncate font-mono text-[10px] text-mute">
                          {m.year} · {m.genres.join(", ")}
                        </span>
                      </span>
                      <Play size={15} className="shrink-0 text-dim group-hover:text-signal-lt" />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {(results.seriesHit.length > 0 || results.se.length > 0) && (
              <section>
                <SectionLabel icon={<MonitorPlay size={13} />} label="Series" />
                <div className="mt-3 space-y-2">
                  {results.seriesHit.map((s) => (
                    <button
                      key={s.title}
                      onClick={() => {
                        onNav("series");
                        onClose();
                      }}
                      className="flex w-full items-center gap-3 rounded-md bg-panel p-3 text-left ring-1 ring-line transition hover:ring-signal"
                    >
                      <img src={s.episodes[0].img} alt="" className="h-12 w-20 shrink-0 rounded-sm object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold">
                          {s.title} · Season {s.season}
                        </span>
                        <span className="block truncate font-mono text-[10px] text-mute">
                          {s.episodes.length} episodes · {s.genres.join(" / ")}
                        </span>
                      </span>
                    </button>
                  ))}
                  {results.se.map((e) => (
                    <button
                      key={e.no}
                      onClick={() => {
                        onPlay({ title: `${SERIES.title} — ${e.title}`, sub: `S0${SERIES.season} E0${e.no} · ${e.dur}`, img: e.img });
                        onClose();
                      }}
                      className="flex w-full items-center gap-3 rounded-md bg-panel p-3 text-left ring-1 ring-line transition hover:ring-signal"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-raised font-mono text-[11px] text-mute">
                        E{String(e.no).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold">{e.title}</span>
                        <span className="block truncate font-mono text-[10px] text-mute">{e.dur}</span>
                      </span>
                      <Play size={15} className="shrink-0 text-dim" />
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-line pb-2 text-mute">
      {icon}
      <span className="font-mono text-[10px] tracking-[0.18em] uppercase">{label}</span>
    </div>
  );
}


