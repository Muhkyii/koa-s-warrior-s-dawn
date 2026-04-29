import { Link } from "react-router-dom";
import { TrustChip } from "@/components/TrustChip";

export const Nav = () => {
  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a
          href="#top"
          className="font-serif-italic text-[28px] font-normal tracking-tight text-foreground"
        >
          Koa
        </a>

        <TrustChip />

        <Link
          to="/dashboard"
          className="rounded-full border border-border/70 bg-surface/60 px-4 py-2 text-[13px] font-medium text-foreground backdrop-blur transition-colors hover:bg-surface"
        >
          Login
        </Link>
      </div>
    </header>
  );
};
