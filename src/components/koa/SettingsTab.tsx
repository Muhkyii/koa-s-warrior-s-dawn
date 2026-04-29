import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { me, type Profile } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sun,
  Moon,
  ChevronDown,
  Phone,
  Mail,
  User,
  Globe,
  Check,
  Loader2,
} from "lucide-react";

export function SettingsTab() {
  return (
    <div className="space-y-10">
      <ProfileSection />
      <AppearanceSection />
      <SupportSection />
      <BillingSection />
    </div>
  );
}

// ─── Profile (editable + saves) ─────────────────────────────────────
const TIMEZONES: { value: string; label: string }[] = [
  { value: "America/New_York",    label: "Eastern Time (ET) — New York, Toronto, Miami" },
  { value: "America/Chicago",     label: "Central Time (CT) — Chicago, Dallas, Mexico City" },
  { value: "America/Denver",      label: "Mountain Time (MT) — Denver, Phoenix" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT) — Los Angeles, Seattle" },
  { value: "America/Anchorage",   label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu",    label: "Hawaii Time (HT)" },
  { value: "Europe/London",       label: "GMT / BST — London" },
  { value: "Europe/Paris",        label: "CET / CEST — Paris, Berlin, Madrid" },
  { value: "Europe/Athens",       label: "EET / EEST — Athens, Helsinki" },
  { value: "Asia/Dubai",          label: "GST — Dubai" },
  { value: "Asia/Kolkata",        label: "IST — Mumbai, Delhi" },
  { value: "Asia/Singapore",      label: "SGT — Singapore" },
  { value: "Asia/Tokyo",          label: "JST — Tokyo" },
  { value: "Australia/Sydney",    label: "AEST / AEDT — Sydney" },
];

function ProfileSection() {
  const [p, setP] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tz, setTz] = useState("America/New_York");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    me.profile().then((r) => {
      setP(r);
      setName(r.name ?? "");
      setEmail(r.email ?? "");
      if (r.timezone) setTz(r.timezone);
    });
  }, []);

  const dirty = p && (
    (name || "") !== (p.name ?? "") ||
    (email || "") !== (p.email ?? "") ||
    tz !== (p.timezone ?? "America/New_York")
  );

  async function save() {
    setBusy(true); setErr(null); setSaved(false);
    try {
      const updated = await me.update({ name, email, timezone: tz });
      setP(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="text-sm text-muted-foreground">
            Manage your profile information.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          disabled={!dirty || busy}
          onClick={save}
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> :
           saved ? <><Check className="mr-1 h-3.5 w-3.5" /> Saved</> :
           "Update"}
        </Button>
      </div>

      <div className="space-y-3">
        <Field icon={User} label="Name">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="border-0 bg-transparent pl-0 focus-visible:ring-0"
          />
        </Field>
        <Field icon={Phone} label="Phone">
          <Input
            value={p?.phone ?? ""}
            disabled
            className="border-0 bg-transparent pl-0 font-mono tabular-nums focus-visible:ring-0"
          />
        </Field>
        <Field icon={Mail} label="Email">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="border-0 bg-transparent pl-0 focus-visible:ring-0"
          />
        </Field>
        <Field icon={Globe} label="Timezone">
          <Select value={tz} onValueChange={setTz}>
            <SelectTrigger className="border-0 bg-transparent pl-0 focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {err && <p className="mt-2 text-xs text-destructive">{err}</p>}
      {p?.tier && (
        <p className="mt-3 text-xs text-muted-foreground">
          tier:{" "}
          <span className="font-mono uppercase tracking-wider">{p.tier}</span>
        </p>
      )}
    </section>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-3.5 py-2.5">
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

// ─── Appearance — real next-themes wiring ───────────────────────────
function AppearanceSection() {
  const { theme, setTheme } = useTheme();

  return (
    <section>
      <h2 className="text-xl font-semibold">Appearance</h2>
      <p className="text-sm text-muted-foreground">
        Choose your preferred theme.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <ThemeCard
          active={theme === "light"}
          onClick={() => setTheme("light")}
          icon={<Sun className="h-5 w-5" />}
          label="Light"
        />
        <ThemeCard
          active={theme === "dark"}
          onClick={() => setTheme("dark")}
          icon={<Moon className="h-5 w-5" />}
          label="Dark"
        />
      </div>
    </section>
  );
}

function ThemeCard({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border bg-surface/60 transition-colors ${
        active
          ? "border-[hsl(var(--amber))] text-foreground"
          : "border-border text-muted-foreground hover:bg-surface"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

// ─── Support ────────────────────────────────────────────────────────
function SupportSection() {
  const items = [
    {
      q: "Koa not responding?",
      a: "If you haven't gotten a reply in a while, your number may have changed. Press the alert at the top of this page to get a fresh number.",
    },
    {
      q: "Changed your phone number?",
      a: "Sign in here from the new number, then text Koa once — your old memory will follow as long as the email matches.",
    },
    {
      q: "Need help with something else?",
      a: "Email kznqedits@gmail.com or just text Koa — they'll route it.",
    },
  ];
  return (
    <section>
      <h2 className="text-xl font-semibold">Support</h2>
      <p className="text-sm text-muted-foreground">Get help with Koa.</p>
      <div className="mt-4 space-y-2">
        {items.map((it) => (
          <Faq key={it.q} q={it.q} a={it.a} />
        ))}
      </div>
    </section>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-surface/60">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium"
      >
        {q}
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <p className="px-4 pb-3 text-xs leading-relaxed text-muted-foreground">
          {a}
        </p>
      )}
    </div>
  );
}

// ─── Billing ────────────────────────────────────────────────────────
function BillingSection() {
  const [p, setP] = useState<Profile | null>(null);
  useEffect(() => {
    me.profile().then(setP).catch(() => {});
  }, []);

  const trialDaysLeft = p?.trial_ends_at
    ? Math.max(0, Math.ceil((p.trial_ends_at * 1000 - Date.now()) / 86_400_000))
    : null;

  return (
    <section>
      <h2 className="text-xl font-semibold">Billing</h2>
      <p className="text-sm text-muted-foreground">
        Get access to Koa and manage your plan.
      </p>
      <div className="mt-4 space-y-3">
        <div className="rounded-xl border border-border bg-surface/60 px-4 py-3">
          <p className="text-sm font-medium">
            {p?.tier === "trialing" && trialDaysLeft != null
              ? `${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"} left in trial`
              : p?.tier === "edge" || p?.tier === "hustle" || p?.tier === "personal"
              ? `${p.tier} plan — active`
              : "Free tier"}
          </p>
          <p className="text-xs text-muted-foreground">
            {p?.tier === "free"
              ? "25 messages/day. Upgrade to chat without limits."
              : p?.tier === "trialing"
              ? "Then $9.99, billed monthly."
              : "Renews automatically."}
          </p>
        </div>
        <Button
          className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
          disabled
        >
          Manage Subscription — coming soon
        </Button>
      </div>
    </section>
  );
}
