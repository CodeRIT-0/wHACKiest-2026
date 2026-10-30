import { ERAS } from "@/lib/eras";

// Transition between two eras: a giant outlined year slides sideways as you scroll past, over a
// ruled line that draws itself across (both driven by ScrollMotion). Purely decorative.
export default function EraDivider({ era, direction = "right" }: { era: string; direction?: "left" | "right" }) {
  const i = ERAS.findIndex((e) => e.id === era);
  const { year, tagline } = ERAS[i];
  return (
    <div aria-hidden className="pointer-events-none relative overflow-hidden py-10 sm:py-16">
      <p
        data-era-year={direction}
        className="whitespace-nowrap text-center font-display text-[30vw] font-extrabold leading-[0.8] tracking-[-0.04em] text-transparent [-webkit-text-stroke:1.5px_var(--fg)] [font-stretch:125%] opacity-50 lg:text-[22vw]"
      >
        {year}
      </p>
      <div className="relative mx-auto -mt-[4vw] flex max-w-[1100px] items-center gap-4 px-6">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">Era {String(i + 1).padStart(2, "0")}</span>
        <span data-era-rule className="h-px flex-1 origin-left bg-ink/40" />
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{tagline}</span>
      </div>
    </div>
  );
}
