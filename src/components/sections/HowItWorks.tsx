import { Section } from "@/components/Section";

const steps = [
  { n: "1", title: "text the number", body: "a real iMessage thread starts, not an app." },
  { n: "2", title: "koa learns who you are", body: "through normal conversation, not a survey." },
  { n: "3", title: "you start using it", body: "tools unlock as you need them." },
];

export const HowItWorks = () => (
  <Section className="bg-surface-warm px-6 py-24 sm:py-32">
    <div className="mx-auto max-w-5xl">
      <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        how it works
      </h2>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div
            key={s.n}
            className="rounded-3xl border border-border/60 bg-surface p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-base font-semibold text-primary-deep">
              {s.n}
            </div>
            <h3 className="mt-5 text-lg font-semibold text-foreground">{s.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  </Section>
);
