import heroImage from "@/assets/koa-hero.jpg";
import Petals from "@/components/Petals";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Hero background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Glowing katana embedded in a mossy stone beside an ancient koa tree, with a torii gate fading into fog"
          width={1920}
          height={1080}
          className="h-full w-full object-cover animate-fade-in"
        />
        {/* Atmospheric overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.7)_85%)]" />
      </div>

      {/* Floating sakura petals */}
      <Petals count={28} />

      {/* Nav */}
      <header className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12 md:py-8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-8 w-[2px] bg-gradient-gold shadow-gold animate-pulse-glow" />
          </div>
          <span className="font-display text-2xl tracking-[0.3em] text-ghost">KOA</span>
        </div>
        <nav className="hidden items-center gap-10 text-sm text-muted-foreground md:flex">
          <a href="#craft" className="transition-colors hover:text-gold">Craft</a>
          <a href="#code" className="transition-colors hover:text-gold">Code</a>
          <a href="#summon" className="transition-colors hover:text-gold">Summon</a>
        </nav>
        <Button variant="outline" size="sm" className="border-gold/40 bg-transparent text-ghost hover:bg-gold/10 hover:text-gold">
          Enter
        </Button>
      </header>

      {/* Hero content */}
      <main className="relative z-10 flex min-h-[calc(100vh-120px)] items-end px-6 pb-20 md:px-12 md:pb-32">
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-2xl animate-fade-up">
            <div className="mb-6 inline-flex items-center gap-2 border border-gold/30 bg-background/40 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em] text-gold backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              <span>Hawaiian · Warrior</span>
            </div>

            <h1 className="font-display text-6xl font-light leading-[0.95] tracking-tight text-ghost md:text-8xl">
              The blade
              <br />
              <span className="italic text-gold" style={{ textShadow: "0 0 40px hsl(var(--gold-glow) / 0.5)" }}>
                answers
              </span>
              <br />
              only to you.
            </h1>

            <p className="mt-8 max-w-lg font-sans text-lg leading-relaxed text-muted-foreground">
              Koa is a personal AI assistant forged with the discipline of a warrior.
              Loyal. Focused. Relentless. Pull the sword from the stone — and begin.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button size="lg" className="group bg-gradient-gold text-primary-foreground shadow-gold transition-smooth hover:shadow-[0_0_100px_-5px_hsl(var(--gold-glow)/0.8)]">
                Draw the sword
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="ghost" size="lg" className="text-ghost hover:bg-ghost/5 hover:text-gold">
                Witness Koa
              </Button>
            </div>

            {/* Quiet credentials row */}
            <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <span>01 — Discipline</span>
              <span className="text-gold/60">02 — Loyalty</span>
              <span>03 — Precision</span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom fog gradient */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />

      {/* Side vertical mark */}
      <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 rotate-90 font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground md:block">
        Koa · MMXXVI
      </div>
    </div>
  );
};

export default Index;
