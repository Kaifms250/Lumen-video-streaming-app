import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MovieCard } from "@/components/MovieCard";
import { movies, searchMovies, ALL_GENRES, getMovieById } from "@/data/movies";
import { useMyList } from "@/hooks/useLocalCollections";

type Search = {
  q?: string;
  genre?: string;
};

export const Route = createFileRoute("/browse")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    q: typeof raw.q === "string" && raw.q ? raw.q : undefined,
    genre: typeof raw.genre === "string" && raw.genre ? raw.genre : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Browse — Lumen" },
      { name: "description", content: "Browse the Lumen catalogue by genre or search across every title." },
    ],
  }),
  component: BrowsePage,
});

function BrowsePage() {
  const { q, genre } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { ids } = useMyList();

  const results = useMemo(() => {
    if (q) return searchMovies(q);
    if (genre === "my-list") {
      return ids.map((id) => getMovieById(id)).filter((m): m is NonNullable<typeof m> => !!m);
    }
    if (genre) {
      return movies.filter((m) => m.genres.includes(genre as never));
    }
    return movies;
  }, [q, genre, ids]);

  const heading = q
    ? `Results for “${q}”`
    : genre === "my-list"
      ? "My List"
      : genre
        ? genre
        : "All Titles";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-[1400px] px-4 pt-24 sm:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black md:text-4xl">{heading}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {results.length} title{results.length === 1 ? "" : "s"}
            </p>
          </div>
          <input
            type="search"
            defaultValue={q ?? ""}
            placeholder="Search titles, cast, year…"
            onChange={(e) => {
              const val = e.target.value;
              navigate({ search: { q: val || undefined, genre: val ? undefined : genre } });
            }}
            className="h-10 w-full max-w-sm rounded-full border border-border bg-card/60 px-4 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            to="/browse"
            search={{ q: undefined, genre: undefined }}
            className={chipCls(!genre && !q)}
          >
            All
          </Link>
          <Link
            to="/browse"
            search={{ q: undefined, genre: "my-list" }}
            className={chipCls(genre === "my-list")}
          >
            My List
          </Link>
          {ALL_GENRES.map((g) => (
            <Link
              key={g}
              to="/browse"
              search={{ q: undefined, genre: g }}
              className={chipCls(genre === g)}
            >
              {g}
            </Link>
          ))}
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card/40 p-12 text-center">
            <div className="text-lg font-semibold">No titles match your search</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different genre, year, or clear your search.
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 gap-3 pb-16 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          >
            {results.map((m) => (
              <div key={m.id} className="flex justify-center">
                <MovieCard movie={m} />
              </div>
            ))}
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function chipCls(active: boolean) {
  return `rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
    active
      ? "border-primary bg-primary text-primary-foreground shadow"
      : "border-border bg-card/50 text-muted-foreground hover:text-foreground"
  }`;
}
