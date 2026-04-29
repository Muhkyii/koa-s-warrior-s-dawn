// src/components/koa/AuthGate.tsx
//
// Three stages:
//   1. chooser — New User / Returning User pick (initial)
//   2. phone   — phone input (Returning, or New after they've texted Koa)
//   3. code    — 6-digit OTP entry
//
// New users hit a QR code that opens iMessage to Koa. Texting Koa is what
// creates their user_profile row (bot extracts name, etc). Once that's
// done they come back, pick Returning, sign in, and the dashboard shows
// the data the bot extracted — editable in Settings.

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { QRCodeSVG } from "qrcode.react";
import { auth, getToken, setToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "./PhoneInput";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AlertCircle, ArrowRight, ArrowLeft, MessageCircle } from "lucide-react";

type Stage = "chooser" | "phone" | "code";
type Path = "new" | "returning";

const KOA_NUMBER = "+17862847802";
const KOA_SMS = `sms:${KOA_NUMBER}?&body=so%20what%20is%20koa%20anyways%3F`;

export function AuthGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [stage, setStage] = useState<Stage>("chooser");
  const [path, setPath] = useState<Path>("returning");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setAuthed(!!getToken());
  }, []);

  if (authed === null) return null;
  if (authed) return <>{children}</>;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      if (stage === "phone") {
        if (phone.replace(/[^\d]/g, "").length < 8) {
          throw new Error("Please enter your full phone number.");
        }
        await auth.start(phone);
        setStage("code");
      } else if (stage === "code") {
        const { jwt } = await auth.verify(phone, code);
        setToken(jwt);
        setAuthed(true);
      }
    } catch (e) {
      setErr(humanizeError(e));
    } finally {
      setBusy(false);
    }
  }

  // ── Chooser: New User / Returning User ────────────────────────────
  if (stage === "chooser") {
    return (
      <main className="mx-auto mt-32 flex max-w-sm flex-col gap-6 px-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          <span className="font-serif-italic font-normal">Koa</span>
        </h1>
        <div className="space-y-2">
          <button
            onClick={() => {
              setPath("new");
              setStage("phone"); // we'll show QR step inside phone stage when path==new
            }}
            className="flex h-14 w-full items-center justify-center rounded-full bg-foreground text-base font-medium text-background transition-transform hover:scale-[1.01]"
          >
            New User
          </button>
          <button
            onClick={() => {
              setPath("returning");
              setStage("phone");
            }}
            className="flex h-14 w-full items-center justify-center rounded-full border border-border bg-surface/40 text-base font-medium text-foreground transition-colors hover:bg-surface"
          >
            Returning User
          </button>
        </div>
      </main>
    );
  }

  // ── New User QR (sub-screen of "phone" stage, before they enter phone) ─
  if (stage === "phone" && path === "new") {
    return (
      <main className="mx-auto mt-20 flex max-w-md flex-col gap-6 px-6">
        <button
          onClick={() => setStage("chooser")}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> back
        </button>

        <header className="space-y-2">
          <p className="font-serif-italic text-xl font-normal">Koa</p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight">
            Text Koa to create<br />your account.
          </h1>
          <p className="text-sm text-muted-foreground">
            Scan the QR code below with your phone to get started. After your
            first text, come back here and sign in with your number — your
            profile fills in automatically.
          </p>
        </header>

        <div className="mx-auto rounded-2xl bg-white p-4 shadow-card">
          <QRCodeSVG value={KOA_SMS} size={180} bgColor="#ffffff" fgColor="#000000" />
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
      </main>
    );
  }

  // ── Phone input (Returning User, or New User after they texted) ─────
  return (
    <main className="mx-auto mt-20 flex max-w-sm flex-col gap-8 px-6">
      <button
        onClick={() => {
          if (stage === "code") {
            setStage("phone");
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
          Sign in to <span className="font-serif-italic font-normal">Koa</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          {stage === "phone"
            ? "We'll text you a 6-digit code."
            : `Code sent to ${phone}.`}
        </p>
      </header>

      <form onSubmit={submit} className="space-y-4">
        {stage === "phone" ? (
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <PhoneInput value={phone} onChange={setPhone} autoFocus />
            <p className="text-[11px] text-muted-foreground">
              Standard SMS rates apply. Same number you text Koa from.
            </p>
          </div>
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
          className="h-11 w-full rounded-full"
        >
          {busy ? "…" : stage === "phone" ? (
            <span className="inline-flex items-center gap-1.5">
              Send code <ArrowRight className="h-3.5 w-3.5" />
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
    </main>
  );
}

function humanizeError(e: unknown): string {
  const raw = e instanceof Error ? e.message : "Something went wrong.";
  if (raw.startsWith("slow down")) {
    const m = raw.match(/(\d+)s/);
    return `Hold on a sec — try again in ${m ? m[1] : "60"} seconds.`;
  }
  if (raw.toLowerCase().includes("invalid phone")) {
    return "That phone number doesn't look right. Double-check the country code.";
  }
  if (raw.toLowerCase().includes("couldn't send sms")) {
    return "We couldn't text that number. Make sure your country is selected and the digits are right.";
  }
  if (raw.toLowerCase().includes("wrong code")) {
    return "That code didn't match. Try again, or send a new one.";
  }
  if (raw.toLowerCase().includes("expired")) {
    return "That code expired. Send a fresh one.";
  }
  return raw;
}
