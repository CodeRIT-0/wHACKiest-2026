import Link from "next/link";
import { ArrowUpRight, Plus } from "@phosphor-icons/react/dist/ssr";
import SectionHeader from "../SectionHeader";
import SplitSection from "../SplitSection";

// TODO: real sponsors. Fill `name` (and later a logo) per slot; empty slots read as "open".
type Slot = { name?: string };
// tiers and notes from the wHACKiest 2026 brochure (Sponsorship structure)
const TIERS: { id: string; label: string; note: string; slots: Slot[]; size: "title" | "gold" | "silver" | "community" }[] = [
  { id: "title", label: "Title sponsor", note: "Maximum brand visibility, stage recognition, mentor or judge teams", slots: [{}], size: "title" },
  { id: "platinum", label: "Platinum sponsor", note: "Prominent placement and participant engagement", slots: [{}, {}], size: "gold" },
  { id: "gold", label: "Gold sponsor", note: "Visibility through event materials and acknowledgements", slots: [{}, {}, {}], size: "silver" },
];

// running slot number where each tier starts (SLOT-01, SLOT-02, …)
const OFFSETS = TIERS.map((_, t) => TIERS.slice(0, t).reduce((sum, tier) => sum + tier.slots.length, 0));

const GRID = { title: "grid-cols-1", gold: "sm:grid-cols-2", silver: "grid-cols-2 sm:grid-cols-3", community: "grid-cols-2 sm:grid-cols-4" };
const HEIGHT = { title: "h-40 sm:h-48", gold: "h-32 sm:h-36", silver: "h-24 sm:h-28", community: "h-20" };

// the legacy of wHACKiest, across previous editions (from the brochure)
const FACTS = [
  ["3000+", "", "participants"],
  ["1000+", "", "teams"],
  ["20+", "", "industry partners"],
];

// One sponsor socket: a blueprint frame with corner brackets, a slot code and an "open" light
function SlotCard({ slot, code, size }: { slot: Slot; code: string; size: keyof typeof HEIGHT }) {
  const open = !slot.name;
  return (
    <div className={`group relative ${HEIGHT[size]} border border-ink/70 bg-panel transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[5px_5px_0_var(--accent)]`}>
      {/* corner brackets */}
      {["left-1.5 top-1.5 border-l border-t", "right-1.5 top-1.5 border-r border-t", "bottom-1.5 left-1.5 border-b border-l", "bottom-1.5 right-1.5 border-b border-r"].map((c) => (
        <span key={c} aria-hidden className={`absolute h-2.5 w-2.5 border-accent ${c}`} />
      ))}
      <div className="absolute inset-x-3 top-2.5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
        <span>{code}</span>
        <span className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${open ? "bg-accent motion-safe:animate-pulse" : "bg-trace"}`} />
          {open ? "Open" : "Live"}
        </span>
      </div>
      <div className="grid h-full place-items-center px-4 pt-4 text-center">
        {open ? (
          <span className={`flex items-center gap-2 font-display font-extrabold uppercase tracking-[-0.01em] text-ink/25 transition-colors group-hover:text-accent ${size === "title" ? "text-2xl sm:text-4xl" : size === "community" ? "text-xs" : "text-sm sm:text-base"}`}>
            <Plus size={size === "title" ? 26 : 14} weight="bold" />
            Your logo
          </span>
        ) : (
          <span className="font-display text-lg font-extrabold">{slot.name}</span>
        )}
      </div>
    </div>
  );
}

export default function Sponsors() {
  return (
    <SplitSection id="sponsors" wide>
      <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)]">
        <SectionHeader index="06" label="Sponsors" title="Powered by collaboration" />
        <p className="max-w-[42ch] text-muted">
          The teams and companies wiring up wHACKiest 2026. Every slot on this board is a socket waiting for the right partner.
        </p>
      </div>

      {/* tier board: a bus line runs down the left and branches into each tier */}
      <div data-trace className="relative mt-12 pl-8 sm:pl-12">
        <svg aria-hidden data-draw className="pointer-events-none absolute inset-y-0 left-0 h-full w-8 sm:w-12" preserveAspectRatio="none" viewBox="0 0 48 100" fill="none">
          <path d="M8 0V100" className="stroke-trace/50" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
        </svg>
        <div data-stagger className="space-y-8">
          {TIERS.map((tier, t) => (
            <div key={tier.id} className="relative">
              {/* branch from the bus into this tier */}
              <span aria-hidden className="absolute -left-6 top-3 h-px w-5 bg-trace/50 sm:-left-10 sm:w-9" />
              <span aria-hidden className="absolute -left-[27px] top-[9px] h-2 w-2 rounded-full border border-trace bg-bg sm:-left-[43px]" />
              <div className="mb-3 flex items-baseline gap-3">
                <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em]">{tier.label}</h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{tier.note}</span>
              </div>
              <div className={`grid gap-3 sm:gap-4 ${GRID[tier.size]}`}>
                {tier.slots.map((slot, i) => (
                  <SlotCard key={i} slot={slot} size={tier.size} code={`SLOT-${String(OFFSETS[t] + i + 1).padStart(2, "0")}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* rolling strip of open slots */}
      <div aria-hidden className="relative mt-12 overflow-hidden border-y border-ink/20 py-3 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-[marquee_30s_linear_infinite] gap-10 font-mono text-xs uppercase tracking-[0.2em] text-muted motion-reduce:animate-none">
          {Array.from({ length: 2 }, (_, k) =>
            ["Your logo", "Track partner", "Your logo", "Mentor partner", "Your logo", "Swag partner", "Your logo", "Cloud credits"].map((t, i) => (
              <span key={`${k}-${i}`} className="flex items-center gap-10">
                {t}
                <span className="text-accent">◆</span>
              </span>
            )),
          )}
        </div>
      </div>

      {/* call to action */}
      <div className="theme-dark relative mt-12 grid gap-8 overflow-hidden rounded-[24px] p-6 sm:p-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">Partner with CodeRIT</p>
          <h3 className="display-wide mt-3 text-3xl leading-[1.02] sm:text-5xl">
            Put your name on the next era<span className="text-accent">.</span>
          </h3>
          <p className="mt-4 max-w-[46ch] text-muted">
            Contribute to the prize pool, bring your own problem statement, judge the final round, or meet emerging tech talent.
            Sponsors don&apos;t just support wHACKiest, they enable it.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="mailto:coderit@msrit.edu?subject=wHACKiest%202026%20sponsorship"
              className="inline-flex items-center gap-2 bg-accent px-5 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-[#050505] transition-transform active:scale-[0.98]"
            >
              Become a sponsor
              <ArrowUpRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
        <dl className="relative grid grid-cols-3 divide-x divide-ink/15 border-y border-ink/15">
          {FACTS.map(([v, unit, label]) => (
            <div key={label} className="flex flex-col-reverse justify-end px-3 py-4 first:pl-0">
              <dt className="mt-1.5 truncate font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{label}</dt>
              <dd className="font-display text-2xl font-extrabold leading-none tracking-[-0.03em] [font-stretch:115%] sm:text-4xl">
                {v}
                {unit && <span className="ml-1 font-mono text-xs font-normal text-accent">{unit}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </SplitSection>
  );
}
