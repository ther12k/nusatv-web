/**
 * Resolve a stream URL to what hls.js should actually load.
 *
 * A source plays direct when the host sends CORS headers and is https.
 * Otherwise the browser would block it (CORS error or mixed content), so it
 * goes through this site's own /stream passthrough — which relays segments
 * unmodified and never spoofs another client's headers:
 *   - `relay` flag on the channel/source (verified no-CORS at scan time),
 *   - any plain-http source on an https page (mixed content),
 *   - the user's global "route through server" toggle.
 */
export function playUrl(
  url: string,
  opts: { proxy?: boolean; relay?: boolean } = {},
): string {
  if (url.startsWith("/")) return url; // already routed
  const mixed =
    typeof location !== "undefined" &&
    location.protocol === "https:" &&
    url.startsWith("http:");
  const viaRelay = opts.proxy || opts.relay || mixed;
  return viaRelay ? `/stream?url=${encodeURIComponent(url)}` : url;
}
