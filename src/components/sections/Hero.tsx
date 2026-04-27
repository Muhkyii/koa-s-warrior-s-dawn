import { ArrowRight } from "lucide-react";
import { ChatMockup } from "@/components/ChatMockup";

export const Hero = () => {
  return (
    <section id="top" className="relative px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-accent-soft px-4 py-1.5 text-sm text-primary-deep">
          <span>🌿</span>
          <span>your homie in iMessage</span>
        </div>

        <h1 className="mt-7 text-[44px] font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl">
          the friend in your phone
          <br className="hidden sm:block" />{" "}
          who actually keeps it real
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-[17px]">
          koa lives in your texts. holds you to your word. remembers your life.
          tells you when you're slacking — but in a way that doesn't feel like a bot.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3">
          <a
            href="#cta"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-medium text-primary-foreground shadow-card transition-all hover:-translate-y-0.5 hover:bg-primary-deep hover:shadow-lift"
          >
            start your trial — free for 7 days
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <p className="text-sm text-muted-foreground">no credit card. cancel anytime.</p>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-md">
        <ChatMockup />
      </div>
    </section>
  );
};
