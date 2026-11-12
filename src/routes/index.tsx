import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroBanner } from "@/components/HeroBanner";
import { MovieRow } from "@/components/MovieRow";
import { movies, getByGenre, getMovieById } from "@/data/movies";
import { useContinueWatching, useMyList } from "@/hooks/useLocalCollections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumen — Cinematic Streaming" },
      { name: "description", content: "Discover trending films, new releases, and hand-picked cinema on Lumen." },
      { property: "og:title", content: "Lumen — Cinematic Streaming" },
      { property: "og:description", content: "Discover trending films and new releases on Lumen." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const featured = useMemo(() => movies.filter((m) => m.trending).slice(0, 5), []);
  const trending = useMemo(() => movies.filter((m) => m.trending), []);
  const newReleases = useMemo(() => movies.filter((m) => m.newRelease), []);
  const popular = useMemo(() => movies.filter((m) => m.popular), []);
  const recommended = useMemo(() => movies.filter((m) => m.recommended), []);

  const { items: progress } = useContinueWatching();
  const continueRow = useMemo(
    () => progress.map((p) => getMovieById(p.movieId)).filter((m): m is NonNullable<typeof m> => !!m),
    [progress],
  );

  const { ids: listIds } = useMyList();
  const myListRow = useMemo(
    () => listIds.map((id) => getMovieById(id)).filter((m): m is NonNullable<typeof m> => !!m),
    [listIds],
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroBanner movies={featured} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="-mt-16 space-y-2"
        >
          <MovieRow
            title="Continue Watching"
            movies={continueRow}
            emptyLabel="No videos in progress."
            stickyTitle
          />
          {myListRow.length > 0 && <MovieRow title="My List" movies={myListRow} />}
          <MovieRow title="Trending Now" movies={trending} />
          <MovieRow title="New Releases" movies={newReleases} />
          <MovieRow title="Action" movies={getByGenre("Action")} />
          <MovieRow title="Drama" movies={getByGenre("Drama")} />
          <MovieRow title="Comedy" movies={getByGenre("Comedy")} />
          <MovieRow title="Sci-Fi" movies={getByGenre("Sci-Fi")} />
          <MovieRow title="Popular This Week" movies={popular} />
          <MovieRow title="Recommended For You" movies={recommended} />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
