import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import SectionHeader from "../SectionHeader";
import SplitSection from "../SplitSection";

// `fit` sizes each mark by eye: a wide wordmark needs less height than a compact badge to weigh the same
type Partner = { name: string; logo: string; width: number; height: number; href?: string; role?: string; fit?: string; pad?: string };

// Row 1: hosting partner, then title sponsor. Row 2: powered by.
const HEADLINE: Partner[] = [
  { name: "Devnovate", logo: "/assets/sponsors/devnovate.png", width: 724, height: 147, href: "https://devnovate.co", role: "Hosting partner" },
  { name: "tryb", logo: "/assets/sponsors/tryb.png", width: 673, height: 240, href: "https://betryb.com/", role: "Title sponsor" },
];
const POWERED_BY: Partner[] = [
  { name: "ElevenLabs", logo: "/assets/sponsors/elevenlabs.png", width: 434, height: 83, href: "https://elevenlabs.io", fit: "max-h-6 sm:max-h-8" },
  { name: "AWS Student Builder Group", logo: "/assets/sponsors/aws-sbg.png", width: 912, height: 213, href: "https://builder.aws.com/community/student-builder-groups", fit: "max-h-16 sm:max-h-20", pad: "px-2 sm:px-3" },
  { name: ".xyz", logo: "/assets/sponsors/xyz.png", width: 251, height: 146, href: "https://gen.xyz", fit: "max-h-11 sm:max-h-14" },
];

// the legacy of wHACKiest, across previous editions (from the brochure)
const FACTS = [
  ["3000+", "", "participants"],
  ["1000+", "", "teams"],
  ["20+", "", "industry partners"],
];

// One sponsor socket: a blueprint frame with corner brackets, a role label and a "live" light
function PartnerCard({ partner, big }: { partner: Partner; big?: boolean }) {
  const card = (
    <div className={`group relative ${big ? "h-40 sm:h-48" : "h-28 sm:h-32"} border border-ink/70 bg-panel transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[5px_5px_0_var(--accent)]`}>
      {["left-1.5 top-1.5 border-l border-t", "right-1.5 top-1.5 border-r border-t", "bottom-1.5 left-1.5 border-b border-l", "bottom-1.5 right-1.5 border-b border-r"].map((c) => (
        <span key={c} aria-hidden className={`absolute h-2.5 w-2.5 border-accent ${c}`} />
      ))}
      <div className="absolute inset-x-3 top-2.5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
        <span>{partner.role ?? partner.name}</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-trace" />
          Live
        </span>
      </div>
      <div className={`grid h-full place-items-center pt-5 ${partner.pad ?? (big ? "px-8 sm:px-12" : "px-6 sm:px-8")}`}>
        <Image
          src={partner.logo}
          alt={partner.name}
          width={partner.width}
          height={partner.height}
          sizes={big ? "(min-width: 640px) 360px, 70vw" : "(min-width: 640px) 220px, 60vw"}
          className={`h-auto w-auto max-w-full object-contain ${partner.fit ?? (big ? "max-h-16 sm:max-h-20" : "max-h-10 sm:max-h-12")}`}
        />
      </div>
    </div>
  );
  if (!partner.href) return card;
  return (
    <a href={partner.href} target="_blank" rel="noopener noreferrer" aria-label={`${partner.name} (opens in a new tab)`} className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
      {card}
    </a>
  );
}

function Tier({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* branch from the bus into this tier */}
      <span aria-hidden className="absolute -left-6 top-3 h-px w-5 bg-trace/50 sm:-left-10 sm:w-9" />
      <span aria-hidden className="absolute -left-[27px] top-[9px] h-2 w-2 rounded-full border border-trace bg-bg sm:-left-[43px]" />
      <div className="mb-3 flex items-baseline gap-3">
        <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em]">{label}</h3>
        {note && <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{note}</span>}
      </div>
      {children}
    </div>
  );
}

export default function Sponsors() {
  return (
    <SplitSection id="sponsors" wide>
      <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)]">
        <SectionHeader index="06" label="Sponsors" title="Powered by collaboration" />
        <p className="max-w-[42ch] text-muted">The teams and companies wiring up wHACKiest 2026.</p>
      </div>

      {/* tier board: a bus line runs down the left and branches into each tier */}
      <div data-trace className="relative mt-12 pl-8 sm:pl-12">
        <svg aria-hidden data-draw className="pointer-events-none absolute inset-y-0 left-0 h-full w-8 sm:w-12" preserveAspectRatio="none" viewBox="0 0 48 100" fill="none">
          <path d="M8 0V100" className="stroke-trace/50" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
        </svg>
        <div data-stagger className="space-y-8">
          <Tier label="Hosting partner & title sponsor">
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {HEADLINE.map((p) => (
                <PartnerCard key={p.name} partner={p} big />
              ))}
            </div>
          </Tier>
          <Tier label="Powered by">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {POWERED_BY.map((p) => (
                <PartnerCard key={p.name} partner={p} />
              ))}
            </div>
          </Tier>
        </div>
      </div>

      {/* rolling strip of partner names */}
      <div aria-hidden className="relative mt-12 overflow-hidden border-y border-ink/20 py-3 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-[marquee_30s_linear_infinite] gap-10 font-mono text-xs uppercase tracking-[0.2em] text-muted motion-reduce:animate-none">
          {Array.from({ length: 2 }, (_, k) =>
            [...HEADLINE, ...POWERED_BY, ...HEADLINE, ...POWERED_BY].map((p, i) => (
              <span key={`${k}-${i}`} className="flex items-center gap-10">
                {p.name}
                <span className="text-accent">â—†</span>
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
            <a
              href="mailto:coderit@msrit.edu?subject=wHACKiest%202026%20sponsorship"
              className="inline-flex items-center gap-2 bg-accent px-5 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-[#050505] transition-transform active:scale-[0.98]"
            >
              Become a sponsor
              <ArrowUpRight size={14} weight="bold" />
            </a>
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
