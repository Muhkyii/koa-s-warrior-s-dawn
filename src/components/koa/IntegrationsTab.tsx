import { useCallback, useEffect, useState } from "react";
import { integrations, type Integration } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Check,
  Plus,
  Lock,
} from "lucide-react";
import {
  NotionIcon,
  TodoistIcon,
  GmailIcon,
  GoogleCalendarIcon,
  GoogleDriveIcon,
  OutlookIcon,
  StravaIcon,
  OuraIcon,
  BankIcon,
} from "./BrandIcons";

type IconCmp = React.ComponentType<{ className?: string }>;

// Visual catalog — what cards to show. Some slugs are "live" (backed by
// real connectors); others are "coming" (visual-only placeholders so the
// dashboard feels complete like Tomo's). Live ones merge with the API.

type CatalogEntry = {
  slug: string;
  label: string;
  description: string;
  icon: IconCmp;
  iconBg: string;
  beta?: boolean;
  status: "live" | "coming";
};

type Section = { title: string; entries: CatalogEntry[] };

const CATALOG: Section[] = [
  {
    title: "Productivity",
    entries: [
      { slug: "gmail",           label: "Gmail",           description: "Let Koa read & draft your emails.",  icon: GmailIcon,          iconBg: "bg-white",                   status: "coming" },
      { slug: "google_calendar", label: "Google Calendar", description: "Let Koa help with calendar.",         icon: GoogleCalendarIcon, iconBg: "bg-white",                   status: "coming" },
      { slug: "google_drive",    label: "Google Drive",    description: "Let Koa help with files.",            icon: GoogleDriveIcon,    iconBg: "bg-white",                   status: "live" },
      { slug: "outlook",         label: "Outlook",         description: "Let Koa help with emails / calendar.",icon: OutlookIcon,        iconBg: "bg-white",        beta: true, status: "coming" },
      { slug: "notion",          label: "Notion",          description: "Let Koa read your pages.",            icon: NotionIcon,         iconBg: "bg-white text-black",          beta: true, status: "live" },
      { slug: "todoist",         label: "Todoist",         description: "Let Koa help with tasks.",            icon: TodoistIcon,        iconBg: "bg-[#E44332] text-white",                  status: "live" },
    ],
  },
  {
    title: "Health",
    entries: [
      { slug: "strava",          label: "Strava",          description: "Let Koa track your fitness.",        icon: StravaIcon,         iconBg: "bg-white",                  beta: true, status: "coming" },
      { slug: "oura",            label: "Oura",            description: "Let Koa track your health.",         icon: OuraIcon,           iconBg: "bg-white text-black",        beta: true, status: "coming" },
    ],
  },
  {
    title: "Finance",
    badge: "BETA",
    entries: [
      { slug: "bank",            label: "Connect new bank", description: "Let Koa watch your money.",          icon: BankIcon,           iconBg: "bg-emerald-500/15 text-emerald-400",          status: "coming" },
    ],
  } as Section & { badge?: string },
];

export function IntegrationsTab() {
  const [live, setLive] = useState<Record<string, Integration> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const reload = useCallback(() => {
    integrations
      .list()
      .then((rows) => {
        const m: Record<string, Integration> = {};
        rows.forEach((r) => (m[r.slug] = r));
        setLive(m);
      })
      .catch((e) => setErr(String(e)));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-sm font-medium text-muted-foreground">
          Connect your accounts.
        </h2>
        {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
      </div>

      {CATALOG.map((section) => (
        <section key={section.title} className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {section.title}
            </h3>
            {(section as { badge?: string }).badge && (
              <span className="rounded-md bg-purple-500/30 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-purple-200">
                {(section as { badge?: string }).badge}
              </span>
            )}
          </div>
          <div className="space-y-2">
            {section.entries.map((e) => (
              <ConnectorCard
                key={e.slug}
                entry={e}
                liveState={live?.[e.slug]}
                onChange={reload}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ConnectorCard({
  entry,
  liveState,
  onChange,
}: {
  entry: CatalogEntry;
  liveState?: Integration;
  onChange: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const Icon = entry.icon;
  const connected = liveState?.connected ?? false;

  async function save() {
    setBusy(true);
    setErr(null);
    try {
      await integrations.saveToken(entry.slug, token.trim());
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
    if (!confirm(`Disconnect ${entry.label}?`)) return;
    setBusy(true);
    try {
      await integrations.disconnect(entry.slug);
      onChange();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface/60 px-4 py-3.5 transition-colors hover:bg-surface">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${entry.iconBg}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{entry.label}</span>
            {entry.beta && (
              <span className="rounded-md bg-purple-500/30 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-purple-200">
                Beta
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{entry.description}</p>
        </div>
        <ActionButton
          entry={entry}
          connected={connected}
          editing={editing}
          onConnect={() => setEditing((v) => !v)}
          onDisconnect={disconnect}
          busy={busy}
        />
      </div>
      {editing && entry.status === "live" && !connected && (
        <div className="mt-3 flex gap-2">
          <Input
            type="password"
            placeholder={`paste your ${entry.label} integration token`}
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Button size="sm" onClick={save} disabled={busy || !token.trim()}>
            save
          </Button>
        </div>
      )}
      {err && <p className="mt-2 text-xs text-destructive">{err}</p>}
    </div>
  );
}

function ActionButton({
  entry,
  connected,
  editing,
  onConnect,
  onDisconnect,
  busy,
}: {
  entry: CatalogEntry;
  connected: boolean;
  editing: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  busy: boolean;
}) {
  if (entry.status === "coming") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border/70 bg-background/40 px-3 py-1 text-[11px] font-medium text-muted-foreground">
        <Lock className="h-3 w-3" />
        soon
      </span>
    );
  }
  if (connected) {
    return (
      <button
        onClick={onDisconnect}
        disabled={busy}
        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-[12px] font-medium text-emerald-400 hover:bg-emerald-500/25"
      >
        <Check className="h-3 w-3" />
        Connected
      </button>
    );
  }
  if (entry.slug === "google_drive") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border/70 bg-background/40 px-3 py-1 text-[11px] font-medium text-muted-foreground">
        configure on host
      </span>
    );
  }
  return (
    <button
      onClick={onConnect}
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-background/40 px-3 py-1 text-[12px] font-medium text-foreground hover:bg-background/70"
    >
      <Plus className="h-3 w-3" />
      {editing ? "cancel" : "Connect"}
    </button>
  );
}
