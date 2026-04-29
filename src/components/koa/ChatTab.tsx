import { useEffect, useState } from "react";
import { MessageCircle, ArrowUpRight } from "lucide-react";
import { UsageMeter } from "./UsageMeter";

const KOA_SMS = "sms:+17862847802";
const KOA_NUMBER_DISPLAY = "+1 (786) 284-7802";

const TAGLINES = [
  "Koa lives in your messages.",
  "Koa never forgets.",
  "Koa texts back.",
  "Koa locks you in.",
  "Koa is just a text away.",
];

export function ChatTab() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % TAGLINES.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--imessage))]/15">
          <MessageCircle className="h-6 w-6 text-[hsl(var(--imessage))]" />
        </div>
        <h2 className="font-serif-italic min-h-[3rem] text-2xl font-normal transition-opacity duration-500">
          {TAGLINES[i]}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Web chat is coming. For now, text Koa from your phone — same number,
          same memory, everywhere.
        </p>
        <a
          href={KOA_SMS}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--imessage))] px-5 py-2.5 text-sm font-medium text-white shadow-glow-cta transition-transform hover:scale-[1.02]"
        >
          Open iMessage
          <ArrowUpRight className="h-4 w-4" />
        </a>
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          {KOA_NUMBER_DISPLAY}
        </p>
      </section>

      <UsageMeter />
    </div>
  );
}
