import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play, Info, Star, Clock } from "lucide-react";
import type { Movie } from "@/lib/types";

function fmtRuntime(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

export function MovieCard({ movie, priority = false }: { movie: Movie; priority?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.04 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative aspect-[2/3] w-[160px] shrink-0 overflow-hidden rounded-xl bg-card shadow-md sm:w-[190px] md:w-[210px]"
      style={{ scrollSnapAlign: "start" }}
    >
      <Link
        to="/movie/$id"
        params={{ id: movie.id }}
        className="absolute inset-0 block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <img
          src={movie.poster}
          alt={movie.title}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-90 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="line-clamp-1 text-sm font-semibold">{movie.title}</div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>{movie.year}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{fmtRuntime(movie.runtime)}</span>
            <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 text-primary" />{movie.rating.toFixed(1)}</span>
          </div>
          <div className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">
            {movie.genres.slice(0, 3).join(" · ")}
          </div>

          <div className="mt-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Link
              to="/watch/$id"
              params={{ id: movie.id }}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow hover:brightness-110"
            >
              <Play className="h-3 w-3 fill-current" /> Play
            </Link>
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
              <Info className="h-3 w-3" /> Info
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
