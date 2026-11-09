import { useMemo, useState } from "react";
import { Play, Search, SlidersHorizontal } from "lucide-react";
import { GENRES, IMG, MOVIES, TOP10, type Movie } from "../data";
import { Chip, Eyebrow, PosterTile, ScreenHead, SectionHead } from "../components/ui";

type Props = { onMovie: (m: Movie) => void; onPlay?: (m: Movie) => void };

export default function Movies({ onMovie }: Props) {
  const [genre, setGenre] = useState("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"rating" | "year" | "title">("rating");

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const l = MOVIES.filter((m) => {
      const okGenre = genre === "All" || m.genres.includes(genre);
      const okText =
        !term ||
        m.title.toLowerCase().includes(term) ||
        m.genres.some((g) => g.toLowerCase().includes(term)) ||
        m.director.toLowerCase().includes(term);
      return okGenre && okText;
    });
    return [...l].sort((a, b) =>
      sort === "rating" ? b.rating - a.rating : sort === "year" ? b.year - a.year : a.title.localeCompare(b.title),
    );
  }, [genre, q, sort]);

  return (
    <div className="animate-rise pb-24 lg:pb-10">
      <ScreenHead
        eyebrow="On demand · 4K HDR"
        title="Movies"
        sub="Seven titles licensed this week, all with Dolby Vision where the source allows."
        right={
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-dim" />
              <input
                value={q}
                placeholder="Filter titles"
                className="h-9 w-[150px] rounded-md bg-panel pl-8 pr-3 text-[12.5px] outline-none ring-1 ring-line transition placeholder:text-dim focus:ring-signal sm:w-[190px]"
                aria-label="Filter titles"
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <label className="flex h-9 items-center gap-2 rounded-md bg-panel pl-3 ring-1 ring-line">
              <SlidersHorizontal size={14} className="text-dim" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                aria-label="Sort"
                className="h-full cursor-pointer rounded-md bg-transparent pr-2 text-[12.5px] font-semibold outline-none"
              >
                <option value="rating">Rating</option>
                <option value="year">Newest</option>
                <option value="title">A–Z</option>
              </select>
            </label>
          </div>
        }
      />

      <div className="no-bar flex gap-2 overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
        {GENRES.map((g) => (
          <Chip key={g} active={g === genre} onClick={() => setGenre(g)}>
            {g}
          </Chip>
        ))}
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between pb-4">
          <Eyebrow>
            {list.length} title{list.length !== 1 ? "s" : ""}
            {genre !== "All" && ` · ${genre}`}
            {q && ` · “${q}”`}
          </Eyebrow>
          <span className="font-mono text-[10px] text-dim">SORTED BY {sort.toUpperCase()}</span>
        </div>

        {list.length === 0 ? (
          <div className="rounded-lg bg-panel py-20 text-center ring-1 ring-line">
            <p className="text-base font-bold">Nothing in {genre} yet</p>
            <p className="mt-2 font-mono text-[11px] text-mute">The catalogue rotates weekly — check back Friday</p>
            <button onClick={() => setGenre("All")} className="mt-5 rounded-md bg-signal px-4 py-2 text-[12.5px] font-bold text-white">
              Show all movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {list.map((m, i) => (
              <div key={m.id} style={{ animationDelay: `${i * 45}ms` }} className="animate-rise">
                <PosterTile
                  img={m.poster}
                  title={m.title}
                  meta={`${m.year} · ${m.genres[0]}`}
                  rating={m.rating}
                  quality={m.quality}
                  onOpen={() => onMovie(m)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* collections band */}
      <section className="mt-14 space-y-4 px-4 sm:px-6 lg:px-8">
        <SectionHead title="Collections" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { t: "After dark", s: "Espionage, thrillers and night streets", img: IMG.series, n: 9 },
            { t: "Wide open spaces", s: "Deserts, ridgelines and golden hour", img: IMG.hero, n: 6 },
          ].map((c) => (
            <button
              key={c.t}
              className="group relative aspect-[16/7] overflow-hidden rounded-lg ring-1 ring-line transition hover:ring-signal"
            >
              <img src={c.img} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent" />
              <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-5 text-left sm:p-6">
                <span className="font-mono text-[10px] tracking-[0.16em] text-white/60 uppercase">{c.n} TITLES</span>
                <span className="mt-1.5 text-xl font-black tracking-tight sm:text-2xl">{c.t}</span>
                <span className="mt-1 max-w-[24ch] text-[12.5px] text-white/70">{c.s}</span>
              </div>
              <span className="absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-signal text-white opacity-0 transition group-hover:opacity-100">
                <Play size={16} fill="currentColor" strokeWidth={0} />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* top 10 — editorial ranked list, no artwork */}
      <section className="mt-14 space-y-4 px-4 sm:px-6 lg:px-8">
        <SectionHead title="Top 10 on IP·TV today" />
        <ol className="divide-y divide-line border-y border-line">
          {TOP10.map((t) => (
            <li key={t.rank}>
              <button
                onClick={() => {
                  const m = MOVIES.find((x) => x.id === t.id);
                  if (m) onMovie(m);
                }}
                className="group flex w-full items-center gap-4 py-3.5 text-left transition hover:bg-raised/60 sm:gap-6"
              >
                <span className="w-10 shrink-0 text-right font-mono text-[26px] leading-none font-semibold text-line transition group-hover:text-signal sm:text-[38px]">
                  {String(t.rank).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-bold transition group-hover:text-signal-lt sm:text-lg">
                    {t.title}
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-[10.5px] text-mute">{t.meta}</span>
                </span>
                <span className="hidden shrink-0 font-mono text-[10px] tracking-[0.14em] text-dim uppercase sm:block">
                  {t.id ? "Play" : "Episodes"}
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-raised text-mute ring-1 ring-line transition group-hover:bg-signal group-hover:text-white group-hover:ring-signal">
                  <Play size={14} fill="currentColor" strokeWidth={0} />
                </span>
              </button>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
