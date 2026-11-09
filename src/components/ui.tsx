import { clsx } from "clsx";
import type { ReactNode } from "react";
import { Play, Star } from "lucide-react";
import type { Channel } from "../data";

const cx = clsx;
export { cx };

/* ------------------------------------------------------------------ atoms */

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("eyebrow", className)}>{children}</div>;
}

export function ScreenHead({
  eyebrow,
  title,
  right,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-4 pb-4 pt-4 sm:px-6 lg:px-8">
      <div className="min-w-0">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-2.5 text-[30px] leading-[0.95] font-black tracking-tight sm:text-[40px]">{title}</h1>
        {sub && <p className="mt-2 max-w-2xl text-sm text-mute">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function SectionHead({
  title,
  action,
  onAction,
  className,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div className={cx("flex items-baseline justify-between gap-4", className)}>
      <div className="flex items-baseline gap-3">
        <span className="h-3 w-[3px] translate-y-[1px] bg-signal" aria-hidden />
        <h2 className="text-[15px] font-bold tracking-tight sm:text-base">{title}</h2>
      </div>
      {action && (
        <button
          onClick={onAction}
          className="eyebrow shrink-0 transition-colors hover:text-signal-lt"
        >
          {action} →
        </button>
      )}
    </div>
  );
}

export function ChannelBug({
  ch,
  size = "md",
  className,
}: {
  ch: Channel;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dims =
    size === "lg"
      ? "h-10 min-w-[62px] px-2 text-[12px]"
      : size === "sm"
        ? "h-5 min-w-[34px] px-1 text-[8px]"
        : "h-8 min-w-[46px] px-1.5 text-[10px]";
  return (
    <span
      style={{ background: ch.bg, color: ch.fg }}
      className={cx(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[5px] leading-none font-extrabold tracking-tight",
        ch.abbr.length > 4 && "text-[8px] tracking-tighter",
        dims,
        className,
      )}
    >
      <span className="truncate">{ch.abbr}</span>
    </span>
  );
}

export function Bar({
  pct,
  className,
  tone = "signal",
}: {
  pct: number;
  className?: string;
  tone?: "signal" | "live" | "fg";
}) {
  const fill = tone === "live" ? "bg-live" : tone === "fg" ? "bg-fg" : "bg-signal";
  return (
    <div className={cx("h-[3px] w-full overflow-hidden rounded-full bg-white/12", className)}>
      <div className={cx("h-full rounded-full transition-[width] duration-500", fill)} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
    </div>
  );
}

export function LiveDot({ label = "LIVE" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm bg-live px-1.5 py-[3px] font-mono text-[9px] leading-none font-semibold tracking-[0.14em] text-white">
      <span className="h-1.5 w-1.5 rounded-full bg-white animate-blink" aria-hidden />
      {label}
    </span>
  );
}

export function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={!!active}
      className={cx(
        "shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition duration-200",
        active
          ? "bg-signal text-white"
          : "bg-raised text-mute ring-1 ring-line hover:text-fg hover:ring-dim",
      )}
    >
      {children}
    </button>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cx(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
        on ? "bg-signal" : "bg-raised ring-1 ring-line",
      )}
    >
      <span
        className={cx(
          "absolute top-1/2 h-[18px] w-[18px] -translate-y-1/2 rounded-full bg-white shadow transition-all duration-200",
          on ? "left-[26px]" : "left-[3px]",
        )}
      />
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  className,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cx(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-[13px] font-semibold ring-1 ring-line transition duration-200 hover:ring-dim hover:bg-raised",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-signal px-5 text-[13px] font-bold text-white transition duration-200 hover:bg-signal-lt active:scale-[0.98]",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ----------------------------------------------------------------- poster */

export function PosterTile({
  img,
  title,
  meta,
  rating,
  quality,
  onOpen,
  className,
}: {
  img: string;
  title: string;
  meta?: string;
  rating?: number;
  quality?: string;
  onOpen?: () => void;
  className?: string;
}) {
  return (
    <button onClick={onOpen} className={cx("group block w-full text-left", className)}>
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-panel ring-1 ring-line transition duration-300 group-hover:ring-signal group-focus-visible:ring-signal">
        <img
          src={img}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/15 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal text-white shadow-[0_12px_34px_-8px_#0e6bff]">
            <Play size={19} fill="currentColor" strokeWidth={0} />
          </span>
        </div>
        {quality && (
          <span className="absolute top-2 left-2 rounded-sm bg-ink/85 px-1.5 py-[3px] font-mono text-[9px] tracking-wider text-fg backdrop-blur-sm">
            {quality}
          </span>
        )}
      </div>
      <div className="mt-2.5">
        <div className="truncate text-[13px] leading-tight font-semibold transition-colors group-hover:text-signal-lt">
          {title}
        </div>
        <div className="mt-1 flex items-center gap-2 font-mono text-[10px] text-mute tnum">
          {meta && <span className="truncate">{meta}</span>}
          {rating !== undefined && (
            <span className="ml-auto inline-flex items-center gap-1 text-fg/80">
              <Star size={10} className="fill-ember text-ember" strokeWidth={0} />
              {rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
