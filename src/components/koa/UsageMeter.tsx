import { useEffect, useState } from "react";
import { me, type Usage } from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function UsageMeter() {
  const [u, setU] = useState<Usage | null>(null);

  useEffect(() => {
    me.usage().then(setU).catch(() => {});
  }, []);

  if (!u) return null;

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Today's usage
        </h3>
        <Badge
          variant="outline"
          className="rounded-full border-border/70 bg-surface/60 font-mono uppercase tracking-wider text-foreground"
        >
          {u.tier}
        </Badge>
      </div>

      {u.unlimited ? (
        <>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-semibold tabular-nums">
              {u.used}
            </span>
            <span className="text-sm text-emerald-400">unlimited</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {u.tier === "trialing" && u.trial_ends_at
              ? `trial runs through ${new Date(u.trial_ends_at * 1000).toLocaleDateString()}`
              : "no daily cap on your tier"}
          </p>
        </>
      ) : (
        <>
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-3xl font-semibold tabular-nums">
              {u.used}
              <span className="ml-1 text-base font-normal text-muted-foreground">
                / {u.limit}
              </span>
            </span>
            <span className="text-xs text-muted-foreground">
              resets midnight UTC
            </span>
          </div>
          <Progress
            value={u.limit > 0 ? Math.min(100, (u.used / u.limit) * 100) : 0}
          />
          {u.used >= u.limit && (
            <p className="mt-2 text-xs text-destructive">
              cap reached — upgrade to keep texting today
            </p>
          )}
        </>
      )}
    </section>
  );
}
