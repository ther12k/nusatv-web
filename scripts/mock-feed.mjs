// Standalone mock of a BitTV-style JSON channel feed, for local verification
// while the real endpoint (duktetek.id) is down / NXDOMAIN.
//
//   node scripts/mock-feed.mjs            # serve on :8787
//   node scripts/mock-feed.mjs 9000       # custom port
//
// Then point the app's feed URL at http://127.0.0.1:8787/feed.json
// (Settings → Channel source → Feed URL) and hit Refresh.
import { createServer } from "node:http";

const port = Number(process.argv[2] ?? 8787);

// BitTV-shaped payload: a bare array of {name, source, country, is_movie, t_stamp}.
// (The exact live shape is unpinned while the real server is offline, so we
//  exercise the tolerant parser's primary path.)
const FEED = {
  t_stamp: Math.floor(Date.now() / 1000),
  channels: [
    { name: "Metro TV HD (Feed)", source: "https://edge.medcom.id/live-edge/smil:metro.smil/playlist.m3u8", country: "Indonesia", is_movie: 0 },
    { name: "RTV (Feed)", source: "https://rtvstream.rtv.co.id:4555/hls/rtv.m3u8", country: "Indonesia", is_movie: 0 },
    { name: "Nusantara TV (Feed)", source: "https://nusantaratv.siar.us/nusantaratv/live/playlist.m3u8", country: "Indonesia", is_movie: 0 },
    { name: "TVRI World (Feed)", source: "https://ott-balancer.tvri.go.id/live/eds/TVRIWorld/hls/TVRIWorld.m3u8", country: "TVRI", is_movie: 0 },
    { name: "DW English (Feed)", source: "https://dwamdstream104.akacast.akamaistream.net/7/806/2561861/v1/live/channel.m3u8", country: "Internasional", is_movie: 0 },
    // a VOD entry that the live-only parser must skip
    { name: "Public Domain Movie (Feed)", source: "https://archive.org/download/FeedMovie/feed.mp4", country: "Film", is_movie: 1 },
  ],
};

createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://127.0.0.1:${port}`);
  res.setHeader("access-control-allow-origin", "*");
  if (url.pathname === "/feed.json") {
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(FEED));
    return;
  }
  res.statusCode = 404;
  res.end("not found");
}).listen(port, "127.0.0.1", () => {
  console.log(`mock BitTV feed on http://127.0.0.1:${port}/feed.json (${FEED.channels.length} entries, 1 VOD)`);
});
