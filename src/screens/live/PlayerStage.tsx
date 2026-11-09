import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Captions,
  Loader2,
  Maximize,
  Pause,
  PictureInPicture2,
  Play,
  Radio,
  SkipForward,
  TriangleAlert,
  Volume2,
  VolumeX,
} from "lucide-react";
import { hhmm, imgFor, signalFor, type Channel } from "../../data";
import { ChannelBug, cx, LiveDot } from "../../components/ui";
import { useChannelStatus } from "../../live/useChannelStatus";
import { playUrl } from "../../live/playUrl";

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
  /** Idle delay before the video chrome fades (0 = always visible).
   *  Pointer activity inside the video reveals it again. */
  hideDelayMs?: number;
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
  hideDelayMs = 5000,
  sourceIndex = 0,
  onSourceChange,
}: Props) {
  const [tuning, setTuning] = useState(false);
  const [chrome, setChrome] = useState(true);
  /** True once the current source has actually produced video frames —
   *  until then the stage shows the probe's latest frame + a spinner. */
  const [streamLive, setStreamLive] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  // ---- video chrome (badges + controls) auto-hide ------------------
  // YouTube-style: chrome shows while the pointer is active inside the
  // video and fades after `hideDelayMs` idle (or the moment the pointer
  // leaves the video). 0 = always visible. Tuning a channel reveals it
  // briefly so the CH badge confirms what landed.
  const chromeTimer = useRef<number | null>(null);
  const clearChromeTimer = useCallback(() => {
    if (chromeTimer.current !== null) {
      window.clearTimeout(chromeTimer.current);
      chromeTimer.current = null;
    }
  }, []);
  const revealChrome = useCallback(() => {
    setChrome(true);
    if (hideDelayMs <= 0) {
      clearChromeTimer();
      return;
    }
    clearChromeTimer();
    chromeTimer.current = window.setTimeout(() => setChrome(false), hideDelayMs);
  }, [hideDelayMs, clearChromeTimer]);
  const hideChromeNow = useCallback(() => {
    clearChromeTimer();
    if (hideDelayMs > 0) setChrome(false);
  }, [hideDelayMs, clearChromeTimer]);
  useEffect(() => clearChromeTimer, [clearChromeTimer]); // unmount
  useEffect(() => {
    revealChrome();
  }, [ch.id, revealChrome]); // a zap flashes the badge, then it fades

  const sig = signalFor(ch);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { statusMap } = useChannelStatus();
  const channelStat = statusMap[ch.id];
  const livePoster = channelStat?.thumb ?? imgFor(ch);

  // Native Picture-in-Picture helper
  const togglePiP = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoRef.current && document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.warn("PiP error:", err);
    }
  };

  // Register MediaSession + autoPictureInPicture for Chrome/browsers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    try {
      // Modern Chromium automatic Picture-in-Picture attribute
      (video as any).autoPictureInPicture = true;
    } catch {}

    if ("mediaSession" in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: ch.name,
          artist: "NusaTV Live",
          album: ch.cat,
          artwork: [{ src: livePoster, sizes: "320x180", type: "image/jpeg" }],
        });
        navigator.mediaSession.playbackState = playing ? "playing" : "paused";

        // Required by Chrome to allow auto PiP on tab switch:
        (navigator.mediaSession as any).setActionHandler?.("enterpictureinpicture", async () => {
          if (document.pictureInPictureElement !== video && document.pictureInPictureEnabled) {
            await video.requestPictureInPicture();
          }
        });
        navigator.mediaSession.setActionHandler("play", () => onTogglePlay());
        navigator.mediaSession.setActionHandler("pause", () => onTogglePlay());
      } catch {}
    }

    const handleVisibilityChange = async () => {
      try {
        if (document.hidden && playing && videoRef.current && document.pictureInPictureEnabled && !document.pictureInPictureElement) {
          await videoRef.current.requestPictureInPicture();
        }
      } catch {}
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [ch.name, ch.cat, livePoster, playing, onTogglePlay]);


  // Stable identity per channel: a fresh array every render would re-run the
  // HLS effect and restart playback mid-stream.
  const sources = useMemo(
    () =>
      ch.sources && ch.sources.length > 0
        ? ch.sources
        : [{ label: "Server 1", url: ch.src, relay: ch.relay }],
    [ch],
  );
  const safeSourceIndex = Math.min(Math.max(0, sourceIndex), sources.length - 1);
  const activeSource = sources[safeSourceIndex] ?? sources[0]!;
  const activeUrl = activeSource.url;
  const activeRelay = activeSource.relay ?? false;
  const exhaustedRef = useRef(false);

  // REAL playback: hls.js attaches the broadcaster's own HLS endpoint
  // to the video element behind the design's chrome. Muted autoplay
  // (browser policy); the mute button unmutes with a user gesture.
  // playUrl() auto-routes no-CORS / plain-http sources through /stream.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    exhaustedRef.current = false;
    setStreamLive(false);
    setStreamError(null);
    const hls = new Hls({ autoStartLoad: true });
    hls.loadSource(playUrl(activeUrl, { proxy, relay: activeRelay }));
    hls.attachMedia(video);
    hls.on(Hls.Events.FRAG_LOADED, () => {
      exhaustedRef.current = false;
      setStreamLive(true);
      setStreamError(null);
      video.removeAttribute("data-hls-error");
    });
    hls.on(Hls.Events.ERROR, (_e, data) => {
      if (!data.fatal) return;
      // Cycle to the next mirror at most once around; after every source has
      // failed, stop retrying (they will all keep failing) and surface it.
      if (sources.length > 1 && onSourceChange && !exhaustedRef.current) {
        exhaustedRef.current = true;
        console.warn(`HLS error on ${activeSource.label}, auto-switching server...`);
        onSourceChange((safeSourceIndex + 1) % sources.length);
      } else {
        video.setAttribute("data-hls-error", data.details);
        setStreamError(data.details);
      }
    });
    return () => {
      hls.destroy();
    };
  }, [activeUrl, activeRelay, proxy, ch.id, safeSourceIndex, sources.length, onSourceChange, activeSource.label]);

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

  const bars = Math.round((sig / 100) * 4);

  return (
    <div
      id={compact ? undefined : "live-stage"}
      className={cx(
        "group/stage relative overflow-hidden bg-panel ring-1 ring-line",
        fill ? "h-full w-full" : "aspect-video w-full",
        cinema ? "rounded-none ring-0" : "rounded-lg",
      )}
      onPointerMove={revealChrome}
      onPointerDown={revealChrome}
      onMouseEnter={revealChrome}
      onMouseLeave={hideChromeNow}
    >
      <video
        ref={videoRef}
        poster={livePoster}
        autoPlay
        muted={muted}
        playsInline
        onPlaying={() => setStreamLive(true)}
        onLoadedData={() => setStreamLive(true)}
        className={cx("h-full w-full object-cover", playing && !tuning && "animate-drift")}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/10 to-ink/40 opacity-70" />
      <div className="scan pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply" />

      {/* Tuning overlay — the probe worker's LATEST FRAME holds the stage
       *  with a spinner until the stream actually delivers frames (the
       *  video sits beneath; this fades out the moment it goes live). */}
      <div
        data-tuning-overlay={streamLive ? undefined : "true"}
        className={cx(
          "pointer-events-none absolute inset-0 z-20 bg-ink transition-opacity duration-500",
          streamLive && "opacity-0",
        )}
        aria-hidden={streamLive}
      >
        {livePoster && (
          <img
            src={livePoster}
            alt=""
            className="h-full w-full scale-[1.02] object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5">
          {streamError ? (
            <>
              <TriangleAlert size={26} className="text-red-400" />
              <p className="text-[13px] font-bold tracking-tight text-white">Signal problem</p>
              <p className="font-mono text-[10px] tracking-wider text-dim uppercase">
                {streamError}{sources.length > 1 ? " · press S for another server" : ""}
              </p>
            </>
          ) : (
            <>
              <Loader2 size={26} className="animate-spin text-signal-lt" />
              <p className="text-[13px] font-bold tracking-tight text-white/90">
                Tuning CH {ch.num} · {ch.name}
              </p>
              <p className="font-mono text-[10px] tracking-wider text-dim uppercase">
                Last frame from server probe
              </p>
            </>
          )}
        </div>
      </div>

      {tuning && (
        <div className="snow pointer-events-none absolute inset-0 z-30 animate-tune mix-blend-screen opacity-50" />
      )}

      {/* top-left identity */}
      <div
        className={cx(
          "absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 transition-opacity duration-300",
          !chrome && "pointer-events-none opacity-0",
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

      {/* signal + clock + float button */}
      <div
        className={cx(
          "absolute top-3 right-3 z-10 flex items-center gap-2 transition-opacity duration-300",
          !chrome && "pointer-events-none opacity-0",
        )}
      >
        <button
          onClick={togglePiP}
          className="flex items-center gap-1.5 rounded-md bg-ink/80 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-signal hover:ring-signal hover:shadow-lg"
          title="Float video on top of other tabs & apps (Picture-in-Picture)"
          aria-label="Floating video"
        >
          <PictureInPicture2 size={13} className="text-signal-lt" />
          <span className="hidden sm:inline">Float</span>
        </button>
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
            !chrome && "pointer-events-none opacity-0",
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
            !chrome && "pointer-events-none opacity-0",
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
