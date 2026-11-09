import { useState } from "react";
import { Check, CreditCard, LogOut, Monitor, Smartphone, Tv } from "lucide-react";
import { PLANS } from "../data";
import { Bar, Eyebrow, GhostButton, PrimaryButton, ScreenHead, cx } from "../components/ui";

const ACCOUNT = [
  ["Username", "UPD-2941"],
  ["Account status", "Active"],
  ["Created", "August 11, 2023"],
  ["Expiry date", "August 11, 2026"],
  ["Account type", "Elite · 4K"],
  ["Connection", "eu-west-2 · 18 ms"],
];

export default function Account() {
  const [plan, setPlan] = useState("Elite");
  const [loggedOut, setLoggedOut] = useState(false);

  return (
    <div className="animate-rise pb-24 lg:pb-10">
      <ScreenHead
        eyebrow="Subscription · renews 11 Aug 2026"
        title="Account"
        sub="Manage the subscription, connections and devices signed in to IP·TV."
        right={
          <div className="flex gap-2.5">
            <GhostButton onClick={() => setLoggedOut(true)} className="hover:border-live hover:text-live">
              <LogOut size={15} /> Logout
            </GhostButton>
            <PrimaryButton>
              <CreditCard size={15} /> Upgrade
            </PrimaryButton>
          </div>
        }
      />

      <div className="grid gap-5 px-4 pt-6 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:px-8">
        {/* account table */}
        <section className="overflow-hidden rounded-lg bg-panel ring-1 ring-line">
          <header className="flex items-center justify-between border-b border-line px-4 py-3.5 sm:px-5">
            <h2 className="text-[14px] font-bold">Account info</h2>
            <span
              className={cx(
                "rounded-sm px-2 py-1 font-mono text-[10px] tracking-[0.14em] uppercase",
                loggedOut ? "bg-raised text-mute" : "bg-signal/20 text-signal-lt",
              )}
            >
              {loggedOut ? "Session ended" : "Active"}
            </span>
          </header>

          <dl className="divide-y divide-line">
            {ACCOUNT.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5">
                <dt className="font-mono text-[11px] tracking-[0.1em] text-mute uppercase">{k}</dt>
                <dd
                  className={cx(
                    "truncate text-right text-[13.5px] font-semibold",
                    k === "Account status" && !loggedOut && "text-signal-lt",
                    k === "Expiry date" && "tnum",
                  )}
                >
                  {k === "Account status" ? (loggedOut ? "Expired" : v) : v}
                </dd>
              </div>
            ))}
            <div className="px-4 py-3.5 sm:px-5">
              <div className="flex items-baseline justify-between">
                <dt className="font-mono text-[11px] tracking-[0.1em] text-mute uppercase">Active connections</dt>
                <dd className="font-mono text-[13px] font-semibold tnum">
                  2 <span className="text-dim">/ 5</span>
                </dd>
              </div>
              <div className="mt-2.5 flex gap-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={cx("h-1.5 flex-1 rounded-full transition", i <= 2 ? "bg-signal" : "bg-raised")}
                  />
                ))}
              </div>
            </div>
          </dl>

          <div className="grid grid-cols-2 gap-2.5 border-t border-line p-4 sm:p-5">
            <PrimaryButton className="h-11">Upgrade plan</PrimaryButton>
            <GhostButton onClick={() => setLoggedOut(true)} className="h-11">
              <LogOut size={15} /> Logout
            </GhostButton>
          </div>
        </section>

        {/* plans */}
        <section className="space-y-3">
          <Eyebrow>Choose a plan</Eyebrow>
          {PLANS.map((p) => {
            const active = p.name === plan;
            return (
              <button
                key={p.name}
                onClick={() => setPlan(p.name)}
                className={cx(
                  "flex w-full items-center gap-4 rounded-lg px-4 py-4 text-left ring-1 transition duration-200",
                  active ? "bg-signal/12 ring-signal" : "bg-panel ring-line hover:ring-dim",
                )}
              >
                <span
                  className={cx(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition",
                    active ? "border-signal bg-signal text-white" : "border-dim",
                  )}
                >
                  {active && <Check size={12} strokeWidth={3.5} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-bold">{p.name}</span>
                  <span className="mt-0.5 block truncate font-mono text-[10.5px] text-mute">{p.detail}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-mono text-[15px] font-semibold tnum">{p.price}</span>
                  <span className="block font-mono text-[9.5px] tracking-[0.12em] text-dim uppercase">
                    {p.price === "Free" ? "" : "/mo"}
                  </span>
                </span>
              </button>
            );
          })}

          <div className="rounded-lg bg-panel p-4 ring-1 ring-line">
            <Eyebrow>Billing</Eyebrow>
            <p className="mt-2.5 text-[13px] leading-relaxed text-mute">
              Next charge <span className="font-mono text-fg tnum">£14.99</span> on{" "}
              <span className="font-mono text-fg tnum">11 Aug 2026</span> · Visa ending 4417.
            </p>
            <div className="mt-3.5">
              <Bar pct={64} />
              <p className="mt-2 font-mono text-[10px] tracking-[0.12em] text-dim uppercase">
                234 days of 365 remaining
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* devices */}
      <section className="mt-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-line pb-3">
          <h2 className="text-[14px] font-bold">Signed-in devices</h2>
          <span className="font-mono text-[10px] text-dim tnum">2 / 5 SLOTS</span>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Tv, name: "Living room · Samsung Tizen", meta: "Playing · Arsenal v Everton", now: true },
            { icon: Monitor, name: "MacBook Pro · Chrome", meta: "Last seen 2 minutes ago", now: false },
            { icon: Smartphone, name: "Pixel 8 · IP·TV Android", meta: "Last seen yesterday", now: false },
          ].map((d) => (
            <li
              key={d.name}
              className={cx(
                "flex items-center gap-3.5 rounded-lg bg-panel px-4 py-3.5 ring-1 transition",
                d.now ? "ring-signal" : "ring-line",
              )}
            >
              <span className={cx("flex h-9 w-9 items-center justify-center rounded-md", d.now ? "bg-signal text-white" : "bg-raised text-mute")}>
                <d.icon size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold">{d.name}</span>
                <span className="block truncate font-mono text-[10px] text-mute">{d.meta}</span>
              </span>
              {d.now && <span className="h-2 w-2 shrink-0 rounded-full bg-live animate-blink" />}
            </li>
          ))}
        </ul>
      </section>

      {loggedOut && (
        <div className="fixed inset-x-0 bottom-20 z-40 mx-auto w-[min(92vw,420px)] animate-sheet lg:bottom-6">
          <div className="flex items-center gap-3 rounded-lg bg-panel px-4 py-3.5 ring-1 ring-signal">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-signal text-white">
              <LogOut size={15} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold">Signed out on this device</span>
              <span className="block font-mono text-[10px] text-mute">Session token cleared · UPD-2941</span>
            </span>
            <button onClick={() => setLoggedOut(false)} className="font-mono text-[11px] text-signal-lt">
              Undo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
