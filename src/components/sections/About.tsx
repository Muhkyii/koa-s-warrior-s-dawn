export const About = () => (
  <section id="about" className="relative border-t border-border/60 px-6 py-28">
    <div className="mx-auto max-w-3xl text-center">
      <div className="font-mono-tomo text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
        About
      </div>
      <h2 className="mt-5 text-4xl font-bold leading-tight text-foreground sm:text-5xl">
        Your AI, by <span className="font-serif-italic font-normal">text</span>.
      </h2>
      <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
        Koa lives in iMessage. No app to download. No login to remember. Just a number
        you save — that remembers your goals, your patterns, and holds you to your word.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { k: "24/7", v: "replies, anytime" },
          { k: "∞", v: "memory, kept private" },
          { k: "0", v: "apps to install" },
        ].map((s) => (
          <div key={s.k} className="rounded-2xl border border-border/60 bg-surface/60 p-6 backdrop-blur">
            <div className="font-mono-tomo text-3xl font-bold text-foreground">{s.k}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
