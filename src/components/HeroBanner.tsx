import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Plus, Check, Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { Movie } from "@/lib/types";
import { useMyList } from "@/hooks/useLocalCollections";

export function HeroBanner({ movies }: { movies: Movie[] }) {
  const [i, setI] = useState(0);
  const { ids, toggle } = useMyList();

  useEffect(() => {
    if (movies.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % movies.length), 8000);
    return () => clearInterval(t);
  }, [movies.length]);

  if (movies.length === 0) return null;
  const m = movies[i];
  const inList = ids.includes(m.id);

  return (
    <section className="relative h-[85vh] min-h-[520px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={m.id}
          src={m.backdrop}
          alt=""
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 hero-fade" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-4 pb-16 sm:px-8 md:pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
              Featured
            </div>
            <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              <span className="text-gradient-brand">{m.title}</span>
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>{m.year}</span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 text-primary" />
                {m.rating.toFixed(1)}
              </span>
              <span>{Math.floor(m.runtime / 60)}h {m.runtime % 60}m</span>
              <span className="rounded border border-border px-1.5 py-0.5 text-[10px] uppercase">HD</span>
              <span className="text-foreground">{m.genres.slice(0, 3).join(" · ")}</span>
            </div>
            <p className="mt-4 line-clamp-3 max-w-xl text-base text-muted-foreground md:text-lg">
              {m.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/watch/$id"
                params={{ id: m.id }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg transition hover:brightness-110"
              >
                <Play className="h-4 w-4 fill-current" /> Play
              </Link>
              <Link
                to="/movie/$id"
                params={{ id: m.id }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-6 py-3 text-sm font-bold text-foreground backdrop-blur transition hover:bg-card"
              >
                <Info className="h-4 w-4" /> More Info
              </Link>
              <button
                type="button"
                onClick={() => toggle(m.id)}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-3 text-sm font-bold text-foreground backdrop-blur transition hover:bg-card"
              >
                {inList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {inList ? "In My List" : "My List"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {movies.length > 1 && (
          <div className="mt-8 flex gap-1.5">
            {movies.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Featured slide ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-1 rounded-full transition-all ${idx === i ? "w-10 bg-primary" : "w-4 bg-white/30 hover:bg-white/60"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
