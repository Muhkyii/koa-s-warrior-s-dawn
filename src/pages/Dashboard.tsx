// src/pages/Dashboard.tsx — tabbed dashboard, Tomo-style.
//
// Three tabs: Chat (text Koa + usage), Integrations (connectors), Settings
// (profile, appearance, support, billing). Top alert banner mirrors landing.

import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthGate } from "@/components/koa/AuthGate";
import { ModeBadge } from "@/components/koa/ModeBadge";
import { ChatTab } from "@/components/koa/ChatTab";
import { IntegrationsTab } from "@/components/koa/IntegrationsTab";
import { SettingsTab } from "@/components/koa/SettingsTab";
import { auth } from "@/lib/api";
import { MessageCircle, Sparkles, Settings as SettingsIcon } from "lucide-react";

type Tab = "chat" | "integrations" | "settings";

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>("chat");

  return (
    <AuthGate>
      <div className="min-h-screen bg-background font-sans text-foreground">
        {/* Top alert banner — matches landing */}
        <div className="relative z-20 w-full border-b border-border/60 bg-surface-warm">
          <a
            href="sms:+17862847802"
            className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-6 py-2.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[hsl(var(--amber))]" />
            <span>Koa not responding?</span>
            <span className="underline underline-offset-4">
              Press here for a new number.
            </span>
          </a>
        </div>

        {/* Header — wordmark + mode + sign out */}
        <header className="border-b border-border/60">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
            <Link
              to="/"
              className="font-koa text-[32px] font-normal tracking-tight"
            >
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

        {/* Tab nav — pill style, centered, like Tomo */}
        <nav className="mx-auto flex max-w-3xl justify-center gap-1 px-6 pt-6">
          <TabButton active={tab === "chat"} onClick={() => setTab("chat")}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/30 px-2 py-0.5 text-[10px] font-medium text-purple-200">
              Beta
            </span>
            <MessageCircle className="h-3.5 w-3.5" />
            Chat
          </TabButton>
          <TabButton
            active={tab === "integrations"}
            onClick={() => setTab("integrations")}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Integrations
          </TabButton>
          <TabButton
            active={tab === "settings"}
            onClick={() => setTab("settings")}
          >
            <SettingsIcon className="h-3.5 w-3.5" />
            Settings
          </TabButton>
        </nav>

        <main className="mx-auto max-w-3xl space-y-6 px-6 pb-20 pt-8">
          {tab === "chat" && <ChatTab />}
          {tab === "integrations" && <IntegrationsTab />}
          {tab === "settings" && <SettingsTab />}
        </main>
      </div>
    </AuthGate>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
        active
          ? "border-border bg-surface text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
