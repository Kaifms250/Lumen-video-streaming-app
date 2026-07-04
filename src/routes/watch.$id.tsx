import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { ArrowLeft, Star } from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { getMovieById } from "@/data/movies";
import { getProgress, saveProgress } from "@/lib/storage";

export const Route = createFileRoute("/watch/$id")({
  loader: ({ params }) => {
    const movie = getMovieById(params.id);
    if (!movie) throw notFound();
    return { movie };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `Watch ${loaderData.movie.title} — Lumen` },
          { name: "description", content: `Now playing: ${loaderData.movie.title}` },
          { name: "robots", content: "noindex" },
        ]
      : [{ title: "Watch — Lumen" }, { name: "robots", content: "noindex" }],
  }),
  component: WatchPage,
  notFoundComponent: WatchNotFound,
});

function WatchPage() {
  const { movie } = Route.useLoaderData();

  const initialTime = useMemo(() => getProgress(movie.id)?.currentTime ?? 0, [movie.id]);

  const handleProgress = useCallback(
    (currentTime: number, duration: number) => {
      if (!isFinite(duration) || duration <= 0) return;
      saveProgress({
        movieId: movie.id,
        currentTime,
        duration,
        percent: (currentTime / duration) * 100,
        updatedAt: Date.now(),
      });
    },
    [movie.id],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-40 glass-nav">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-4 px-4 sm:px-8">
          <Link
            to="/movie/$id"
            params={{ id: movie.id }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to details
          </Link>
          <div className="ml-auto truncate text-sm font-semibold">{movie.title}</div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 pt-20 pb-16 sm:px-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-black shadow-2xl">
          <VideoPlayer
            src={movie.videoUrl}
            autoPlay
            initialTime={initialTime}
            onProgress={handleProgress}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-black md:text-3xl">
              <span className="text-gradient-brand">{movie.title}</span>
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>{movie.year}</span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 text-primary" />
                {movie.rating.toFixed(1)}
              </span>
              <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
              <span>{movie.genres.join(" · ")}</span>
            </div>
            <p className="mt-3 max-w-3xl text-muted-foreground">{movie.description}</p>
          </div>
          <Link
            to="/movie/$id"
            params={{ id: movie.id }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-semibold hover:bg-card"
          >
            View details
          </Link>
        </div>
      </main>
    </div>
  );
}

function WatchNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold">Stream unavailable</h1>
        <p className="mt-2 text-muted-foreground">
          The requested title couldn't be found or is no longer available.
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
