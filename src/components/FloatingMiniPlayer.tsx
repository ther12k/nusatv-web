import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Loader2,
  Maximize2,
  Pause,
  PictureInPicture2,
  Play,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import type { Channel } from "../data";
import { imgFor } from "../data";
import { ChannelBug, cx, LiveDot } from "./ui";
import { playUrl } from "../live/playUrl";
import { useChannelStatus } from "../live/useChannelStatus";

type Props = {
  ch: Channel;
  playing: boolean;
  muted: boolean;
  proxy?: boolean;
  sourceIndex?: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onExpand: () => void;
  onClose: () => void;
};

export default function FloatingMiniPlayer({
  ch,
  playing,
  muted,
  proxy = false,
  sourceIndex = 0,
  onTogglePlay,
  onToggleMute,
  onExpand,
  onClose,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [streamLive, setStreamLive] = useState(false);
  const { statusMap } = useChannelStatus();
  const poster = statusMap[ch.id]?.thumb ?? imgFor(ch);

  const sources =
    ch.sources && ch.sources.length > 0
      ? ch.sources
      : [{ label: "Server 1", url: ch.src, relay: ch.relay }];
  const safeSourceIndex = Math.min(Math.max(0, sourceIndex), sources.length - 1);
  const activeSource = sources[safeSourceIndex] ?? sources[0]!;
  const activeUrl = activeSource.url;

  // Stream playback — no-CORS / plain-http sources route through /stream.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setStreamLive(false);
    const hls = new Hls({ autoStartLoad: true });
    hls.loadSource(playUrl(activeUrl, { proxy, relay: activeSource.relay ?? false }));
    hls.attachMedia(video);
    hls.on(Hls.Events.FRAG_LOADED, () => setStreamLive(true));
    return () => {
      hls.destroy();
    };
  }, [activeUrl, activeSource.relay, proxy]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    if (playing) void video.play().catch(() => {});
    else video.pause();
  }, [playing, muted, activeUrl]);

  const togglePiP = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoRef.current && document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch {
      // ignore
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-20 right-3.5 z-50 w-[min(calc(100vw-1.75rem),18rem)] sm:bottom-6 sm:right-6 sm:w-84 overflow-hidden rounded-xl bg-panel shadow-2xl ring-1 ring-line animate-rise transition-all duration-200"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-line bg-ink/90 px-3 py-1.5 backdrop-blur">
        <div className="flex items-center gap-1.5 min-w-0">
          <LiveDot />
          <ChannelBug ch={ch} size="sm" />
          <span className="truncate font-semibold text-[11px] text-white/90">
            {ch.name}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onExpand}
            className="flex h-6 w-6 items-center justify-center rounded text-mute hover:bg-white/10 hover:text-fg transition"
            title="Expand to Full Player"
            aria-label="Expand player"
          >
            <Maximize2 size={13} />
          </button>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded text-mute hover:bg-white/10 hover:text-fg transition"
            title="Close Mini-player"
            aria-label="Close mini-player"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Video Viewport */}
      <div
        onClick={onExpand}
        className="group/mini relative aspect-video w-full cursor-pointer bg-black overflow-hidden"
      >
        <video
          ref={videoRef}
          autoPlay
          muted={muted}
          playsInline
          onPlaying={() => setStreamLive(true)}
          onLoadedData={() => setStreamLive(true)}
          className="h-full w-full object-cover"
        />

        {/* Latest probed frame + spinner until the stream delivers frames */}
        {!streamLive && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/70">
            {poster && (
              <img src={poster} alt="" className="absolute h-full w-full object-cover opacity-60" />
            )}
            <Loader2 size={18} className="relative animate-spin text-signal-lt" />
          </div>
        )}

        {/* Floating Controls Overlay (shown on hover or when paused) */}
        <div
          className={cx(
            "absolute inset-0 z-10 flex flex-col justify-between p-2.5 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-200",
            hovered || !playing ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="rounded bg-black/60 px-1.5 py-0.5 font-mono text-[9px] text-white/80 backdrop-blur">
              {activeSource.label}
            </span>
            <button
              onClick={togglePiP}
              className="flex h-6 w-6 items-center justify-center rounded bg-black/60 text-white/80 hover:bg-signal hover:text-white backdrop-blur transition"
              title="Pop out to floating desktop window (PiP)"
            >
              <PictureInPicture2 size={12} />
            </button>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between gap-2 pt-2"
          >
            <button
              onClick={onTogglePlay}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-signal text-white shadow transition hover:scale-105"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" className="ml-0.5" />}
            </button>

            <button
              onClick={onToggleMute}
              className="flex h-6 w-6 items-center justify-center rounded bg-black/60 text-white/80 hover:text-white backdrop-blur transition"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
