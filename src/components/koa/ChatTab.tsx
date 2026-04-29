import { MessageCircle, ArrowUpRight } from "lucide-react";
import { UsageMeter } from "./UsageMeter";

const KOA_SMS = "sms:+14157700232";
const KOA_NUMBER_DISPLAY = "+1 (415) 770-0232";

export function ChatTab() {
  return (
    <div className="space-y-6">
      {/* Hero — text Koa CTA */}
      <section className="rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--imessage))]/15">
          <MessageCircle className="h-6 w-6 text-[hsl(var(--imessage))]" />
        </div>
        <h2 className="font-serif-italic text-2xl font-normal">
          Koa lives in your messages.
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

      {/* Usage meter — kept exactly like the user liked it */}
      <UsageMeter />
    </div>
  );
}
