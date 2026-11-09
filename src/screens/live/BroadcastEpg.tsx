import { CHANNELS, featureFor, hhmm, type Channel } from "../../data";
import { ChannelBug, Chip, cx, Eyebrow } from "../../components/ui";

const DAYS = ["Today", "Tomorrow", "Wednesday", "Thursday", "Friday"];

type Props = {
  now: Date;
  activeId: string;
  onSelect: (id: string) => void;
  channels: Channel[];
};

export default function BroadcastEpg({ now, activeId, onSelect, channels }: Props) {
  const list = channels.length ? channels : CHANNELS;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-line px-3 py-2.5 sm:px-4">
        <Eyebrow>Programme grid · 5 days</Eyebrow>
        <div className="no-bar flex gap-1.5 overflow-x-auto">
          {DAYS.map((d, i) => (
            <Chip key={d} active={i === 0}>
              {d}
            </Chip>
          ))}
        </div>
        <span className="hidden font-mono text-[10px] text-dim tnum sm:inline">{hhmm(now)}</span>
      </div>

      {/* desktop / tablet: channel × day matrix */}
      <div className="thin-bar hidden min-h-0 flex-1 overflow-auto md:block">
        <div
          className="min-w-[720px]"
          style={{ display: "grid", gridTemplateColumns: `148px repeat(${DAYS.length}, minmax(120px, 1fr))` }}
        >
          <div className="sticky top-0 z-20 border-b border-line bg-ink px-3 py-2 font-mono text-[9.5px] tracking-[0.16em] text-dim uppercase">
            Channel
          </div>
          {DAYS.map((d, i) => (
            <div
              key={d}
              className={cx(
                "sticky top-0 z-20 border-b border-l border-line bg-ink px-3 py-2 font-mono text-[10px] tracking-[0.12em] uppercase",
                i === 0 ? "text-signal-lt" : "text-mute",
              )}
            >
              {d}
            </div>
          ))}

          {list.map((c) => {
            const active = c.id === activeId;
            return (
              <Row key={c.id} c={c} active={active} onSelect={onSelect} />
            );
          })}
        </div>
      </div>

      {/* mobile: today-only stacked cells */}
      <div className="thin-bar min-h-0 flex-1 divide-y divide-line overflow-y-auto md:hidden">
        {list.map((c) => {
          const active = c.id === activeId;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={cx("flex w-full items-center gap-3 px-3 py-2.5 text-left", active && "bg-signal/12")}
            >
              <ChannelBug ch={c} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-semibold">{c.name}</span>
                <span className="block truncate font-mono text-[10px] text-mute">{featureFor(c, 0)}</span>
              </span>
              <span className="font-mono text-[10px] text-dim tnum">{c.num}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Row({ c, active, onSelect }: { c: Channel; active: boolean; onSelect: (id: string) => void }) {
  return (
    <>
      <button
        onClick={() => onSelect(c.id)}
        className={cx(
          "sticky left-0 z-10 flex items-center gap-2 border-b border-line bg-ink px-2.5 py-1.5 text-left",
          active && "bg-signal/10",
        )}
      >
        <span className="font-mono text-[9.5px] text-dim tnum">{c.num}</span>
        <ChannelBug ch={c} size="sm" />
        <span className="hidden min-w-0 truncate text-[11.5px] font-semibold lg:block">{c.name}</span>
      </button>
      {DAYS.map((_, day) => {
        const title = day === 0 ? c.now : featureFor(c, day);
        const live = day === 0;
        return (
          <button
            key={day}
            onClick={() => onSelect(c.id)}
            className={cx(
              "border-b border-l border-line px-2.5 py-1.5 text-left transition",
              live && active ? "bg-signal/20 ring-1 ring-inset ring-signal/50" : "hover:bg-raised",
              active && !live && "bg-signal/5",
            )}
          >
            <span className={cx("block truncate text-[11.5px] leading-tight font-semibold", live && active && "text-white")}>
              {title}
            </span>
            <span className="mt-0.5 block truncate font-mono text-[9px] text-mute">
              {live ? "On now" : day === 1 ? "Tomorrow" : DAYS[day]}
            </span>
          </button>
        );
      })}
    </>
  );
}
