import {
  Activity,
  ChevronDown,
  ChevronsDownUp,
  ChevronsUpDown,
  Eye,
  Film,
  Globe,
  Landmark,
  Layers,
  MapPin,
  Moon,
  Music2,
  Search,
  Sparkles,
  Star,
  Trophy,
  Tv,
  X,
} from "lucide-react";
import type { Channel } from "../../data";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChannelBug, Chip, cx, Eyebrow, LiveDot } from "../../components/ui";
import { useChannelStatus } from "../../live/useChannelStatus";

type Props = {
  list: Channel[];
  activeId: string;
  cat: string;
  /** Bundled categories + any groups the user's playlist carries. */
  cats: readonly string[];
  query: string;
  favs: string[];
  density: "comfortable" | "compact";
  showNumbers: boolean;
  countLabel: string;
  /** Hide channels the server probe marked offline. */
  hideOffline: boolean;
  onToggleHideOffline: () => void;
  onCat: (c: string) => void;
  onQuery: (q: string) => void;
  onSelect: (id: string) => void;
  onToggleFav: (id: string) => void;
};

// Visual badge & icon helper for category accordion headers
function getCategoryIcon(category: string) {
  const norm = category.toLowerCase();
  if (norm.includes("fav")) return <Star size={13} className="text-ember fill-ember" />;
  if (norm.includes("indo")) return <Landmark size={13} className="text-red-400" />;
  if (norm.includes("daerah")) return <MapPin size={13} className="text-amber-400" />;
  if (norm.includes("tvri")) return <Tv size={13} className="text-blue-400" />;
  if (norm.includes("inter")) return <Globe size={13} className="text-sky-400" />;
  if (norm.includes("film") || norm.includes("movie")) return <Film size={13} className="text-purple-400" />;
  if (norm.includes("religi")) return <Moon size={13} className="text-emerald-400" />;
  if (norm.includes("musik")) return <Music2 size={13} className="text-pink-400" />;
  if (norm.includes("olahraga") || norm.includes("sport")) return <Trophy size={13} className="text-orange-400" />;
  if (norm.includes("life") || norm.includes("food")) return <Sparkles size={13} className="text-yellow-400" />;
  return <Layers size={13} className="text-dim" />;
}

