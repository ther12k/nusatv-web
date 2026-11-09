import { useCallback, useEffect, useState } from "react";
import Rail, { type ScreenId } from "./components/Rail";
import TopBar from "./components/TopBar";
import Live from "./screens/Live";
import Guide from "./screens/Guide";
import Settings from "./screens/Settings";
import FloatingMiniPlayer from "./components/FloatingMiniPlayer";
import { LiveProvider, useLive } from "./live/LiveContext";

function useNow(ms = 15000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), ms);
    return () => window.clearInterval(id);
  }, [ms]);
  return now;
}

function Shell() {
  const now = useNow(15000);
  const { config, channels, activeId, playing, setPlaying, muted, setMuted, volume, setVolume, proxy, sourceIdxMap, miniDismissed, setMiniDismissed, isScrolledOut } = useLive();
  const [screen, setScreen] = useState<ScreenId>("live");

  const cinema = screen === "live" && config.layout === "cinema";

  const go = useCallback((s: ScreenId) => {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className="min-h-screen bg-ink text-fg">
      <Rail screen={screen} onNav={go} cinema={cinema} />

      <div className={cinema ? "lg:pl-0" : "lg:pl-[76px]"}>
        {!cinema && <TopBar now={now} />}

        <main key={cinema ? "cinema" : screen}>
          {screen === "live" && <Live now={now} />}
          {screen === "guide" && <Guide now={now} />}
          {screen === "settings" && <Settings />}
        </main>
      </div>

      {/* YouTube-like Floating Mini-Player when navigating to Guide, Settings, etc. */}
      {(screen !== "live" || isScrolledOut) && !miniDismissed && (
        <FloatingMiniPlayer
          ch={channels.find((c) => c.id === activeId) ?? channels[0]!}
          playing={playing}
          muted={muted}
          volume={volume}
          onVolumeChange={setVolume}
          proxy={proxy}
          sourceIndex={sourceIdxMap[activeId] ?? 0}
          onTogglePlay={() => setPlaying((p) => !p)}
          onToggleMute={() => setMuted((m) => !m)}
          onExpand={() => {
            if (screen !== "live") go("live");
            window.scrollTo({ top: 0, behavior: "smooth" });
            const stage = document.getElementById("live-stage");
            stage?.scrollIntoView({ behavior: "smooth", block: "center" });
            setMiniDismissed(false);
          }}
          onClose={() => setMiniDismissed(true)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LiveProvider>
      <Shell />
    </LiveProvider>
  );
}
