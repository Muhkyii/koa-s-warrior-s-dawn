import { MessageSquare, Mail } from "lucide-react";

export const Contact = () => (
  <section id="contact" className="relative border-t border-border/60 px-6 py-28">
    <div className="mx-auto max-w-3xl text-center">
      <div className="font-mono-tomo text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
        Contact
      </div>
      <h2 className="mt-5 text-4xl font-bold leading-tight text-foreground sm:text-5xl">
        Talk to a human.
      </h2>
      <p className="mx-auto mt-5 max-w-lg text-muted-foreground">
        Real person, real reply. Usually within a few hours.
      </p>
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href="sms:+17862847802?&body=hey%20koa%20team"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow-cta transition-transform hover:-translate-y-0.5"
        >
          <MessageSquare className="h-4 w-4" />
          Text us
        </a>
        <a
          href="mailto:hey@koa.ai"
          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/60 px-6 py-3 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-surface"
        >
          <Mail className="h-4 w-4" />
          hey@koa.ai
        </a>
      </div>
    </div>
  </section>
);
