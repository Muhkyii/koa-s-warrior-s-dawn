// src/pages/Dashboard.tsx — gated dashboard at /dashboard.
// Wired in App.tsx as <Route path="/dashboard" element={<Dashboard />} />.

import { Link } from "react-router-dom";
import { AuthGate } from "@/components/koa/AuthGate";
import { ProfileCard } from "@/components/koa/ProfileCard";
import { ModeBadge } from "@/components/koa/ModeBadge";
import { UsageMeter } from "@/components/koa/UsageMeter";
import { Connectors } from "@/components/koa/Connectors";
import { auth } from "@/lib/api";

export default function Dashboard() {
  return (
    <AuthGate>
      <div className="min-h-screen bg-background font-sans text-foreground">
        <header className="border-b border-border/60">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
            <Link to="/" className="font-mono-tomo text-[22px] font-medium">
              Koa
            </Link>
            <div className="flex items-center gap-3">
              <ModeBadge />
              <button
                onClick={() => {
                  auth.logout();
                  window.location.href = "/";
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                sign out
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-3xl space-y-6 px-6 py-10">
          <section className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              your dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              profile, usage, connectors
            </p>
          </section>

          <ProfileCard />
          <UsageMeter />
          <Connectors />
        </main>
      </div>
    </AuthGate>
  );
}
