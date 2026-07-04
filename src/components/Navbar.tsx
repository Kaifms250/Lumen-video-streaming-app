import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Film, Bookmark, Home } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate({ to: "/browse", search: { q: q.trim(), genre: undefined } });
  };

  const linkCls = (active: boolean) =>
    `text-sm font-medium transition-colors ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-nav" : "bg-gradient-to-b from-background/70 to-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:gap-8 sm:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <Film className="h-6 w-6 text-primary" />
          <span className="text-lg font-black tracking-tight text-gradient-brand">LUMEN</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className={linkCls(pathname === "/")}>Home</Link>
          <Link
            to="/browse"
            search={{ q: undefined, genre: undefined }}
            className={linkCls(pathname.startsWith("/browse"))}
          >
            Browse
          </Link>
          <Link
            to="/browse"
            search={{ q: undefined, genre: "my-list" }}
            className={linkCls(false)}
          >
            My List
          </Link>
        </div>

        <form onSubmit={submit} className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2">
          <label className="relative flex w-full max-w-xs items-center">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search titles, genres, cast…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-9 w-full min-w-0 rounded-full border border-border bg-card/60 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring"
            />
          </label>
        </form>

        <div className="flex items-center gap-1 md:hidden">
          <Link to="/" aria-label="Home"><Home className="h-5 w-5" /></Link>
          <Link to="/browse" search={{ q: undefined, genre: "my-list" }} aria-label="My List">
            <Bookmark className="h-5 w-5" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
