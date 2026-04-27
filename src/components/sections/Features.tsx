import { Camera, Brain, Zap } from "lucide-react";
import { Section } from "@/components/Section";

const items = [
  {
    icon: Camera,
    title: "reads everything",
    body: "photos, voice notes, links. responds in voice.",
  },
  {
    icon: Brain,
    title: "remembers your life",
    body: "your goals, your patterns, what you said last tuesday.",
  },
  {
    icon: Zap,
    title: "takes action",
    body: "sets reminders, logs trades, drafts emails.",
  },
];

export const Features = () => (
  <Section className="px-6 py-24 sm:py-32">
    <div className="mx-auto max-w-5xl">
      <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        what koa actually does
      </h2>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {items.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded-3xl border border-border/70 bg-surface p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-primary-deep">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </div>
  </Section>
);
