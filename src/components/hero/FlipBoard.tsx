"use client";

import { Fragment } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { useHydrated } from "@/hooks/useHydrated";
import { useNow } from "@/hooks/useNow";
import { boardAt, KICK_OFF_LABEL } from "./hero-status";

// The countdown as a split-flap departure board: each digit is a card hinged across the middle,
// and when it changes the top half falls away and the new bottom half slaps down over the old
// one. Everything comes from the shared one-second clock, so the board and the seconds dial
// change on the same tick. Before hydration it shows dashes, so server and browser agree.

const UNITS = ["Days", "Hours", "Minutes", "Seconds"];
const STATS = [
  ["24", "hours", "On the clock"],
  ["2–4", "", "Per team"],
  ["₹50,000", "", "Prize pool"],
] as const;

const pad = (n: number) => String(n).padStart(2, "0");
const split = (s: number) => [pad(Math.floor(s / 86400)), pad(Math.floor((s % 86400) / 3600)), pad(Math.floor((s % 3600) / 60)), pad(s % 60)];

// lit from above: the top half of a card catches more light than the bottom
const TOP = "linear-gradient(180deg,#3a3630 0%,#27241f 100%)";
const BOTTOM = "linear-gradient(180deg,#1f1d19 0%,#141310 100%)";

function Half({ pos, digit, style, ...motionProps }: { pos: "top" | "bottom"; digit: string } & HTMLMotionProps<"span">) {
  const top = pos === "top";
  return (
    <motion.span
      {...motionProps}
      className={`absolute inset-x-0 h-1/2 overflow-hidden [backface-visibility:hidden] ${
        top ? "top-0 origin-bottom rounded-t-[0.13em]" : "bottom-0 origin-top rounded-b-[0.13em]"
      }`}
      style={{ background: top ? TOP : BOTTOM, ...style }}
    >
      {/* the full digit, twice the half's height, so each half shows only its share of the glyph */}
      <span className={`absolute inset-x-0 flex h-[200%] items-center justify-center ${top ? "top-0" : "bottom-0"}`}>{digit}</span>
    </motion.span>
  );
}

function Flap({ value, prev, reduce }: { value: string; prev: string; reduce: boolean }) {
  const flipping = !reduce && value !== prev;
  return (
    <span
      data-flap
      className="relative block h-[1.34em] w-[0.98em] font-display font-extrabold leading-none tabular-nums text-[#fff3dc] [font-stretch:100%] [perspective:5em] [text-shadow:0_0.03em_0_rgba(0,0,0,0.6)]"
    >
      <Half pos="top" digit={value} />
      {/* the old bottom half stays until the new flap lands over it */}
      <Half pos="bottom" digit={flipping ? prev : value} />
      {flipping && (
        <>
          <Half
            key={`fall-${prev}${value}`}
            pos="top"
            digit={prev}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: -90 }}
            transition={{ duration: 0.24, ease: [0.55, 0, 0.9, 0.45] }}
            style={{ zIndex: 2 }}
          />
          <Half
            key={`land-${prev}${value}`}
            pos="bottom"
            digit={value}
            initial={{ rotateX: 90 }}
            animate={{ rotateX: 0 }}
            transition={{ delay: 0.22, duration: 0.36, ease: [0.25, 1.55, 0.5, 1] }}
            style={{ zIndex: 2 }}
          />
        </>
      )}
      {/* the hinge, and the two pins it turns on */}
      <span aria-hidden className="absolute inset-x-0 top-1/2 z-[3] h-[0.04em] -translate-y-1/2 bg-black/85" />
      <span aria-hidden className="absolute -left-[0.035em] top-1/2 z-[3] h-[0.18em] w-[0.07em] -translate-y-1/2 rounded-full bg-[#5a554b]" />
      <span aria-hidden className="absolute -right-[0.035em] top-1/2 z-[3] h-[0.18em] w-[0.07em] -translate-y-1/2 rounded-full bg-[#5a554b]" />
    </span>
  );
}

export default function FlipBoard() {
  const now = useNow();
  const prefersReduced = useReducedMotion();
  const hydrated = useHydrated();
  const reduce = hydrated && !!prefersReduced;

  const board = now === null ? null : boardAt(now);
  const cur = board ? split(board.left) : ["--", "--", "--", "--"];
  // one second ago there was one more second left: any digit that differs flips this tick
  const prev = board && board.left > 0 ? split(board.left + 1) : cur;
  const tick = now !== null && now % 2 === 0;

  return (
    <div data-board className="theme-dark relative overflow-hidden rounded-[20px] border-2 border-ink shadow-[6px_6px_0_var(--accent)]">
      <span aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
      <span aria-hidden className="pointer-events-none absolute -left-16 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgba(253,156,54,0.18),transparent)]" />

      <div className="relative flex flex-col gap-3 p-3.5 sm:gap-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-7 lg:py-4">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em]">
            <span className="flex items-center gap-2 text-accent">
              <span className={`h-1.5 w-1.5 rounded-full bg-accent transition-opacity duration-300 ${tick ? "opacity-100" : "opacity-30"}`} />
              {board?.label ?? "T-minus to kick-off"}
            </span>
            <span className="text-muted">{KICK_OFF_LABEL}</span>
          </p>

          <div
            role="timer"
            aria-label={board ? `${cur[0]} days, ${cur[1]} hours, ${cur[2]} minutes. ${board.label}` : "Countdown to kick-off"}
            className="mt-3 flex items-start gap-1.5 text-[28px] min-[400px]:text-[32px] sm:gap-2.5 sm:text-[42px] lg:text-[min(46px,5.6vh)]"
          >
            {UNITS.map((unit, g) => (
              <Fragment key={unit}>
                {g > 0 && (
                  <span aria-hidden className="flex h-[1.34em] flex-col justify-center gap-[0.2em] px-[0.04em]">
                    {[0, 1].map((k) => (
                      <span key={k} className={`h-[0.11em] w-[0.11em] rounded-full bg-accent transition-opacity duration-300 ${tick ? "opacity-100" : "opacity-25"}`} />
                    ))}
                  </span>
                )}
                <span className="flex flex-col items-center">
                  <span aria-hidden className="flex gap-[0.07em]">
                    {cur[g].split("").map((ch, i) => (
                      <Flap key={i} value={ch} prev={prev[g][i] ?? ch} reduce={reduce} />
                    ))}
                  </span>
                  <span aria-hidden className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-muted sm:text-[10px]">
                    {unit}
                  </span>
                </span>
              </Fragment>
            ))}
          </div>
        </div>

        {/* the numbers that matter, on the same board */}
        <dl className="grid shrink-0 grid-cols-3 divide-x divide-line border-t border-line pt-3 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
          {STATS.map(([n, unit, label]) => (
            <div key={label} className="flex flex-col-reverse px-3 first:pl-0 lg:px-5 lg:first:pl-0">
              <dt className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">{label}</dt>
              <dd className="display-wide text-2xl leading-none sm:text-[28px]">
                {n}
                {unit && <span className="ml-1 font-mono text-[11px] font-normal tracking-normal text-accent">{unit}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
