import { useEffect, useState } from "react";
import { me, type Usage } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function UsageMeter() {
  const [u, setU] = useState<Usage | null>(null);

  useEffect(() => {
    me.usage().then(setU).catch(() => {});
  }, []);

  if (!u) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span>Today's usage</span>
          <Badge variant="outline" className="font-mono uppercase tracking-wider">
            {u.tier}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {u.unlimited ? (
          <>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold tabular-nums">{u.used}</span>
              <span className="text-sm text-emerald-500">unlimited</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {u.tier === "trialing" && u.trial_ends_at
                ? `trial runs through ${new Date(u.trial_ends_at * 1000).toLocaleDateString()}`
                : "no daily cap on your tier"}
            </p>
          </>
        ) : (
          <>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold tabular-nums">
                {u.used}
                <span className="ml-1 text-sm font-normal text-muted-foreground">
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
              <p className="text-xs text-destructive">
                cap reached — upgrade to keep texting today
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
