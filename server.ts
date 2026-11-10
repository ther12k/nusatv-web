import path from "node:path";
import { lookup } from "node:dns/promises";
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

/* ------------------------------------------------------------------ SSRF */

/** True when the IPv4 dotted-quad lands in a non-public range. */
function blockedIPv4(ip: string): boolean {
  const o = ip.split(".").map(Number);
  if (o.length !== 4 || o.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return true;
  const [a, b] = [o[0]!, o[1]!];
  return (
    a === 0 || // "this network"
    a === 10 || // private
    a === 127 || // loopback
    (a === 100 && b >= 64 && b <= 127) || // CGNAT
    (a === 169 && b === 254) || // link-local (cloud metadata)
    (a === 172 && b >= 16 && b <= 31) || // private
    a === 192 && b === 168 || // private
    (a === 198 && (b === 18 || b === 19)) || // benchmarking
    a >= 224 // multicast + reserved
  );
}

/** Expands an IPv6 string to its 8 numeric groups; null when
 *  unparseable (callers block those — fail closed). Understands "::"
 *  compression and dotted-quad tails (::ffff:10.0.0.5). */
function parseIPv6(ip: string): number[] | null {
  const dbl = ip.indexOf("::");
  if (dbl !== -1 && ip.indexOf("::", dbl + 1) !== -1) return null; // two "::"
  const head = (dbl === -1 ? ip : ip.slice(0, dbl)).split(":").filter(Boolean);
  const tail = (dbl === -1 ? [] : ip.slice(dbl + 2).split(":")).filter(Boolean);
  const groups: number[] = [];
  const push = (part: string): boolean => {
    if (part.includes(".")) {
      const o = part.split(".").map(Number);
      if (o.length !== 4 || o.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return false;
      groups.push(((o[0]! << 8) | o[1]!)!, ((o[2]! << 8) | o[3]!)!);
      return true;
    }
    if (!/^[0-9a-f]{1,4}$/.test(part)) return false;
    groups.push(parseInt(part, 16));
    return true;
  };
  for (const p of head) if (!push(p)) return null;
  const fill = 8 - head.length - tail.length;
  if (dbl === -1 ? groups.length + tail.length !== 8 : fill < 0) return null;
  if (dbl !== -1) for (let i = 0; i < fill; i++) groups.push(0);
  for (const p of tail) if (!push(p)) return null;
  return groups.length === 8 ? groups : null;
}

/** True when the IPv6 address (unbracketed) lands in a non-public range. */
function blockedIPv6(raw: string): boolean {
  const g = parseIPv6(raw.toLowerCase());
  if (!g) return true; // unparseable → block (fail closed)
  // ::ffff:0:0/96 IPv4-mapped — decide on the embedded IPv4
  if (g.slice(0, 5).every((x) => x === 0) && g[5] === 0xffff) {
    return blockedIPv4(`${g[6]! >> 8}.${g[6]! & 255}.${g[7]! >> 8}.${g[7]! & 255}`);
  }
  if (g.every((x) => x === 0)) return true; // ::
  if (g.slice(0, 7).every((x) => x === 0) && g[7] === 1) return true; // ::1
  if ((g[0]! & 0xfe00) === 0xfc00) return true; // fc00::/7 unique-local
  if ((g[0]! & 0xffc0) === 0xfe80) return true; // fe80::/10 link-local
  if (g[0] === 0x2001 && g[1] === 0x0db8) return true; // 2001:db8::/32 doc
  return false;
}

/** A hostname that is itself an IP literal is checked directly; a DNS
 *  name is RESOLVED and every address it maps to must be public. This
 *  is the check the hostname-only regex missed (DNS names pointing at
 *  internal ranges, IPv6 ULA/link-local, v4-mapped v6). */
async function assertPublicHost(hostname: string): Promise<void> {
  const host = hostname.replace(/^\[|\]$/g, "");
  const isV4 = /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
  const isV6 = host.includes(":");
  if (isV4) {
    if (blockedIPv4(host)) throw new Error("private address blocked");
    return;
  }
  if (isV6) {
    if (blockedIPv6(host)) throw new Error("private address blocked");
    return;
  }
  const records = await lookup(host, { family: 0, all: true });
  for (const { address } of records) {
    if (address.includes(":") ? blockedIPv6(address) : blockedIPv4(address)) {
      throw new Error(`resolves to private address (${address})`);
    }
  }
}

class BlockedTargetError extends Error {}
class CapError extends Error {}

/** Fetch that re-validates protocol, host AND resolved addresses on
 *  every redirect hop (redirect: "follow" would let a public URL hop
 *  to an internal one after the initial check). */
async function safeFetch(
  target: string,
  opts: { timeoutMs: number; headers?: Record<string, string> },
): Promise<Response> {
  const seen = new Set<string>();
  let url = target;
  for (let hop = 0; hop < 5; hop++) {
    let u: URL;
    try {
      u = new URL(url);
    } catch {
      throw new BlockedTargetError("bad url");
    }
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      throw new BlockedTargetError("http/https only");
    }
    if (seen.has(u.toString())) throw new BlockedTargetError("redirect loop");
    seen.add(u.toString());
    try {
      await assertPublicHost(u.hostname);
    } catch (err) {
      throw new BlockedTargetError(err instanceof Error ? err.message : "host blocked");
    }
    const res = await fetch(u.toString(), {
      signal: AbortSignal.timeout(opts.timeoutMs),
      headers: opts.headers,
      redirect: "manual",
    });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) return res; // weird 3xx without location: hand back as-is
      url = new URL(loc, u).toString();
      continue;
    }
    return res;
  }
  throw new BlockedTargetError("too many redirects");
}

