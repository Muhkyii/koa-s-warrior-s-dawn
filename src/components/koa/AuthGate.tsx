// src/components/koa/AuthGate.tsx
//
// Phone-only sign-in via SMS (Twilio). Country-code selector handles
// international numbers. JWT lands in localStorage on success.

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { auth, getToken, setToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "./PhoneInput";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AlertCircle } from "lucide-react";

type Stage = "phone" | "code";

export function AuthGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [stage, setStage] = useState<Stage>("phone");
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
        // Validate: at least country code + ~7 digits
        if (phone.replace(/[^\d]/g, "").length < 8) {
          throw new Error("Please enter your full phone number.");
        }
        await auth.start(phone);
        setStage("code");
      } else {
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

  return (
    <main className="mx-auto mt-20 flex max-w-sm flex-col gap-8 px-6">
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
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setStage("phone");
                setCode("");
                setErr(null);
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ← use a different number
            </button>
          </div>
        )}

        <Button
          type="submit"
          disabled={busy || (stage === "code" && code.length < 6)}
          className="h-11 w-full rounded-full"
        >
          {busy ? "…" : stage === "phone" ? "Send code" : "Verify & continue"}
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

// Map raw error strings to softer human copy where useful.
function humanizeError(e: unknown): string {
  const raw = e instanceof Error ? e.message : "Something went wrong.";
  if (raw.startsWith("slow down")) {
    const m = raw.match(/(\d+)s/);
    const s = m ? m[1] : "60";
    return `Hold on a sec — try again in ${s} seconds.`;
  }
  if (raw.toLowerCase().includes("invalid phone")) {
    return "That phone number doesn't look right. Double-check the country code and digits.";
  }
  if (raw.toLowerCase().includes("couldn't send sms")) {
    return "We couldn't text that number. If you're using a Twilio trial, the number must be verified in your Twilio account first.";
  }
  if (raw.toLowerCase().includes("wrong code")) {
    return "That code didn't match. Try again, or send a new one.";
  }
  if (raw.toLowerCase().includes("expired")) {
    return "That code expired. Send a fresh one.";
  }
  return raw;
}
