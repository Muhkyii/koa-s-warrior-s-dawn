import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type Msg = { from: "user" | "koa"; text: string };

const script: Msg[] = [
  { from: "user", text: "skipped the gym today" },
  { from: "koa", text: "soft. what actually stopped you" },
  { from: "user", text: "was tired" },
  { from: "koa", text: "you slept 9 hours bro. lock in tomorrow" },
];

export const ChatMockup = () => {
  const [visible, setVisible] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
      // initial pause
      await wait(400);
      for (let i = 0; i < script.length; i++) {
        if (cancelled) return;
        const m = script[i];
        if (m.from === "koa") {
          setTyping(true);
          await wait(1100);
          if (cancelled) return;
          setTyping(false);
        }
        setVisible((v) => [...v, m]);
        await wait(m.from === "user" ? 700 : 900);
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-[28px] border border-border/70 bg-surface shadow-lift">
        {/* header */}
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-3 text-xs text-muted-foreground">
          <span>9:41</span>
          <span className="font-medium text-foreground">koa</span>
          <span className="opacity-60">●●●</span>
        </div>
        {/* messages */}
        <div className="flex flex-col gap-2.5 bg-surface p-5 min-h-[320px]">
          <AnimatePresence initial={false}>
            {visible.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[78%] rounded-3xl px-4 py-2.5 text-[15px] leading-snug ${
                    m.from === "user"
                      ? "bg-bubble-user text-foreground rounded-br-md"
                      : "bg-bubble-ai text-foreground rounded-bl-md"
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
            {typing && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-center gap-1 rounded-3xl rounded-bl-md bg-bubble-ai px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70"
                      style={{
                        animation: "dot-pulse 1.2s infinite",
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* input */}
        <div className="flex items-center gap-2 border-t border-border/60 px-4 py-3">
          <div className="h-8 w-8 rounded-full bg-muted" />
          <div className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
            iMessage
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dot-pulse {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
};
