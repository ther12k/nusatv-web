import { useRef, useState, type ReactNode } from "react";
import { Check, ClipboardPaste, Globe, ListPlus, RotateCcw, Save, Server, Trash2, Type, Upload } from "lucide-react";
import { EPG_CACHE, LANGS } from "../data";
import { Chip, GhostButton, PrimaryButton, ScreenHead, Toggle, cx } from "../components/ui";
import { useLive } from "../live/LiveContext";
import LayoutPanel from "./live/LayoutPanel";

type Row = { label: string; hint?: string; control: ReactNode };
type Panel = { title: string; note?: string; rows: Row[] };

function Panel({ p }: { p: Panel }) {
  return (
    <section className="overflow-hidden rounded-lg bg-panel ring-1 ring-line">
      <header className="flex items-baseline justify-between border-b border-line px-4 py-3.5 sm:px-5">
        <h2 className="text-[14px] font-bold tracking-tight">{p.title}</h2>
        {p.note && <span className="font-mono text-[10px] tracking-[0.14em] text-dim uppercase">{p.note}</span>}
      </header>
      <div className="divide-y divide-line">
        {p.rows.map((r) => (
          <div key={r.label} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
            <div className="min-w-0">
              <div className="text-[13.5px] font-semibold">{r.label}</div>
              {r.hint && <div className="mt-0.5 text-[12px] text-mute">{r.hint}</div>}
            </div>
            <div className="shrink-0">{r.control}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Settings() {
  const live = useLive();
  const [autoStart, setAutoStart] = useState(true);
  const [lastChannel, setLastChannel] = useState(true);
  const [skipIntro, setSkipIntro] = useState(true);
  const [autoplay, setAutoplay] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [lang, setLang] = useState(LANGS[0]);
  const [font, setFont] = useState(16);
  const [cache, setCache] = useState("1 Hour");
  const [quality, setQuality] = useState("Auto");
  const [notif, setNotif] = useState(true);
  const [lock, setLock] = useState(false);
  const [saved, setSaved] = useState(false);
  const { playlistUrl, loadPlaylist, importText, loadXtream, removePlaylist, proxy, setProxy } = useLive();
  const [plUrl, setPlUrl] = useState("");
  const [plText, setPlText] = useState("");
  const [xtHost, setXtHost] = useState("");
  const [xtUser, setXtUser] = useState("");
  const [xtPass, setXtPass] = useState("");
  const [plBusy, setPlBusy] = useState(false);
  const [plMsg, setPlMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const say = (r: { ok: boolean; count: number; message?: string }) =>
    setPlMsg(r.ok ? `Loaded ${r.count} channels (CH 100+)` : `Failed: ${r.message}`);
  const onLoad = async () => {
    const u = plUrl.trim();
    if (!u) return;
    setPlBusy(true);
    setPlMsg(null);
    say(await loadPlaylist(u));
    setPlBusy(false);
  };
  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setPlMsg(null);
    say(importText(await f.text(), f.name));
  };
  const onPaste = () => {
    if (!plText.trim()) return;
    setPlMsg(null);
    say(importText(plText, "pasted playlist"));
  };
  const onXtream = async () => {
    setPlBusy(true);
    setPlMsg(null);
    say(await loadXtream(xtHost, xtUser, xtPass));
    setPlBusy(false);
  };

  const selectCls =
    "h-9 cursor-pointer rounded-md bg-raised px-3 text-[12.5px] font-semibold outline-none ring-1 ring-line transition hover:ring-dim focus:ring-signal";

  const panels: Panel[] = [
    {
      title: "My playlist",
      note: "import",
      rows: [
        {
          label: "1-Click community presets",
          hint: "Quickly load popular community playlists without typing long URLs.",
          control: (
            <div className="flex flex-wrap gap-2">
              <GhostButton
                onClick={() => {
                  setPlUrl("https://raw.githubusercontent.com/dhasap/dhanytv/main/dhanytv.m3u");
                  setPlBusy(true);
                  setPlMsg(null);
                  loadPlaylist("https://raw.githubusercontent.com/dhasap/dhanytv/main/dhanytv.m3u").then((r) => {
                    setPlBusy(false);
                    say(r);
                  });
                }}
                className="text-[12px]"
              >
                <Globe size={13} className="text-signal-lt" /> DhanyTV (~890 Ch)
              </GhostButton>
              <GhostButton
                onClick={() => {
                  const u = "https://iptv-org.github.io/iptv/countries/id.m3u";
                  setPlUrl(u);
                  setPlBusy(true);
                  setPlMsg(null);
                  loadPlaylist(u).then((r) => {
                    setPlBusy(false);
                    say(r);
                  });
                }}
                className="text-[12px]"
              >
                <Globe size={13} className="text-signal-lt" /> IPTV-org Indonesia
              </GhostButton>
            </div>
          ),
        },
        {
          label: "From URL",
          hint: "Any m3u/m3u8 you legitimately hold — your provider's or a public list. Stored on this device only.",
          control: (
            <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-center">
              <input
                value={plUrl}
                onChange={(e) => setPlUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onLoad()}
                placeholder="https://…/playlist.m3u"
                aria-label="Playlist URL"
                className="h-9 w-full rounded-md bg-raised px-3 text-[12.5px] outline-none ring-1 ring-line transition placeholder:text-dim focus:ring-signal"
              />
              <PrimaryButton onClick={onLoad} className="shrink-0">
                <ListPlus size={14} /> {plBusy ? "Loading…" : "Load"}
              </PrimaryButton>
            </div>
          ),
        },
        {
          label: "From file",
          hint: "Import an .m3u/.m3u8 file from this device (TiviMate, Kodi and VLC all export m3u).",
          control: (
            <div>
              <input
                ref={fileRef}
                type="file"
                accept=".m3u,.m3u8,.txt,text/plain"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
              <GhostButton onClick={() => fileRef.current?.click()}>
                <Upload size={14} /> Choose file
              </GhostButton>
            </div>
          ),
        },
        {
          label: "Paste playlist text",
          hint: "Paste #EXTM3U content directly.",
          control: (
            <div className="w-full max-w-md">
              <textarea
                value={plText}
                onChange={(e) => setPlText(e.target.value)}
                placeholder={"#EXTM3U\n#EXTINF:-1 group-title=\"News\",Channel name\nhttps://…"}
                aria-label="Playlist text"
                rows={3}
                className="w-full rounded-md bg-raised px-3 py-2 font-mono text-[11.5px] outline-none ring-1 ring-line transition placeholder:text-dim focus:ring-signal"
              />
              <div className="mt-2">
                <GhostButton onClick={onPaste}>
                  <ClipboardPaste size={14} /> Import text
                </GhostButton>
              </div>
            </div>
          ),
        },
        {
          label: "Xtream Codes",
          hint: "Host, username and password from your IPTV panel subscription — its live channels load directly.",
          control: (
            <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
              <input value={xtHost} onChange={(e) => setXtHost(e.target.value)} placeholder="http://panel.host:port" aria-label="Xtream host" className="h-9 w-full rounded-md bg-raised px-3 text-[12.5px] outline-none ring-1 ring-line transition placeholder:text-dim focus:ring-signal" />
              <input value={xtUser} onChange={(e) => setXtUser(e.target.value)} placeholder="username" aria-label="Xtream username" className="h-9 w-full rounded-md bg-raised px-3 text-[12.5px] outline-none ring-1 ring-line transition placeholder:text-dim focus:ring-signal" />
              <input value={xtPass} onChange={(e) => setXtPass(e.target.value)} type="password" placeholder="password" aria-label="Xtream password" className="h-9 w-full rounded-md bg-raised px-3 text-[12.5px] outline-none ring-1 ring-line transition placeholder:text-dim focus:ring-signal" />
              <PrimaryButton onClick={onXtream} className="shrink-0">
                <Globe size={14} /> {plBusy ? "…" : "Login"}
              </PrimaryButton>
            </div>
          ),
        },
        {
          label: "Route streams through my server",
          hint: "For stream hosts that block browsers (no CORS): playlists and segments relay through this site. Slower; uses your server's bandwidth.",
          control: <Toggle on={proxy} onChange={setProxy} label="Route through server" />,
        },
        ...(playlistUrl
          ? [{ label: "Loaded playlist", hint: `${playlistUrl}${plMsg ? " · " + plMsg : ""}`, control: <span className="flex items-center gap-2"><Check size={15} className="text-signal-lt" /><GhostButton onClick={() => { removePlaylist(); setPlMsg("Playlist removed"); }}><Trash2 size={14} /> Remove</GhostButton></span> }]
          : plMsg
            ? [{ label: "Status", hint: plMsg, control: <Server size={15} className="text-dim" /> }]
            : []),
      ],
    },
    {
      title: "TV & keyboard",
      note: "no mouse needed",
      rows: [
        {
          label: "Remote control keys",
          hint: "↑ ↓ → ← change channel · S switch stream server/mirror · Enter toggles Cinema (fullscreen) · numbers jump to channel · Backspace goes back · M sound · L channel list · C layout config · Alt+1…4 layouts. On TV browsers the remote's D-pad sends the arrow keys.",
          control: <Check size={15} className="text-signal-lt" />,
        },
      ],
    },
    {
      title: "General settings",
      note: "Device UPD-2941",
      rows: [
        { label: "Auto start app on boot", hint: "Launch into the last watched channel", control: <Toggle on={autoStart} onChange={setAutoStart} label="Auto start" /> },
        { label: "Open last channel on start", hint: "Sky Sports Main Event · CH 106", control: <Toggle on={lastChannel} onChange={setLastChannel} label="Open last channel" /> },
        {
          label: "Language selection",
          hint: "Interface and programme metadata",
          control: (
            <select value={lang} onChange={(e) => setLang(e.target.value)} className={selectCls} aria-label="Language">
              {LANGS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          ),
        },
        {
          label: "Font size",
          hint: `${font}px base — affects the guide and menus`,
          control: (
            <div className="flex items-center gap-2">
              <Type size={15} className="text-dim" />
              <div className="flex overflow-hidden rounded-md ring-1 ring-line">
                {[14, 16, 18, 20].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFont(s)}
                    className={cx(
                      "px-2.5 py-1.5 font-mono text-[11px] tnum transition",
                      s === font ? "bg-signal text-white" : "bg-raised text-mute hover:text-fg",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ),
        },
      ],
    },
    {
      title: "Playback",
      note: "HEVC · 2160p",
      rows: [
        { label: "Skip intro automatically", hint: "Jumps opening credits when detected", control: <Toggle on={skipIntro} onChange={setSkipIntro} label="Skip intro" /> },
        { label: "Autoplay next episode", hint: "10 second countdown, no prompt", control: <Toggle on={autoplay} onChange={setAutoplay} label="Autoplay" /> },
        { label: "Captions by default", hint: "English closed captions where available", control: <Toggle on={captions} onChange={setCaptions} label="Captions" /> },
        {
          label: "Streaming quality",
          hint: "Adaptive above 25 Mbps",
          control: (
            <div className="no-bar flex gap-2 overflow-x-auto">
              {["Auto", "4K", "1080p", "720p"].map((q) => (
                <Chip key={q} active={q === quality} onClick={() => setQuality(q)}>
                  {q}
                </Chip>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      title: "Guide & data",
      note: "EPG",
      rows: [
        {
          label: "Auto-clear EPG cache",
          hint: "Wipes stored programme data on this interval",
          control: (
            <div className="flex overflow-hidden rounded-md ring-1 ring-line">
              {EPG_CACHE.map((c) => (
                <button
                  key={c}
                  onClick={() => setCache(c)}
                  className={cx(
                    "px-3 py-1.5 font-mono text-[11px] transition",
                    c === cache ? "bg-signal text-white" : "bg-raised text-mute hover:text-fg",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          ),
        },
        { label: "Refresh interval", hint: "Pulls the grid from the EPG server", control: <span className="font-mono text-[12px] text-mute tnum">15 minutes</span> },
        { label: "Storage used", hint: "Programme data, artwork and resume points", control: <span className="font-mono text-[12px] text-mute tnum">412 MB / 2 GB</span> },
      ],
    },
    {
      title: "Account & alerts",
      note: "Synced",
      rows: [
        { label: "Push notifications", hint: "Kick-off alerts for followed teams", control: <Toggle on={notif} onChange={setNotif} label="Notifications" /> },
        { label: "Parental lock", hint: "PIN required for 18+ channels and films", control: <Toggle on={lock} onChange={setLock} label="Parental lock" /> },
        { label: "Timezone", hint: "Guide times shown in this zone", control: <span className="font-mono text-[12px] text-mute">Europe/London</span> },
      ],
    },
  ];

  return (
    <div className="animate-rise pb-24 lg:pb-10">
      <ScreenHead
        eyebrow="Device · UPD-2941"
        title="Settings"
        sub="Changes apply immediately and sync to every signed-in device on this account."
        right={
          <div className="flex gap-2.5">
            <GhostButton
              onClick={() => {
                setAutoStart(true);
                setLastChannel(true);
                setSkipIntro(true);
                setAutoplay(false);
                setCaptions(true);
                setFont(16);
                setCache("1 Hour");
                setLang(LANGS[0]);
                live.reset();
              }}
            >
              <RotateCcw size={15} /> Reset
            </GhostButton>
            <PrimaryButton
              onClick={() => {
                setSaved(true);
                window.setTimeout(() => setSaved(false), 2200);
              }}
            >
              {saved ? <Check size={15} /> : <Save size={15} />}
              {saved ? "Saved" : "Save changes"}
            </PrimaryButton>
          </div>
        }
      />

      <div className="px-4 pt-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg ring-1 ring-line">
          <LayoutPanel
            config={live.config}
            onPatch={live.patch}
            onPreset={live.applyPreset}
            onReset={live.reset}
            embedded
          />
        </div>
      </div>

      <div className="grid gap-5 px-4 pt-5 sm:px-6 lg:grid-cols-2 lg:px-8">
        {panels.map((p) => (
          <Panel key={p.title} p={p} />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line px-4 pt-5 font-mono text-[10px] tracking-[0.14em] text-dim uppercase sm:px-6 lg:px-8">
        <span className="flex items-center gap-2">
          <Globe size={13} /> Server eu-west-2 · 18 ms
        </span>
        <span>Build 4.2.1 (2941)</span>
        <span className={cx("transition-colors", saved && "text-signal-lt")}>
          {saved ? "Settings written to device" : "Unsaved changes are kept in memory"}
        </span>
      </div>
    </div>
  );
}
