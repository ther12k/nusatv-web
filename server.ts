import path from "node:path";
/**
 * NusaTV web — static file server (the app is a fully client-side
 * single-page build in ./dist; streams come from the broadcasters'
 * CDNs, this host only serves files).
 */
const PORT = Number(process.env.PORT ?? 8133);
const DIST = new URL("./dist/", import.meta.url).pathname;

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

const BLOCKED_HOST = /^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1)/i;

/** Text relay for playlist files the browser cannot fetch directly
 *  (no CORS on the playlist host). Bound: http/https, 10 s, 2 MB,
 *  text responses only — never proxies stream segments. */
async function relayPlaylist(target: string): Promise<Response> {
  let u: URL;
  try {
    u = new URL(target);
  } catch {
    return new Response("bad url", { status: 400 });
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    return new Response("http/https only", { status: 400 });
  }
  if (BLOCKED_HOST.test(u.hostname)) {
    return new Response("private hosts blocked", { status: 403 });
  }
  try {
    const res = await fetch(u.toString(), {
      signal: AbortSignal.timeout(10_000),
      headers: { "user-agent": "NusaTV-playlist-loader/1" },
      redirect: "follow",
    });
    if (!res.ok) return new Response(`upstream HTTP ${res.status}`, { status: 502 });
    const len = Number(res.headers.get("content-length") ?? 0);
    if (len > 2_000_000) return new Response("over 2 MB", { status: 413 });
    const text = await res.text();
    if (text.length > 2_000_000) return new Response("over 2 MB", { status: 413 });
    return new Response(text, {
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
    });
  } catch (err) {
    return new Response(`relay failed: ${String(err)}`, { status: 502 });
  }
}

/** Media passthrough for streams whose hosts block browsers (no
 *  CORS). m3u8 playlists are REWRITTEN so every segment and URI
 *  attribute routes back through this relay; segments stream through
 *  unbuffered. Opt-in from the app's "route through server" toggle. */
async function relayStream(request: Request, target: string): Promise<Response> {
  let u: URL;
  try {
    u = new URL(target);
  } catch {
    return new Response("bad url", { status: 400 });
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    return new Response("http/https only", { status: 400 });
  }
  if (BLOCKED_HOST.test(u.hostname)) {
    return new Response("private hosts blocked", { status: 403 });
  }
  const prox = (abs: string) => `/stream?url=${encodeURIComponent(abs)}`;
  try {
    const res = await fetch(u.toString(), {
      signal: AbortSignal.timeout(20_000),
      headers: { "user-agent": "NusaTV/1", ...(request.headers.get("range") ? { range: request.headers.get("range")! } : {}) },
      redirect: "follow",
    });
    if (!res.ok || !res.body) return new Response(`upstream HTTP ${res.status}`, { status: 502 });
    const ct = res.headers.get("content-type") ?? "application/octet-stream";
    if (/html|javascript|ecmascript|svg/i.test(ct)) {
      return new Response("media relay accepts video/audio streams only", { status: 403 });
    }
    const isPlaylist =
      /mpegurl|m3u8/i.test(ct) || u.pathname.split("?")[0]!.endsWith(".m3u8");
    if (isPlaylist) {
      const text = await res.text();
      if (text.length > 2_000_000) return new Response("over 2 MB", { status: 413 });
      const rewritten = text.split("\n").map((line) => {
        const l = line.trim();
        if (l === "") return line;
        if (l.startsWith("#")) {
          return l.replace(/URI="([^"]+)"/g, (_m, raw: string) => {
            const abs = (() => {
              try { return new URL(raw, u).toString(); } catch { return raw; }
            })();
            return `URI="${prox(abs)}"`;
          });
        }
        const abs = (() => {
          try { return new URL(l, u).toString(); } catch { return l; }
        })();
        return prox(abs);
      }).join("\n");
      return new Response(rewritten, {
        headers: { "content-type": "application/vnd.apple.mpegurl", "cache-control": "no-store" },
      });
    }
    return new Response(res.body, {
      headers: { "content-type": ct, "cache-control": "no-store" },
    });
  } catch (err) {
    return new Response(`relay failed: ${String(err)}`, { status: 502 });
  }
}
Bun.serve({
  port: PORT,
  hostname: process.env.HOST ?? "127.0.0.1",
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/fetch") {
      return relayPlaylist(url.searchParams.get("url") ?? "");
    }
    if (url.pathname === "/stream") {
      return relayStream(request, url.searchParams.get("url") ?? "");
    }
    let rel = decodeURIComponent(url.pathname);
    if (rel === "/" || rel.endsWith("/")) rel += "index.html";
    
    // Strict path resolution against DIST root
    const resolved = path.resolve(DIST, "." + path.normalize(rel));
    if (!resolved.startsWith(DIST)) {
      return new Response("Forbidden", { status: 403 });
    }
    
    const file = Bun.file(resolved);
    const isHtml = resolved.endsWith(".html");
    const isStatus = resolved.endsWith("status.json");
    const isThumb = resolved.includes("/thumbnails/");
    
    const cacheHeader = isStatus
      ? "no-cache, no-store, must-revalidate"
      : isThumb
        ? "public, max-age=30, must-revalidate"
        : isHtml
          ? "no-cache"
          : "public, max-age=86400";

    const ext = path.extname(resolved).toLowerCase();
    return new Response(file, {
      headers: {
        "content-type": MIME[ext] ?? "application/octet-stream",
        "cache-control": cacheHeader,
        "x-content-type-options": "nosniff",
      },
    });
  },
});
console.log(`NusaTV web on http://127.0.0.1:${PORT}`);
