const BASE: string =
  // @ts-expect-error — Vite injects import.meta.env at build time
  (import.meta.env?.VITE_API_URL as string) || "https://koa-web-api.fly.dev";

const TOKEN_KEY = "koa_jwt";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("content-type") && init.body)
    headers.set("content-type", "application/json");
  const t = getToken();
  if (t) headers.set("authorization", `Bearer ${t}`);

  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.detail) msg = String(body.detail);
    } catch {
      /* ignore */
    }
    if (res.status === 401) setToken(null);
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// ── Auth ──────────────────────────────────────────────────────────────
export type AuthStartResponse = { ok: true; expires_in: number };
export type AuthVerifyResponse = {
  jwt: string;
  user: { chat_id: number; phone: string; email: string };
};

export const auth = {
  start: (phone: string, email: string) =>
    req<AuthStartResponse>("/auth/start", {
      method: "POST",
      body: JSON.stringify({ phone, email }),
    }),
  verify: (phone: string, code: string) =>
    req<AuthVerifyResponse>("/auth/verify", {
      method: "POST",
      body: JSON.stringify({ phone, code }),
    }),
  logout: () => setToken(null),
};

// ── Profile / state ───────────────────────────────────────────────────
export type Profile = {
  chat_id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  timezone: string | null;
  tier: "free" | "trialing" | "personal" | "hustle" | "edge" | null;
  subscription_status: string | null;
  trial_ends_at: number | null;
  channel: string | null;
  created_at: number | null;
  web_signed_up_at: number | null;
};

export type Usage = {
  tier: string;
  subscription_status: string | null;
  trial_ends_at: number | null;
  used: number;
  limit: number;
  unlimited: boolean;
  date: string;
};

export type ModeState = {
  mode:
    | "onboard"
    | "crisis"
    | "utility"
    | "trader"
    | "casual"
    | "venting"
    | null;
  reason: string | null;
  crisis_lock_active: boolean;
  crisis_lock_expires_at: number | null;
};

export type Integration = {
  slug: "notion" | "todoist" | "google_drive";
  label: string;
  connected: boolean;
  connected_at?: number | null;
  [k: string]: unknown;
};

export type ProfileUpdate = {
  name?: string;
  email?: string;
  timezone?: string;
};

export const me = {
  profile: () => req<Profile>("/auth/me"),
  usage: () => req<Usage>("/auth/me/usage"),
  mode: () => req<ModeState>("/auth/me/mode"),
  update: (patch: ProfileUpdate) =>
    req<Profile>("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),
};

export const integrations = {
  list: () =>
    req<{ connectors: Integration[] }>("/api/integrations").then(
      (r) => r.connectors,
    ),
  saveToken: (slug: string, token: string) =>
    req<{ ok: boolean }>(`/api/integrations/${slug}/save_token`, {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  disconnect: (slug: string) =>
    req<{ ok: true }>(`/api/integrations/${slug}`, { method: "DELETE" }),
};
