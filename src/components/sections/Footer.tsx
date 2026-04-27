export const Footer = () => (
  <footer className="border-t border-border/70 bg-background px-6 py-12">
    <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
      <div>
        <div className="text-xl font-bold text-foreground">koa</div>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
          koa is not a licensed therapist or financial advisor. for crisis support, call 988.
        </p>
      </div>
      <nav className="flex items-center gap-6 text-sm text-muted-foreground">
        <a href="#pricing" className="transition-colors hover:text-foreground">pricing</a>
        <a href="#faq" className="transition-colors hover:text-foreground">faq</a>
        <a href="#" className="transition-colors hover:text-foreground">privacy</a>
        <a href="#" className="transition-colors hover:text-foreground">terms</a>
      </nav>
    </div>
    <div className="mx-auto mt-8 max-w-6xl text-xs text-muted-foreground">
      © {new Date().getFullYear()} koa. made with care.
    </div>
  </footer>
);
