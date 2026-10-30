"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const LOOPS = 7; // each drum runs through the digits a few times before it lands
const STRIP = Array.from({ length: LOOPS * 10 }, (_, i) => i % 10);
const DRUM_TIME = 1.6; // first drum; each next one stops a beat later
const DRUM_STAGGER = 0.35;
const TICKS = 30;

// Prize pool as a chronograph: press the stopwatch crown (or let the vault press it when it
// unlocks) and the hand sweeps while the counter drums roll, left to right, onto the total.
export default function PrizeChrono({ value, armed }: { value: number; armed: boolean }) {
  const reduce = useReducedMotion();
  const digits = String(value).split("").map(Number);
  const run = DRUM_TIME + DRUM_STAGGER * (digits.length - 1);
  const [starts, setStarts] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const done = reduce || (starts > 0 && !running);

  const start = useCallback(() => {
    if (running) return;
    setStarts((n) => n + 1);
    setRunning(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setRunning(false), (run + 0.15) * 1000);
  }, [running, run]);

  // the vault starts the clock the first time it opens
  useEffect(() => {
    if (!armed || starts > 0 || reduce) return;
    const t = setTimeout(start, 250);
    return () => clearTimeout(t);
  }, [armed, starts, reduce, start]);

  useEffect(() => () => clearTimeout(timer.current), []);

  // group digits Indian style: 50,000 -> [5,0] , [0,0,0]
  const head = digits.slice(0, digits.length - 3);
  const tail = digits.slice(-3);
  const lit = running || done;

  return (
    <div className="mt-6 flex items-center gap-3">
      <div className="relative border border-ink bg-panel p-2.5 shadow-[4px_4px_0_var(--fg)]">
        {/* seconds track: sweeps orange while the clock runs */}
        <div aria-hidden className="mb-2 flex items-end justify-between px-0.5">
          {Array.from({ length: TICKS }, (_, i) => (
            <span
              key={i}
              className={`w-px transition-colors ${i % 5 === 0 ? "h-2.5" : "h-1.5"} ${lit ? "bg-accent" : "bg-ink/30"}`}
              style={{ transitionDuration: lit ? "0.12s" : "0s", transitionDelay: running ? `${((i / TICKS) * run).toFixed(2)}s` : "0s" }}
            />
          ))}
        </div>

        {/* counter drums */}
        <div role="img" aria-label={`Prize pool: ₹${value.toLocaleString("en-IN")}`} className="flex items-center gap-1 border border-ink/40 bg-bg p-1">
          <span aria-hidden className="px-1 font-display text-2xl font-extrabold text-accent sm:text-3xl">
            ₹
          </span>
          {head.map((d, i) => (
            <Drum key={`h${i}`} digit={d} index={i} starts={starts} reduce={!!reduce} />
          ))}
          <span aria-hidden className="self-end pb-1 font-display text-2xl font-extrabold text-ink">
            ,
          </span>
          {tail.map((d, i) => (
            <Drum key={`t${i}`} digit={d} index={head.length + i} starts={starts} reduce={!!reduce} />
          ))}
        </div>

        <div className="mt-1.5 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.18em]">
          <span aria-hidden className="text-muted">Chrono / WH-2026</span>
          <motion.span
            aria-live="polite"
            initial={false}
            animate={done ? { opacity: 1, scale: [0.7, 1.12, 1] } : { opacity: 0.7, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={`font-bold ${done ? "text-accent" : "text-muted"}`}
          >
            {done ? "Prize pool" : running ? "Counting…" : "Press the crown"}
          </motion.span>
        </div>
      </div>

      <Stopwatch starts={starts} running={running} run={run} reduce={!!reduce} onPress={start} />
    </div>
  );
}

function Stopwatch({ starts, running, run, reduce, onPress }: { starts: number; running: boolean; run: number; reduce: boolean; onPress: () => void }) {
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={running}
      aria-label="Press the stopwatch crown to reveal the prize pool"
      className="group relative h-20 w-16 shrink-0 disabled:cursor-wait"
    >
      <svg viewBox="0 0 64 80" aria-hidden className="line-art h-full w-full overflow-visible" fill="none" strokeLinecap="round">
        {/* crown: dips when pressed */}
        <motion.g key={`crown-${starts}`} initial={false} animate={starts && !reduce ? { y: [0, 4, 0] } : { y: 0 }} transition={{ duration: 0.3 }} className="stroke-ink">
          <circle cx={32} cy={6} r={4} />
          <rect x={27} y={10} width={10} height={6} rx={1.5} className="fill-bg transition-colors group-hover:fill-accent" />
        </motion.g>
        <line x1={32} y1={16} x2={32} y2={21} className="stroke-ink" />
        {/* side pushers */}
        <path d="M12 30 l-5 -5 M52 30 l5 -5" className="stroke-ink" strokeWidth={2} />
        <circle cx={32} cy={48} r={26} className="fill-bg stroke-ink" strokeWidth={1.5} />
        <circle cx={32} cy={48} r={22} className="stroke-ink/30" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          const r1 = i % 3 === 0 ? 16 : 19;
          return (
            <line
              key={i}
              x1={(32 + r1 * Math.sin(a)).toFixed(2)}
              y1={(48 - r1 * Math.cos(a)).toFixed(2)}
              x2={(32 + 22 * Math.sin(a)).toFixed(2)}
              y2={(48 - 22 * Math.cos(a)).toFixed(2)}
              className="stroke-ink"
            />
          );
        })}
        {/* the hand sweeps once per run */}
        <motion.g
          key={`hand-${starts}`}
          initial={{ rotate: 0 }}
          animate={{ rotate: starts && !reduce ? 360 : 0 }}
          transition={{ duration: starts && !reduce ? run : 0, ease: [0.3, 0, 0.2, 1] }}
          style={{ transformOrigin: "32px 48px", transformBox: "view-box" }}
        >
          <line x1={32} y1={52} x2={32} y2={30} className="stroke-accent" strokeWidth={1.75} />
        </motion.g>
        <circle cx={32} cy={48} r={2.5} className="fill-accent stroke-accent" />
      </svg>
    </button>
  );
}

