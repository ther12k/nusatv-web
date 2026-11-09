import type { ReactNode } from "react";
import { Check, Columns3, Grid2x2, PanelLeft, PanelRight, Rows3, StretchHorizontal, Tv2, X } from "lucide-react";
import { CHROME_DELAYS, LAYOUTS, type Density, type LayoutId, type ListSide, type LiveConfig, type MosaicCount } from "../../live/model";
import { Chip, cx, Eyebrow, Toggle } from "../../components/ui";

type Props = {
  config: LiveConfig;
  onPatch: (p: Partial<LiveConfig>) => void;
  onPreset: (id: LayoutId) => void;
  onReset: () => void;
  onClose?: () => void;
  embedded?: boolean;
};

export default function LayoutPanel({ config, onPatch, onPreset, onReset, onClose, embedded }: Props) {
  return (
    <div className={cx("flex min-h-0 flex-col", embedded ? "bg-panel" : "h-full bg-ink")}>
      <header className="flex items-start justify-between gap-3 border-b border-line px-4 py-4 sm:px-5">
        <div>
          <Eyebrow>Layout model</Eyebrow>
          <h2 className="mt-1.5 text-[18px] leading-none font-black tracking-tight">Live TV config</h2>
          <p className="mt-2 max-w-[36ch] text-[12.5px] leading-relaxed text-mute">
            Four compositions. Pick a preset, then tune list side, density and mosaic size.
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-mute ring-1 ring-line transition hover:text-fg"
            aria-label="Close layout config"
          >
            <X size={15} />
          </button>
        )}
      </header>

      <div className={cx("space-y-6 px-4 py-5 sm:px-5", !embedded && "thin-bar min-h-0 flex-1 overflow-y-auto")}>
        <section>
          <Eyebrow>Presets</Eyebrow>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {LAYOUTS.map((p) => {
              const active = p.id === config.layout;
              return (
                <button
                  key={p.id}
                  onClick={() => onPreset(p.id)}
                  className={cx(
                    "rounded-lg p-2.5 text-left ring-1 transition duration-200",
                    active ? "bg-signal/12 ring-signal" : "bg-panel ring-line hover:ring-dim",
                  )}
                >
                  <Glyph id={p.id} active={active} side={config.listSide} />
                  <div className="mt-2 flex items-baseline justify-between gap-2">
                    <span className="text-[13px] font-bold">{p.label}</span>
                    <span className="font-mono text-[9px] tracking-wider text-dim">{p.keys}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-mute">{p.blurb}</p>
                </button>
              );
            })}
          </div>
        </section>

        {config.layout === "studio" && (
          <section>
            <Eyebrow>List position</Eyebrow>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <SideBtn
                active={config.listSide === "left"}
                onClick={() => onPatch({ listSide: "left" })}
                icon={<PanelLeft size={15} />}
                label="List left"
              />
              <SideBtn
                active={config.listSide === "right"}
                onClick={() => onPatch({ listSide: "right" })}
                icon={<PanelRight size={15} />}
                label="List right"
              />
            </div>
          </section>
        )}

        <section>
          <Eyebrow>Density</Eyebrow>
          <div className="mt-3 flex gap-2">
            {(["comfortable", "compact"] as Density[]).map((d) => (
              <Chip key={d} active={config.density === d} onClick={() => onPatch({ density: d })}>
                {d === "comfortable" ? "Comfortable" : "Compact"}
              </Chip>
            ))}
          </div>
        </section>

        {config.layout === "mosaic" && (
          <section>
            <Eyebrow>Mosaic tiles</Eyebrow>
            <div className="mt-3 flex gap-2">
              {([4, 6, 9] as MosaicCount[]).map((n) => (
                <Chip key={n} active={config.mosaicCount === n} onClick={() => onPatch({ mosaicCount: n })}>
                  {n === 4 ? "2 × 2" : n === 6 ? "3 × 2" : "3 × 3"}
                </Chip>
              ))}
            </div>
          </section>
        )}

        <section className="divide-y divide-line overflow-hidden rounded-lg bg-panel ring-1 ring-line">
          <ToggleRow
            label="Now & next strip"
            hint="Programme progress under the player"
            on={config.showNowNext}
            onChange={(v) => onPatch({ showNowNext: v })}
          />
          <ToggleRow
            label="Day-grid EPG"
            hint="Used in Broadcast layout"
            on={config.showEpgStrip}
            onChange={(v) => onPatch({ showEpgStrip: v })}
          />
          <ToggleRow
            label="Channel numbers"
            hint="LCN beside each bug — type to zap"
            on={config.showChannelNumbers}
            onChange={(v) => onPatch({ showChannelNumbers: v })}
          />
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
            <div className="min-w-0">
              <div className="text-[13px] font-semibold">Auto-hide player controls</div>
              <div className="mt-0.5 text-[11.5px] text-mute">
                Video chrome fades when the pointer leaves or idles — move over the video to bring it back
              </div>
            </div>
            <div className="flex shrink-0 gap-1.5">
              {CHROME_DELAYS.map((d) => (
                <Chip
                  key={d.ms}
                  active={config.chromeHideDelayMs === d.ms}
                  onClick={() => onPatch({ chromeHideDelayMs: d.ms })}
                >
                  {d.label}
                </Chip>
              ))}
            </div>
          </div>
        </section>

        <p className="font-mono text-[10px] leading-relaxed tracking-[0.08em] text-dim uppercase">
          Digits zap a channel · ↑↓ change channel · L toggles the list in cinema · F favourites the current channel
        </p>
      </div>

      <footer className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 sm:px-5">
        <button onClick={onReset} className="font-mono text-[10px] tracking-[0.14em] text-dim uppercase hover:text-fg">
          Reset layout
        </button>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-signal-lt uppercase">
          <Check size={12} /> Synced to this device
        </span>
      </footer>
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  on,
  onChange,
}: {
  label: string;
  hint: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-3.5 py-3">
      <div className="min-w-0">
        <div className="text-[13px] font-semibold">{label}</div>
        <div className="mt-0.5 text-[11px] text-mute">{hint}</div>
      </div>
      <Toggle on={on} onChange={onChange} label={label} />
    </div>
  );
}

function SideBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "flex h-10 items-center justify-center gap-2 rounded-md text-[12.5px] font-semibold ring-1 transition",
        active ? "bg-signal text-white ring-signal" : "bg-panel text-mute ring-line hover:text-fg",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function Glyph({ id, active, side }: { id: LayoutId; active: boolean; side: ListSide }) {
  const box = "h-[72px] rounded-md bg-ink p-1.5";
  const player = cx("rounded-[3px]", active ? "bg-signal/80" : "bg-signal/45");
  const list = "rounded-[3px] bg-raised";
  if (id === "studio") {
    return (
      <div className={cx(box, "grid gap-1", side === "left" ? "grid-cols-[1fr_2.1fr]" : "grid-cols-[2.1fr_1fr]")}>
        {side === "left" ? (
          <>
            <div className={list} />
            <div className={player} />
          </>
        ) : (
          <>
            <div className={player} />
            <div className={list} />
          </>
        )}
      </div>
    );
  }
  if (id === "broadcast") {
    return (
      <div className={cx(box, "flex flex-col gap-1")}>
        <div className={cx(player, "h-[42%]")} />
        <div className="grid min-h-0 flex-1 grid-cols-5 gap-0.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={cx("rounded-[2px]", i < 5 ? "bg-line" : "bg-raised")} />
          ))}
        </div>
      </div>
    );
  }
  if (id === "mosaic") {
    return (
      <div className={cx(box, "grid grid-cols-3 grid-rows-2 gap-1")}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={cx("rounded-[2px]", i === 0 ? player : list)} />
        ))}
      </div>
    );
  }
  return (
    <div className={cx(box)}>
      <div className={cx(player, "h-full")} />
    </div>
  );
}

export function LayoutIcon({ id, size = 15 }: { id: LayoutId; size?: number }) {
  if (id === "studio") return <Columns3 size={size} />;
  if (id === "broadcast") return <Rows3 size={size} />;
  if (id === "mosaic") return <Grid2x2 size={size} />;
  if (id === "cinema") return <StretchHorizontal size={size} />;
  return <Tv2 size={size} />;
}
