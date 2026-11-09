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

export type StreamSource = {
  label: string;
  url: string;
  /** Host sends no CORS headers (or is plain http) — route via /stream. */
  relay?: boolean;
};

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
  /** The broadcaster's own public HLS endpoint. */
  src: string;
  sources?: StreamSource[];
  /** Primary src needs the /stream relay (no CORS / plain http). */
  relay?: boolean;
};

export const CHANNELS: Channel[] = [
  // Curated Indonesian national & regional streams + verified international feeds.
  { id: "metrotv", num: 1, name: "Metro TV HD", abbr: "METRO", bg: "#0F2850", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://edge.medcom.id/live-edge/smil:metro.smil/playlist.m3u8",
    sources: [
      { label: "Server 1 (Medcom HD)", url: "https://edge.medcom.id/live-edge/smil:metro.smil/playlist.m3u8" },
      { label: "Server 2 (DensTV Flashcon)", url: "http://op-flashcon-digdayahd-1.dens.tv/h/h12/01.m3u8" }
    ] },
  { id: "cnnid", num: 2, name: "CNN Indonesia", abbr: "CNN", bg: "#CC0000", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://video.detik.com/livecnn/smil:cnntv/chunklist_w268557525_b384000_sleng.m3u8",
    sources: [
      { label: "Server 1 (Detik Edge)", url: "https://video.detik.com/livecnn/smil:cnntv/chunklist_w268557525_b384000_sleng.m3u8" },
      { label: "Server 2 (Detik Master)", url: "https://video.detik.com/livecnn/smil:cnntv/playlist.m3u8" }
    ] },
  { id: "cnbcid", num: 3, name: "CNBC Indonesia", abbr: "CNBC", bg: "#002B49", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://video.detik.com/livecnbc/smil:cnbctv/chunklist_w1279679883_b384000_sleng.m3u8",
    sources: [
      { label: "Server 1 (Detik Edge)", url: "https://video.detik.com/livecnbc/smil:cnbctv/chunklist_w1279679883_b384000_sleng.m3u8" },
      { label: "Server 2 (Detik Master)", url: "https://video.detik.com/livecnbc/smil:cnbctv/playlist.m3u8" }
    ] },
  { id: "inews", num: 4, name: "iNews (Irak)", abbr: "INEWS", bg: "#B01111", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://live.i-news.tv/hls/stream.m3u8",
    sources: [
      { label: "Server 1 (Official)", url: "https://live.i-news.tv/hls/stream.m3u8" },
      { label: "Server 2 (Stream 1)", url: "https://live.i-news.tv/hls/1/stream.m3u8" }
    ] },
  { id: "rtv", num: 5, name: "RTV", abbr: "RTV", bg: "#551A8B", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://rtvstream.rtv.co.id:4555/hls/rtv.m3u8" },
  { id: "ntv", num: 6, name: "Nusantara TV", abbr: "NTV", bg: "#1E6FEB", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://nusantaratv.siar.us/nusantaratv/live/playlist.m3u8" },
  { id: "daai", num: 7, name: "DAAI TV", abbr: "DAAI", bg: "#008080", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://pull.daaiplus.com/live-DAAIPLUS/live-DAAIPLUS_HD.m3u8" },
  { id: "magna", num: 8, name: "MAGNA Channel", abbr: "MAGNA", bg: "#4A148C", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://edge.medcom.id/live-edge/smil:magna.smil/chunklist_w521170343_b1128000_sleng.m3u8" },
  { id: "bnch", num: 9, name: "BN Channel", abbr: "BN", bg: "#004D40", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://flv.intechmedia.net/live/ch112.m3u8" },
  { id: "tvriworld", num: 10, name: "TVRI World", abbr: "WORLD", bg: "#0D47A1", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/TVRIWorld/hls/TVRIWorld.m3u8" },
  { id: "tv9", num: 11, name: "TV9 Nusantara", abbr: "TV9", bg: "#1B5E20", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://5bf7b725107e5.streamlock.net/tv9/tv9/playlist.m3u8",
    sources: [
      { label: "Server 1 (Streamlock)", url: "https://5bf7b725107e5.streamlock.net/tv9/tv9/playlist.m3u8" },
      { label: "Server 2 (Intechmedia)", url: "http://122.248.43.242:1935/TV9/_definst_/myStream/playlist.m3u8" }
    ] },
  { id: "jawapos", num: 12, name: "Jawa Pos TV", abbr: "JP TV", bg: "#E65100", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "http://122.248.43.242:1935/JAWAPOSTVJKT/_definst_/myStream/playlist.m3u8" },
  { id: "bandungtv", num: 13, name: "Bandung TV", abbr: "BDG", bg: "#37474F", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "http://202.150.153.254:65500/bandungtvWEBSITE.m3u8" },
  { id: "dw", num: 14, name: "DW English", abbr: "DW", bg: "#1F2A44", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8" },
  { id: "f24en", num: 15, name: "France 24 English", abbr: "F24", bg: "#1A1A2E", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://static.france24.com/live/F24_EN_LO_HLS/live_web.m3u8" },
  { id: "cgtn", num: 16, name: "CGTN English", abbr: "CGTN", bg: "#B6002D", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://news.cgtn.com/resource/live/english/cgtn-news.m3u8" },
  { id: "dwde", num: 17, name: "DW Deutsch", abbr: "DW DE", bg: "#3A2A1F", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://dwamdstream101.akamaized.net/hls/live/2015524/dwstream101/index.m3u8" },
  { id: "f24fr", num: 18, name: "France 24 Français", abbr: "F24 FR", bg: "#2E1A2E", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://static.france24.com/live/F24_FR_LO_HLS/live_web.m3u8" },
  { id: "f24es", num: 19, name: "France 24 Español", abbr: "F24 ES", bg: "#1A2E2E", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://static.france24.com/live/F24_ES_LO_HLS/live_web.m3u8" },
  { id: "nasa", num: 20, name: "NASA TV Public", abbr: "NASA", bg: "#0B3D91", fg: "#ffffff", cat: "Sains", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8",
    sources: [
      { label: "Server 1 (Master)", url: "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8" },
      { label: "Server 2 (2000k)", url: "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master_2000.m3u8" }
    ] },
  { id: "rbt", num: 21, name: "Red Bull TV", abbr: "RBT", bg: "#123B7A", fg: "#ffffff", cat: "Olahraga", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8",
    sources: [
      { label: "Server 1 (BoRB-AT)", url: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8" },
      { label: "Server 2 (BoRB-US)", url: "https://rbmn-live.akamaized.net/hls/live/622817/BoRB-US/master_928.m3u8" }
    ] },
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
  // Community playlist expansion (2026-11-09): every entry below was verified
  // live from the public iptv-org / Free-TV / dhanytv lists — HTTP 200 with a
  // valid #EXTM3U manifest, fetched WITHOUT referer or UA spoofing. Entries
  // whose host blocks browsers (no CORS) carry relay:true and play through
  // this site's own /stream passthrough.
  { id: "btv", num: 46, name: "BTV", abbr: "BTV", bg: "#101820", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://lnd0t3b922.tenbytecdn.com/ta-sg1/90369cf5-6ac2-411d-b3d0-15fae10a2e2c/master.m3u8" },
  { id: "garudatv", num: 47, name: "Garuda TV", abbr: "GRD TV", bg: "#C62828", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://hgmtv.com:19360/garudatvlivestreaming/garudatvlivestreaming.m3u8" },
  { id: "mgn", num: 48, name: "Metro Globe Network", abbr: "MGN", bg: "#003D7C", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://edge.medcom.id/live-edge/smil:mgnch.smil/playlist.m3u8" },
  { id: "indonesiana", num: 49, name: "Indonesiana TV", abbr: "IDNA", bg: "#37474F", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://tvstreamcast.com/indonesiana.m3u8" },
  { id: "tic", num: 50, name: "The Indonesia Channel", abbr: "TIC", bg: "#00695C", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://restreamer.indonusa.id:8443/d5f4ad43-1b5a-4b0f-8bef-5b37224ed221.m3u8" },
  { id: "uchannel", num: 51, name: "U Channel", abbr: "U CH", bg: "#4A148C", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://srs.u-channel.tv/live/uchannel-tv.m3u8" },
  { id: "salira", num: 52, name: "Salira TV", abbr: "SLRA", bg: "#283593", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://live.salira.tv/p/3870/hybrid/play.m3u8" },
  { id: "mbgtv", num: 53, name: "MBG TV", abbr: "MBG", bg: "#33691E", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://stream.convergen.co/mbg_stream/smil:mbStream.smil/playlist.m3u8" },
  { id: "vtv", num: 54, name: "VTV", abbr: "VTV", bg: "#5D4037", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://flv.intechmedia.net/live/ch107.m3u8" },
  { id: "rinjani", num: 55, name: "Rinjani TV", abbr: "RNJ", bg: "#00838F", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://rinjanitv.cloud/hls/tvkabel.m3u8" },
  { id: "lingkar", num: 56, name: "Lingkar TV", abbr: "LNKR", bg: "#455A64", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://lingkartv.my.id/hls/lingkartv.m3u8" },
  { id: "caruban", num: 57, name: "Caruban TV", abbr: "CRBN", bg: "#BF360C", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://stream.carubantv.id/hls/0/stream.m3u8" },
  { id: "jambitv", num: 58, name: "Jambi TV", abbr: "JMBI", bg: "#1B5E20", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://jambitv.globaldigitalcore.com/hls/sah5tu7Eiveepohyieyie3OoteL2anga.m3u8" },
  { id: "efarina", num: 59, name: "Efarina TV", abbr: "EFRN", bg: "#4E342E", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://live.efarinatv.com/hls/bgtaufikganteng.m3u8" },
  { id: "usmtv", num: 60, name: "USM TV", abbr: "USM", bg: "#0277BD", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://play.fsa-stream.my.id/hls/siaran.m3u8" },
  { id: "pktv", num: 61, name: "PKTV", abbr: "PKTV", bg: "#616161", fg: "#ffffff", cat: "Indonesia", pool: "live", now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://streaming.id18.tunnel.my.id/hls/stream.m3u8" },
  { id: "sangaji", num: 62, name: "Sangaji TV", abbr: "SNGJ", bg: "#795548", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://cdn.adyadigitalteknologi.com:8090/vod/relay.m3u8" },
  { id: "kilisuci", num: 63, name: "Kilisuci TV", abbr: "KLSI", bg: "#827717", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://5bf7b725107e5.streamlock.net/kstv/kstv/playlist.m3u8" },
  { id: "brtv", num: 64, name: "BRTV", abbr: "BRTV", bg: "#00695C", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://5bf7b725107e5.streamlock.net/brtv/brtv/playlist.m3u8" },
  { id: "bmstv", num: 65, name: "BMS TV", abbr: "BMS", bg: "#283593", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://5bf7b725107e5.streamlock.net/bmstv/bmstv/playlist.m3u8" },
  { id: "angeltv", num: 66, name: "Angel TV", abbr: "ANGEL", bg: "#AD1457", fg: "#ffffff", cat: "Indonesia", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://janya-digimix.akamaized.net/vglive-sk-234616/indonesia/ngrp:angelindonesia_all/playlist.m3u8" },
  { id: "densfood", num: 67, name: "Dens Food Channel", abbr: "FOOD", bg: "#8D6E63", fg: "#ffffff", cat: "Lifestyle", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://op-flashcon-digdayahd-1.dens.tv/h/h221/02.m3u8" },
  { id: "balikpapan", num: 68, name: "Balikpapan TV", abbr: "BLPN", bg: "#00695C", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "http://122.248.43.242:1935/BALIKPAPANTV/_definst_/myStream/playlist.m3u8" },
  { id: "batamtv", num: 69, name: "Batam TV", abbr: "BTM", bg: "#0277BD", fg: "#ffffff", cat: "Daerah", pool: "live", now: "Live broadcast", next: "Programme follows", prog: 50, src: "http://122.248.43.242:1935/BATAMTV/_definst_/myStream/playlist.m3u8" },
  { id: "bantentv", num: 70, name: "Banten TV", abbr: "BNTN", bg: "#455A64", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://5bf7b725107e5.streamlock.net/bantentv/bantentv/playlist.m3u8" },
  { id: "bungotv", num: 71, name: "Bungo TV", abbr: "BNGO", bg: "#5D4037", fg: "#ffffff", cat: "Daerah", pool: "live", now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://5bf7b725107e5.streamlock.net/bungotv/bungotv/playlist.m3u8" },
  { id: "dutatv", num: 72, name: "Duta TV", abbr: "DUTA", bg: "#37474F", fg: "#ffffff", cat: "Daerah", pool: "live", now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://dutatv.siar.us/dutatv/live/playlist.m3u8" },
  { id: "fajartv", num: 73, name: "Fajar TV", abbr: "FAJR", bg: "#AD1457", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "http://122.248.43.242:1935/FAJARTV/_definst_/myStream/playlist.m3u8" },
  { id: "jektv", num: 74, name: "Jek TV", abbr: "JEK", bg: "#00838F", fg: "#ffffff", cat: "Daerah", pool: "live", now: "Live broadcast", next: "Programme follows", prog: 50, src: "http://27.124.81.245:1935/jektv/myStream/playlist.m3u8" },
  { id: "jitv", num: 75, name: "Jogja Istimewa TV", abbr: "JI TV", bg: "#33691E", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "http://103.255.15.222:1935/tv/jitv_720p/playlist.m3u8" },
  { id: "jogjatv", num: 76, name: "Jogja TV", abbr: "JOGJA", bg: "#616161", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://stream.jogjatv.co.id/jtvlive/stream/index.m3u8" },
  { id: "jtv", num: 77, name: "JTV Surabaya", abbr: "JTV", bg: "#004D40", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "http://122.248.43.242:1935/JTVSURABAYA/_definst_/myStream/playlist.m3u8" },
  { id: "jtvkediri", num: 78, name: "JTV Kediri", abbr: "JTV KD", bg: "#1B5E20", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "http://122.248.43.242:1935/JTVKEDIRI/_definst_/myStream/playlist.m3u8", relay: true },
  { id: "jtvmadiun", num: 79, name: "JTV Madiun", abbr: "JTV MD", bg: "#2E7D32", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "http://122.248.43.242:1935/JTVMADIUN/_definst_/myStream/playlist.m3u8" },
  { id: "jtvmalang", num: 80, name: "JTV Malang", abbr: "JTV ML", bg: "#388E3C", fg: "#ffffff", cat: "Daerah", pool: "live", now: "Live broadcast", next: "Programme follows", prog: 50, src: "http://122.248.43.242:1935/JTVMALANG/_definst_/myStream/playlist.m3u8" },
  { id: "kawanua", num: 81, name: "Kawanua TV", abbr: "KWN", bg: "#00838F", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "http://122.248.43.242:1935/KAWANUATV/_definst_/myStream/playlist.m3u8" },
  { id: "madutv", num: 82, name: "Madu TV", abbr: "MADU", bg: "#F9A825", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://re1.siar.us/madutv/hd720/playlist.m3u8" },
  { id: "padangtv", num: 83, name: "Padang TV", abbr: "PDG", bg: "#BF360C", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "http://122.248.43.242:1935/PADANGTV/_definst_/myStream/playlist.m3u8" },
  { id: "pontv", num: 84, name: "PONTV", abbr: "PON", bg: "#283593", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "http://122.248.43.242:1935/PONTV/_definst_/myStream/playlist.m3u8" },
  { id: "radartv", num: 85, name: "Radar Tasikmalaya TV", abbr: "RDR", bg: "#5D4037", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://v2.siar.us/radartasikmalaya/live/playlist.m3u8" },
  { id: "rctv", num: 86, name: "RCTV", abbr: "RCTV", bg: "#8E24AA", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://v10.siar.us/rctv/live/playlist.m3u8" },
  { id: "riautv", num: 87, name: "Riau TV", abbr: "RIAU", bg: "#00695C", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "http://122.248.43.242:1935/RIAUTV/_definst_/myStream/playlist.m3u8" },
  { id: "stv", num: 88, name: "Samarinda TV", abbr: "STV", bg: "#455A64", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "http://122.248.43.242:1935/SAMARINDATV/_definst_/myStream/playlist.m3u8" },
  { id: "tatv", num: 89, name: "TATV Semarang", abbr: "TATV", bg: "#0277BD", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://v2.siar.us/tatv/live.sdp/playlist.m3u8" },
  { id: "tvtabalong", num: 90, name: "TV Tabalong", abbr: "TBLG", bg: "#33691E", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://5bf7b725107e5.streamlock.net/tvtabalong/tvtabalong/playlist.m3u8" },
  { id: "dhohotv", num: 91, name: "Dhoho TV", abbr: "DHOHO", bg: "#795548", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://dhohotv.siar.us/dhohotv/live/playlist.m3u8" },
  { id: "banjartv", num: 92, name: "Banjar TV", abbr: "BNJR", bg: "#004D40", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://banjartv.siar.us/banjartv/live/playlist.m3u8" },
  { id: "aktv", num: 93, name: "AKTV Kaltim", abbr: "AKTV", bg: "#2E7D32", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://akativi.siar.us/live/akativi.m3u8" },
  { id: "stara", num: 94, name: "Stara TV", abbr: "STARA", bg: "#0288D1", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://stream.staratv.id/hls/0/stream.m3u8" },
  { id: "starajkt", num: 95, name: "Stara TV Jakarta", abbr: "ST JKT", bg: "#039BE5", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://jakarta.staratv.id/hls/0/stream.m3u8" },
  { id: "starabdg", num: 96, name: "Stara TV Bandung", abbr: "ST BDG", bg: "#039BE5", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://bandung.staratv.id/hls/0/stream.m3u8" },
  { id: "staramlg", num: 97, name: "Stara TV Malang", abbr: "ST MLG", bg: "#29B6F6", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://malang.staratv.id/hls/0/stream.m3u8" },
  { id: "starabjn", num: 98, name: "Stara TV Bojonegoro", abbr: "ST BJN", bg: "#4FC3F7", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://bojonegoro.staratv.id/hls/stream.m3u8" },
  { id: "staracjr", num: 99, name: "Stara TV Cianjur", abbr: "ST CJR", bg: "#81D4FA", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://cianjur.staratv.id/hls/0/stream.m3u8" },
  { id: "staraphy", num: 100, name: "Stara TV Parahyangan", abbr: "ST PHY", bg: "#4FC3F7", fg: "#ffffff", cat: "Daerah", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://parahyangan.staratv.id/hls/0/stream.m3u8" },
  { id: "ahsantv", num: 101, name: "Ahsan TV", abbr: "AHSAN", bg: "#1B5E20", fg: "#ffffff", cat: "Religius", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://5bf7b725107e5.streamlock.net/ahsantv/ahsantv/playlist.m3u8" },
  { id: "alwafa", num: 102, name: "Al Wafa Tarim", abbr: "ALWF", bg: "#00695C", fg: "#ffffff", cat: "Religius", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ammedia.siar.us/ammedia/live/playlist.m3u8" },
  { id: "ashiil", num: 103, name: "Ashiil TV", abbr: "ASHL", bg: "#2E7D32", fg: "#ffffff", cat: "Religius", pool: "live", now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://wahyu1ptv.pages.dev/AshiilTV-HD.m3u8" },
  { id: "asthatv", num: 104, name: "Astha TV", abbr: "ASTHA", bg: "#388E3C", fg: "#ffffff", cat: "Religius", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://hgmtv.com:2020/hls/asthalive/asthalive.m3u8" },
  { id: "dhammatv", num: 105, name: "Dhamma TV", abbr: "DHMA", bg: "#F57F17", fg: "#ffffff", cat: "Religius", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://b.webcache.maxindo.net.id/dhamma/dhamma.m3u8" },
  { id: "madani", num: 106, name: "Madani TV", abbr: "MADANI", bg: "#004D40", fg: "#ffffff", cat: "Religius", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://stream.asianastream.com/madani/madanitv.smil/playlist.m3u8" },
  { id: "mqtv", num: 107, name: "MQTV", abbr: "MQTV", bg: "#1B5E20", fg: "#ffffff", cat: "Religius", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://5bf7b725107e5.streamlock.net/mqtv/mqtv/playlist.m3u8" },
  { id: "salamtv", num: 108, name: "Salam TV", abbr: "SALAM", bg: "#2E7D32", fg: "#ffffff", cat: "Religius", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://live.salamtelevisi.com/hls/0/stream.m3u8" },
  { id: "dmitv", num: 109, name: "DMI TV", abbr: "DMI", bg: "#33691E", fg: "#ffffff", cat: "Religius", pool: "live", now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://tvstreamcast.com/tawaftv.m3u8" },
  { id: "mic", num: 110, name: "Music Information Channel", abbr: "MIC", bg: "#6A1B9A", fg: "#ffffff", cat: "Musik", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://mic.siar.us/mic/live/mic.m3u8" },
  { id: "ssfm", num: 111, name: "Suara Surabaya (Visual)", abbr: "SS FM", bg: "#8E24AA", fg: "#ffffff", cat: "Musik", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ssfm.siar.us/ssfm/live/playlist.m3u8" },
  { id: "now80s", num: 112, name: "Now 80's", abbr: "NOW80", bg: "#AD1457", fg: "#ffffff", cat: "Musik", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://lightning-now80s-samsungnz.amagi.tv/playlist.m3u8", relay: true },
  { id: "trtmuzik", num: 113, name: "TRT Müzik", abbr: "TRT M", bg: "#6D4C41", fg: "#ffffff", cat: "Musik", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://tv-trtmuzik.medya.trt.com.tr/master.m3u8" },
  { id: "c70s", num: 114, name: "70s Cinema", abbr: "70s", bg: "#311B92", fg: "#ffffff", cat: "Film", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5f4d878d3d19b30007d2e782/master.m3u8?terminate=false&deviceType=web&deviceMake=web&deviceModel=web&sid=96&deviceId=5f4d878d3d19b30007d2e782&deviceVersion=DNT&appVersion=DNT&deviceDNT=0&userId=&advertisingId=&deviceLat=&deviceLon=&app_name=&appName=web&buildVersion=&appStoreUrl=&architecture=&includeExtendedEvents=false&marketingRegion=US&serverSideAds=false", relay: true },
  { id: "c80s", num: 115, name: "80s Rewind", abbr: "80s", bg: "#4527A0", fg: "#ffffff", cat: "Film", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5ca525b650be2571e3943c63/master.m3u8?terminate=false&deviceType=web&deviceMake=web&deviceModel=web&sid=95&deviceId=5ca525b650be2571e3943c63&deviceVersion=DNT&appVersion=DNT&deviceDNT=0&userId=&advertisingId=&deviceLat=&deviceLon=&app_name=&appName=web&buildVersion=&appStoreUrl=&architecture=&includeExtendedEvents=false&marketingRegion=US&serverSideAds=false", relay: true },
  { id: "c90s", num: 116, name: "90s Throwback", abbr: "90s", bg: "#512DA8", fg: "#ffffff", cat: "Film", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5f4d86f519358a00072b978e/master.m3u8?terminate=false&deviceType=web&deviceMake=web&deviceModel=web&sid=94&deviceId=5f4d86f519358a00072b978e&deviceVersion=DNT&appVersion=DNT&deviceDNT=0&userId=&advertisingId=&deviceLat=&deviceLon=&app_name=&appName=web&buildVersion=&appStoreUrl=&architecture=&includeExtendedEvents=false&marketingRegion=US&serverSideAds=false", relay: true },
  { id: "classicmovies", num: 117, name: "Classic Movies", abbr: "CLASS", bg: "#5E35B1", fg: "#ffffff", cat: "Film", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/561c5b0dada51f8004c4d855/master.m3u8?terminate=false&deviceType=web&deviceMake=web&deviceModel=web&sid=106&deviceId=561c5b0dada51f8004c4d855&deviceVersion=DNT&appVersion=DNT&deviceDNT=0&userId=&advertisingId=&deviceLat=&deviceLon=&app_name=&appName=web&buildVersion=&appStoreUrl=&architecture=&includeExtendedEvents=false&marketingRegion=US&serverSideAds=false", relay: true },
  { id: "paramountmovies", num: 118, name: "Paramount Movies", abbr: "PMOUNT", bg: "#1A237E", fg: "#ffffff", cat: "Film", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5cb0cae7a461406ffe3f5213/master.m3u8?terminate=false&deviceType=web&deviceMake=web&deviceModel=web&sid=100&deviceId=5cb0cae7a461406ffe3f5213&deviceVersion=DNT&appVersion=DNT&deviceDNT=0&userId=&advertisingId=&deviceLat=&deviceLon=&app_name=&appName=web&buildVersion=&appStoreUrl=&architecture=&includeExtendedEvents=false&marketingRegion=US&serverSideAds=false", relay: true },
  { id: "actionhw", num: 119, name: "Action Hollywood", abbr: "ACTHW", bg: "#B71C1C", fg: "#ffffff", cat: "Film", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://cdn-apse1-prod.tsv2.amagi.tv/linear/amg01076-lightningintern-actionhollywood-samsungnz/playlist.m3u8" },
  { id: "plutoaction", num: 120, name: "Pluto TV Action", abbr: "ACT", bg: "#880E4F", fg: "#ffffff", cat: "Film", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/561d7d484dc7c8770484914a/master.m3u8?terminate=false&deviceType=web&deviceMake=web&deviceModel=web&sid=54&deviceId=561d7d484dc7c8770484914a&deviceVersion=DNT&appVersion=DNT&deviceDNT=0&userId=&advertisingId=&deviceLat=&deviceLon=&app_name=&appName=web&buildVersion=&appStoreUrl=&architecture=&includeExtendedEvents=false&marketingRegion=US&serverSideAds=false", relay: true },
  { id: "plutocomedy", num: 121, name: "Pluto TV Comedy", abbr: "COMEDY", bg: "#4A148C", fg: "#ffffff", cat: "Film", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5a4d3a00ad95e4718ae8d8db/master.m3u8?terminate=false&deviceType=web&deviceMake=web&deviceModel=web&sid=57&deviceId=5a4d3a00ad95e4718ae8d8db&deviceVersion=DNT&appVersion=DNT&deviceDNT=0&userId=&advertisingId=&deviceLat=&deviceLon=&app_name=&appName=web&buildVersion=&appStoreUrl=&architecture=&includeExtendedEvents=false&marketingRegion=US&serverSideAds=false", relay: true },
  { id: "plutodrama", num: 122, name: "Pluto TV Drama", abbr: "DRAMA", bg: "#283593", fg: "#ffffff", cat: "Film", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5b4e92e4694c027be6ecece1/master.m3u8?terminate=false&deviceType=web&deviceMake=web&deviceModel=web&sid=60&deviceId=5b4e92e4694c027be6ecece1&deviceVersion=DNT&appVersion=DNT&deviceDNT=0&userId=&advertisingId=&deviceLat=&deviceLon=&app_name=&appName=web&buildVersion=&appStoreUrl=&architecture=&includeExtendedEvents=false&marketingRegion=US&serverSideAds=false", relay: true },
  { id: "plutohorror", num: 123, name: "Pluto TV Horror", abbr: "HORROR", bg: "#212121", fg: "#ffffff", cat: "Film", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/569546031a619b8f07ce6e25/master.m3u8?terminate=false&deviceType=web&deviceMake=web&deviceModel=web&sid=75&deviceId=569546031a619b8f07ce6e25&deviceVersion=DNT&appVersion=DNT&deviceDNT=0&userId=&advertisingId=&deviceLat=&deviceLon=&app_name=&appName=web&buildVersion=&appStoreUrl=&architecture=&includeExtendedEvents=false&marketingRegion=US&serverSideAds=false", relay: true },
  { id: "plutowestern", num: 124, name: "Pluto TV Westerns", abbr: "WEST", bg: "#4E342E", fg: "#ffffff", cat: "Film", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5b4e94282d4ec87bdcbb87cd/master.m3u8?terminate=false&deviceType=web&deviceMake=web&deviceModel=web&sid=103&deviceId=5b4e94282d4ec87bdcbb87cd&deviceVersion=DNT&appVersion=DNT&deviceDNT=0&userId=&advertisingId=&deviceLat=&deviceLon=&app_name=&appName=web&buildVersion=&appStoreUrl=&architecture=&includeExtendedEvents=false&marketingRegion=US&serverSideAds=false", relay: true },
  { id: "plutocult", num: 125, name: "Pluto TV Cult Films", abbr: "CULT", bg: "#263238", fg: "#ffffff", cat: "Film", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5c665db3e6c01b72c4977bc2/master.m3u8?terminate=false&deviceType=web&deviceMake=web&deviceModel=web&sid=109&deviceId=5c665db3e6c01b72c4977bc2&deviceVersion=DNT&appVersion=DNT&deviceDNT=0&userId=&advertisingId=&deviceLat=&deviceLon=&app_name=&appName=web&buildVersion=&appStoreUrl=&architecture=&includeExtendedEvents=false&marketingRegion=US&serverSideAds=false", relay: true },
  { id: "plutodocs", num: 126, name: "Pluto TV Documentaries", abbr: "DOCS", bg: "#1B5E20", fg: "#ffffff", cat: "Dokumenter", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://service-stitcher.clusters.pluto.tv/stitch/hls/channel/5b85a7582921777994caea63/master.m3u8?terminate=false&deviceType=web&deviceMake=web&deviceModel=web&sid=91&deviceId=5b85a7582921777994caea63&deviceVersion=DNT&appVersion=DNT&deviceDNT=0&userId=&advertisingId=&deviceLat=&deviceLon=&app_name=&appName=web&buildVersion=&appStoreUrl=&architecture=&includeExtendedEvents=false&marketingRegion=US&serverSideAds=false", relay: true },
  { id: "cgtndoc", num: 127, name: "CGTN Documentary", abbr: "CGTN D", bg: "#004D40", fg: "#ffffff", cat: "Dokumenter", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://news.cgtn.com/resource/live/document/cgtn-doc.m3u8" },
  { id: "aljazeera", num: 128, name: "Al Jazeera English", abbr: "AJ EN", bg: "#B7791F", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://live-hls-apps-aje-fa.getaj.net/AJE/index.m3u8",
    sources: [
      { label: "Apps CDN", url: "https://live-hls-apps-aje-fa.getaj.net/AJE/index.m3u8" },
      { label: "Web CDN", url: "https://live-hls-web-aja.getaj.net/AJA/index.m3u8" }
    ] },
  { id: "aljazeera_ar", num: 129, name: "Al Jazeera Arabic", abbr: "AJ AR", bg: "#8D6E2F", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://live-hls-web-aja.getaj.net/AJA/index.m3u8" },
  { id: "ajmubasher", num: 130, name: "Al Jazeera Mubasher", abbr: "AJMB", bg: "#6D4C1F", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://live-hls-web-ajm.getaj.net/AJM/index.m3u8" },
  { id: "alarabiya", num: 131, name: "Al Arabiya", abbr: "ARABY", bg: "#1C5A9E", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://live.alarabiya.net/alarabiapublish/alarabiya.smil/playlist.m3u8" },
  { id: "alhadath", num: 132, name: "Al Hadath", abbr: "HADTH", bg: "#0D47A1", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://live.alarabiya.net/alarabiapublish/alhadath.smil/alarabiapublish/alhadath_1080p/chunks.m3u8" },
  { id: "abcnewsus", num: 133, name: "ABC News (US)", abbr: "ABC", bg: "#252526", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://abcnews-streams.akamaized.net/hls/live/2023560/abcnewshudson1/master.m3u8" },
  { id: "abcnewsau", num: 134, name: "ABC News (AU)", abbr: "ABC AU", bg: "#424242", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://c.mjh.nz/abc-news.m3u8" },
  { id: "cbsnews", num: 135, name: "CBS News", abbr: "CBS", bg: "#03224C", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://cbsnews.akamaized.net/hls/live/2020607/cbsnlineup_8/master.m3u8",
    sources: [
      { label: "Akamaized", url: "https://cbsnews.akamaized.net/hls/live/2020607/cbsnlineup_8/master.m3u8" },
      { label: "Google DAI", url: "https://dai.google.com/linear/hls/event/Sid4xiTQTkCT1SLu6rjUSQ/master.m3u8" }
    ] },
  { id: "nbcnow", num: 136, name: "NBC News NOW", abbr: "NBC", bg: "#16396C", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://d1si3n1st4nkgb.cloudfront.net/10502/88896001/hls/master.m3u8?ads.xumo_channelId=88896001" },
  { id: "bloomberg", num: 137, name: "Bloomberg TV", abbr: "BLOOM", bg: "#14110F", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://bloomberg.com/media-manifest/streams/us.m3u8",
    sources: [
      { label: "US edition", url: "https://bloomberg.com/media-manifest/streams/us.m3u8" },
      { label: "EU edition", url: "https://bloomberg.com/media-manifest/streams/eu.m3u8" }
    ] },
  { id: "skyarabia", num: 138, name: "Sky News Arabia", abbr: "SKY AR", bg: "#0F4C81", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://stream.skynewsarabia.com/hls/sna.m3u8" },
  { id: "trtworld", num: 139, name: "TRT World", abbr: "TRT W", bg: "#8C1D2F", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://tv-trtworld.medya.trt.com.tr/master.m3u8",
    sources: [
      { label: "TRT Official", url: "https://tv-trtworld.medya.trt.com.tr/master.m3u8" },
      { label: "Mirror (Antik)", url: "https://dash2.antik.sk/live/test_trt_world_atktv/playlist.m3u8" }
    ] },
  { id: "nhkworld", num: 140, name: "NHK World Japan", abbr: "NHK W", bg: "#0A2A66", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://master.nhkworld.jp/nhkworld-tv/playlist/live.m3u8",
    sources: [
      { label: "Master CDN", url: "https://master.nhkworld.jp/nhkworld-tv/playlist/live.m3u8" },
      { label: "Media OSD", url: "https://media-osa.hls.nhkworld.jp/hls/w/live/master.m3u8" }
    ] },
  { id: "dwes", num: 141, name: "DW Español", abbr: "DW ES", bg: "#2C3E66", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://dwamdstream104.akamaized.net/hls/live/2015530/dwstream104/stream04/streamPlaylist.m3u8" },
  { id: "cgtnes", num: 142, name: "CGTN Español", abbr: "CG ES", bg: "#8E1B3A", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://news.cgtn.com/resource/live/espanol/cgtn-e.m3u8" },
  { id: "cgtnfr", num: 143, name: "CGTN Français", abbr: "CG FR", bg: "#7B1FA2", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://news.cgtn.com/resource/live/french/cgtn-f.m3u8" },
  { id: "arirang", num: 144, name: "Arirang TV", abbr: "ARIRANG", bg: "#C2185B", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://amdlive.ctnd.com.edgesuite.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8" },
  { id: "indiatoday", num: 145, name: "India Today", abbr: "IN TDY", bg: "#C60C0C", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://indiatodaylive.akamaized.net/hls/live/2014320/indiatoday/indiatodaylive/playlist.m3u8" },
  { id: "recordnews", num: 146, name: "Record News", abbr: "RECNW", bg: "#06427C", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://rnw-rn.otteravision.com/rnw/rn/rnw_rn.m3u8" },
  { id: "sabcnews", num: 147, name: "SABC News", abbr: "SABC", bg: "#B71C1C", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://sabconetanw.cdn.mangomolo.com/news/smil:news.stream.smil/chunklist_b250000_t64MjQwcA==.m3u8" },
  { id: "scripps", num: 148, name: "Scripps News", abbr: "SCRIP", bg: "#1E4E79", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://content.uplynk.com/channel/4bb4901b934c4e029fd4c1abfc766c37.m3u8" },
  { id: "courttv", num: 149, name: "Court TV", abbr: "COURT", bg: "#1B2A4A", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://content.uplynk.com/channel/6c0bd0f94b1d4526a98676e9699a10ef.m3u8" },
  { id: "globalnews", num: 150, name: "Global News", abbr: "GLOBAL", bg: "#B0113B", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://live.corusdigitaldev.com/groupd/live/49a91e7f-1023-430f-8d66-561055f3d0f7/live.isml/.m3u8" },
  { id: "usatoday", num: 151, name: "USA Today", abbr: "USA TD", bg: "#0A6FA8", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg00731-gannettcoinc-usatodaynews-plex/playlist.m3u8" },
  { id: "reuters", num: 152, name: "Reuters Now", abbr: "REUT", bg: "#B75A0F", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://amg00453-reuters-amg00453c1-rakuten-uk-2110.playouts.now.amagi.tv/playlist/amg00453-reuters-reuters-rakutenuk/playlist.m3u8" },
  { id: "tv5monde", num: 153, name: "TV5Monde Info", abbr: "TV5", bg: "#1D4E9E", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott.tv5monde.com/Content/HLS/Live/channel(info)/index.m3u8", relay: true },
  { id: "rtve24", num: 154, name: "RTVE 24H", abbr: "RTVE", bg: "#8E2A54", fg: "#ffffff", cat: "Internasional", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ztnr.rtve.es/ztnr/1694255.m3u8" },
  { id: "tvrisport", num: 155, name: "TVRI Sport", abbr: "TVRI S", bg: "#0D47A1", fg: "#ffffff", cat: "Olahraga", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/SportHD/hls/SportHD.m3u8" },
  { id: "plutosport", num: 156, name: "Pluto TV Sport", abbr: "PSPORT", bg: "#C62828", fg: "#ffffff", cat: "Olahraga", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/608030eff4b6f70007e1684c/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1&advertisingId=channel&embedPartner=rokuChannel&appName=rokuchannel&is_lat=1&bmodel=bm1&content=channel&platform=web&tags=ROKU_CONTENT_TAGS&coppa=false&content_type=livefeed&rdid=channel&genre=ROKU_ADS_CONTENT_GENRE&content_rating=ROKU_ADS_CONTENT_RATING&studio_id=viacom&channel_id=channel", relay: true },
  { id: "tvri_kalteng", num: 157, name: "TVRI Kalimantan Tengah", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Kalteng/hls/Kalteng.m3u8" },
  { id: "tvri_jambi", num: 158, name: "TVRI Jambi", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Jambi/hls/Jambi.m3u8" },
  { id: "tvri_maluku", num: 159, name: "TVRI Maluku", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Ambon/hls/Ambon.m3u8" },
  { id: "tvri_kalsel", num: 160, name: "TVRI Kalimantan Selatan", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Kalsel/hls/Kalsel.m3u8" },
  { id: "tvri_pabar", num: 161, name: "TVRI Papua Barat", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Pabar/hls/Pabar.m3u8" },
  { id: "tvri_sulbar", num: 162, name: "TVRI Sulawesi Barat", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Sulbar/hls/Sulbar.m3u8" },
  { id: "tvri_sumbar", num: 163, name: "TVRI Sumatera Barat", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Sumbar/hls/Sumbar.m3u8" },
  { id: "tvri_jogja", num: 164, name: "TVRI Yogyakarta", abbr: "TVRI", bg: "#1E6FEB", fg: "#ffffff", cat: "TVRI", pool: "live", hd: true, now: "Live broadcast", next: "Programme follows", prog: 50, src: "https://ott-balancer.tvri.go.id/live/eds/Jogjakarta/hls/Jogjakarta.m3u8" },
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