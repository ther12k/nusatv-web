import { useState } from "react";
import { Check, Play, Plus, Star } from "lucide-react";
import { IMG, SERIES } from "../data";
import { Bar, Chip, Eyebrow, GhostButton, PrimaryButton, SectionHead } from "../components/ui";
import type { PlayItem } from "../components/Player";

export default function Series({ onPlay }: { onPlay: (item: PlayItem) => void }) {
  const [season, setSeason] = useState(2);
  const eps = SERIES.episodes;

  return (
    <div className="animate-rise pb-24 lg:pb-10">
      {/* series hero */}
      <section className="relative isolate overflow-hidden">
        <img src={IMG.series} alt="" className="absolute inset-0 h-full w-full object-cover object-[60%_40%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/30 sm:bg-none" />
        <div className="absolute inset-0 hidden scrim-l sm:block" />
        <div className="relative px-4 pt-24 pb-7 sm:px-8 sm:pt-40 sm:pb-9 lg:px-12 lg:pt-52">
          <div className="max-w-[620px]">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-sm bg-signal px-1.5 py-[4px] font-mono text-[9px] tracking-[0.14em] text-white">
                ORIGINAL SERIES
              </span>
              <span className="font-mono text-[10px] tracking-[0.16em] text-white/70 uppercase">
                {SERIES.quality} · {SERIES.episodes.length} episodes
              </span>
            </div>
            <h1 className="mt-3.5 text-[clamp(2.1rem,7vw,4.2rem)] leading-[0.9] font-black tracking-[-0.045em]">
              {SERIES.title}
            </h1>
            <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] text-white/70 tnum">
              <span className="flex items-center gap-1.5 text-white">
                <Star size={11} className="fill-ember text-ember" strokeWidth={0} /> {SERIES.rating}
              </span>
              <span>{SERIES.year}</span>
              <span>Season {SERIES.season}</span>
              <span>{SERIES.genres.join(" · ")}</span>
            </div>
            <p className="mt-4 hidden max-w-[56ch] text-[14.5px] leading-relaxed text-white/75 line-clamp-3 sm:block">
              {SERIES.synopsis}
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <PrimaryButton
                onClick={() =>
                  onPlay({
                    title: `${SERIES.title} — Night Train`,
                    sub: `S0${SERIES.season} E04 · 49m`,
                    img: eps[3].img,
                    dur: 2940,
                  })
                }
                className="h-11 px-6 text-sm"
              >
                <Play size={17} fill="currentColor" strokeWidth={0} /> Resume E04
              </PrimaryButton>
              <GhostButton className="h-11 bg-white/8 px-5 text-white ring-white/25 backdrop-blur-sm hover:bg-white/15">
                <Plus size={16} /> My List
              </GhostButton>
              <GhostButton className="h-11 bg-white/8 px-5 text-white ring-white/25 backdrop-blur-sm hover:bg-white/15">
                <Check size={16} /> Mark watched
              </GhostButton>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-6 px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead title="Episodes" className="flex-1" />
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <Chip key={s} active={s === season} onClick={() => setSeason(s)}>
                Season {s}
              </Chip>
            ))}
          </div>
        </div>

        {season !== 2 ? (
          <div className="rounded-lg bg-panel py-20 text-center ring-1 ring-line">
            <Eyebrow>Season {season}</Eyebrow>
            <p className="mt-3 text-base font-bold">Not on the server yet</p>
            <p className="mt-2 font-mono text-[11px] text-mute">Episodes land within 48h of the broadcast</p>
          </div>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {eps.map((e, i) => {
              return (
                <li key={e.no} style={{ animationDelay: `${i * 40}ms` }} className="animate-rise">
                  <button
                    onClick={() =>
                      onPlay({
                        title: `${SERIES.title} — ${e.title}`,
                        sub: `S0${SERIES.season} E0${String(e.no).padStart(2, "0")} · ${e.dur}`,
                        img: e.img,
                        dur: 3000,
                      })
                    }
                    className="group flex w-full items-start gap-3 py-3.5 text-left transition hover:bg-raised/50 sm:gap-5"
                  >
                    <span className="relative aspect-video w-[112px] shrink-0 overflow-hidden rounded-md bg-panel ring-1 ring-line sm:w-[188px]">
                      <img src={e.img} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      <span className="absolute inset-0 flex items-center justify-center bg-ink/45 opacity-0 transition group-hover:opacity-100">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-signal text-white">
                          <Play size={14} fill="currentColor" strokeWidth={0} />
                        </span>
                      </span>
                      {e.pct === 100 && (
                        <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-signal text-white">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}
                      <span className="absolute right-1.5 bottom-1.5 rounded bg-ink/85 px-1 py-px font-mono text-[9.5px] text-white/90 tnum">
                        {e.dur}
                      </span>
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-2.5">
                        <span className="font-mono text-[11px] text-dim tnum">E{String(e.no).padStart(2, "0")}</span>
                        <span className="truncate text-[14.5px] font-bold transition group-hover:text-signal-lt">
                          {e.title}
                        </span>
                      </span>
                      <span className="mt-1.5 line-clamp-2 block max-w-[70ch] text-[13px] leading-relaxed text-mute">
                        {e.desc}
                      </span>
                      <span className="mt-2.5 flex max-w-[320px] items-center gap-3">
                        <Bar pct={e.pct} className="flex-1" tone={e.pct === 100 ? "fg" : "signal"} />
                        <span className="shrink-0 font-mono text-[10px] text-dim tnum">
                          {e.pct === 100 ? "WATCHED" : e.pct > 0 ? `${e.pct}%` : "NEW"}
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
          {[
            ["CAST", "Léa Drucker · Mathilde Amni · Jonathan Zimmer"],
            ["CREATOR", "Éric Rochant · Canal+ / Federation"],
            ["AUDIO", "English 5.1 · Français · Deutsch"],
          ].map(([k, v]) => (
            <div key={k}>
              <Eyebrow>{k}</Eyebrow>
              <p className="mt-2 text-[13px] text-fg/85">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
