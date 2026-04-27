import { Section } from "@/components/Section";

const items = [
  { emoji: "🚗", title: "gig workers", line: '"yo it\'s almost 4pm, you hitting the road?"' },
  { emoji: "📊", title: "traders", line: '"5 ai agents only ping when they all agree"' },
  { emoji: "🚀", title: "founders", line: '"you said you\'d ship today. did you?"' },
  { emoji: "👋", title: "everyone else", line: '"the friend who remembers + roasts when you slack"' },
];

export const Audiences = () => (
  <Section className="px-6 py-24 sm:py-32">
    <div className="mx-auto max-w-5xl">
      <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        who's koa for
      </h2>
      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {items.map((i) => (
          <div
            key={i.title}
            className="rounded-3xl border border-border/70 bg-surface p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
          >
            <div className="text-3xl">{i.emoji}</div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">{i.title}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{i.line}</p>
          </div>
        ))}
      </div>
    </div>
  </Section>
);
