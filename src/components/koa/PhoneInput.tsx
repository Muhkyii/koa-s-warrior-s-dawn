import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type Country = { code: string; flag: string; name: string };

export const COUNTRIES: Country[] = [
  { code: "1",   flag: "🇺🇸", name: "United States" },
  { code: "1",   flag: "🇨🇦", name: "Canada" },
  { code: "52",  flag: "🇲🇽", name: "Mexico" },
  { code: "44",  flag: "🇬🇧", name: "United Kingdom" },
  { code: "61",  flag: "🇦🇺", name: "Australia" },
  { code: "33",  flag: "🇫🇷", name: "France" },
  { code: "49",  flag: "🇩🇪", name: "Germany" },
  { code: "39",  flag: "🇮🇹", name: "Italy" },
  { code: "34",  flag: "🇪🇸", name: "Spain" },
  { code: "55",  flag: "🇧🇷", name: "Brazil" },
  { code: "91",  flag: "🇮🇳", name: "India" },
  { code: "81",  flag: "🇯🇵", name: "Japan" },
  { code: "82",  flag: "🇰🇷", name: "South Korea" },
  { code: "86",  flag: "🇨🇳", name: "China" },
  { code: "971", flag: "🇦🇪", name: "United Arab Emirates" },
  { code: "966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "63",  flag: "🇵🇭", name: "Philippines" },
  { code: "234", flag: "🇳🇬", name: "Nigeria" },
  { code: "27",  flag: "🇿🇦", name: "South Africa" },
  { code: "351", flag: "🇵🇹", name: "Portugal" },
  { code: "31",  flag: "🇳🇱", name: "Netherlands" },
  { code: "46",  flag: "🇸🇪", name: "Sweden" },
];

export function PhoneInput({
  value,
  onChange,
  autoFocus,
}: {
  /** Full E.164 string, e.g. "+17862847802" */
  value: string;
  /** Called with full E.164 string on every change */
  onChange: (v: string) => void;
  autoFocus?: boolean;
}) {
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [digits, setDigits] = useState("");
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const initialized = useRef(false);

  // Initialize from incoming `value` exactly once.
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (!value) {
      onChange(`+${country.code}`);
      return;
    }
    const stripped = value.replace(/[^\d]/g, "");
    const match = COUNTRIES.find((c) => stripped.startsWith(c.code));
    if (match) {
      setCountry(match);
      setDigits(stripped.slice(match.code.length));
    } else {
      setDigits(stripped);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Click-outside closes dropdown
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (open && dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function emit(nextDigits: string, nextCountry: Country) {
    onChange(`+${nextCountry.code}${nextDigits}`);
  }

  function onTyped(raw: string) {
    const next = raw.replace(/[^\d]/g, "").slice(0, 15);
    setDigits(next);
    emit(next, country);
  }

  function pickCountry(c: Country) {
    setCountry(c);
    setOpen(false);
    emit(digits, c);
  }

  return (
    <div className="relative" ref={dropRef}>
      <div className="flex items-stretch overflow-hidden rounded-xl border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex shrink-0 items-center gap-1.5 border-r border-border bg-surface/40 px-3 text-sm hover:bg-surface"
        >
          <span className="text-base leading-none">{country.flag}</span>
          <span className="font-mono tabular-nums">+{country.code}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          autoFocus={autoFocus}
          placeholder="phone number"
          value={digits}
          onChange={(e) => onTyped(e.target.value)}
          className="w-full bg-transparent px-3 py-2.5 font-mono tabular-nums text-sm focus:outline-none"
        />
      </div>

      {open && (
        <div className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-border bg-popover py-1 shadow-card">
          {COUNTRIES.map((c) => (
            <button
              key={`${c.code}-${c.name}`}
              type="button"
              onClick={() => pickCountry(c)}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-surface ${
                country === c ? "bg-surface/60" : ""
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-base leading-none">{c.flag}</span>
                <span>{c.name}</span>
              </span>
              <span className="font-mono tabular-nums text-muted-foreground">
                +{c.code}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
