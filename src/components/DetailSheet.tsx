import { useEffect } from "react";
import { Check, Play, Plus, Star, X } from "lucide-react";
import type { Movie } from "../data";
import { cx, GhostButton, PrimaryButton } from "./ui";

export default function DetailSheet({
  movie,
  onClose,
  onPlay,
}: {
  movie: Movie | null;
  onClose: () => void;
  onPlay: (m: Movie) => void;
}) {
  useEffect(() => {
    if (!movie) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [movie, onClose]);

  if (!movie) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-6 animate-fade"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={movie.title}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-panel ring-1 ring-line animate-sheet sm:rounded-xl thin-bar"
      >
        <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[21/9]">
          <img src={movie.poster} alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/35 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-black"
            aria-label="Close"
          >
            <X size={17} />
          </button>
          <div className="absolute right-4 bottom-4 left-4 sm:right-6 sm:bottom-5 sm:left-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-sm bg-signal px-1.5 py-[3px] font-mono text-[9px] tracking-wider text-white">
                {movie.quality}
              </span>
              <span className="font-mono text-[10px] tracking-[0.14em] text-white/70 uppercase">
                {movie.match}% match
              </span>
            </div>
            <h2 className="mt-2 text-2xl leading-none font-black tracking-tight sm:text-4xl">{movie.title}</h2>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] text-mute tnum">
            <span className="inline-flex items-center gap-1 text-fg">
              <Star size={11} className="fill-ember text-ember" strokeWidth={0} />
              {movie.rating.toFixed(1)}
            </span>
            <span>{movie.year}</span>
            <span>{movie.dur}</span>
            <span>{movie.genres.join(" · ")}</span>
            <span className="rounded border border-line px-1.5 py-0.5 text-[10px]">18+</span>
          </div>

          <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-fg/85">{movie.synopsis}</p>

          <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-2 border-t border-line pt-4 font-mono text-[11px] sm:grid-cols-2">
            <div className="flex justify-between gap-4">
              <dt className="text-dim">DIRECTOR</dt>
              <dd className="text-right text-fg/90">{movie.director}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-dim">AUDIO</dt>
              <dd className="text-right text-fg/90">English 5.1 · Español · Deutsch</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-dim">SUBTITLES</dt>
              <dd className="text-right text-fg/90">English CC, Français, العربية</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-dim">SOURCE</dt>
              <dd className="text-right text-fg/90">HEVC · 2160p · 18.4 Mbps</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryButton onClick={() => onPlay(movie)} className="h-11 px-6">
              <Play size={16} fill="currentColor" strokeWidth={0} /> Play
            </PrimaryButton>
            <GhostButton className="h-11">
              <Plus size={16} /> My List
            </GhostButton>
            <GhostButton className="h-11">
              <Check size={16} /> Watched
            </GhostButton>
            <span className={cx("ml-auto hidden items-center font-mono text-[10px] text-dim sm:flex")}>
              ESC to close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
