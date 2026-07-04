export function RowSkeleton({ title }: { title: string }) {
  return (
    <section className="py-4">
      <h2 className="mb-3 px-4 text-lg font-bold sm:px-8 md:text-xl">{title}</h2>
      <div className="flex gap-3 overflow-hidden px-4 pb-4 sm:gap-4 sm:px-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[2/3] w-[160px] shrink-0 animate-pulse rounded-xl bg-card sm:w-[190px] md:w-[210px]"
          />
        ))}
      </div>
    </section>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[85vh] min-h-[520px] w-full animate-pulse overflow-hidden bg-card">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[55vh] w-full bg-card" />
      <div className="mx-auto max-w-[1200px] space-y-4 p-8">
        <div className="h-10 w-2/3 rounded bg-card" />
        <div className="h-4 w-1/3 rounded bg-card" />
        <div className="h-24 w-full rounded bg-card" />
      </div>
    </div>
  );
}
