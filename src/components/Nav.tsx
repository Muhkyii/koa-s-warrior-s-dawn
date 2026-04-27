export const Nav = () => {
  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href="#top" className="font-mono-tomo text-[22px] font-medium text-foreground">
          Koa
        </a>

        <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-surface/60 py-1 pl-1 pr-4 text-[13px] text-muted-foreground sm:flex">
          <div className="flex -space-x-2">
            <span className="h-7 w-7 rounded-full border border-border bg-[hsl(var(--amber))]/70" />
            <span className="h-7 w-7 rounded-full border border-border bg-[hsl(var(--imessage))]/60" />
          </div>
          <span>Trusted by 12,000+ people locking in today.</span>
        </div>

        <a
          href="#top"
          className="rounded-full border border-border/70 bg-surface/60 px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-surface"
        >
          Login
        </a>
      </div>
    </header>
  );
};
