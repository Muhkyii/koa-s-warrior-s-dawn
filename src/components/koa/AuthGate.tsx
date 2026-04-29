// src/components/koa/AuthGate.tsx
//
// Phone-only sign-in. We send a 6-digit code via SMS (Twilio) and verify
// against the Koa backend. JWT lands in localStorage on success.

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { auth, getToken, setToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

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
        await auth.start(phone);
        setStage("code");
      } else {
        const { jwt } = await auth.verify(phone, code);
        setToken(jwt);
        setAuthed(true);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto mt-24 flex max-w-sm flex-col gap-8 px-6">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Sign in to <span className="font-serif-italic font-normal">Koa</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          {stage === "phone"
            ? "Enter your phone number — we'll text you a 6-digit code."
            : `Code sent to ${phone}`}
        </p>
      </header>

      <form onSubmit={submit} className="space-y-4">
        {stage === "phone" ? (
          <div className="space-y-1.5">
            <Label htmlFor="phone">phone</Label>
            <Input
              id="phone"
              autoFocus
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+1 555 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="text-[11px] text-muted-foreground">
              Same number you text Koa from. Standard SMS rates apply.
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
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-center text-xs text-destructive">
            {err}
          </p>
        )}
      </form>
    </main>
  );
}
