import { Check } from "lucide-react";
import { Section } from "@/components/Section";

const plans = [
  {
    name: "personal",
    price: "$19",
    blurb: "iMessage. memory + accountability. start with 7-day trial.",
    popular: false,
  },
  {
    name: "power-user",
    price: "$59",
    blurb: "adds telegram, signal feed, trading tools, auto-execute.",
    popular: true,
  },
  {
    name: "edge",
    price: "$99",
    blurb: "all three channels. save $38 vs separate.",
    popular: false,
  },
];

export const Pricing = () => (
  <Section id="pricing" className="bg-surface-warm px-6 py-24 sm:py-32">
    <div className="mx-auto max-w-6xl">
      <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        simple pricing
      </h2>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative rounded-3xl border bg-surface p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift ${
              p.popular ? "border-primary/50 ring-1 ring-primary/20" : "border-border/70"
            }`}
          >
            {p.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-soft">
                most popular
              </div>
            )}
            <h3 className="text-lg font-semibold text-foreground">{p.name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl font-bold tracking-tight text-foreground">{p.price}</span>
              <span className="text-muted-foreground">/mo</span>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{p.blurb}</p>
            <a
              href="#cta"
              className={`mt-7 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-all hover:-translate-y-0.5 ${
                p.popular
                  ? "bg-primary text-primary-foreground hover:bg-primary-deep shadow-card"
                  : "border border-border bg-background text-foreground hover:border-foreground/30"
              }`}
            >
              get {p.name}
            </a>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-md text-center text-sm text-muted-foreground">
        real life coach: $200/hr. or $19/mo for koa 24/7.
      </p>
    </div>
  </Section>
);
