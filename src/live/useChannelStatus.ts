import { useEffect, useState } from "react";

export type ChannelStatus = {
  status: "online" | "degraded" | "offline";
  latencyMs: number;
  resolution?: string | null;
  lastChecked: number;
  thumb?: string | null;
};

export type StatusRegistry = {
  lastUpdated: number;
  total: number;
  channels: Record<string, ChannelStatus>;
};

let cachedStatus: StatusRegistry | null = null;
const listeners = new Set<(s: StatusRegistry | null) => void>();

async function fetchStatus() {
  try {
    const res = await fetch("/status.json", { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as StatusRegistry;
    cachedStatus = data;
    listeners.forEach((fn) => fn(data));
  } catch {
    // offline or static preview
  }
}

let intervalStarted = false;
function ensurePolling() {
  if (intervalStarted) return;
  intervalStarted = true;
  void fetchStatus();
  setInterval(() => {
    void fetchStatus();
  }, 30_000);
}

export function useChannelStatus() {
  const [data, setData] = useState<StatusRegistry | null>(cachedStatus);

  useEffect(() => {
    ensurePolling();
    listeners.add(setData);
    if (cachedStatus) setData(cachedStatus);
    return () => {
      listeners.delete(setData);
    };
  }, []);

  return {
    statusMap: data?.channels ?? {},
    lastUpdated: data?.lastUpdated ?? null,
  };
}
