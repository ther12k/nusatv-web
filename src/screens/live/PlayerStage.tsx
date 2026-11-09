import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Captions,
  Maximize,
  Pause,
  PictureInPicture2,
  Play,
  Radio,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { hhmm, imgFor, signalFor, type Channel } from "../../data";
import { ChannelBug, cx, LiveDot } from "../../components/ui";
import { useChannelStatus } from "../../live/useChannelStatus";

type Props = {
  ch: Channel;
  now: Date;
  muted: boolean;
  playing: boolean;
  zap?: string;
  fill?: boolean;
  compact?: boolean;
  cinema?: boolean;
  onMute: () => void;
  onTogglePlay: () => void;
  onOpen?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  /** Route through this host's /stream relay (non-CORS hosts). */
  proxy?: boolean;
  sourceIndex?: number;
  onSourceChange?: (index: number) => void;
};

export default function PlayerStage({
  ch,
  now,
  muted,
  playing,
  zap,
  fill,
  compact,
  cinema,
  onMute,
  onTogglePlay,
  onOpen,
  onPrev,
  onNext,
  proxy = false,
  sourceIndex = 0,
  onSourceChange,
}: Props) {
  const [tuning, setTuning] = useState(false);
  const [chrome, setChrome] = useState(true);

  // Native Picture-in-Picture helper
  const togglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoRef.current && document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch {
      // browser blocked or unsupported
    }
  };

  // YouTube-like: when switching browser tabs (document.hidden), pop out to PiP if playing!
  useEffect(() => {
    const handleVisibilityChange = async () => {
      try {
        if (document.hidden && playing && videoRef.current && document.pictureInPictureEnabled && !document.pictureInPictureElement) {
          await videoRef.current.requestPictureInPicture();
        }
      } catch {
        // user interaction required in some browsers
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [playing]);
  const sig = signalFor(ch);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { statusMap } = useChannelStatus();
  const channelStat = statusMap[ch.id];
  const livePoster = channelStat?.thumb ?? imgFor(ch);

  const sources = ch.sources && ch.sources.length > 0
    ? ch.sources
    : [{ label: "Server 1", url: ch.src }];
  const safeSourceIndex = Math.min(Math.max(0, sourceIndex), sources.length - 1);
  const activeSource = sources[safeSourceIndex] ?? sources[0]!;
  const activeUrl = activeSource.url;

  // REAL playback: hls.js attaches the broadcaster's own HLS endpoint
  // to the video element behind the design's chrome. Muted autoplay
  // (browser policy); the mute button unmutes with a user gesture.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const hls = new Hls({ autoStartLoad: true });
    const source =
      proxy && !activeUrl.startsWith("/")
        ? `/stream?url=${encodeURIComponent(activeUrl)}`
        : activeUrl;
    hls.loadSource(source);
    hls.attachMedia(video);
    hls.on(Hls.Events.ERROR, (_e, data) => {
      if (!data.fatal) return;
      if (sources.length > 1 && onSourceChange) {
        console.warn(`HLS error on ${activeSource.label}, auto-switching server...`);
        onSourceChange((safeSourceIndex + 1) % sources.length);
      } else {
        video.setAttribute("data-hls-error", data.details);
      }
    });
    return () => {
      hls.destroy();
    };
  }, [activeUrl, proxy, safeSourceIndex, sources.length, onSourceChange]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    if (playing) void video.play().catch(() => {/* autoplay block — poster shows */});
    else video.pause();
  }, [playing, muted, activeUrl]);

  useEffect(() => {
    setTuning(true);
    const id = window.setTimeout(() => setTuning(false), 420);
    return () => window.clearTimeout(id);
  }, [ch.id]);

  useEffect(() => {
    if (!cinema) return;
    setChrome(true);
    const id = window.setTimeout(() => setChrome(false), 2800);
    return () => window.clearTimeout(id);
  }, [cinema, ch.id]);

  const bars = Math.round((sig / 100) * 4);

  return (
    <div
      id={compact ? undefined : "live-stage"}
      className={cx(
        "group/stage relative overflow-hidden bg-panel ring-1 ring-line",
        fill ? "h-full w-full" : "aspect-video w-full",
        cinema ? "rounded-none ring-0" : "rounded-lg",
      )}
      onMouseMove={() => cinema && setChrome(true)}
    >
      <video
        ref={videoRef}
        poster={livePoster}
        autoPlay
        muted={muted}
        playsInline
        className={cx("h-full w-full object-cover", playing && !tuning && "animate-drift")}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/10 to-ink/40 opacity-70" />
      <div className="scan pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply" />

      {tuning && (
        <div className="snow pointer-events-none absolute inset-0 z-20 animate-tune mix-blend-screen opacity-50" />
      )}

      {/* top-left identity */}
      <div
        className={cx(
          "absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 transition-opacity duration-300",
          cinema && !chrome && "opacity-0",
        )}
      >
        <LiveDot />
        <span className="rounded bg-ink/75 px-1.5 py-1 font-mono text-[10px] text-white/85 backdrop-blur tnum">
          CH {ch.num}
        </span>
        <ChannelBug ch={ch} size="sm" />
        {ch.hd && (
          <span className="rounded-sm bg-ink/75 px-1.5 py-1 font-mono text-[9px] tracking-wider text-white/80 backdrop-blur">
            {ch.pool === "sport" || ch.pool === "film" ? "4K HDR" : "HD"}
          </span>
        )}
        {sources.length > 1 && (
          <div className="flex items-center gap-1 rounded bg-ink/85 p-0.5 ring-1 ring-white/20 backdrop-blur">
            {sources.map((s, idx) => (
              <button
                key={s.url + idx}
                onClick={(e) => {
                  e.stopPropagation();
                  onSourceChange?.(idx);
                }}
                className={cx(
                  "rounded px-2 py-0.5 font-mono text-[9.5px] font-bold tracking-wider transition",
                  idx === safeSourceIndex
                    ? "bg-signal text-white shadow-sm"
                    : "text-white/70 hover:bg-white/15 hover:text-white"
                )}
                title={`Switch to ${s.label}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* signal + clock */}
      <div
        className={cx(
          "absolute top-3 right-3 z-10 flex items-center gap-2.5 transition-opacity duration-300",
          cinema && !chrome && "opacity-0",
        )}
      >
        {channelStat && (
          <span
            className={cx(
              "hidden items-center gap-1 rounded bg-ink/80 px-2 py-0.5 font-mono text-[9px] font-semibold tracking-wider backdrop-blur sm:flex",
              channelStat.status === "online" ? "text-emerald-400" : channelStat.status === "offline" ? "text-red-400" : "text-amber-400"
            )}
            title={`Last probed signal: ${channelStat.latencyMs}ms`}
          >
            <span className={cx("inline-block h-1.5 w-1.5 rounded-full", channelStat.status === "online" ? "bg-emerald-400 animate-pulse" : channelStat.status === "offline" ? "bg-red-400" : "bg-amber-400")} />
            {channelStat.status.toUpperCase()} {channelStat.latencyMs}ms
          </span>
        )}
        <span className="hidden items-end gap-[2px] sm:flex" aria-label={`Signal ${sig}%`}>
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={cx("w-[3px] rounded-sm", i <= bars ? "bg-signal-lt" : "bg-white/25")}
              style={{ height: 4 + i * 3 }}
            />
          ))}
        </span>
        <span className="rounded bg-ink/75 px-1.5 py-1 font-mono text-[10px] text-white/80 backdrop-blur tnum">
          {hhmm(now)}
        </span>
      </div>

      {/* zap number — like a CRT overlay */}
      {zap && (
        <div className="absolute top-12 right-4 z-30 font-mono text-[42px] leading-none font-black tracking-tighter text-white drop-shadow-[0_4px_18px_rgba(0,0,0,.8)] animate-zap sm:text-[64px]">
          {zap}
          <span className="animate-blink">_</span>
        </div>
      )}

      {tuning && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <span className="rounded-md bg-ink/70 px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] text-white/90 uppercase backdrop-blur">
            Tuning {ch.num}
          </span>
        </div>
      )}

      {/* centre play */}
      {!compact && (
        <button
          onClick={onTogglePlay}
          className={cx(
            "absolute inset-0 z-[5] flex items-center justify-center",
            cinema && !chrome && "opacity-0",
          )}
          aria-label={playing ? "Pause" : "Play"}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink/55 text-white ring-1 ring-white/25 backdrop-blur transition duration-200 hover:scale-105 hover:bg-signal hover:ring-signal sm:h-20 sm:w-20">
            {playing ? (
              <Pause size={26} fill="currentColor" strokeWidth={0} />
            ) : (
              <Play size={26} fill="currentColor" strokeWidth={0} className="ml-0.5" />
            )}
          </span>
        </button>
      )}

      {/* transport */}
      {!compact && (
        <div
          className={cx(
            "absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 px-3.5 pb-3 transition-opacity duration-300 sm:gap-4 sm:px-4",
            cinema && !chrome && "pointer-events-none opacity-0",
          )}
        >
          <button onClick={onMute} className="text-white/85 hover:text-signal-lt" aria-label={muted ? "Unmute" : "Mute"}>
            {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="truncate text-[13px] font-bold">{ch.now}</span>
              <span className="shrink-0 font-mono text-[10px] tracking-[0.18em] text-white/70">
                LIVE
              </span>
            </div>
            <div className="h-[4px] w-full overflow-hidden rounded bg-white/15">
              <div className="h-full w-1/3 animate-pulse rounded bg-red-500/80" />
            </div>
          </div>
          {onPrev && (
            <button onClick={onPrev} className="hidden text-white/80 hover:text-signal-lt sm:block" aria-label="Previous channel">
              <SkipForward size={16} className="rotate-180" />
            </button>
          )}
          {onNext && (
            <button onClick={onNext} className="hidden text-white/80 hover:text-signal-lt sm:block" aria-label="Next channel">
              <SkipForward size={16} />
            </button>
          )}
          {sources.length > 1 && onSourceChange && (
            <button
              onClick={() => onSourceChange((safeSourceIndex + 1) % sources.length)}
              className="hidden items-center gap-1 rounded bg-white/10 px-2 py-1 font-mono text-[10px] text-white/90 ring-1 ring-white/20 transition hover:bg-signal hover:text-white sm:flex"
              title={`Current server: ${activeSource.label} (Press 'S' to cycle)`}
            >
              <Radio size={12} className="text-signal-lt" />
              <span>{activeSource.label}</span>
            </button>
          )}
          <button className="hidden text-white/80 hover:text-signal-lt sm:block" aria-label="Captions">
            <Captions size={16} />
          </button>
          <button
            onClick={togglePiP}
            className="hidden text-white/85 hover:text-signal-lt sm:block"
            title="Floating window (Picture-in-Picture)"
            aria-label="Picture in picture"
          >
            <PictureInPicture2 size={17} />
          </button>
          {onOpen && (
            <button onClick={onOpen} className="text-white/85 hover:text-signal-lt" aria-label="Fullscreen player">
              <Maximize size={17} />
            </button>
          )}
        </div>
      )}

      {compact && (
        <div className="absolute inset-x-0 bottom-0 z-10 p-2.5">
          <div className="truncate text-[12px] font-bold">{ch.now}</div>
          <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded bg-white/15">
            <div className="h-full w-1/3 animate-pulse rounded bg-red-500/80" />
          </div>
        </div>
      )}

      {cinema && (
        <div
          className={cx(
            "pointer-events-none absolute bottom-16 left-4 z-10 max-w-lg transition-opacity duration-300 sm:bottom-20 sm:left-8",
            !chrome && "opacity-0",
          )}
        >
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] text-white/60 uppercase">
            <Radio size={12} /> {ch.name} · {ch.cat}
          </div>
          <div className="mt-1 text-2xl leading-none font-black tracking-tight sm:text-4xl">{ch.now}</div>
        </div>
      )}
    </div>
  );
}
