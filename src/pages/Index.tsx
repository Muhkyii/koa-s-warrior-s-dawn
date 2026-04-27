import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { Footer } from "@/components/sections/Footer";
import { ThreeBackground } from "@/components/ThreeBackground";
import { About } from "@/components/sections/About";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";

const Index = () => {
  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans text-foreground">
      {/* top alert banner */}
      <div className="relative z-20 w-full border-b border-border/60 bg-surface-warm">
        <a
          href="sms:+14157700232"
          className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-6 py-2.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[hsl(var(--amber))]" />
          <span>Koa not responding?</span>
          <span className="underline underline-offset-4">Press here for a new number.</span>
        </a>
      </div>

      <div className="relative">
        <ThreeBackground />
        <div className="relative z-10">
          <Nav />
          <main className="mx-auto flex w-full max-w-3xl flex-col items-center">
            <Hero />
          </main>
        </div>
      </div>

      <About />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
