import { CalendarClock, History, Play, Plus, Trash2, Tv } from "lucide-react";
import { CHANNELS, CONTINUE, IMG, MOVIES, type Movie } from "../data";
import { Bar, ChannelBug, Eyebrow, GhostButton, LiveDot, PrimaryButton, PosterTile, SectionHead } from "../components/ui";
import type { PlayItem } from "../components/Player";
import type { ScreenId } from "../components/Rail";

type Props = {
  now: Date;
  onNav: (s: ScreenId) => void;
  onPlay: (item: PlayItem) => void;
  onMovie: (m: Movie) => void;
};

export default function Home({ now, onNav, onPlay, onMovie }: Props) {
  const live = CHANNELS.slice(0, 8);

  return (
    <div className="animate-rise pb-24 lg:pb-10">
      {/* ------------------------------------------------------------ hero */}
      <section className="relative isolate h-[78vh] max-h-[720px] min-h-[470px] w-full overflow-hidden">
        <img
          src={IMG.hero}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover object-[68%_45%] animate-drift"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10 sm:hidden" />
        <div className="absolute inset-0 hidden scrim-l sm:block" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />

        <div className="absolute inset-x-0 bottom-0 px-4 pb-7 sm:px-8 sm:pb-9 lg:px-12 lg:pb-12">
          <div className="max-w-[660px] animate-rise" style={{ animationDelay: "80ms" }}>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-sm bg-signal px-1.5 py-[4px] font-mono text-[9px] tracking-[0.14em] text-white">
                FEATURED
              </span>
              <span className="font-mono text-[10px] tracking-[0.16em] text-white/70 uppercase">
                4K · Dolby Vision · Atmos
              </span>
              <span className="hidden font-mono text-[10px] tracking-[0.16em] text-white/50 uppercase sm:inline">
                {now.toLocaleDateString([], { weekday: "long" })} premiere
              </span>
            </div>

            <h1 className="mt-3.5 text-[clamp(2.3rem,7.5vw,4.6rem)] leading-[0.9] font-black tracking-[-0.045em]">
              Jojo Rabbit
              <span className="ml-2 align-middle font-mono text-[clamp(0.9rem,2vw,1.35rem)] font-normal tracking-normal text-white/55 tnum">
                (2022)
              </span>
            </h1>

            <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] text-white/70 tnum">
              <span className="flex items-center gap-1.5 text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-ember" /> 7.9
              </span>
              <span>1h 48m</span>
              <span className="rounded border border-white/25 px-1.5 py-0.5 text-[10px]">15</span>
              <span>Comedy · Drama</span>
              <span className="hidden sm:inline">Taika Waititi</span>
            </div>

            <p className="mt-4 hidden max-w-[54ch] text-[14.5px] leading-relaxed text-white/75 line-clamp-3 sm:block">
              A lonely German boy joins the Hitler Youth to please his mother — and discovers a Jewish girl hiding
              in the attic, with his imaginary friend Adolf as the worst possible conscience.
            </p>

            <div className="mt-5.5 flex flex-wrap gap-2.5 sm:mt-6">
              <PrimaryButton
                onClick={() =>
                  onPlay({ title: "Jojo Rabbit", sub: "2022 · 1h 48m · 4K Dolby Vision", img: IMG.jojo, dur: 6480 })
                }
                className="h-11 px-6 text-sm"
              >
                <Play size={17} fill="currentColor" strokeWidth={0} /> Watch Now
              </PrimaryButton>
              <GhostButton
                onClick={() => onMovie(MOVIES[0])}
                className="h-11 bg-white/8 px-5 text-white ring-white/25 backdrop-blur-sm hover:bg-white/15 hover:ring-white/50"
              >
                More Info
              </GhostButton>
              <button
                aria-label="Add to my list"
                className="flex h-11 w-11 items-center justify-center rounded-md text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-white/15"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ quick dials */}
      <div className="border-b border-line px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="no-bar flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => onNav("guide")}
            className="flex h-9 shrink-0 items-center gap-2 rounded-md bg-signal px-3.5 text-[12px] font-semibold text-white transition hover:bg-signal-lt"
          >
            <CalendarClock size={15} /> TV Guide
          </button>
          <button
            onClick={() => onNav("history")}
            className="flex h-9 shrink-0 items-center gap-2 rounded-md bg-raised px-3.5 text-[12px] font-semibold text-mute ring-1 ring-line transition hover:text-fg hover:ring-dim"
          >
            <History size={15} /> History
          </button>
          <span className="mx-1 hidden h-5 w-px shrink-0 bg-line sm:block" />
          {CHANNELS.slice(0, 6).map((c) => (
            <button
              key={c.id}
              onClick={() => onNav("live")}
              className="shrink-0 rounded-md p-0.5 ring-1 ring-line transition hover:ring-signal"
              title={`${c.name} · ${c.now}`}
            >
              <ChannelBug ch={c} size="md" className="ring-0" />
            </button>
          ))}
          <span className="ml-auto shrink-0 pl-3 font-mono text-[10px] tracking-[0.14em] text-dim uppercase">
            {CHANNELS.length} channels
          </span>
        </div>
      </div>

      <div className="space-y-11 px-4 pt-8 sm:px-6 lg:px-8">
        {/* -------------------------------------------------- latest update */}
        <section className="space-y-4">
          <SectionHead title="Latest update" action="All movies" onAction={() => onNav("movies")} />
          <div className="no-bar -mx-4 flex gap-3.5 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-7 lg:gap-4 lg:overflow-visible lg:px-0">
            {MOVIES.slice(0, 7).map((m) => (
              <PosterTile
                key={m.id}
                className="w-[132px] shrink-0 lg:w-auto"
                img={m.poster}
                title={m.title}
                meta={`${m.year} · ${m.genres[0]}`}
                rating={m.rating}
                quality={m.quality}
                onOpen={() => onMovie(m)}
              />
            ))}
          </div>
        </section>

        {/* ------------------------------------------------ continue watching */}
        <section className="space-y-4">
          <SectionHead title="Continue watching" action="History" onAction={() => onNav("history")} />
          <div className="no-bar -mx-4 flex gap-3.5 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0">
            {CONTINUE.map((r) => (
              <button
                key={r.id}
                onClick={() =>
                  r.to === "series"
                    ? onNav("series")
                    : r.to === "live"
                      ? onNav("live")
                      : r.to === "movies"
                        ? onNav("movies")
                        : onPlay({ title: r.title, sub: r.sub, img: r.img, dur: 6480 })
                }
                className="group w-[262px] shrink-0 text-left lg:w-auto"
              >
                <div className="relative aspect-video overflow-hidden rounded-md bg-panel ring-1 ring-line transition duration-300 group-hover:ring-signal">
                  <img
                    src={r.img}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/10 to-transparent" />
                  {r.live ? (
                    <span className="absolute top-2 left-2">
                      <LiveDot />
                    </span>
                  ) : (
                    <span className="absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-white opacity-0 ring-1 ring-white/25 backdrop-blur transition group-hover:opacity-100">
                      <Play size={13} fill="currentColor" strokeWidth={0} />
                    </span>
                  )}
                  <span className="absolute right-2.5 bottom-2.5 rounded bg-ink/80 px-1.5 py-0.5 font-mono text-[10px] text-white/90 tnum">
                    {r.pct}%
                  </span>
                </div>
                <div className="mt-2.5 truncate text-[13.5px] font-semibold transition group-hover:text-signal-lt">
                  {r.title}
                </div>
                <div className="mt-1 truncate font-mono text-[10px] text-mute">{r.sub}</div>
                <Bar pct={r.pct} className="mt-2" tone={r.live ? "live" : "signal"} />
              </button>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------- live now */}
        <section className="space-y-4">
          <SectionHead title="On air right now" action="Open live TV" onAction={() => onNav("live")} />
          <div className="no-bar -mx-4 flex gap-3.5 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0">
            {live.map((c) => (
              <button
                key={c.id}
                onClick={() => onNav("live")}
                className="group w-[236px] shrink-0 text-left lg:w-auto"
              >
                <div className="relative aspect-video overflow-hidden rounded-md bg-panel ring-1 ring-line transition duration-300 group-hover:ring-signal">
                  <img
                    src={c.pool === "sport" ? IMG.sports : c.pool === "film" ? IMG.jojo : IMG.series}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/25 to-transparent" />
                  <span className="absolute top-2 left-2">
                    <LiveDot />
                  </span>
                  <span className="absolute right-2.5 bottom-2.5 font-mono text-[10px] text-white/70 tnum">
                    CH {c.num}
                  </span>
                  <span className="absolute bottom-2.5 left-2.5 flex items-center gap-2">
                    <ChannelBug ch={c} size="sm" />
                    <span className="max-w-[130px] truncate text-[11.5px] font-semibold text-white">{c.name}</span>
                  </span>
                </div>
                <div className="mt-2.5 truncate text-[13px] font-semibold transition group-hover:text-signal-lt">
                  {c.now}
                </div>
                <Bar pct={c.prog} className="mt-2" tone="live" />
                <div className="mt-1.5 flex items-center justify-between font-mono text-[9.5px] text-mute">
                  <span className="truncate">{c.cat}</span>
                  <span className="tnum">{100 - c.prog}% left</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------- footer tip */}
        <section className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 pb-4">
          <Eyebrow>IP·TV — 14 channels · 7 films · 1 series</Eyebrow>
          <div className="flex items-center gap-2 text-dim">
            <Tv size={14} />
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase">Press / to search</span>
            <span className="mx-1 h-4 w-px bg-line" />
            <Trash2 size={14} />
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase">Clear cache</span>
          </div>
        </section>
      </div>
    </div>
  );
}
