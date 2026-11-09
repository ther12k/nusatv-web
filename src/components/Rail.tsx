import { CalendarClock, Settings2, Tv } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cx } from "./ui";

export type ScreenId =
  | "home"
  | "live"
  | "guide"
  | "movies"
  | "series"
  | "history"
  | "settings"
  | "account";

// NusaTV ships the REAL product: live streams, the guide grid, and
// the layout settings. The design's VOD screens (home/movies/series/
// history/account) are placeholder content — not in the nav.
const NAV: { id: ScreenId | "search"; label: string; icon: LucideIcon }[] = [
  { id: "live", label: "Live TV", icon: Tv },
  { id: "guide", label: "Guide", icon: CalendarClock },
  { id: "settings", label: "Settings", icon: Settings2 },
];

export default function Rail({
  screen,
  onNav,
  onSearch,
  cinema = false,
}: {
  screen: ScreenId;
  onNav: (s: ScreenId) => void;
  onSearch?: () => void;
  cinema?: boolean;
}) {
  const go = (id: ScreenId | "search") => (id === "search" ? onSearch?.() : onNav(id));

  return (
    <>
      {/* desktop: fixed 76px icon rail */}
      <nav
        aria-label="Primary"
        className={cx(
          "fixed inset-y-0 left-0 z-40 hidden w-[76px] flex-col items-center border-r border-line bg-ink py-4 lg:flex",
          cinema && "lg:hidden",
        )}
      >
        <button
          onClick={() => onNav("live")}
          aria-label="NusaTV home"
          className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-signal text-[13px] font-black tracking-tighter text-white shadow-[0_8px_24px_-10px_#0e6bff] transition hover:bg-signal-lt"
        >
          NU
        </button>

        <div className="flex w-full flex-1 flex-col gap-0.5">
          {NAV.map((item) => {
            const active = item.id === screen;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "group relative flex h-[58px] w-full flex-col items-center justify-center gap-1.5 transition-colors duration-200",
                  active ? "text-white" : "text-dim hover:text-fg",
                )}
              >
                {active && (
                  <span className="absolute top-1/2 left-0 h-9 w-[3px] -translate-y-1/2 rounded-r-full bg-signal" />
                )}
                <span
                  className={cx(
                    "relative flex h-9 w-9 items-center justify-center rounded-lg transition duration-200",
                    active
                      ? "bg-signal text-white shadow-[0_10px_26px_-12px_#0e6bff]"
                      : "group-hover:bg-raised",
                  )}
                >
                  <Icon size={18} strokeWidth={active ? 2.4 : 2} />
                  {item.id === "live" && !active && (
                    <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-live" />
                  )}
                </span>
                <span className="text-[9px] leading-none font-medium tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex flex-col items-center gap-2 border-t border-line pt-4">
          <span className="font-mono text-[9px] tracking-[0.16em] text-dim">v4.2</span>
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-blink" title="Connected" />
        </div>
      </nav>

      {/* mobile / tablet: bottom bar */}
      <nav
        aria-label="Primary"
        className={cx(
          "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 backdrop-blur-md lg:hidden",
          cinema && "hidden",
        )}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="no-bar flex overflow-x-auto">
          {NAV.map((item) => {
            const active = item.id === screen;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "relative flex h-16 min-w-[68px] flex-1 shrink-0 flex-col items-center justify-center gap-1.5 px-1 transition-colors",
                  active ? "text-white" : "text-dim",
                )}
              >
                {active && <span className="absolute top-0 h-[3px] w-8 rounded-b-full bg-signal" />}
                <span
                  className={cx(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition",
                    active && "bg-signal",
                  )}
                >
                  <Icon size={17} strokeWidth={active ? 2.4 : 2} />
                </span>
                <span className="text-[9px] leading-none font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
