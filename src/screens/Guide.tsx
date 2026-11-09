import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarClock, ChevronLeft, ChevronRight, Radio } from "lucide-react";
import { CHANNELS, GUIDE_SPAN, PX_PER_MIN, buildGuide, hhmm } from "../data";
import { ChannelBug, Chip, cx, Eyebrow } from "../components/ui";

const COL = "w-[132px]";
const COLW = 132;

export default function Guide({ now }: { now: Date }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [day, setDay] = useState(0);
  const guide = useMemo(() => buildGuide(now, day), [now, day]);
  const { rows, base, nowOffset } = guide;

  const nowX = nowOffset * PX_PER_MIN;
  const totalW = GUIDE_SPAN * PX_PER_MIN;

  // open the grid around what is on right now; reset to the start of a future day
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    if (day === 0) el.scrollLeft = Math.max(0, nowX - 220);
    else el.scrollLeft = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day]);

  const jumpToNow = () => {
    if (day !== 0) {
      setDay(0); // the effect above re-centres the grid
      return;
    }
    scroller.current?.scrollTo({ left: Math.max(0, nowX - 220), behavior: "smooth" });
  };

  const hourTicks = Array.from({ length: GUIDE_SPAN / 60 + 1 }, (_, i) => i);

  return (
    <div className="animate-rise pb-24 lg:pb-8">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line px-4 pt-6 pb-4 sm:px-6 lg:px-8">
        <div>
          <Eyebrow>Electronic programme guide · 12 hours</Eyebrow>
          <h1 className="mt-2.5 text-[30px] leading-[0.95] font-black tracking-tight sm:text-[40px]">TV Guide</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="no-bar flex gap-2 overflow-x-auto">
            {["Today", "Tomorrow", "Wed 15", "Thu 16"].map((d, i) => (
              <Chip key={d} active={i === day} onClick={() => setDay(i)}>
                {d}
              </Chip>
            ))}
          </div>
          <button
            onClick={jumpToNow}
            className="flex h-9 items-center gap-2 rounded-md bg-signal px-3.5 font-mono text-[11px] font-semibold tracking-wider text-white transition hover:bg-signal-lt"
          >
            <Radio size={13} /> {hhmm(now)}
          </button>
          <div className="hidden items-center gap-1 sm:flex">
            <button className="flex h-9 w-9 items-center justify-center rounded-md text-mute ring-1 ring-line transition hover:text-fg" aria-label="Previous day">
              <ChevronLeft size={16} />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-md text-mute ring-1 ring-line transition hover:text-fg" aria-label="Next day">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-line px-4 py-2.5 font-mono text-[10px] tracking-[0.12em] text-mute uppercase sm:px-6 lg:px-8">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-signal" /> On now
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-raised ring-1 ring-line" /> Scheduled
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-[2px] bg-live" /> Current time
        </span>
        <span className="ml-auto hidden text-dim sm:inline">{CHANNELS.length} channels · scroll horizontally →</span>
      </div>

      {/* the grid */}
      <div
        ref={scroller}
        className="thin-bar relative max-h-[calc(100vh-16rem)] min-h-[340px] overflow-auto overscroll-x-contain"
      >
        <div
          className="relative"
          style={{
            width: COLW + totalW,
            // hour + half-hour rules, anchored to the time axis origin (not the page)
            backgroundImage: `repeating-linear-gradient(to right, rgba(36,41,49,.95) 0 1px, transparent 1px ${60 * PX_PER_MIN}px), repeating-linear-gradient(to right, rgba(36,41,49,.5) 0 1px, transparent 1px ${30 * PX_PER_MIN}px)`,
            backgroundPosition: `${COLW}px 0`,
          }}
        >
          {/* time axis */}
          <div className="sticky top-0 z-30 flex h-10 border-b border-line bg-ink">
            <div className={cx("sticky left-0 z-40 flex shrink-0 items-center border-r border-line bg-ink px-3", COL)}>
              <span className="font-mono text-[9.5px] tracking-[0.16em] text-dim uppercase">Channel</span>
            </div>
            <div className="relative flex-1">
              {hourTicks.map((i) => {
                const d = new Date(base.getTime() + i * 60 * 60000);
                const isNowHour = Math.floor(nowOffset / 60) === i;
                // don't let an hour label collide with the live time chip
                if (Math.abs(i * 60 * PX_PER_MIN - nowX) < 34) return null;
                return (
                  <span
                    key={i}
                    style={{ left: i * 60 * PX_PER_MIN }}
                    className={cx(
                      "absolute top-1/2 -translate-x-1/2 font-mono text-[10.5px] tnum",
                      isNowHour ? "font-semibold text-signal-lt" : "text-mute",
                    )}
                  >
                    {hhmm(d)}
                  </span>
                );
              })}
              {/* live time chip riding the axis */}
              {nowX >= 0 && nowX <= totalW && (
                <span
                  style={{ left: nowX }}
                  className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center rounded-sm bg-live px-1.5 py-[3px] font-mono text-[9.5px] leading-none font-semibold text-white shadow-[0_0_18px_-4px_#ff3b30]"
                >
                  {hhmm(now)}
                </span>
              )}
            </div>
          </div>

          {/* channel rows */}
          {rows.map(({ channel: c, programs }) => (
            <div key={c.id} className="flex border-b border-line">
              <div
                className={cx(
                  "sticky left-0 z-20 flex shrink-0 items-center gap-2 border-r border-line bg-ink px-2.5 sm:px-3",
                  COL,
                )}
              >
                <span className="font-mono text-[9.5px] text-dim tnum">{c.num}</span>
                <ChannelBug ch={c} size="sm" />
                <span className="hidden min-w-0 flex-col sm:flex">
                  <span className="truncate text-[12px] leading-tight font-semibold">{c.name}</span>
                  <span className="truncate font-mono text-[9px] text-dim">{c.cat}</span>
                </span>
              </div>

              <div className="relative h-[62px] flex-1 sm:h-[68px]">
                {programs.map((p, i) => {
                  const live = nowOffset >= p.start && nowOffset < p.start + p.dur;
                  const elapsed = ((nowOffset - p.start) / p.dur) * 100;
                  const startD = new Date(base.getTime() + p.start * 60000);
                  const endD = new Date(base.getTime() + (p.start + p.dur) * 60000);
                  return (
                    <button
                      key={`${c.id}-${i}`}
                      style={{ left: p.start * PX_PER_MIN + 1, width: Math.max(26, p.dur * PX_PER_MIN - 2) }}
                      className={cx(
                        "group absolute top-1 bottom-1 overflow-hidden rounded-[4px px-2 py-1.5 text-left transition duration-150",
                        live
                          ? "bg-signal/18 ring-1 ring-signal/70 hover:bg-signal/28"
                          : "bg-raised/85 ring-1 ring-line hover:bg-signal/12 hover:ring-signal/60",
                      )}
                      title={`${p.title} · ${hhmm(startD)}–${hhmm(endD)}`}
                    >
                      <span
                        className={cx(
                          "block truncate text-[11.5px] leading-tight font-semibold",
                          live ? "text-white" : "text-fg/90 group-hover:text-white",
                        )}
                      >
                        {p.title}
                      </span>
                      <span className="mt-1 block truncate font-mono text-[9.5px] text-mute tnum">
                        {hhmm(startD)} – {hhmm(endD)}
                      </span>
                      {live && (
                        <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white/15">
                          <span className="block h-full bg-live" style={{ width: `${Math.max(0, Math.min(100, elapsed))}%` }} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* the now line */}
          {nowX >= 0 && nowX <= totalW && (
            <div
              className="pointer-events-none absolute top-10 bottom-0 z-10 w-[2px] bg-live"
              style={{ left: COLW + nowX }}
              aria-hidden
            >
              <span className="absolute -top-1 -left-[4px] h-2.5 w-2.5 rotate-45 bg-live" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 font-mono text-[10px] tracking-[0.12em] text-dim uppercase sm:px-6 lg:px-8">
        <span className="flex items-center gap-2">
          <CalendarClock size={13} /> Data refreshed {hhmm(now)} · EPG source: IP·TV grid
        </span>
        <span className="hidden sm:inline">Window {hhmm(base)} → {hhmm(new Date(base.getTime() + GUIDE_SPAN * 60000))}</span>
      </div>
    </div>
  );
}
