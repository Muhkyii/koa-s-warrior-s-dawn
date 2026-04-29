import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { me, auth, type Profile } from "@/lib/api";
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
  CreditCard,
  Sparkles,
  Trash2,
  Clock,
} from "lucide-react";

// Pull a clean error string out of anything thrown.
function errToString(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  if (e && typeof e === "object") {
    const obj = e as Record<string, unknown>;
    if (typeof obj.detail === "string") return obj.detail;
    if (typeof obj.message === "string") return obj.message;
    try { return JSON.stringify(e); } catch { /* fall through */ }
  }
  return "Something went wrong.";
}

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

  useEffect(() => {
    me.profile().then((r) => {
      setP(r);
      setName(r.name ?? "");
      setEmail(r.email ?? "");
      if (r.timezone) setTz(r.timezone);
    }).catch((e) => toast.error(errToString(e)));
  }, []);

  const dirty = !!p && (
    (name || "") !== (p.name ?? "") ||
    (email || "") !== (p.email ?? "") ||
    tz !== (p.timezone ?? "America/New_York")
  );

  async function save() {
    setBusy(true); setSaved(false);
    try {
      const updated = await me.update({ name, email, timezone: tz });
      setP(updated);
      setSaved(true);
      toast.success("Profile updated");
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      toast.error(errToString(e));
    } finally {
      setBusy(false);
    }
  }

  let updateLabel: React.ReactNode = "Update";
  if (busy) updateLabel = <Loader2 className="h-3.5 w-3.5 animate-spin" />;
  else if (saved) updateLabel = (
    <span className="flex items-center gap-1">
      <Check className="h-3.5 w-3.5" /> Saved
    </span>
  );

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
          {updateLabel}
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

// ─── Appearance ─────────────────────────────────────────────────────
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

// ─── Billing — Tomo-style Manage Subscription dropdown ──────────────
function BillingSection() {
  const [p, setP] = useState<Profile | null>(null);
  const [open, setOpen] = useState(false);

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
        <PlanStatusCard profile={p} trialDaysLeft={trialDaysLeft} />

        <div className="overflow-hidden rounded-2xl border border-border bg-surface/40">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-medium hover:bg-surface/60"
          >
            <span>Manage Subscription</span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div className="border-t border-border bg-background/40">
              <ManageOption
                icon={Sparkles}
                title="Upgrade plan"
                subtitle="Unlock unlimited messages + premium features."
                ctaLabel="See plans"
                disabled
                comingSoon
              />
              <div className="mx-4 h-px bg-border" />
              <ManageOption
                icon={CreditCard}
                title="Update payment"
                subtitle="Manage your card and billing details via Stripe."
                ctaLabel="Open billing portal"
                disabled
                comingSoon
              />
              <div className="mx-4 h-px bg-border" />
              <CancelOption
                isTrialing={p?.tier === "trialing"}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PlanStatusCard({
  profile,
  trialDaysLeft,
}: {
  profile: Profile | null;
  trialDaysLeft: number | null;
}) {
  if (!profile) {
    return (
      <div className="rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-muted-foreground">
        loading…
      </div>
    );
  }

  const isTrialing = profile.tier === "trialing" && trialDaysLeft != null;
  const isPaid = profile.tier === "edge" || profile.tier === "hustle" ||
                 profile.tier === "personal";

  let title: string;
  let subtitle: string;
  let accent: string;

  if (isTrialing) {
    title = `${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"} left in trial`;
    subtitle = "Then $9.99, billed monthly.";
    accent = trialDaysLeft! <= 1 ? "border-[hsl(var(--amber))]/60" : "border-border";
  } else if (isPaid) {
    title = `${profile.tier} plan — active`;
    subtitle = "Renews automatically.";
    accent = "border-emerald-500/40";
  } else {
    title = "Free tier";
    subtitle = "25 messages/day. Upgrade to chat without limits.";
    accent = "border-border";
  }

  return (
    <div className={`rounded-xl border bg-surface/60 px-4 py-3.5 ${accent}`}>
      <div className="flex items-center gap-2.5">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm font-medium">{title}</p>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function ManageOption({
  icon: Icon,
  title,
  subtitle,
  ctaLabel,
  disabled,
  comingSoon,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  ctaLabel: string;
  disabled?: boolean;
  comingSoon?: boolean;
  onClick?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface/60">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </span>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="shrink-0 rounded-full"
        disabled={disabled}
        onClick={onClick}
      >
        {comingSoon ? "Soon" : ctaLabel}
      </Button>
    </div>
  );
}

const CANCEL_REASONS = [
  { value: "too_expensive",  label: "Too expensive" },
  { value: "not_using",      label: "I'm not using it enough" },
  { value: "switching",      label: "Switching to a different product" },
  { value: "missing_feature",label: "Missing a feature I need" },
  { value: "privacy",        label: "Privacy concerns" },
  { value: "just_trying",    label: "Just trying it out" },
  { value: "other",          label: "Other" },
] as const;

function CancelOption({ isTrialing }: { isTrialing: boolean }) {
  const [step, setStep] = useState<"closed" | "form" | "confirm">("closed");
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);

  async function performDelete() {
    if (!reason) return;
    setBusy(true);
    try {
      await me.delete(reason, details);
      auth.logout();
      toast.success("Account deleted");
      window.location.href = "/";
    } catch (e) {
      toast.error(errToString(e));
    } finally {
      setBusy(false);
    }
  }

  if (step === "closed") {
    return (
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/15">
            <Trash2 className="h-4 w-4 text-destructive" />
          </span>
          <div>
            <p className="text-sm font-medium">
              {isTrialing ? "Cancel trial" : "Delete account"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isTrialing
                ? "Stop your trial and wipe your account."
                : "Permanently wipe your profile and bot memory."}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="shrink-0 rounded-full border-destructive/40 text-destructive hover:bg-destructive/10"
          onClick={() => setStep("form")}
        >
          {isTrialing ? "Cancel" : "Delete"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 border-t border-border bg-destructive/5 px-4 py-4">
      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <Trash2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
        <p>
          Quick check-in before you go: why are you{" "}
          {isTrialing ? "cancelling" : "deleting"}? Helps us improve.
        </p>
      </div>

      <Select value={reason} onValueChange={setReason}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a reason" />
        </SelectTrigger>
        <SelectContent>
          {CANCEL_REASONS.map((r) => (
            <SelectItem key={r.value} value={r.value}>
              {r.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {reason === "other" && (
        <textarea
          placeholder="Tell us more (optional)"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      )}

      <div className="flex items-center justify-between gap-2 pt-1">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full"
          onClick={() => {
            setStep("closed");
            setReason("");
            setDetails("");
          }}
          disabled={busy}
        >
          Never mind
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="rounded-full"
          onClick={performDelete}
          disabled={!reason || busy}
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : (
            isTrialing ? "Cancel trial" : "Delete account"
          )}
        </Button>
      </div>
    </div>
  );
}
