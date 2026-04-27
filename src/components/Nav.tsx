import { useEffect, useState } from "react";

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-background/85 backdrop-blur-md transition-colors ${
        scrolled ? "border-b border-border/70" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="text-xl font-bold tracking-tight text-foreground">
          koa
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground sm:flex">
          <a href="#pricing" className="transition-colors hover:text-foreground">pricing</a>
          <a href="#faq" className="transition-colors hover:text-foreground">faq</a>
        </nav>
        <a
          href="#cta"
          className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:bg-primary-deep"
        >
          start free
        </a>
      </div>
    </header>
  );
};
