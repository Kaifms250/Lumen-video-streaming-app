export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-card/30 py-10">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 sm:px-8 md:grid-cols-4">
        <div>
          <div className="text-lg font-black tracking-tight text-gradient-brand">LUMEN</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Cinematic streaming. Curated stories, delivered in premium quality.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold">Explore</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>New Releases</li>
            <li>Trending</li>
            <li>Documentaries</li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Company</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>About</li>
            <li>Careers</li>
            <li>Press</li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Legal</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>Terms</li>
            <li>Privacy</li>
            <li>Cookie Policy</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-[1400px] px-4 text-xs text-muted-foreground sm:px-8">
        © {new Date().getFullYear()} Lumen. All titles are fictional demonstrations.
      </div>
    </footer>
  );
}
