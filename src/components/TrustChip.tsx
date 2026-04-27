import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const sayings = [
  "Trusted by 12,000+ people locking in today.",
  "1.2M texts sent this week.",
  "Loved by builders, lifters & late-night thinkers.",
  "Featured in TechCrunch & Product Hunt.",
  "Replying in <2s, 24/7.",
];

export const TrustChip = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % sayings.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-surface/60 py-1 pl-1 pr-4 text-[13px] text-muted-foreground backdrop-blur sm:flex">
      <div className="flex -space-x-2">
        <span className="h-7 w-7 rounded-full border border-border bg-[hsl(var(--amber))]/70" />
        <span className="h-7 w-7 rounded-full border border-border bg-[hsl(var(--imessage))]/60" />
      </div>
      <div className="relative h-5 min-w-[260px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={i}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center whitespace-nowrap"
          >
            {sayings[i]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};
