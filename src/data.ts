import heroImg from "./assets/images/hero-sunset.jpg";
import jojoImg from "./assets/images/jojo-art.svg";
import seriesImg from "./assets/images/series-still.jpg";
import sportsImg from "./assets/images/live-sports.jpg";
import pDune from "./assets/images/poster-dune.jpg";
import pOppen from "./assets/images/poster-oppen.jpg";
import pSnow from "./assets/images/poster-snow.jpg";
import pPast from "./assets/images/poster-past.jpg";
import pHeron from "./assets/images/poster-heron.jpg";
import pTokyo from "./assets/images/poster-tokyo.jpg";

export const IMG = {
  hero: heroImg,
  jojo: jojoImg,
  series: seriesImg,
  sports: sportsImg,
  dune: pDune,
  oppen: pOppen,
  snow: pSnow,
  past: pPast,
  heron: pHeron,
  tokyo: pTokyo,
};

/* ------------------------------------------------------------------ movies */

export type Movie = {
  id: string;
  title: string;
  year: number;
  genres: string[];
  rating: number;
  dur: string;
  poster: string;
  synopsis: string;
  match: number;
  quality: string;
  director: string;
};

export const MOVIES: Movie[] = [
  {
    id: "jojo",
    title: "Jojo Rabbit",
    year: 2022,
    genres: ["Comedy", "Drama"],
    rating: 7.9,
    dur: "1h 48m",
    poster: IMG.jojo,
    synopsis:
      "A lonely German boy joins the Hitler Youth to please his mother — and discovers a Jewish girl hiding in the attic, with his imaginary friend Adolf as the worst possible conscience.",
    match: 97,
    quality: "4K Dolby Vision",
    director: "Taika Waititi",
  },
  {
    id: "dune2",
    title: "Dune: Part Two",
    year: 2024,
    genres: ["Sci-Fi", "Adventure"],
    rating: 8.6,
    dur: "2h 46m",
    poster: IMG.dune,
    synopsis:
      "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family — and chooses between the love of his life and the fate of the known universe.",
    match: 98,
    quality: "4K Dolby Vision",
    director: "Denis Villeneuve",
  },
  {
    id: "oppen",
    title: "Oppenheimer",
    year: 2023,
    genres: ["Drama", "History"],
    rating: 8.4,
    dur: "3h 00m",
    poster: IMG.oppen,
    synopsis:
      "J. Robert Oppenheimer races to build the atomic bomb before the Nazis can, then spends the rest of his life answering for what it became.",
    match: 96,
    quality: "4K HDR10",
    director: "Christopher Nolan",
  },
  {
    id: "anatomy",
    title: "Anatomy of a Fall",
    year: 2023,
    genres: ["Drama", "Mystery"],
    rating: 7.7,
    dur: "2h 32m",
    poster: IMG.snow,
    synopsis:
      "A writer stands trial for the death of her husband, found at the foot of the family chalet — while their blind son becomes the only witness who might decide the truth.",
    match: 91,
    quality: "HD 1080p",
    director: "Justine Triet",
  },
  {
    id: "past",
    title: "Past Lives",
    year: 2023,
    genres: ["Romance", "Drama"],
    rating: 7.8,
    dur: "1h 46m",
    poster: IMG.past,
    synopsis:
      "Two childhood friends reunite in New York after twenty years apart and weigh the lives they chose against the one they might have had.",
    match: 94,
    quality: "4K HDR",
    director: "Celine Song",
  },
  {
    id: "heron",
    title: "The Boy and the Heron",
    year: 2023,
    genres: ["Animation", "Fantasy"],
    rating: 7.5,
    dur: "2h 04m",
    poster: IMG.heron,
    synopsis:
      "A grieving boy follows a talking heron through a crumbling tower into a collapsing world built for the dead — and for the people who refuse to leave it.",
    match: 89,
    quality: "4K Dolby Atmos",
    director: "Hayao Miyazaki",
  },
  {
    id: "tokyo",
    title: "Perfect Days",
    year: 2023,
    genres: ["Drama"],
    rating: 7.9,
    dur: "2h 04m",
    poster: IMG.tokyo,
    synopsis:
      "A Tokyo toilet cleaner finds a quiet order in routines, cassette tapes and the light that falls through the trees onto his dashboard.",
    match: 93,
    quality: "HD 1080p",
    director: "Wim Wenders",
  },
];