export default function ChannelList({
  list,
  activeId,
  cat,
  cats,
  query,
  favs,
  density,
  showNumbers,
  countLabel,
  hideOffline,
  onToggleHideOffline,
  onCat,
  onQuery,
  onSelect,
  onToggleFav,
}: Props) {
  const compact = density === "compact";
  const { statusMap } = useChannelStatus();
  const activeRef = useRef<HTMLDivElement | null>(null);

  // Grouping channels into category accordion groups
  const groups = useMemo(() => {
    // 1. Separate favourites if present and "All" or "Favourites" is active
    const favSet = new Set(favs);
    const result: { id: string; title: string; channels: Channel[]; isFav?: boolean }[] = [];

    if (favs.length > 0 && (cat === "All" || cat === "Favourites")) {
      const favChannels = list.filter((c) => favSet.has(c.id));
      if (favChannels.length > 0) {
        result.push({
          id: "Favourites",
          title: "Favourites",
          channels: favChannels,
          isFav: true,
        });
      }
    }

    if (cat === "Favourites") {
      return result;
    }

    // 2. Group the rest by channel.cat
    const map = new Map<string, Channel[]>();
    for (const c of list) {
      const g = c.cat || "Other";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(c);
    }

    // Preserve the desired category ordering from cats
    for (const category of cats) {
      if (category === "All" || category === "Favourites") continue;
      const chs = map.get(category);
      if (chs && chs.length > 0) {
        result.push({ id: category, title: category, channels: chs });
        map.delete(category);
      }
    }

    // Remaining user-defined or unlisted groups
    for (const [category, chs] of map.entries()) {
      if (chs.length > 0) {
        result.push({ id: category, title: category, channels: chs });
      }
    }

    return result;
  }, [list, cats, cat, favs]);

  // Which category accordions are expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    // By default expand all when browsing
    return init;
  });

  // Track the category of the active channel to auto-expand it
  const activeCat = useMemo(() => {
    const ch = list.find((c) => c.id === activeId);
    return ch?.cat;
  }, [list, activeId]);

  // Auto-expand category containing the active channel
  useEffect(() => {
    if (activeCat) {
      setExpanded((prev) => {
        if (prev[activeCat] === false) {
          // If specifically collapsed by user, we can keep it or reopen when active channel changes
          return { ...prev, [activeCat]: true };
        }
        return prev;
      });
    }
  }, [activeCat, activeId]);

  // When searching, auto-expand all groups with matches
  const hasQuery = query.trim().length > 0;
  useEffect(() => {
    if (hasQuery) {
      const allOpen: Record<string, boolean> = {};
      for (const g of groups) allOpen[g.id] = true;
      setExpanded(allOpen);
    }
  }, [hasQuery, groups]);

  // Helper: toggle a single accordion
  const toggleGroup = (id: string) => {
    setExpanded((prev) => {
      const isOpen = prev[id] !== false; // default open
      return { ...prev, [id]: !isOpen };
    });
  };

  // Helper: expand all / collapse all
  const allExpanded = groups.every((g) => expanded[g.id] !== false);
  const toggleAll = () => {
    const nextState = !allExpanded;
    const next: Record<string, boolean> = {};
    for (const g of groups) next[g.id] = nextState;
    setExpanded(next);
  };

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeId]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Search & Header */}
      <div className="border-b border-line px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Eyebrow>Live television</Eyebrow>
            <span className="flex items-center gap-1 font-mono text-[10px] text-dim tnum">
              <Activity size={10} className="text-emerald-400 animate-pulse" /> {countLabel}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleHideOffline}
              title={hideOffline ? "Showing online channels only — tap to show all" : "Hide channels the server probe marked offline"}
              aria-label="Toggle online-only filter"
              aria-pressed={hideOffline}
              className={cx(
                "flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[9.5px] ring-1 transition",
                hideOffline
                  ? "bg-signal/20 text-signal-lt ring-signal/50"
                  : "bg-raised text-mute ring-line hover:bg-panel hover:text-fg",
              )}
            >
              <Eye size={11} className={hideOffline ? "text-signal-lt" : undefined} />
              <span className="hidden xs:inline">Online</span>
            </button>
            <button
              onClick={toggleAll}
              title={allExpanded ? "Collapse all categories" : "Expand all categories"}
              aria-label={allExpanded ? "Collapse all categories" : "Expand all categories"}
              className="flex items-center gap-1 rounded bg-raised px-2 py-0.5 font-mono text-[9.5px] text-mute ring-1 ring-line transition hover:bg-panel hover:text-fg"
            >
              {allExpanded ? (
                <>
                  <ChevronsDownUp size={11} className="text-signal-lt" />
                  <span className="hidden xs:inline">Collapse</span>
                </>
              ) : (
                <>
                  <ChevronsUpDown size={11} className="text-signal-lt" />
                  <span className="hidden xs:inline">Expand</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search input with quick clear */}
        <div className="relative mt-2.5">
          <Search size={13} className="absolute top-1/2 left-2.5 -translate-y-1/2 text-dim" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search channels, numbers, genres…"
            aria-label="Filter channels"
            className="h-8 w-full rounded-md bg-raised pl-8 pr-7 text-[12px] outline-none ring-1 ring-line transition placeholder:text-dim focus:ring-signal"
          />
          {hasQuery && (
            <button
              onClick={() => onQuery("")}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-dim hover:text-fg"
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Quick jump category pills */}
        <div className="no-bar -mx-1 mt-2.5 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
          {cats.map((c) => (
            <Chip
              key={c}
              active={c === cat}
              onClick={() => {
                onCat(c);
                if (c !== "All" && c !== "Favourites") {
                  // Ensure this category is expanded
                  setExpanded((prev) => ({ ...prev, [c]: true }));
                }
              }}
            >
              {c}
            </Chip>
          ))}
        </div>
      </div>

      {/* Accordion Channel Groups */}
      <div className="thin-bar min-h-0 flex-1 divide-y divide-line overflow-y-auto">
        {groups.map((group) => {
          const isOpen = expanded[group.id] !== false;
          const hasActive = group.channels.some((c) => c.id === activeId);

          return (
            <div key={group.id} className="border-b border-line/60 last:border-b-0">
              {/* Accordion Section Header */}
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                aria-expanded={isOpen}
                className={cx(
                  "sticky top-0 z-10 flex w-full items-center justify-between gap-2 px-3 py-2 text-left backdrop-blur-md transition-colors sm:px-4",
                  hasActive
                    ? "bg-ink/95 border-l-2 border-signal"
                    : "bg-ink/90 hover:bg-raised/80",
                )}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="shrink-0">{getCategoryIcon(group.id)}</span>
                  <span className="truncate text-[11.5px] font-bold tracking-tight uppercase text-fg/90">
                    {group.title}
                  </span>
                  <span className="shrink-0 rounded-full bg-raised px-1.5 py-0.2 font-mono text-[9px] text-mute ring-1 ring-line">
                    {group.channels.length}
                  </span>
                  {hasActive && (
                    <span className="flex items-center gap-1 rounded bg-signal/20 px-1.5 py-0.5 font-mono text-[8.5px] font-semibold tracking-wider text-signal-lt">
                      <span className="h-1.5 w-1.5 rounded-full bg-signal-lt animate-pulse" />
                      ON AIR
                    </span>
                  )}
                </div>

                <ChevronDown
                  size={14}
                  className={cx(
                    "shrink-0 text-dim transition-transform duration-200",
                    isOpen ? "rotate-180 text-fg" : "rotate-0",
                  )}
                />
              </button>

              {/* Accordion Section Body */}
              {isOpen && (
                <div className="divide-y divide-line/40 bg-ink/30">
                  {group.channels.map((c) => {
                    const active = c.id === activeId;
                    const faved = favs.includes(c.id);

                    return (
                      <div
                        key={c.id}
                        ref={active ? activeRef : undefined}
                        className={cx(
                          "group relative flex w-full items-center gap-2.5 text-left transition-colors duration-150",
                          compact ? "px-3 py-1.5 sm:px-4" : "px-3 py-2 sm:px-4",
                          active ? "bg-signal/14" : "hover:bg-raised",
                        )}
                      >
                        {active && <span className="absolute inset-y-0 left-0 w-[3px] bg-signal" />}
                        <button
                          onClick={() => onSelect(c.id)}
                          aria-current={active ? "true" : undefined}
                          className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                        >
                          {showNumbers && (
                            <span
                              className={cx(
                                "w-6 shrink-0 font-mono text-[10px] tnum",
                                active ? "text-signal-lt font-bold" : "text-dim",
                              )}
                            >
                              {c.num}
                            </span>
                          )}

                          {/* Live Channel Thumbnail / Signal Indicator */}
                          {(() => {
                            const stat = statusMap[c.id];
                            const hasThumb = !!stat?.thumb;
                            const isOnline = stat?.status === "online";
                            const isDegraded = stat?.status === "degraded";
                            const isOffline = stat?.status === "offline";

                            return (
                              <div
                                className="relative shrink-0 overflow-hidden rounded bg-ink/80 ring-1 ring-white/10"
                                style={{ width: compact ? 42 : 54, aspectRatio: "16/9" }}
                              >
                                {hasThumb ? (
                                  <img
                                    src={stat.thumb!}
                                    alt=""
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-raised">
                                    <ChannelBug ch={c} size="sm" className="opacity-75" />
                                  </div>
                                )}
                                <span
                                  className={cx(
                                    "absolute top-0.5 right-0.5 h-2 w-2 rounded-full border border-black/60 shadow-sm",
                                    isOnline
                                      ? "bg-emerald-500 shadow-emerald-500/50"
                                      : isDegraded
                                        ? "bg-amber-500"
                                        : isOffline
                                          ? "bg-red-500"
                                          : "bg-white/40",
                                  )}
                                  title={
                                    stat
                                      ? `${stat.status.toUpperCase()} (${stat.latencyMs}ms)`
                                      : "Checking signal..."
                                  }
                                />
                              </div>
                            );
                          })()}

                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-1.5">
                              <span
                                className={cx(
                                  "truncate font-semibold",
                                  compact ? "text-[12px]" : "text-[13px]",
                                  active ? "text-white" : "text-fg/90",
                                )}
                              >
                                {c.name}
                              </span>
                              {c.hd && (
                                <span className="shrink-0 rounded-sm bg-raised px-1 py-px font-mono text-[8px] text-mute ring-1 ring-line">
                                  HD
                                </span>
                              )}
                            </span>
                            {!compact && (
                              <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px]">
                                {(() => {
                                  const stat = statusMap[c.id];
                                  if (!stat) return <span className="truncate text-mute">{c.now}</span>;
                                  const online = stat.status === "online";
                                  const offline = stat.status === "offline";
                                  return (
                                    <span
                                      className={cx(
                                        "flex items-center gap-1 truncate font-medium",
                                        online
                                          ? "text-emerald-400"
                                          : offline
                                            ? "text-red-400"
                                            : "text-amber-400",
                                      )}
                                    >
                                      <span
                                        className={cx(
                                          "inline-block h-1.5 w-1.5 rounded-full",
                                          online
                                            ? "bg-emerald-400"
                                            : offline
                                              ? "bg-red-400"
                                              : "bg-amber-400",
                                        )}
                                      />
                                      {online ? `${stat.latencyMs}ms` : stat.status.toUpperCase()}
                                      {stat.resolution && (
                                        <span className="text-dim">· {stat.resolution.split("x")[1]}p</span>
                                      )}
                                    </span>
                                  );
                                })()}
                              </div>
                            )}
                          </span>
                          {active && !compact && <LiveDot />}
                        </button>

                        <button
                          onClick={() => onToggleFav(c.id)}
                          aria-label={faved ? `Unfavourite ${c.name}` : `Favourite ${c.name}`}
                          aria-pressed={faved}
                          className={cx(
                            "shrink-0 rounded p-1 transition",
                            faved
                              ? "text-ember"
                              : "text-dim opacity-0 hover:text-fg group-hover:opacity-100 focus-visible:opacity-100",
                          )}
                        >
                          <Star size={13} fill={faved ? "currentColor" : "none"} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {groups.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-semibold">No channels match "{query || cat}"</p>
            <button
              onClick={() => {
                onCat("All");
                onQuery("");
              }}
              className="mt-2 font-mono text-[11px] text-signal-lt"
            >
              Reset filters →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

