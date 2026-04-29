// src/components/koa/AuthGate.tsx
//
// Sign-in: chooser → identifier (phone OR email) → 6-digit OTP.
// SMS uses phone, email uses email-only (backend looks up phone via
// user_profile.email so chat_id stays stable).

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { QRCodeSVG } from "qrcode.react";
import { auth, getToken, setToken, type AuthIdentifier } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "./PhoneInput";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AlertCircle, ArrowRight, ArrowLeft, MessageCircle, Mail } from "lucide-react";

type Stage = "chooser" | "identifier" | "code";
type Path = "new" | "returning";
type Channel = "sms" | "email";

const KOA_NUMBER = "+17862847802";
const KOA_SMS = `sms:${KOA_NUMBER}?&body=so%20what%20is%20koa%20anyways%3F`;

export function AuthGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [stage, setStage] = useState<Stage>("chooser");
  const [path, setPath] = useState<Path>("returning");
  const [channel, setChannel] = useState<Channel>("sms");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setAuthed(!!getToken());
  }, []);

  if (authed === null) return null;
  if (authed) return <>{children}</>;

  // Build the AuthIdentifier from the current channel.
  function currentIdentifier(): AuthIdentifier | null {
    if (channel === "sms") {
      if (phone.replace(/[^\d]/g, "").length < 8) return null;
      return { phone };
    } else {
      if (!email || !email.includes("@")) return null;
      return { email };
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      if (stage === "identifier") {
        const id = currentIdentifier();
        if (!id) {
          throw new Error(
            channel === "sms"
              ? "Please enter your full phone number."
              : "Please enter a valid email address.",
          );
        }
        await auth.start(id);
        setStage("code");
      } else if (stage === "code") {
        const id = currentIdentifier();
        if (!id) throw new Error("Lost track of your identifier — start over.");
        const { jwt } = await auth.verify(id, code);
        setToken(jwt);
        setAuthed(true);
      }
    } catch (e) {
      setErr(humanizeError(e));
    } finally {
      setBusy(false);
    }
  }

  const Centered = ({ children }: { children: ReactNode }) => (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );

  // ── Chooser ───────────────────────────────────────────────────────
  if (stage === "chooser") {
    return (
      <Centered>
        <div className="flex flex-col gap-6">
          <h1 className="font-koa text-4xl font-normal">Koa</h1>
          <div className="space-y-3">
            <button
              onClick={() => {
                setPath("new");
                setStage("identifier");
              }}
              className="flex h-14 w-full items-center justify-center rounded-full bg-foreground text-base font-medium text-background shadow-glow-cta transition-transform hover:scale-[1.01]"
            >
              New User
            </button>
            <button
              onClick={() => {
                setPath("returning");
                setStage("identifier");
              }}
              className="flex h-14 w-full items-center justify-center rounded-full border border-border bg-surface/40 text-base font-medium text-foreground transition-colors hover:bg-surface"
            >
              Returning User
            </button>
          </div>
        </div>
      </Centered>
    );
  }

  // ── New User QR ───────────────────────────────────────────────────
  if (stage === "identifier" && path === "new") {
    return (
      <Centered>
        <div className="flex flex-col gap-6">
          <button
            onClick={() => setStage("chooser")}
            className="self-start inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> back
          </button>

          <header className="space-y-2">
            <p className="font-koa text-2xl font-normal">Koa</p>
            <h1 className="text-3xl font-bold leading-tight tracking-tight">
              Text Koa to create<br />your account.
            </h1>
            <p className="text-sm text-muted-foreground">
              Scan the QR code with your phone to get started. After your
              first text, come back here and sign in — your profile fills
              in automatically.
            </p>
          </header>

          <div className="mx-auto rounded-2xl bg-white p-4 shadow-card">
            <QRCodeSVG value={KOA_SMS} size={200} bgColor="#ffffff" fgColor="#000000" />
          </div>

          <a
            href={KOA_SMS}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[hsl(var(--imessage))] px-5 py-3 text-sm font-medium text-white"
          >
            <MessageCircle className="h-4 w-4" /> Open iMessage instead
          </a>

          <button
            onClick={() => setPath("returning")}
            className="text-center text-sm text-muted-foreground hover:text-foreground"
          >
            I've already texted Koa →
          </button>
        </div>
      </Centered>
    );
  }

  // ── Identifier (SMS or Email — only one shown) + OTP ─────────────
  return (
    <Centered>
      <div className="flex flex-col gap-7">
        <button
          onClick={() => {
            if (stage === "code") {
              setStage("identifier");
              setCode("");
              setErr(null);
            } else {
              setStage("chooser");
              setErr(null);
            }
          }}
          className="self-start inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> back
        </button>

        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Sign in to <span className="font-koa font-normal">Koa</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            {stage === "identifier"
              ? channel === "sms"
                ? "We'll text you a 6-digit code."
                : "We'll email you a 6-digit code."
              : `Code sent to ${channel === "email" ? email : phone}.`}
          </p>
        </header>

        <form onSubmit={submit} className="space-y-4">
          {stage === "identifier" ? (
            <>
              {channel === "sms" ? (
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <PhoneInput value={phone} onChange={setPhone} autoFocus />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2 rounded-xl border border-input bg-background px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-ring">
                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      autoFocus
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-sm focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setChannel(channel === "sms" ? "email" : "sms");
                  setErr(null);
                }}
                className="block w-full text-center text-xs text-muted-foreground hover:text-foreground"
              >
                {channel === "sms"
                  ? "Or use email instead →"
                  : "Or use phone instead →"}
              </button>
              <p className="text-[11px] text-muted-foreground">
                {channel === "sms"
                  ? "Standard SMS rates apply. Same number you text Koa from."
                  : "Only works for accounts that already have email on file."}
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(v) => setCode(v)}
                autoFocus
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          )}

          <Button
            type="submit"
            disabled={busy || (stage === "code" && code.length < 6)}
            className="h-12 w-full rounded-full text-base"
          >
            {busy ? "…" : stage === "identifier" ? (
              <span className="inline-flex items-center gap-1.5">
                Send code <ArrowRight className="h-4 w-4" />
              </span>
            ) : "Verify & continue"}
          </Button>

          {err && (
            <div className="flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0 translate-y-px" />
              <span className="leading-relaxed">{err}</span>
            </div>
          )}
        </form>
      </div>
    </Centered>
  );
}

function humanizeError(e: unknown): string {
  const raw = e instanceof Error ? e.message : "Something went wrong.";
  if (raw.startsWith("slow down")) {
    const m = raw.match(/(\d+)s/);
    return `Hold on a sec — try again in ${m ? m[1] : "60"} seconds.`;
  }
  if (raw.toLowerCase().includes("no account with that email")) {
    return "We don't have an account with that email. Sign in with your phone first.";
  }
  if (raw.toLowerCase().includes("invalid phone")) {
    return "That phone number doesn't look right.";
  }
  if (raw.toLowerCase().includes("couldn't send sms")) {
    return "We couldn't text that number. Try email instead.";
  }
  if (raw.toLowerCase().includes("couldn't send email")) {
    return "We couldn't email that address. Try SMS instead.";
  }
  if (raw.toLowerCase().includes("wrong code")) {
    return "That code didn't match. Try again, or send a new one.";
  }
  if (raw.toLowerCase().includes("expired")) {
    return "That code expired. Send a fresh one.";
  }
  return raw;
}
