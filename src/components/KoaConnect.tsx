// KoaConnect.tsx — drop-in dashboard for the Koa user site.
//
// Renders the entire connect dashboard: phone OTP login → integrations
// grid → subscriptions → account / delete-data. Talks to the FastAPI
// backend in koa_user_site/.
//
// Required env (set in Lovable's environment):
//   VITE_KOA_API_BASE  — e.g. https://api.koa.app or http://localhost:8788

import { useEffect, useState, useCallback } from "react";

const API_BASE =
  (import.meta as any)?.env?.VITE_KOA_API_BASE || "http://localhost:8788";
const TOKEN_KEY = "koa.session.token";

type Provider = {
  id: string;
  name: string;
  category: "Productivity" | "Health" | "Finance";
  blurb: string;
  logo: string;
  beta?: boolean;
  oauth_kind?: string;
  configured: boolean;
  connected: boolean;
  account_email: string | null;
  status: "connected" | "available" | "coming_soon";
};

type Subscription = {
  sub_id: number;
  topic: string;
  kind: string;
  frequency_hours: number | null;
  fire_hour: number | null;
  fire_minute: number | null;
  message_template: string | null;
  paused: number;
};

async function api<T = any>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const r = await fetch(API_BASE + path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });
  if (!r.ok) {
    const body = await r.json().catch(() => ({}));
    throw new Error(body.detail || `HTTP ${r.status}`);
  }
  return r.json();
}

function formatPhoneInput(raw: string): string {
  const d = (raw || "").replace(/\D/g, "").slice(0, 11);
  const n = d.startsWith("1") ? d.slice(1) : d;
  if (!n) return "";
  if (n.length <= 3) return `+1 (${n}`;
  if (n.length <= 6) return `+1 (${n.slice(0, 3)}) ${n.slice(3)}`;
  return `+1 (${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6, 10)}`;
}

