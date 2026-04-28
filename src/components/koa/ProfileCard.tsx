import { useEffect, useState } from "react";
import { me, type Profile } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ProfileCard() {
  const [p, setP] = useState<Profile | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    me.profile().then(setP).catch((e) => setErr(String(e)));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        {err ? (
          <p className="text-sm text-destructive">{err}</p>
        ) : !p ? (
          <p className="text-sm text-muted-foreground">loading…</p>
        ) : (
          <dl className="grid grid-cols-[100px_1fr] gap-y-2.5 text-sm">
            <dt className="text-muted-foreground">name</dt>
            <dd>{p.name ?? "—"}</dd>
            <dt className="text-muted-foreground">phone</dt>
            <dd className="font-mono tabular-nums">{p.phone ?? "—"}</dd>
            <dt className="text-muted-foreground">email</dt>
            <dd className="break-all">{p.email ?? "—"}</dd>
            <dt className="text-muted-foreground">tier</dt>
            <dd>
              <TierBadge tier={p.tier} status={p.subscription_status} />
            </dd>
            {p.trial_ends_at && (
              <>
                <dt className="text-muted-foreground">trial ends</dt>
                <dd>{new Date(p.trial_ends_at * 1000).toLocaleDateString()}</dd>
              </>
            )}
          </dl>
        )}
      </CardContent>
    </Card>
  );
}

function TierBadge({
  tier,
  status,
}: {
  tier: Profile["tier"];
  status: string | null;
}) {
  const t = tier ?? "free";
  const variant: "default" | "secondary" | "outline" =
    t === "edge" || t === "hustle" ? "default" :
    t === "personal" || t === "trialing" ? "secondary" : "outline";
  return (
    <Badge variant={variant} className="font-mono uppercase tracking-wider">
      {t}
      {status && status !== "active" && (
        <span className="ml-1 opacity-70">· {status}</span>
      )}
    </Badge>
  );
}
