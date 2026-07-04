import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play, Plus, Check, Star, Clock, Calendar, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MovieRow } from "@/components/MovieRow";
import { getMovieById, similarMovies } from "@/data/movies";
import { useMyList } from "@/hooks/useLocalCollections";

export const Route = createFileRoute("/movie/$id")({
  loader: ({ params }) => {
    const movie = getMovieById(params.id);
    if (!movie) throw notFound();
    return { movie };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.movie.title} — Lumen` },
          { name: "description", content: loaderData.movie.description },
          { property: "og:title", content: `${loaderData.movie.title} — Lumen` },
          { property: "og:description", content: loaderData.movie.description },
          { property: "og:image", content: loaderData.movie.backdrop },
          { name: "twitter:image", content: loaderData.movie.backdrop },
        ]
      : [{ title: "Title unavailable — Lumen" }, { name: "robots", content: "noindex" }],
  }),
  component: MovieDetails,
  notFoundComponent: MovieNotFound,
});

function MovieDetails() {
  const { movie } = Route.useLoaderData();
  const { ids, toggle } = useMyList();
  const inList = ids.includes(movie.id);
  const similar = similarMovies(movie, 10);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="relative h-[70vh] min-h-[460px] w-full overflow-hidden">
          <motion.img
            initial={{ scale: 1.06, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            src={movie.backdrop}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 hero-fade" />

          <div className="relative z-10 mx-auto flex h-full max-w-[1400px] items-end px-4 pb-14 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-3xl"
            >
              <Link
                to="/"
                className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Link>
              <h1 className="text-4xl font-black leading-tight md:text-6xl">
                <span className="text-gradient-brand">{movie.title}</span>
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 text-primary" />
                  {movie.rating.toFixed(1)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {movie.year}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
                <span className="rounded border border-border px-1.5 py-0.5 text-[10px] uppercase">HD</span>
              </div>
              <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
                {movie.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/watch/$id"
                  params={{ id: movie.id }}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg transition hover:brightness-110"
                >
                  <Play className="h-4 w-4 fill-current" /> Play
                </Link>
                <button
                  type="button"
                  onClick={() => toggle(movie.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-6 py-3 text-sm font-bold text-foreground backdrop-blur transition hover:bg-card"
                >
                  {inList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {inList ? "In My List" : "Add to My List"}
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold">About</h2>
              <p className="mt-3 text-muted-foreground">{movie.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {movie.genres.map((g: string) => (
                  <Link
                    key={g}
                    to="/browse"
                    search={{ q: undefined, genre: g }}
                    className="rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {g}
                  </Link>
                ))}
              </div>
            </div>
            <aside className="glass-panel rounded-2xl p-5 text-sm">
              <dl className="space-y-3">
                <Row label="Director" value={movie.director} />
                <Row label="Cast" value={movie.cast.length ? movie.cast.join(", ") : "—"} />
                <Row label="Release Year" value={String(movie.year)} />
                <Row label="Runtime" value={`${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`} />
                <Row label="Rating" value={`${movie.rating.toFixed(1)} / 10`} />
                <Row label="Genres" value={movie.genres.join(", ")} />
              </dl>
            </aside>
          </div>
        </section>

        <MovieRow title="More Like This" movies={similar} />
      </main>
      <Footer />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-foreground">{value}</dd>
    </div>
  );
}

function MovieNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 pt-40 text-center">
        <h1 className="text-3xl font-bold">Title unavailable</h1>
        <p className="mt-2 text-muted-foreground">
          We couldn't find that movie in the Lumen catalogue.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
