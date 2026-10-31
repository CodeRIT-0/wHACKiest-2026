"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, CaretLeft, CaretRight, Check } from "@phosphor-icons/react";
import TrackArt, { type ArtKind } from "../tracks/TrackArt";
import { useTrack } from "../tracks/TrackContext";

export type Problem = { id: string; track: string; art: ArtKind; title: string; blurb: string; detail: string };

const PER_PAGE = 4;
// x (in a 0-1000 wide board) of each card column's centre, and the chip pin + bend height that
// feeds it. Outer columns bend high, inner ones low, so no two traces cross.
const TRACES = [
  { col: 119, pin: 470, bend: 84 },
  { col: 373, pin: 490, bend: 108 },
  { col: 627, pin: 510, bend: 108 },
  { col: 881, pin: 530, bend: 84 },
];
// decorative side traces with little components on them, like the board in the reference
const SIDE = ["M446 22H300V10H180", "M446 42H330V58H230", "M554 22H700V10H820", "M554 42H670V58H770"];
const PARTS = [
  [240, 6], [360, 18], [280, 54], [720, 6], [640, 18], [710, 54],
];

// TODO: the "what we look for" list is a placeholder until the judging criteria are final
const LOOK_FOR = ["A working prototype over slides", "A real user with a real problem", "Something you can show live at final judging"];

// "Real problems. Bigger possibilities.": a chip feeding a row of problem statement cards.
// Picking a card (hover, focus or click) routes current down its trace and opens its brief.

