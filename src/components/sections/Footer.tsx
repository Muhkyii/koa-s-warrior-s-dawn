export const Footer = () => (
  <footer className="relative w-full border-t border-border/60 px-6 py-8">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-[13px] text-muted-foreground sm:flex-row">
      <div className="font-mono-tomo text-foreground">Koa</div>
      <nav className="flex flex-wrap items-center justify-center gap-5">
        <a href="#about" className="transition-colors hover:text-foreground">About</a>
        <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
        <a href="#contact" className="transition-colors hover:text-foreground">Contact</a>
        <a href="mailto:careers@koa.ai" className="transition-colors hover:text-foreground">Careers</a>
        <a href="#" className="transition-colors hover:text-foreground">Terms</a>
        <a href="#" className="transition-colors hover:text-foreground">Privacy</a>
      </nav>
    </div>
  </footer>
);
