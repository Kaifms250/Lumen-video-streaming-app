import type { Movie } from "@/lib/types";
import angelOnePoster from "@/assets/poster-angel-one.jpg";
import darkTruthsPoster from "@/assets/poster-dark-truths.jpg";
import bipbopPoster from "@/assets/poster-bipbop.jpg";
import muxReelPoster from "@/assets/poster-mux-reel.jpg";

/**
 * Catalog of legally usable, publicly hosted HLS streams.
 * Every URL below was verified to return a valid #EXTM3U manifest.
 * Blender Foundation films are licensed CC-BY; the rest are official
 * player test/demo streams (marked "Demo" in their descriptions).
 */
const wiki = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=960`;

export const movies: Movie[] = [
  {
    id: "big-buck-bunny",
    title: "Big Buck Bunny",
    description: "A gentle giant rabbit takes comic revenge on three bullying rodents. Blender Foundation open movie (CC-BY).",
    poster: wiki("Big_buck_bunny_poster_big.jpg"),
    backdrop: wiki("Big.Buck.Bunny.-.Opening.Screen.png"),
    videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    genres: ["Animation", "Comedy"], runtime: 11, rating: 7.8, year: 2008,
    cast: [], director: "Sacha Goedegebure",
    trending: true, popular: true, recommended: true,
  },
  {
    id: "tears-of-steel",
    title: "Tears of Steel",
    description: "In a future Amsterdam, scientists try to save the world from robots by re-staging a painful breakup. Blender Foundation open movie (CC-BY).",
    poster: wiki("Tears_of_Steel_1080p.webm"),
    backdrop: wiki("Tears_of_Steel_1080p.webm"),
    videoUrl: "https://test-streams.mux.dev/tos_ismc/main.m3u8",
    genres: ["Sci-Fi", "Action"], runtime: 12, rating: 7.1, year: 2012,
    cast: ["Derek de Lint", "Sergio Hasselbaink", "Vanja Rukavina"], director: "Ian Hubert",
    trending: true, newRelease: true, recommended: true,
  },
  {
    id: "elephants-dream",
    title: "Elephants Dream (Dark Truths)",
    description: "Demo stream: a short Blender-based clip packaged by Google's Shaka Player team for adaptive streaming tests.",
    poster: darkTruthsPoster,
    backdrop: wiki("Elephants_Dream_s5_both.jpg"),
    videoUrl: "https://storage.googleapis.com/shaka-demo-assets/bbb-dark-truths-hls/hls.m3u8",
    genres: ["Mystery", "Fantasy"], runtime: 6, rating: 6.9, year: 2020,
    cast: [], director: "Shaka Player demo",
    newRelease: true, popular: true,
  },
  {
    id: "angel-one",
    title: "Angel One",
    description: "Demo stream: a one-minute multi-bitrate HLS sample from the Shaka Player demo library.",
    poster: angelOnePoster,
    backdrop: angelOnePoster,
    videoUrl: "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8",
    genres: ["Fantasy", "Drama"], runtime: 1, rating: 6.5, year: 2016,
    cast: [], director: "Shaka Player demo",
    newRelease: true, recommended: true,
  },
  {
    id: "bipbop",
    title: "BipBop Test Pattern",
    description: "Demo stream: Apple's official advanced HLS example (fMP4) with multiple qualities, audio and subtitle tracks.",
    poster: bipbopPoster,
    backdrop: bipbopPoster,
    videoUrl: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
    genres: ["Documentary"], runtime: 10, rating: 6.0, year: 2017,
    cast: [], director: "Apple HLS examples",
    popular: true,
  },
  {
    id: "mux-demo-reel",
    title: "Mux Demo Reel",
    description: "Demo stream: a short sample video hosted by Mux for testing HLS playback.",
    poster: muxReelPoster,
    backdrop: muxReelPoster,
    videoUrl: "https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe.m3u8",
    genres: ["Documentary"], runtime: 2, rating: 6.2, year: 2021,
    cast: [], director: "Mux",
    trending: true,
  },
];

export const ALL_GENRES = [
  "Action", "Comedy", "Drama", "Sci-Fi", "Animation",
  "Fantasy", "Adventure", "Mystery", "Documentary",
] as const;

export function getMovieById(id: string): Movie | undefined {
  return movies.find((m) => m.id === id);
}

export function getByGenre(genre: string): Movie[] {
  return movies.filter((m) => m.genres.includes(genre as Movie["genres"][number]));
}

export function similarMovies(m: Movie, limit = 8): Movie[] {
  return movies
    .filter((o) => o.id !== m.id)
    .map((o) => ({ movie: o, score: o.genres.filter((g) => m.genres.includes(g)).length }))
    .sort((a, b) => b.score - a.score || b.movie.rating - a.movie.rating)
    .slice(0, limit)
    .map((x) => x.movie);
}

export function searchMovies(query: string): Movie[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return movies.filter((m) =>
    m.title.toLowerCase().includes(q) ||
    m.director.toLowerCase().includes(q) ||
    String(m.year).includes(q) ||
    m.genres.some((g) => g.toLowerCase().includes(q)) ||
    m.cast.some((c) => c.toLowerCase().includes(q)),
  );
}
