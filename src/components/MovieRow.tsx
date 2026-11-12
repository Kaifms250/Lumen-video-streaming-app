import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Movie } from "@/lib/types";
import { MovieCard } from "./MovieCard";

type Props = {
  title: string;
  movies: Movie[];
  emptyLabel?: string;
  stickyTitle?: boolean;
};

export function MovieRow({ title, movies, emptyLabel, stickyTitle = false }: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  };

  if (movies.length === 0) {
    if (!emptyLabel) return null;
    return (
      <section className="py-4">
        <h2 className={`mb-3 px-4 text-lg font-bold sm:px-8 md:text-xl ${stickyTitle ? "sticky top-16 z-20 bg-background/95 py-2 backdrop-blur" : ""}`}>{title}</h2>
        <p className="px-4 text-sm text-muted-foreground sm:px-8">{emptyLabel}</p>
      </section>
    );
  }

  return (
    <section className="group/row py-4">
      <h2 className={`mb-3 px-4 text-lg font-bold sm:px-8 md:text-xl ${stickyTitle ? "sticky top-16 z-20 bg-background/95 py-2 backdrop-blur" : ""}`}>{title}</h2>
      <div className="relative">
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scroll(-1)}
          className="absolute left-1 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-background/70 p-2 opacity-0 backdrop-blur transition-opacity hover:bg-background group-hover/row:opacity-100 md:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div
          ref={scroller}
          className="scroll-row flex gap-3 overflow-x-auto px-4 pb-4 sm:gap-4 sm:px-8"
        >
          {movies.map((m, i) => (
            <MovieCard key={m.id} movie={m} priority={i < 4} />
          ))}
        </div>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scroll(1)}
          className="absolute right-1 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-background/70 p-2 opacity-0 backdrop-blur transition-opacity hover:bg-background group-hover/row:opacity-100 md:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
