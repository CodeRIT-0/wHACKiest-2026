import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Reveal from "../motion/Reveal";
import SectionHeader from "../SectionHeader";
import SplitSection from "../SplitSection";

// TODO: real sponsors (name + logo); the grid holds six around the hub
const sponsors = ["Sponsor", "Sponsor", "Sponsor", "Sponsor", "Sponsor", "Sponsor"];

// grid cells (col, row) around the hub at (1, 1), as percentages of the board
const COLS = ["16.67%", "50%", "83.33%"];
const CELLS = [
  [0, 0],
  [1, 0],
  [2, 0],
  [0, 2],
  [1, 2],
  [2, 2],
];

export default function Sponsors() {
  return (
    <SplitSection
      id="sponsors"
    >
      <SectionHeader index="06" label="Sponsors" title="Powered by collaboration" />
      <Reveal delay={0.1}>
        <p className="mt-5 max-w-[42ch] text-muted">The teams and companies wiring up wHACKiest 2026.</p>
      </Reveal>

      <Reveal delay={0.15}>
        {/* 1980s network: a hub computer wired to every sponsor window */}
        <div data-trace data-stagger className="relative mt-10 grid h-[420px] grid-cols-3 grid-rows-3 gap-x-3 gap-y-8 sm:gap-x-5">
          <svg aria-hidden data-draw className="absolute inset-0 h-full w-full" fill="none">
            {CELLS.map(([c, r], i) => {
              const bus = r === 0 ? "33%" : "67%";
              const end = r === 0 ? "16%" : "84%";
              const route = [
                ["50%", "50%", "50%", bus],
                ["50%", bus, COLS[c], bus],
                [COLS[c], bus, COLS[c], end],
              ];
              // blue wire with an orange pulse running out from the hub
              return (
                <g key={i} strokeWidth={1.5}>
                  {route.map(([x1, y1, x2, y2], j) => (
                    <g key={j}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-blue/40" />
                      <line x1={x1} y1={y1} x2={x2} y2={y2} className="wire-pulse stroke-accent" />
                    </g>
                  ))}
                </g>
              );
            })}
          </svg>

          {CELLS.map(([c, r], i) => (
            <div
              key={i}
              style={{ gridColumnStart: c + 1, gridRowStart: r + 1 }}
              className="relative flex flex-col overflow-hidden border border-ink/70 bg-panel shadow-[3px_3px_0_color-mix(in_srgb,var(--fg)_85%,transparent)] transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center gap-1 border-b border-ink/70 bg-panel px-1.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-ink/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-ink/40" />
                <span className="ml-1 h-1.5 flex-1 rounded-full bg-ink/10" />
              </div>
              <div className="grid flex-1 place-items-center p-2 text-center font-display text-sm font-bold uppercase tracking-[0.04em] text-ink/40">
                {sponsors[i]}
              </div>
            </div>
          ))}

          {/* hub */}
          <div className="relative col-start-2 row-start-2 flex flex-col items-center justify-center">
            <div className="w-full max-w-[120px] rounded-md border border-[#cfc4aa] bg-[linear-gradient(#efe8d7,#e2d9c3)] p-1.5 shadow-[0_14px_24px_-14px_rgba(70,50,15,0.6)]">
              <div className="scanlines grid aspect-[4/3] place-items-center rounded-sm bg-[#0d1714] font-mono text-[10px] font-bold text-[#ffb35c] [text-shadow:0_0_6px_#ffb35c]">
                CodeRIT
              </div>
            </div>
            <div className="h-2 w-20 rounded-b-md bg-[linear-gradient(#e6dec9,#cdc2a7)]" />
          </div>
        </div>
      </Reveal>

      <Link
        href="/#contact"
        className="mt-8 inline-flex items-center gap-2 border border-ink px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.06em] transition hover:border-accent hover:text-accent active:scale-[0.98]"
      >
        Become a sponsor
        <ArrowUpRight size={14} weight="bold" />
      </Link>
    </SplitSection>
  );
}