function Drum({ digit, index, starts, reduce }: { digit: number; index: number; starts: number; reduce: boolean }) {
  // before the first start every drum rests on 0; each start remounts the strip and rolls it
  const target = starts || reduce ? (LOOPS - 1) * 10 + digit : 0;
  return (
    <span className="relative block h-[1.15em] w-[0.8em] overflow-hidden border border-ink/30 bg-panel font-display text-3xl font-extrabold leading-[1.15em] text-ink sm:text-4xl">
      <motion.span
        key={starts}
        initial={{ y: 0, filter: "blur(0px)" }}
        animate={{ y: `-${target * 1.15}em`, filter: starts && !reduce ? ["blur(0px)", "blur(2px)", "blur(2px)", "blur(0px)"] : "blur(0px)" }}
        transition={
          reduce || !starts
            ? { duration: 0 }
            : {
                // wind up, run, then catch on the index line with a small bounce
                y: { duration: DRUM_TIME + index * DRUM_STAGGER, ease: [0.45, 0.05, 0.2, 1.06] },
                filter: { duration: DRUM_TIME + index * DRUM_STAGGER, times: [0, 0.2, 0.75, 1] },
              }
        }
        className="absolute inset-x-0 top-0 flex flex-col"
      >
        {STRIP.map((d, i) => (
          <span key={i} className="block h-[1.15em] text-center tabular-nums">
            {d}
          </span>
        ))}
      </motion.span>
      {/* drum curvature + index line */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(color-mix(in_srgb,var(--fg)_22%,transparent),transparent_30%,transparent_70%,color-mix(in_srgb,var(--fg)_22%,transparent))]"
      />
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-accent/70" />
    </span>
  );
}
