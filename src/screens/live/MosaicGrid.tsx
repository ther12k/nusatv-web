import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { Play, Star } from "lucide-react";
import { imgFor, type Channel } from "../../data";
import { Bar, ChannelBug, cx, LiveDot } from "../../components/ui";
import { useChannelStatus } from "../../live/useChannelStatus";
import { playUrl } from "../../live/playUrl";
import type { MosaicCount } from "../../live/model";

type Props = {
  channels: Channel[];
  activeId: string;
  count: MosaicCount;
  favs: string[];
  proxy?: boolean;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
};

const REAL_TILES = 4; // browsers choke on 9 simultaneous decodes — cap real playback

function TileVideo({
  src,
  live,
  proxy = false,
  relay = false,
}: {
  src: string;
  live: boolean;
  proxy?: boolean;
  relay?: boolean;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video || !live) return;
    const hls = new Hls({ autoStartLoad: true });
    hls.loadSource(playUrl(src, { proxy, relay }));
    hls.attachMedia(video);
    return () => {
      hls.destroy();
    };
  }, [src, live, proxy, relay]);
  if (!live) {
    return null; // the poster <img> already renders beneath
  }
  return (
    <video
      ref={ref}
      autoPlay
      muted
      playsInline
      className="h-full w-full object-cover"
    />
  );
}

export default function MosaicGrid({ channels, activeId, count, favs, proxy = false, onSelect, onOpen }: Props) {
  const { statusMap } = useChannelStatus();
  const tiles = channels.slice(0, count);
  const cols =
    count === 4
      ? "grid-cols-1 sm:grid-cols-2"
      : count === 6
        ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3";

  return (
    <div className={cx("grid gap-2.5 p-3 sm:gap-3 sm:p-4 lg:p-5", cols)}>
      {tiles.map((c, tileIndex) => {
        const active = c.id === activeId;
        const faved = favs.includes(c.id);
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            onDoubleClick={() => onOpen(c.id)}
            className={cx(
              "group relative aspect-video overflow-hidden rounded-lg bg-panel text-left ring-1 transition duration-200",
              active ? "ring-2 ring-signal shadow-[0_0_0_1px_#0e6bff,0_18px_50px_-24px_#0e6bff]" : "ring-line hover:ring-dim",
            )}
          >
            <img
              src={statusMap[c.id]?.thumb ?? imgFor(c)}
              alt=""
              className={cx(
                "h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]",
                tileIndex < REAL_TILES && "invisible",
              )}
            />
            {tileIndex < REAL_TILES && (
              <div className="absolute inset-0">
                <TileVideo src={c.src} live proxy={proxy} relay={c.relay ?? false} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/20" />
            <div className="scan pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply" />

            <div className="absolute top-2 left-2 flex items-center gap-1.5">
              {active ? <LiveDot /> : <ChannelBug ch={c} size="sm" />}
              {faved && <Star size={11} className="fill-ember text-ember" />}
            </div>
            <span className="absolute top-2 right-2 font-mono text-[10px] text-white/70 tnum">CH {c.num}</span>

            {active && (
              <span className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-signal text-white opacity-0 shadow-[0_12px_28px_-10px_#0e6bff] transition group-hover:opacity-100">
                <Play size={16} fill="currentColor" strokeWidth={0} />
              </span>
            )}

            <div className="absolute inset-x-0 bottom-0 p-2.5">
              <div className="flex items-center gap-2">
                {active && <ChannelBug ch={c} size="sm" />}
                <span className="truncate text-[12.5px] font-bold">{c.name}</span>
              </div>
              <div className="mt-0.5 truncate font-mono text-[10px] text-white/70">{c.now}</div>
              <Bar pct={c.prog} tone={active ? "live" : "fg"} className="mt-1.5" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
