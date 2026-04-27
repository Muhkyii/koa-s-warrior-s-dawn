import { useMemo } from "react";

const Petals = ({ count = 24 }: { count?: number }) => {
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 20,
        duration: 14 + Math.random() * 16,
        size: 6 + Math.random() * 10,
        opacity: 0.4 + Math.random() * 0.5,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 block rounded-[70%_30%_60%_40%/40%_60%_40%_60%] bg-sakura animate-float-petal"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.7}px`,
            opacity: p.opacity,
            animationDelay: `-${p.delay}s`,
            animationDuration: `${p.duration}s`,
            filter: "blur(0.5px)",
            boxShadow: "0 0 6px hsl(var(--sakura) / 0.5)",
          }}
        />
      ))}
    </div>
  );
};

export default Petals;