/** Reads a response body as text, ENFORCING the byte cap while
 *  streaming (res.text() would buffer an unbounded body first). */
async function readCapped(res: Response, capBytes: number): Promise<string> {
  const len = Number(res.headers.get("content-length") ?? 0);
  if (len > capBytes) throw new CapError(`over ${capBytes} bytes`);
  const reader = res.body!.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value!.byteLength;
    if (total > capBytes) {
      await reader.cancel().catch(() => {});
      throw new CapError(`over ${capBytes} bytes`);
    }
    chunks.push(value!);
  }
  return new TextDecoder().decode(concat(chunks, total));
}

function concat(chunks: Uint8Array[], total: number): Uint8Array {
  const out = new Uint8Array(total);
  let at = 0;
  for (const c of chunks) {
    out.set(c, at);
    at += c.byteLength;
  }
  return out;
}

/* --------------------------------------------------------------- relays */

const CAP = 2_000_000;

/** Text relay for playlist files the browser cannot fetch directly
 *  (no CORS on the playlist host). Bound: http/https, 10 s, 2 MB
 *  (enforced while streaming), text responses only. */
async function relayPlaylist(target: string): Promise<Response> {
  try {
    const res = await safeFetch(target, {
      timeoutMs: 10_000,
      headers: { "user-agent": "NusaTV-playlist-loader/1" },
    });
    if (!res.ok) return new Response(`upstream HTTP ${res.status}`, { status: 502 });
    const ct = res.headers.get("content-type") ?? "";
    if (/html|javascript|ecmascript|svg/i.test(ct)) {
      return new Response("playlist relay accepts text/media lists only", { status: 403 });
    }
    const text = await readCapped(res, CAP);
    return new Response(text, {
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
    });
  } catch (err) {
    if (err instanceof BlockedTargetError) return new Response(err.message, { status: 403 });
    if (err instanceof CapError) return new Response(err.message, { status: 413 });
    return new Response(`relay failed: ${String(err)}`, { status: 502 });
  }
}

/** Media passthrough for streams whose hosts block browsers (no
 *  CORS). m3u8 playlists are REWRITTEN so every segment and URI
 *  attribute routes back through this relay; segments stream through
 *  unbuffered with upstream status (206 partial) and range headers
 *  preserved. */
async function relayStream(request: Request, target: string): Promise<Response> {
  const prox = (abs: string) => `/stream?url=${encodeURIComponent(abs)}`;
  const range = request.headers.get("range");
  try {
    const res = await safeFetch(target, {
      timeoutMs: 20_000,
      headers: { "user-agent": "NusaTV/1", ...(range ? { range } : {}) },
    });
    if (!res.ok || !res.body) return new Response(`upstream HTTP ${res.status}`, { status: 502 });
    const ct = res.headers.get("content-type") ?? "application/octet-stream";
    if (/html|javascript|ecmascript|svg/i.test(ct)) {
      return new Response("media relay accepts video/audio streams only", { status: 403 });
    }
    const isPlaylist =
      /mpegurl|m3u8/i.test(ct) || new URL(target).pathname.split("?")[0]!.endsWith(".m3u8");
    if (isPlaylist) {
      const text = await readCapped(res, CAP);
      const rewritten = text.split("\n").map((line) => {
        const l = line.trim();
        if (l === "") return line;
        if (l.startsWith("#")) {
          return l.replace(/URI="([^"]+)"/g, (_m, raw: string) => {
            const abs = (() => {
              try { return new URL(raw, new URL(target)).toString(); } catch { return raw; }
            })();
            return `URI="${prox(abs)}"`;
          });
        }
        const abs = (() => {
          try { return new URL(l, new URL(target)).toString(); } catch { return l; }
        })();
        return prox(abs);
      }).join("\n");
      return new Response(rewritten, {
        headers: { "content-type": "application/vnd.apple.mpegurl", "cache-control": "no-store" },
      });
    }
    // Segments: stream through, preserving 206/200 + range semantics so
    // seek/buffer math in hls.js stays correct.
    const headers: Record<string, string> = {
      "content-type": ct,
      "cache-control": "no-store",
    };
    const cr = res.headers.get("content-range");
    const ar = res.headers.get("accept-ranges");
    const cl = res.headers.get("content-length");
    if (cr) headers["content-range"] = cr;
    if (ar) headers["accept-ranges"] = ar;
    if (cl) headers["content-length"] = cl;
    return new Response(res.body, { status: res.status, headers });
  } catch (err) {
    if (err instanceof BlockedTargetError) return new Response(err.message, { status: 403 });
    if (err instanceof CapError) return new Response(err.message, { status: 413 });
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
