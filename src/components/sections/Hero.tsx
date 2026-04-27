import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section
      id="top"
      className="flex w-full flex-col items-center justify-center px-6 py-20 text-center sm:py-28"
    >
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-5xl text-[44px] font-bold leading-[1.02] text-foreground sm:text-6xl md:text-7xl lg:text-[88px]"
      >
        Koa wants you to<br />
        <span className="font-serif-italic font-normal">lock in</span>. Do you?
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 text-lg text-muted-foreground sm:text-xl"
      >
        It all starts with one text.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 flex flex-col items-center gap-4"
      >
        <a
          href="sms:+14157700578"
          className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-glow-cta transition-transform hover:-translate-y-0.5"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[hsl(var(--imessage))] text-white">
            <MessageSquare className="h-4 w-4" strokeWidth={2.5} />
          </span>
          Get Started
        </a>
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our Terms and Privacy.
        </p>
      </motion.div>
    </section>
  );
};
