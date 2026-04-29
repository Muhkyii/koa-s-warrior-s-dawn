import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { ChatMockup } from "@/components/ChatMockup";

const KOA_SMS = "sms:+17862847802?&body=so%20what%20is%20koa%20anyways%3F";

export const Hero = () => {
  return (
    <section
      id="top"
      className="relative flex w-full flex-col items-center justify-center px-6 py-16 text-center sm:py-24"
    >
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-5xl text-[40px] font-bold leading-[1.02] text-foreground sm:text-6xl md:text-7xl"
      >
        Koa wants you to<br />
        <span className="font-serif-italic font-normal">lock in</span>. Do you?
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="mt-5 text-base text-muted-foreground sm:text-lg"
      >
        Scan. Text. Lock in. It all starts with one message.
      </motion.p>

      {/* QR CODE — the centerpiece */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-10"
      >
        {/* animated glow ring */}
        <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-[hsl(var(--amber))]/30 via-[hsl(var(--imessage))]/20 to-fuchsia-500/20 blur-2xl" />
        <a
          href={KOA_SMS}
          className="relative block rounded-[28px] bg-white p-5 shadow-glow-cta transition-transform hover:-translate-y-0.5"
          aria-label="Scan to text Koa"
        >
          <QRCodeSVG
            value={KOA_SMS}
            size={196}
            level="H"
            bgColor="#ffffff"
            fgColor="#000000"
            imageSettings={{
              src:
                "data:image/svg+xml;utf8," +
                encodeURIComponent(
                  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' rx='10' fill='#22c55e'/><text x='50%' y='56%' font-size='22' font-weight='700' text-anchor='middle' fill='white' font-family='JetBrains Mono,monospace'>K</text></svg>`,
                ),
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </a>
        <div className="mt-3 font-mono-tomo text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Scan with your phone
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 flex flex-col items-center gap-3"
      >
        <a
          href={KOA_SMS}
          className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-[15px] font-medium text-primary-foreground shadow-glow-cta transition-transform hover:-translate-y-0.5"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[hsl(var(--imessage))] text-white">
            <MessageSquare className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
          Or tap to text from your phone
        </a>
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our Terms and Privacy.
        </p>
      </motion.div>

      {/* Live chat demo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mt-20 w-full"
      >
        <div className="font-mono-tomo mb-4 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          — A real conversation —
        </div>
        <ChatMockup />
      </motion.div>
    </section>
  );
};
