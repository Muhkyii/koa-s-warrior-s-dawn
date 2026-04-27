import { ArrowRight } from "lucide-react";
import { Section } from "@/components/Section";

export const FinalCTA = () => (
  <Section id="cta" className="bg-surface-warm px-6 py-28 sm:py-36">
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        stop scrolling.<br />start texting koa.
      </h2>
      <div className="mt-10">
        <a
          href="#"
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-card transition-all hover:-translate-y-0.5 hover:bg-primary-deep hover:shadow-lift"
        >
          start free
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        your warrior in your pocket. koa is hawaiian for warrior.
      </p>
    </div>
  </Section>
);