const dirOf = (track: string) => track.toLowerCase().replace(/ & /g, "_and_").replace(/\s+/g, "_");
export default function ProblemBoard({ problems }: { problems: Problem[] }) {
  const reduce = useReducedMotion();
  const [page, setPage] = useState(0);
  // each page holds one statement per track, in track order, so the card index is the track;
  // that index is shared with the Tracks terminal above
  const { track: active, setTrack: setActive } = useTrack();
  const pages = Math.ceil(problems.length / PER_PAGE);
  const visible = problems.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const current = visible[active] ?? visible[0];

  const goTo = (n: number) => {
    setPage((n + pages) % pages);
  };

  return (
    <div className="mt-12">
      {/* carries on from the Tracks terminal: same prompt, now reading the selected track */}
      <p className="mb-6 text-center font-mono text-[12px] text-muted lg:mb-3">
        <span className="text-[#1f8a4c]">hacker@whackiest</span>:<span className="text-blue">~</span>$ cat ./tracks/
        <span className="font-bold text-accent">{dirOf(current.track)}</span>/problems
      </p>
      {/* the chip and its traces (only where the four cards sit side by side) */}
      <div aria-hidden data-trace className="relative hidden h-36 lg:block">
        <svg data-draw viewBox="0 0 1000 144" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" fill="none">
          {/* side traces stay powered: lit orange, with current running out from the chip */}
          <g style={{ filter: "drop-shadow(0 0 3px var(--accent))" }}>
            {SIDE.map((d) => (
              <g key={d}>
                <path d={d} className="stroke-accent/60" strokeWidth={2} vectorEffect="non-scaling-stroke" />
                <path d={d} className="wire-pulse stroke-[#fff6e6]" strokeWidth={2} vectorEffect="non-scaling-stroke" />
              </g>
            ))}
            {PARTS.map(([x, y]) => (
              <rect key={`${x}-${y}`} x={x} y={y} width="14" height="8" className="fill-bg stroke-accent" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
            ))}
          </g>
          {TRACES.map((t, i) => {
            const d = `M${t.pin} 64V${t.bend}H${t.col}V144`;
            const on = i === active;
            return (
              <g key={t.col}>
                <path d={d} className={`transition-colors duration-300 ${on ? "stroke-accent" : "stroke-ink/20"}`} strokeWidth={on ? 2.5 : 2} vectorEffect="non-scaling-stroke" />
                {/* the pulse is hidden by CSS under reduced motion */}
                {on && <path d={d} className="wire-pulse stroke-[#fff6e6]" strokeWidth={2.5} vectorEffect="non-scaling-stroke" />}
              </g>
            );
          })}
        </svg>
        {/* chip */}
        <div className="absolute left-1/2 top-0 flex h-16 w-28 -translate-x-1/2 flex-col items-center justify-center bg-ink font-mono text-[10px] uppercase tracking-[0.14em] text-bg before:absolute before:-left-[7px] before:bottom-2 before:top-2 before:w-[5px] before:bg-[repeating-linear-gradient(0deg,var(--fg)_0_3px,transparent_3px_8px)] after:absolute after:-right-[7px] after:bottom-2 after:top-2 after:w-[5px] after:bg-[repeating-linear-gradient(0deg,var(--fg)_0_3px,transparent_3px_8px)]">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_var(--accent)]" />
            WHK-26
          </span>
          <span className="mt-1 text-accent">{current.id}</span>
        </div>
      </div>

      {/* cards */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={page}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          data-stagger
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {visible.map((pb, i) => {
            const on = i === active;
            return (
              <li key={pb.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`group flex h-full w-full flex-col border bg-panel p-4 text-left transition-[border-color,box-shadow,transform] duration-300 ${
                    on ? "-translate-y-1 border-accent shadow-[5px_5px_0_var(--accent)]" : "border-ink/25 hover:border-ink/60"
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span className={`grid h-8 w-8 place-items-center font-display text-sm font-bold transition-colors ${on ? "bg-accent text-ink" : "bg-ink text-bg"}`}>
                      {page * PER_PAGE + i + 1}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{pb.id}</span>
                  </span>
                  <span className={`mt-4 block aspect-[5/3] border border-line bg-bg p-1 ${on ? "is-active" : ""}`}>
                    <TrackArt kind={pb.art} tone="dark" />
                  </span>
                  <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-accent">{pb.track}</span>
                  <span className="mt-1 text-lg font-semibold leading-snug">{pb.title}</span>
                  <span className="mt-1 line-clamp-2 text-sm text-muted">{pb.blurb}</span>
                  <span className={`mt-auto flex items-center justify-between pt-5 text-xs font-semibold uppercase tracking-[0.06em] ${on ? "text-ink" : "text-muted"}`}>
                    Read details
                    <ArrowRight size={14} weight="bold" className={`transition-transform ${on ? "translate-x-0.5 text-accent" : ""}`} />
                  </span>
                </button>
              </li>
            );
          })}
        </motion.ul>
      </AnimatePresence>

      {/* paging */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Array.from({ length: pages }, (_, n) => (
            <button
              key={n}
              type="button"
              onClick={() => goTo(n)}
              aria-label={`Page ${n + 1}`}
              aria-current={n === page ? "page" : undefined}
              className="grid h-6 place-items-center"
            >
              <span className={`block h-2 rounded-full transition-[width,background-color] duration-300 ${n === page ? "w-6 bg-accent" : "w-2 bg-ink/25 hover:bg-ink/50"}`} />
            </button>
          ))}
          <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
            {page * PER_PAGE + 1}–{page * PER_PAGE + visible.length} of {problems.length}
          </span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => goTo(page - 1)} aria-label="Previous problem statements" className="grid h-9 w-9 place-items-center border border-ink transition-colors hover:bg-ink hover:text-bg">
            <CaretLeft size={14} weight="bold" />
          </button>
          <button type="button" onClick={() => goTo(page + 1)} aria-label="Next problem statements" className="grid h-9 w-9 place-items-center border border-ink transition-colors hover:bg-ink hover:text-bg">
            <CaretRight size={14} weight="bold" />
          </button>
        </div>
      </div>

      {/* brief for the selected statement */}
      <div aria-live="polite" className="mt-6 border-2 border-ink bg-panel shadow-[6px_6px_0_var(--fg)]">
        <div className="flex items-center gap-2 border-b-2 border-ink bg-panel px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em]">
          <span className="text-accent">{current.id}</span>
          <span className="text-muted">/</span>
          <span className="truncate">{current.track}</span>
          <span className="ml-auto text-muted">brief.txt</span>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            initial={reduce ? false : { opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] md:p-6"
          >
            <div>
              <h3 className="display-wide text-2xl leading-tight">{current.title}</h3>
              <p className="mt-3 text-muted">{current.detail}</p>
            </div>
            <div className="md:border-l md:border-dashed md:border-line md:pl-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">What we look for</p>
              <ul className="mt-3 space-y-2 text-sm">
                {LOOK_FOR.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check size={16} weight="bold" className="mt-0.5 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-5 inline-flex items-center gap-2 bg-ink px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.06em] text-bg transition-transform active:scale-[0.98]"
              >
                Take this on
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
