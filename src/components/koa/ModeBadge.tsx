import { useEffect, useState } from "react";
import { me, type ModeState } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const TONE: Record<NonNullable<ModeState["mode"]>, string> = {
  crisis:  "bg-destructive text-destructive-foreground hover:bg-destructive",
  onboard: "bg-[hsl(var(--amber))] text-black",
  trader:  "bg-blue-500 text-white",
  utility: "bg-emerald-500 text-white",
  casual:  "bg-muted text-muted-foreground",
  venting: "bg-purple-500 text-white",
};

export function ModeBadge() {
  const [m, setM] = useState<ModeState | null>(null);

  useEffect(() => {
    let alive = true;
    const tick = () =>
      me.mode().then((x) => alive && setM(x)).catch(() => {});
    tick();
    const t = setInterval(tick, 10_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  if (!m) return null;

  const label = m.mode ?? "idle";
  const cls = m.mode ? TONE[m.mode] : "bg-muted text-muted-foreground";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge className={`font-mono uppercase tracking-wider ${cls}`}>
          {label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        {m.reason ?? "no recent classification"}
        {m.crisis_lock_active && m.crisis_lock_expires_at && (
          <div className="mt-1 text-xs opacity-75">
            lock lifts at{" "}
            {new Date(m.crisis_lock_expires_at * 1000).toLocaleTimeString()}
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
