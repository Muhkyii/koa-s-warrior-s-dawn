import { useCallback, useEffect, useState } from "react";
import { integrations, type Integration } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Connectors() {
  const [list, setList] = useState<Integration[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const reload = useCallback(() => {
    integrations
      .list()
      .then(setList)
      .catch((e) => setErr(String(e)));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Connectors
        </CardTitle>
      </CardHeader>
      <CardContent>
        {err ? (
          <p className="text-sm text-destructive">{err}</p>
        ) : !list ? (
          <p className="text-sm text-muted-foreground">loading…</p>
        ) : list.length === 0 ? (
          <p className="text-sm text-muted-foreground">none configured</p>
        ) : (
          <ul className="-my-2 divide-y divide-border">
            {list.map((c) => (
              <ConnectorRow key={c.slug} c={c} onChange={reload} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function ConnectorRow({
  c,
  onChange,
}: {
  c: Integration;
  onChange: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setErr(null);
    try {
      await integrations.saveToken(c.slug, token.trim());
      setToken("");
      setEditing(false);
      onChange();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "save failed");
    } finally {
      setBusy(false);
    }
  }

  async function disconnect() {
    if (!confirm(`Disconnect ${c.label}?`)) return;
    setBusy(true);
    try {
      await integrations.disconnect(c.slug);
      onChange();
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={`h-2 w-2 rounded-full ${
              c.connected ? "bg-emerald-500" : "bg-muted-foreground/30"
            }`}
          />
          <span className="text-sm font-medium">{c.label}</span>
          {!c.connected && (
            <span className="text-xs text-muted-foreground">not connected</span>
          )}
        </div>
        <div className="flex gap-2">
          {c.connected ? (
            <Button
              variant="outline"
              size="sm"
              onClick={disconnect}
              disabled={busy}
            >
              disconnect
            </Button>
          ) : c.slug === "google_drive" ? (
            <span className="text-xs text-muted-foreground">
              configure on host
            </span>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing((v) => !v)}
            >
              {editing ? "cancel" : "connect"}
            </Button>
          )}
        </div>
      </div>
      {editing && !c.connected && (
        <div className="mt-2 flex gap-2">
          <Input
            type="password"
            placeholder={`paste your ${c.label} integration token`}
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Button
            size="sm"
            onClick={save}
            disabled={busy || !token.trim()}
          >
            save
          </Button>
        </div>
      )}
      {err && <p className="mt-2 text-xs text-destructive">{err}</p>}
    </li>
  );
}