export const GENRES = ["All", "Drama", "Sci-Fi", "Adventure", "Romance", "Animation", "Mystery", "History", "Fantasy"];

export const TOP10 = [
  { rank: 1, title: "Dune: Part Two", meta: "2024 · Sci-Fi", id: "dune2" },
  { rank: 2, title: "Oppenheimer", meta: "2023 · Drama", id: "oppen" },
  { rank: 3, title: "The Bureau — S02", meta: "Series · Espionage", id: "" },
  { rank: 4, title: "Anatomy of a Fall", meta: "2023 · Mystery", id: "anatomy" },
  { rank: 5, title: "Perfect Days", meta: "2023 · Drama", id: "tokyo" },
  { rank: 6, title: "The Boy and the Heron", meta: "2023 · Animation", id: "heron" },
];

/* ---------------------------------------------------------------- channels */

export type Channel = {
  id: string;
  num: number;
  name: string;
  abbr: string;
  bg: string;
  fg: string;
  cat: string;
  pool: string;
  hd?: boolean;
  now: string;
  next: string;
  prog: number;
  /** The broadcaster's own public HLS endpoint (all CORS-open). */
  src: string;
};

export const CHANNELS: Channel[] = [
  // Curated Indonesian national & regional streams + verified international feeds.
  { id: "metrotv", num: 1, name: "Metro TV HD", abbr: "METRO", bg: "#0F2850", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://edge.medcom.id/live-edge/smil:metro.smil/playlist.m3u8" },
  { id: "cnnid", num: 2, name: "CNN Indonesia", abbr: "CNN", bg: "#CC0000", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://video.detik.com/livecnn/smil:cnntv/chunklist_w268557525_b384000_sleng.m3u8" },
  { id: "cnbcid", num: 3, name: "CNBC Indonesia", abbr: "CNBC", bg: "#002B49", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://video.detik.com/livecnbc/smil:cnbctv/chunklist_w1279679883_b384000_sleng.m3u8" },
  { id: "inews", num: 4, name: "iNews HD", abbr: "INEWS", bg: "#B01111", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://live.i-news.tv/hls/stream.m3u8" },
  { id: "rtv", num: 5, name: "RTV", abbr: "RTV", bg: "#551A8B", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://rtvstream.rtv.co.id:4555/hls/rtv.m3u8" },
  { id: "ntv", num: 6, name: "Nusantara TV", abbr: "NTV", bg: "#1E6FEB", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://nusantaratv.siar.us/nusantaratv/live/playlist.m3u8" },
  { id: "daai", num: 7, name: "DAAI TV", abbr: "DAAI", bg: "#008080", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://pull.daaiplus.com/live-DAAIPLUS/live-DAAIPLUS_HD.m3u8" },
  { id: "magna", num: 8, name: "MAGNA Channel", abbr: "MAGNA", bg: "#4A148C", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://edge.medcom.id/live-edge/smil:magna.smil/chunklist_w521170343_b1128000_sleng.m3u8" },
  { id: "bnch", num: 9, name: "BN Channel", abbr: "BN", bg: "#004D40", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://flv.intechmedia.net/live/ch112.m3u8" },
  { id: "tvriworld", num: 10, name: "TVRI World", abbr: "WORLD", bg: "#0D47A1", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/TVRIWorld/hls/TVRIWorld.m3u8" },
  { id: "tv9", num: 11, name: "TV9 Nusantara", abbr: "TV9", bg: "#1B5E20", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://5bf7b725107e5.streamlock.net/tv9/tv9/playlist.m3u8" },
  { id: "jawapos", num: 12, name: "Jawa Pos TV", abbr: "JP TV", bg: "#E65100", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "http://122.248.43.242:1935/JAWAPOSTVJKT/_definst_/myStream/playlist.m3u8" },
  { id: "bandungtv", num: 13, name: "Bandung TV", abbr: "BDG", bg: "#37474F", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "http://202.150.153.254:65500/bandungtvWEBSITE.m3u8" },
  { id: "dw", num: 14, name: "DW English", abbr: "DW", bg: "#1F2A44", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8" },
  { id: "f24en", num: 15, name: "France 24 English", abbr: "F24", bg: "#1A1A2E", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://static.france24.com/live/F24_EN_LO_HLS/live_web.m3u8" },
  { id: "cgtn", num: 16, name: "CGTN English", abbr: "CGTN", bg: "#B6002D", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://news.cgtn.com/resource/live/english/cgtn-news.m3u8" },
  { id: "dwde", num: 17, name: "DW Deutsch", abbr: "DW DE", bg: "#3A2A1F", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://dwamdstream101.akamaized.net/hls/live/2015524/dwstream101/index.m3u8" },
  { id: "f24fr", num: 18, name: "France 24 Français", abbr: "F24 FR", bg: "#2E1A2E", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://static.france24.com/live/F24_FR_LO_HLS/live_web.m3u8" },
  { id: "f24es", num: 19, name: "France 24 Español", abbr: "F24 ES", bg: "#1A2E2E", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://static.france24.com/live/F24_ES_LO_HLS/live_web.m3u8" },
  { id: "nasa", num: 20, name: "NASA TV Public", abbr: "NASA", bg: "#0B3D91", fg: "#ffffff", cat: "Sains", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8" },
  { id: "rbt", num: 21, name: "Red Bull TV", abbr: "RBT", bg: "#123B7A", fg: "#ffffff", cat: "Olahraga", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8" },
  { id: "tvri_nasional", num: 22, name: "TVRI Nasional", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8" },
  { id: "tvri_dki", num: 23, name: "TVRI DKI Jakarta", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/DKI/hls/DKI.m3u8" },
  { id: "tvri_jabar", num: 24, name: "TVRI Jawa Barat", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Jabar/hls/Jabar.m3u8" },
  { id: "tvri_jateng", num: 25, name: "TVRI Jawa Tengah", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Jateng/hls/Jateng.m3u8" },
  { id: "tvri_jatim", num: 26, name: "TVRI Jawa Timur", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Jatim/hls/Jatim.m3u8" },
  { id: "tvri_bali", num: 27, name: "TVRI Bali", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Bali/hls/Bali.m3u8" },
  { id: "tvri_sumut", num: 28, name: "TVRI Sumatera Utara", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Sumut/hls/Sumut.m3u8" },
  { id: "tvri_sumsel", num: 29, name: "TVRI Sumatera Selatan", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Sumsel/hls/Sumsel.m3u8" },
  { id: "tvri_sulsel", num: 30, name: "TVRI Sulawesi Selatan", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Sulsel/hls/Sulsel.m3u8" },
  { id: "tvri_sulut", num: 31, name: "TVRI Sulawesi Utara", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Sulut/hls/Sulut.m3u8" },
  { id: "tvri_sulteng", num: 32, name: "TVRI Sulawesi Tengah", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Sulteng/hls/Sulteng.m3u8" },
  { id: "tvri_sultra", num: 33, name: "TVRI Sulawesi Tenggara", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Sultra/hls/Sultra.m3u8" },
  { id: "tvri_kaltim", num: 34, name: "TVRI Kalimantan Timur", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Kaltim/hls/Kaltim.m3u8" },
  { id: "tvri_kalbar", num: 35, name: "TVRI Kalimantan Barat", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Kalbar/hls/Kalbar.m3u8" },
  { id: "tvri_aceh", num: 36, name: "TVRI Aceh", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Aceh/hls/Aceh.m3u8" },
  { id: "tvri_riau", num: 37, name: "TVRI Riau", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Riau/hls/Riau.m3u8" },
  { id: "tvri_bengkulu", num: 38, name: "TVRI Bengkulu", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Bengkulu/hls/Bengkulu.m3u8" },
  { id: "tvri_lampung", num: 39, name: "TVRI Lampung", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Lampung/hls/Lampung.m3u8" },
  { id: "tvri_babel", num: 40, name: "TVRI Kep. Bangka Belitung", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Babel/hls/Babel.m3u8" },
  { id: "tvri_ntb", num: 41, name: "TVRI Nusa Tenggara Barat", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/NTB/hls/NTB.m3u8" },
  { id: "tvri_ntt", num: 42, name: "TVRI Nusa Tenggara Timur", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/NTT/hls/NTT.m3u8" },
  { id: "tvri_gorontalo", num: 43, name: "TVRI Gorontalo", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Gorontalo/hls/Gorontalo.m3u8" },
  { id: "tvri_papua", num: 44, name: "TVRI Papua", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Papua/hls/Papua.m3u8" },
  { id: "mux", num: 45, name: "Mux Test", abbr: "MUX", bg: "#CCA700", fg: "#101014", cat: "Test", pool: "live", now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
];

const POOLS: Record<string, string[]> = {
  live: ["Live broadcast"],
  ent: ["Saturday Night Takeaway", "The Graham Norton Show", "Mastermind", "Taskmaster", "Late Night Live", "Catchphrase", "Newsnight"],
  news: ["World News Tonight", "Business Today", "The Lead", "Market Close", "Foreign Desk", "Late Edition", "Global Public Square"],
  sport: ["Premier League Live", "Cycling: Giro Stage 9", "Sportscenter", "Champions League Countdown", "Live: ATP Madrid", "Full Time", "The Football Show"],
  film: ["Feature: The Third Man", "Feature: Heat", "Feature: Moonlight", "Double Bill: Alien", "Film4 Premiere", "Late Night Cinema", "Feature: Rush"],
  doc: ["Planet Earth III", "Deadliest Catch", "Building the Impossible", "Ancient Roads", "Ocean Giants", "Storm Chasers", "How It's Made"],
  kids: ["Adventure Time", "Teen Titans Go!", "The Amazing World of Gumball", "We Bare Bears", "Craig of the Creek", "Total DramaRama"],
  music: ["MTV Unplugged", "Top of the Pops", "Behind the Music", "Live at Brixton", "120 Minutes", "Club MTV"],
};

/* --------------------------------------------------------------- epg guide */

export type Program = { start: number; dur: number; title: string };
export type GuideRow = { channel: Channel; programs: Program[] };

export const PX_PER_MIN = 3;
export const GUIDE_SPAN = 12 * 60;

/** Window starts on the hour before `now` (shifted by `dayOffset` days) and runs 12h forward. */
export function buildGuide(
  now: Date,
  dayOffset = 0,
): { rows: GuideRow[]; base: Date; nowOffset: number } {
  const base = new Date(now);
  base.setMinutes(0, 0, 0);
  base.setHours(base.getHours() - 1 + dayOffset * 24);
  const durs = [30, 60, 90, 120, 45, 60, 30, 75];
  const rows: GuideRow[] = CHANNELS.map((channel, ci) => {
    const pool = POOLS[channel.pool] ?? POOLS.ent;
    const programs: Program[] = [];
    let t = 0;
    let i = 0;
    while (t < GUIDE_SPAN) {
      const dur = Math.min(durs[(ci * 3 + i * 5) % durs.length], GUIDE_SPAN - t);
      programs.push({ start: t, dur, title: pool[(ci * 2 + i) % pool.length] });
      t += dur;
      i++;
    }
    return { channel, programs };
  });
  const nowOffset = (now.getTime() - base.getTime()) / 60000;
  return { rows, base, nowOffset };
}

export function hhmm(d: Date): string {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function clock(d: Date): string {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function longDate(d: Date): string {
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

export function imgFor(c: Channel): string {
  // Poster shown before the stream attaches (and on mosaic tiles
  // beyond the live-video cap) — grouped by category.
  if (c.cat === "Olahraga") return IMG.sports;
  if (c.cat === "Internasional") return IMG.series;
  if (c.cat === "Sains") return IMG.hero;
  if (c.cat === "Test") return IMG.past;
  return IMG.hero; // TVRI
}

export function featureFor(c: Channel, day: number): string {
  const pool = POOLS[c.pool] ?? POOLS.ent;
  return pool[(day * 3 + c.num) % pool.length];
}

export function signalFor(c: Channel): number {
  return 72 + (c.num % 24);
}

/* --------------------------------------------------------------- continue */

export type Resume = { id: string; title: string; sub: string; img: string; pct: number; live?: boolean; to: string };

export const CONTINUE: Resume[] = [
  { id: "r1", title: "The Bureau", sub: "S02 E04 · Night Train", img: IMG.series, pct: 45, to: "series" },
  { id: "r2", title: "Jojo Rabbit", sub: "2022 · 1h 46m left", img: IMG.jojo, pct: 68, to: "player" },
  { id: "r3", title: "Arsenal v Everton", sub: "Sky Sports · Premier League", img: IMG.sports, pct: 71, live: true, to: "live" },
  { id: "r4", title: "Perfect Days", sub: "2023 · 1h 22m left", img: IMG.tokyo, pct: 30, to: "movies" },
];

/* ----------------------------------------------------------------- series */

export type Episode = { no: number; title: string; dur: string; desc: string; img: string; pct: number };

export const SERIES = {
  title: "The Bureau",
  year: 2024,
  season: 2,
  genres: ["Espionage", "Drama"],
  rating: 8.2,
  quality: "4K HDR10",
  synopsis:
    "Within the DGSE, a department that officially does not exist handles sources nobody will admit to running — until one handler starts pulling at a thread that leads back inside the building.",
  episodes: [
    { no: 1, title: "Cold Start", dur: "52m", desc: "A handler in Beirut burns a twelve-year source to protect a network that officially does not exist.", img: IMG.series, pct: 100 },
    { no: 2, title: "The Mole Hunt", dur: "48m", desc: "Marquise is handed a file with one page missing and a colleague who answers too quickly.", img: IMG.jojo, pct: 100 },
    { no: 3, title: "Red Cell", dur: "51m", desc: "A dry-run recruitment goes live in Tbilisi when the recruit turns up a day early.", img: IMG.snow, pct: 64 },
    { no: 4, title: "Night Train", dur: "49m", desc: "Exfiltration by rail through three borders, with a package that keeps waking up.", img: IMG.past, pct: 45 },
    { no: 5, title: "Handler", dur: "50m", desc: "Lazare is offered the seat he has wanted for a decade, on the condition he never sit in it.", img: IMG.sports, pct: 0 },
    { no: 6, title: "Exfiltration", dur: "57m", desc: "Everything the department built comes down to one corridor and forty seconds.", img: IMG.hero, pct: 0 },
  ] as Episode[],
};

/* ---------------------------------------------------------------- history */

export type HistoryItem = { id: string; title: string; sub: string; img: string; pct: number; when: string };

export const HISTORY: HistoryItem[] = [
  { id: "h1", title: "Oppenheimer", sub: "2023 · Drama · 4K HDR10", img: IMG.oppen, pct: 92, when: "Today, 14:20" },
  { id: "h2", title: "The Bureau — S02 E03", sub: "Red Cell · 51m", img: IMG.series, pct: 64, when: "Yesterday, 22:05" },
  { id: "h3", title: "Arsenal v Everton", sub: "Sky Sports · Premier League", img: IMG.sports, pct: 71, when: "Yesterday, 19:45" },
  { id: "h4", title: "The Boy and the Heron", sub: "2023 · Animation", img: IMG.heron, pct: 100, when: "Sat, 20:12" },
  { id: "h5", title: "Past Lives", sub: "2023 · Romance", img: IMG.past, pct: 38, when: "Fri, 23:31" },
];

export const RECENT = ["dune", "bbc one", "champions league", "studio ghibli", "newsnight", "perfect days"];

/* --------------------------------------------------------------- settings */

export const LANGS = ["English (UK)", "Español", "Français", "Deutsch", "العربية", "日本語"];
export const EPG_CACHE = ["30 Min", "1 Hour", "2 Hour", "4 Hour"];

export const PLANS = [
  { name: "Trial", price: "Free", detail: "2 days · 1 connection", active: false },
  { name: "Elite", price: "£14.99", detail: "12 months · 5 connections · 4K", active: true },
  { name: "Family", price: "£22.99", detail: "12 months · 8 connections · 4K", active: false },
];
