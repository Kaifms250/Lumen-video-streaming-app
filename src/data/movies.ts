import type { Movie } from "@/lib/types";

// A handful of freely-available HLS streams reused across mock titles.
const HLS = {
  bigBuck: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  tears: "https://test-streams.mux.dev/tos_ismc/main.m3u8",
  sintel: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
  mux: "https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe.m3u8",
};

// Picsum with a stable seed gives us consistent, license-free imagery per title.
const poster = (seed: string) => `https://picsum.photos/seed/${seed}-p/500/750`;
const backdrop = (seed: string) => `https://picsum.photos/seed/${seed}-b/1600/900`;

const raw: Array<Omit<Movie, "poster" | "backdrop"> & { seed: string }> = [
  {
    id: "nebula-drift", seed: "nebula-drift",
    title: "Nebula Drift",
    description: "A stranded pilot navigates a decaying orbital station where reality bends between waking and dream.",
    videoUrl: HLS.bigBuck, genres: ["Sci-Fi", "Thriller"], runtime: 128, rating: 8.4, year: 2024,
    cast: ["Iris Kwan", "Marco Vela", "Dana Ohara"], director: "Sofia Lin",
    trending: true, newRelease: true, popular: true, recommended: true,
  },
  {
    id: "iron-verdict", seed: "iron-verdict",
    title: "Iron Verdict",
    description: "A retired judge is pulled back into a case that ties her city's elite to a decades-old crime.",
    videoUrl: HLS.tears, genres: ["Drama", "Thriller"], runtime: 114, rating: 7.9, year: 2023,
    cast: ["Priya Anand", "Cole Reeves"], director: "Hiro Tanaka",
    trending: true, recommended: true,
  },
  {
    id: "midnight-cartographer", seed: "midnight-cart",
    title: "The Midnight Cartographer",
    description: "A reclusive mapmaker discovers streets that only appear after dark — and someone is watching him draw.",
    videoUrl: HLS.sintel, genres: ["Mystery", "Drama"], runtime: 102, rating: 8.1, year: 2024,
    cast: ["Emil Rousseau", "Ada Blythe"], director: "Noor Farid",
    newRelease: true, popular: true,
  },
  {
    id: "glass-hearts", seed: "glass-hearts",
    title: "Glass Hearts",
    description: "Two rival florists share the same corner of a rainy city — and, eventually, the same umbrella.",
    videoUrl: HLS.bigBuck, genres: ["Romance", "Comedy"], runtime: 96, rating: 7.4, year: 2023,
    cast: ["Lila Moreno", "Ben Katsaros"], director: "Amelia Chen", recommended: true,
  },
  {
    id: "howling-static", seed: "howling-static",
    title: "Howling Static",
    description: "A late-night radio host starts receiving calls from a listener who shouldn't be able to hear him.",
    videoUrl: HLS.tears, genres: ["Horror", "Mystery"], runtime: 91, rating: 7.7, year: 2024,
    cast: ["Rowan Priest", "Sabine Kohl"], director: "Dmitri Vasa",
    trending: true, newRelease: true,
  },
  {
    id: "paper-tiger", seed: "paper-tiger",
    title: "Paper Tiger",
    description: "A washed-up boxer trains a teenage prodigy for a fight neither of them believes she can win.",
    videoUrl: HLS.sintel, genres: ["Drama", "Action"], runtime: 121, rating: 8.2, year: 2022,
    cast: ["Terrence Odum", "Jia Park"], director: "Rafael Souza",
    popular: true, recommended: true,
  },
  {
    id: "orbital-heist", seed: "orbital-heist",
    title: "Orbital Heist",
    description: "Six thieves. One space elevator. Zero margin for error at forty thousand kilometers.",
    videoUrl: HLS.bigBuck, genres: ["Action", "Sci-Fi", "Adventure"], runtime: 133, rating: 7.6, year: 2024,
    cast: ["Kai Fenton", "Nadia Reyes", "Otto Vance"], director: "June Park",
    trending: true, newRelease: true, popular: true,
  },
  {
    id: "salt-and-lightning", seed: "salt-lightning",
    title: "Salt & Lightning",
    description: "A coastal chef and a storm chaser meet during hurricane season and rebuild what the wind took.",
    videoUrl: HLS.tears, genres: ["Romance", "Drama"], runtime: 108, rating: 7.3, year: 2023,
    cast: ["Delia March", "Owen Kessler"], director: "Marisol Vega",
  },
  {
    id: "the-last-argument", seed: "last-argument",
    title: "The Last Argument",
    description: "A philosophy professor's final lecture becomes a live confession that shakes an entire university.",
    videoUrl: HLS.sintel, genres: ["Drama"], runtime: 99, rating: 8.0, year: 2022,
    cast: ["Henrik Solberg"], director: "Ines Duarte", recommended: true,
  },
  {
    id: "cinder-and-code", seed: "cinder-code",
    title: "Cinder & Code",
    description: "A firefighter and a hacker chase an arsonist who leaves cryptographic signatures in the ashes.",
    videoUrl: HLS.bigBuck, genres: ["Thriller", "Action", "Mystery"], runtime: 117, rating: 7.8, year: 2024,
    cast: ["Val Ortega", "Sam Whitaker"], director: "Priya Anand",
    newRelease: true, popular: true,
  },
  {
    id: "featherweight", seed: "featherweight",
    title: "Featherweight",
    description: "An animated tale of a baby albatross learning to trust the wind, and the storm that raised him.",
    videoUrl: HLS.tears, genres: ["Animation", "Adventure", "Fantasy"], runtime: 88, rating: 8.5, year: 2023,
    cast: ["Voice cast: Ada Ito", "Milo Grant"], director: "Studio Kite",
    popular: true, recommended: true,
  },
  {
    id: "quiet-country", seed: "quiet-country",
    title: "Quiet Country",
    description: "A documentary crew embeds with a village that hasn't spoken above a whisper in seventy years.",
    videoUrl: HLS.sintel, genres: ["Documentary"], runtime: 82, rating: 8.3, year: 2023,
    cast: [], director: "Yasmine Haddad",
  },
  {
    id: "gravity-well", seed: "gravity-well",
    title: "Gravity Well",
    description: "Rescue divers race a collapsing trench where physics itself seems to have taken sides.",
    videoUrl: HLS.bigBuck, genres: ["Sci-Fi", "Thriller", "Adventure"], runtime: 126, rating: 7.5, year: 2024,
    cast: ["Ana Volkov", "Reed Callahan"], director: "Kenji Aoki", trending: true, newRelease: true,
  },
  {
    id: "half-a-map", seed: "half-a-map",
    title: "Half a Map",
    description: "Two estranged siblings follow their father's hand-drawn treasure map across three countries.",
    videoUrl: HLS.tears, genres: ["Adventure", "Comedy", "Drama"], runtime: 111, rating: 7.6, year: 2022,
    cast: ["Josie Amara", "Luca Bianchi"], director: "Sam Whitaker",
    recommended: true,
  },
  {
    id: "dark-tide", seed: "dark-tide",
    title: "Dark Tide",
    description: "A marine biologist and a suspicious lighthouse keeper investigate a coast where fish refuse to swim.",
    videoUrl: HLS.sintel, genres: ["Horror", "Mystery", "Thriller"], runtime: 104, rating: 7.2, year: 2023,
    cast: ["Freya Lund", "Amos Reid"], director: "Dmitri Vasa",
  },
  {
    id: "the-blueprint", seed: "the-blueprint",
    title: "The Blueprint",
    description: "An architect races to reverse-engineer a skyscraper that seems to redesign itself overnight.",
    videoUrl: HLS.bigBuck, genres: ["Mystery", "Sci-Fi"], runtime: 119, rating: 7.9, year: 2024,
    cast: ["Neve Aldridge"], director: "Noor Farid", trending: true, popular: true,
  },
  {
    id: "wildflower-highway", seed: "wildflower-hwy",
    title: "Wildflower Highway",
    description: "A road-trip comedy about a botanist, a fugitive, and a station wagon that only turns right.",
    videoUrl: HLS.tears, genres: ["Comedy", "Adventure"], runtime: 95, rating: 7.1, year: 2022,
    cast: ["Tam Delgado", "Rue Osei"], director: "Amelia Chen",
  },
  {
    id: "silent-signal", seed: "silent-signal",
    title: "Silent Signal",
    description: "A deaf codebreaker in 1944 intercepts a transmission that shouldn't exist for another eighty years.",
    videoUrl: HLS.sintel, genres: ["Drama", "Thriller", "Mystery"], runtime: 128, rating: 8.6, year: 2023,
    cast: ["Astrid Køhler"], director: "Ines Duarte",
    recommended: true, popular: true,
  },
  {
    id: "neon-monarch", seed: "neon-monarch",
    title: "Neon Monarch",
    description: "In a city ruled by advertising, a jingle writer discovers her lyrics are being used as commands.",
    videoUrl: HLS.bigBuck, genres: ["Sci-Fi", "Thriller"], runtime: 112, rating: 7.7, year: 2024,
    cast: ["Zuri Malik", "Ken Ito"], director: "Sofia Lin", newRelease: true,
  },
  {
    id: "the-understudy", seed: "understudy",
    title: "The Understudy",
    description: "A backup ballerina takes the stage the night the prima disappears — and refuses to give it back.",
    videoUrl: HLS.tears, genres: ["Drama", "Thriller"], runtime: 106, rating: 7.8, year: 2023,
    cast: ["Camille Roux"], director: "Marisol Vega",
  },
  {
    id: "static-summer", seed: "static-summer",
    title: "Static Summer",
    description: "Three friends spend the last summer before college trying to build a radio that reaches the future.",
    videoUrl: HLS.sintel, genres: ["Drama", "Sci-Fi", "Romance"], runtime: 101, rating: 7.5, year: 2022,
    cast: ["Nova Pierce", "Eli Hart", "June Park"], director: "Amelia Chen",
    recommended: true,
  },
  {
    id: "the-cartel-line", seed: "cartel-line",
    title: "The Cartel Line",
    description: "A rookie border agent uncovers a smuggling route that runs directly through her own precinct.",
    videoUrl: HLS.bigBuck, genres: ["Action", "Thriller", "Drama"], runtime: 124, rating: 7.4, year: 2023,
    cast: ["Ximena Ortiz"], director: "Rafael Souza",
    popular: true,
  },
  {
    id: "little-machines", seed: "little-machines",
    title: "Little Machines",
    description: "An animated adventure through a grandmother's attic, where every clock keeps a different time.",
    videoUrl: HLS.tears, genres: ["Animation", "Fantasy", "Comedy"], runtime: 84, rating: 8.0, year: 2024,
    cast: ["Voice cast: Ivy Wren"], director: "Studio Kite", newRelease: true, recommended: true,
  },
  {
    id: "black-glass-bay", seed: "black-glass",
    title: "Black Glass Bay",
    description: "A detective returns to her fishing hometown to solve a killing that mirrors one she witnessed as a child.",
    videoUrl: HLS.sintel, genres: ["Mystery", "Thriller", "Drama"], runtime: 118, rating: 8.1, year: 2023,
    cast: ["Ingrid Aas", "Malik Sadler"], director: "Kenji Aoki",
    popular: true,
  },
  {
    id: "afterglow", seed: "afterglow",
    title: "Afterglow",
    description: "A widowed astronomer builds a telescope pointed at the exact spot where her wife's voice was last heard.",
    videoUrl: HLS.bigBuck, genres: ["Drama", "Romance", "Sci-Fi"], runtime: 109, rating: 8.4, year: 2024,
    cast: ["Yuki Aramaki"], director: "Sofia Lin",
    trending: true, newRelease: true, recommended: true,
  },
  {
    id: "hard-frost", seed: "hard-frost",
    title: "Hard Frost",
    description: "A mountain rescue team is trapped by a storm — and by whatever is climbing up the mountain behind them.",
    videoUrl: HLS.tears, genres: ["Horror", "Thriller", "Adventure"], runtime: 97, rating: 7.3, year: 2022,
    cast: ["Bear Novak", "Sana Idris"], director: "Dmitri Vasa",
  },
  {
    id: "the-fifth-verse", seed: "fifth-verse",
    title: "The Fifth Verse",
    description: "A pop star on the run from her label hides in a small-town choir, and finds her real voice.",
    videoUrl: HLS.sintel, genres: ["Drama", "Romance", "Comedy"], runtime: 105, rating: 7.6, year: 2023,
    cast: ["Halle Beaumont"], director: "Marisol Vega",
  },
  {
    id: "protocol-nine", seed: "protocol-nine",
    title: "Protocol Nine",
    description: "An off-books intelligence unit must extract a defector who insists she doesn't want to leave.",
    videoUrl: HLS.bigBuck, genres: ["Action", "Thriller"], runtime: 122, rating: 7.5, year: 2024,
    cast: ["Idris Vale", "Mei Otsuka"], director: "Hiro Tanaka",
    trending: true, popular: true,
  },
  {
    id: "the-color-of-water", seed: "color-water",
    title: "The Color of Water",
    description: "A documentary following four rivers, four communities, and one question about who owns a source.",
    videoUrl: HLS.tears, genres: ["Documentary"], runtime: 78, rating: 8.2, year: 2024,
    cast: [], director: "Yasmine Haddad", newRelease: true,
  },
  {
    id: "moth-and-flame", seed: "moth-flame",
    title: "Moth and Flame",
    description: "A jewel thief and the insurance investigator chasing her keep meeting in the wrong hotel bars.",
    videoUrl: HLS.sintel, genres: ["Romance", "Thriller", "Comedy"], runtime: 113, rating: 7.7, year: 2023,
    cast: ["Odette Marchand", "Kai Fenton"], director: "Amelia Chen",
    recommended: true,
  },
  {
    id: "steel-lullaby", seed: "steel-lullaby",
    title: "Steel Lullaby",
    description: "A retired hitman is pulled out of hiding by a lullaby only he was supposed to remember.",
    videoUrl: HLS.bigBuck, genres: ["Action", "Drama", "Thriller"], runtime: 115, rating: 7.9, year: 2024,
    cast: ["Anton Grieves"], director: "Rafael Souza", popular: true,
  },
  {
    id: "the-quiet-year", seed: "quiet-year",
    title: "The Quiet Year",
    description: "After a global blackout, a village learns that silence is also a kind of language.",
    videoUrl: HLS.tears, genres: ["Drama", "Sci-Fi"], runtime: 120, rating: 8.3, year: 2023,
    cast: ["Naima Osei", "Julien Bell"], director: "Ines Duarte", recommended: true,
  },
];

export const movies: Movie[] = raw.map((m) => ({
  ...m,
  poster: poster(m.seed),
  backdrop: backdrop(m.seed),
}));

export const ALL_GENRES = [
  "Action", "Comedy", "Horror", "Drama", "Thriller",
  "Sci-Fi", "Romance", "Animation", "Documentary",
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
    .map((o) => ({
      movie: o,
      score: o.genres.filter((g) => m.genres.includes(g)).length,
    }))
    .sort((a, b) => b.score - a.score || b.movie.rating - a.movie.rating)
    .slice(0, limit)
    .map((x) => x.movie);
}

export function searchMovies(query: string): Movie[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return movies.filter((m) => {
    return (
      m.title.toLowerCase().includes(q) ||
      m.director.toLowerCase().includes(q) ||
      String(m.year).includes(q) ||
      m.genres.some((g) => g.toLowerCase().includes(q)) ||
      m.cast.some((c) => c.toLowerCase().includes(q))
    );
  });
}