function ProviderLogo({ logo }: { logo: string }) {
  const colors: Record<string, string> = {
    gmail: "bg-red-600",
    gcal: "bg-blue-600",
    gdrive: "bg-green-600",
    outlook: "bg-blue-700",
    notion: "bg-zinc-100 text-zinc-900",
    todoist: "bg-red-500",
    strava: "bg-orange-500",
    oura: "bg-zinc-800",
    bank: "bg-emerald-700",
  };
  const letter = logo.charAt(0).toUpperCase();
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-lg text-base font-bold text-white ${
        colors[logo] || "bg-zinc-700"
      }`}
    >
      {letter}
    </div>
  );
}

function LoginScreen({ onAuthed }: { onAuthed: () => void }) {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

  async function sendCode() {
    setBusy(true);
    setErr("");
    setInfo("");
    try {
      const r = await api<any>("/auth/otp/request", {
        method: "POST",
        body: JSON.stringify({ phone }),
      });
      if (r.delivery && !r.delivery.sent) {
        setErr(`couldn't send: ${r.delivery.reason}`);
      } else {
        setInfo(`code sent to ${phone} via imessage`);
        setStep("code");
      }
    } catch (e: any) {
      setErr(e.message || "request failed");
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    setBusy(true);
    setErr("");
    try {
      const r = await api<any>("/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ phone, code }),
      });
      localStorage.setItem(TOKEN_KEY, r.token);
      onAuthed();
    } catch (e: any) {
      setErr(e.message || "invalid code");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 text-zinc-100">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-xl">
        <div className="mb-2 flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Koa</h1>
          <span className="text-violet-500">✦</span>
        </div>
        <p className="mb-6 text-sm text-zinc-400">
          your iMessage AI. log in with your phone number to manage your
          subscriptions and connectors.
        </p>

        {step === "phone" ? (
          <>
            <input
              type="tel"
              autoFocus
              inputMode="tel"
              autoComplete="tel"
              placeholder="+1 (305) 555-1234"
              value={phone}
              onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
              onKeyDown={(e) => e.key === "Enter" && sendCode()}
              className="mb-3 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-base text-zinc-100 placeholder-zinc-600 outline-none focus:border-violet-500"
            />
            <button
              disabled={busy || phone.replace(/\D/g, "").length < 10}
              onClick={sendCode}
              className="w-full rounded-lg bg-violet-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:bg-violet-500 disabled:opacity-50"
            >
              {busy ? "sending…" : "send code"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              autoFocus
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && verify()}
              className="mb-3 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-center text-2xl tracking-[0.5em] text-zinc-100 outline-none focus:border-violet-500"
            />
            <button
              disabled={busy || code.length !== 6}
              onClick={verify}
              className="w-full rounded-lg bg-violet-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:bg-violet-500 disabled:opacity-50"
            >
              {busy ? "verifying…" : "verify"}
            </button>
            <button
              onClick={() => setStep("phone")}
              className="mt-3 w-full text-xs text-zinc-500 hover:text-zinc-300"
            >
              ← use a different number
            </button>
          </>
        )}

        {info && <p className="mt-4 text-sm text-emerald-400">{info}</p>}
        {err && <p className="mt-4 text-sm text-rose-400">{err}</p>}
      </div>
    </div>
  );
}

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [me, setMe] = useState<{ chat_id: number; phone: string } | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [m, p, s] = await Promise.all([
        api<any>("/me"),
        api<any>("/providers"),
        api<any>("/subscriptions"),
      ]);
      setMe(m);
      setProviders(p.providers || []);
      setSubs(s.subscriptions || []);
    } catch (e) {
      console.error(e);
      onSignOut();
    } finally {
      setLoading(false);
    }
  }, [onSignOut]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("ok=") || hash.includes("error=")) {
      window.history.replaceState({}, "", window.location.pathname);
      void load();
    }
  }, [load]);

  async function startGoogle(kind: string) {
    try {
      const r = await api<any>(`/oauth/google/start?kind=${kind}`);
      window.location.href = r.auth_url;
    } catch (e: any) {
      alert(e.message || "couldn't start oauth");
    }
  }

  async function disconnect(provider: string) {
    if (!confirm(`disconnect ${provider}?`)) return;
    await api(`/connections/${provider}`, { method: "DELETE" });
    void load();
  }

  async function cancelSub(sub_id: number) {
    if (!confirm("cancel this subscription?")) return;
    await api(`/subscriptions/${sub_id}`, { method: "DELETE" });
    void load();
  }

  async function wipeData() {
    if (
      !confirm(
        "this permanently deletes all your koa data: subscriptions, " +
          "corrections, routines, connections, reminders. continue?"
      )
    )
      return;
    await api("/data/wipe", { method: "POST" });
    onSignOut();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-zinc-500">
        loading…
      </div>
    );
  }

  const formattedPhone = me ? formatPhoneInput(me.phone) : "";
  const categories: Provider["category"][] = ["Productivity", "Health", "Finance"];
  const grouped: Record<string, Provider[]> = {};
  for (const c of categories) grouped[c] = providers.filter((p) => p.category === c);

  const stale = providers.find((p) => !p.connected && p.id === "google_gmail");

  return (
    <div className="min-h-screen bg-black px-6 py-8 text-zinc-100 md:px-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Koa</h1>
              <span className="text-violet-500 text-xl">✦</span>
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              Connected as {formattedPhone}
              <span className="ml-2 rounded-full bg-emerald-900/40 px-2 py-0.5 text-xs text-emerald-400">
                Active
              </span>
            </p>
          </div>
          <button
            onClick={onSignOut}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
            title="sign out"
          >
            ☰
          </button>
        </header>

        {stale && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-violet-900/50 bg-violet-950/30 p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl text-violet-400">⚠</span>
              <div>
                <p className="font-semibold">{stale.name} disconnected</p>
                <p className="text-sm text-zinc-400">
                  Reconnect to continue AI email features.
                </p>
              </div>
            </div>
            <button
              onClick={() => startGoogle("gmail")}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-500"
            >
              Reconnect
            </button>
          </div>
        )}

        <section className="mb-10">
          <h2 className="text-2xl font-bold">Integrations</h2>
          <p className="mb-6 text-sm text-zinc-500">
            Connect your tools. Unlock more with Koa.
          </p>

          {categories.map((cat) =>
            grouped[cat].length === 0 ? null : (
              <div key={cat} className="mb-8">
                <h3 className="mb-3 flex items-center gap-2 text-base font-semibold">
                  <span
                    className={
                      cat === "Productivity"
                        ? "text-violet-400"
                        : cat === "Health"
                          ? "text-rose-400"
                          : "text-emerald-400"
                    }
                  >
                    {cat === "Productivity" ? "▢" : cat === "Health" ? "♥" : "$"}
                  </span>
                  {cat}
                </h3>
                <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/50">
                  {grouped[cat].map((p, i) => (
                    <div
                      key={p.id}
                      className={`flex items-center gap-4 p-4 ${
                        i > 0 ? "border-t border-zinc-800/60" : ""
                      }`}
                    >
                      <ProviderLogo logo={p.logo} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{p.name}</span>
                          {p.beta && (
                            <span className="rounded bg-violet-900/40 px-1.5 py-0.5 text-[10px] uppercase text-violet-300">
                              Beta
                            </span>
                          )}
                        </div>
                        <p className="truncate text-sm text-zinc-500">
                          {p.connected && p.account_email
                            ? p.account_email
                            : p.blurb}
                        </p>
                      </div>
                      {p.status === "connected" ? (
                        <button
                          onClick={() => disconnect(p.id)}
                          className="flex items-center gap-1 rounded-lg border border-emerald-700/50 bg-emerald-950/30 px-3 py-1.5 text-sm text-emerald-400 hover:bg-rose-950/40 hover:border-rose-700/60 hover:text-rose-300"
                          title="click to disconnect"
                        >
                          ✓ Connected
                        </button>
                      ) : p.status === "available" ? (
                        <button
                          onClick={() => {
                            if (p.oauth_kind) startGoogle(p.oauth_kind);
                            else
                              alert(
                                `${p.name} OAuth not yet wired in the backend — coming soon`
                              );
                          }}
                          className="flex items-center gap-1 rounded-lg border border-violet-700/60 bg-violet-950/30 px-3 py-1.5 text-sm text-violet-300 hover:bg-violet-900/40"
                        >
                          + Connect
                        </button>
                      ) : (
                        <span
                          className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-500"
                          title="set provider env credentials in your .env to enable"
                        >
                          Coming soon
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-violet-900/50 bg-gradient-to-br from-violet-950/40 to-zinc-950 p-5">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
              <span className="text-violet-400">✦</span> Upgrade to Koa Pro
            </h3>
            <ul className="mb-4 space-y-2 text-sm text-zinc-400">
              <li>○ Unlimited automations</li>
              <li>○ Real-time sync</li>
              <li>○ Advanced AI actions</li>
              <li>◆ Priority support</li>
            </ul>
            <button className="w-full rounded-lg bg-violet-600 py-2 text-sm font-semibold hover:bg-violet-500">
              Upgrade Now
            </button>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
              <span>🔔</span> Subscriptions
            </h3>
            {subs.length === 0 ? (
              <p className="text-sm text-zinc-500">
                No subscriptions yet. Text Koa things like "update me on AI
                news daily" or "ping me at 9am every day to gym".
              </p>
            ) : (
              <ul className="space-y-2">
                {subs.slice(0, 4).map((s) => (
                  <li
                    key={s.sub_id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="truncate text-zinc-300">
                      {s.topic || s.message_template}
                    </span>
                    <button
                      onClick={() => cancelSub(s.sub_id)}
                      className="ml-3 text-xs text-zinc-500 hover:text-rose-400"
                    >
                      cancel
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
            <div className="flex items-center gap-3">
              <span className="text-zinc-500">👤</span>
              <div>
                <p className="font-semibold">Account</p>
                <p className="text-sm text-zinc-500">
                  Manage your account settings and data.
                </p>
              </div>
            </div>
            <span className="text-zinc-600">›</span>
          </div>

          <button
            onClick={wipeData}
            className="flex w-full items-center justify-between rounded-xl border border-rose-900/40 bg-rose-950/20 p-4 text-left hover:bg-rose-950/40"
          >
            <div className="flex items-center gap-3">
              <span className="text-rose-400">🗑</span>
              <div>
                <p className="font-semibold text-rose-300">Delete all my data</p>
                <p className="text-sm text-zinc-500">
                  Permanently delete your account and all data.
                </p>
              </div>
            </div>
            <span className="text-rose-700">›</span>
          </button>
        </section>
      </div>
    </div>
  );
}

export default function KoaConnect() {
  const [authed, setAuthed] = useState<boolean>(
    typeof window !== "undefined" && !!localStorage.getItem(TOKEN_KEY)
  );

  if (!authed) return <LoginScreen onAuthed={() => setAuthed(true)} />;
  return (
    <Dashboard
      onSignOut={() => {
        localStorage.removeItem(TOKEN_KEY);
        setAuthed(false);
      }}
    />
  );
}
