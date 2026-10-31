"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { SquaresFour } from "@phosphor-icons/react";
import SectionHeader from "../../SectionHeader";
import { useHydrated } from "@/hooks/useHydrated";
import CrtScreen, { type Stage } from "./CrtScreen";
import PrizeWindow from "./PrizeWindow";
import { inr, masked, PRIZES, TOTAL, type Prize } from "./prize-data";

// The prize reveal, driven entirely by scroll. The section is a tall stretch with a pinned stage:
// the machine boots as it arrives, reports the pool as encrypted, and then each further screen of
// scrolling decrypts one place — the progress bar on the tube *is* the scroll bar, and the figure
// resolves out of random glyphs as the page moves. Scrolling back up re-encrypts it.

/** [start, end] of each place's decrypt, as fractions of the pinned stretch */
const BEATS: [number, number][] = [
  [0.13, 0.31],
  [0.39, 0.57],
  [0.65, 0.83],
];
const BOOT_END = 0.1;
const STEP = 1 / 24; // the scroll position is quantised to this, so React re-renders stay cheap

type View = { stage: Stage; index: number; t: number };
const REVEALED: View = { stage: "done", index: -1, t: 1 };

// where the scroll position sits in the story
function read(v: number): View {
  if (v < BOOT_END) return { stage: "boot", index: -1, t: 0 };
  for (let i = 0; i < BEATS.length; i++) {
    const [start, end] = BEATS[i];
    if (v < start) return { stage: "idle", index: i, t: 0 };
    if (v < end) return { stage: "reading", index: i, t: Math.round(((v - start) / (end - start)) / STEP) * STEP };
  }
  return REVEALED;
}

const decrypted = (v: number) => PRIZES.filter((_, i) => v >= BEATS[i][1]);

export default function PrizeMachine() {
  const ref = useRef<HTMLElement>(null);
  // the tube snaps on the first time the section comes into view, and stays on from then
  const powered = useInView(ref, { amount: 0.05, once: true });
  // `useReducedMotion` is already true on the first client render but false on the server, so it
  // only takes effect once hydration is done — otherwise the markup the two produce disagrees
  const prefersReduced = useReducedMotion();
  const hydrated = useHydrated();
  const reduce = hydrated && !!prefersReduced;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [view, setView] = useState<View>(() => read(0));
  const [mounted, setMounted] = useState<Prize[]>([]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = read(v);
    setView((prev) => (prev.stage === next.stage && prev.index === next.index && prev.t === next.t ? prev : next));
    const ids = decrypted(v);
    setMounted((prev) => (prev.length === ids.length ? prev : ids));
  });

  // with reduced motion the section is a normal block and everything is simply already decrypted
  const stage: Stage = reduce ? "done" : powered ? view.stage : "off";
  const revealed = reduce ? PRIZES : mounted;
  const active = view.stage === "reading" ? PRIZES[view.index] : null;
  const done = stage === "done";
  const runningTotal = revealed.reduce((sum, p) => sum + p.amount, 0);
  const ids = revealed.map((p) => p.id);

  return (
    <section ref={ref} id="prizes" className={`relative overflow-x-clip ${reduce ? "" : "h-[240vh] lg:h-[320vh]"}`}>
      {/* the room warms up as the pool comes out */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: done ? 1 : 0.25 }}
        transition={{ duration: 1 }}
        className="pointer-events-none absolute left-1/2 top-1/3 h-[70vh] w-[70vh] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(253,156,54,0.2),transparent)] blur-2xl"
      />

      <div className={reduce ? "relative" : "sticky top-0 h-screen overflow-hidden"}>
        <div className="relative z-10 mx-auto flex h-full max-w-[1240px] flex-col px-6 pb-5 pt-20 lg:pb-3">
          {/* ---------------- heading ---------------- */}
          <div className="grid shrink-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-end lg:gap-10">
            <SectionHeader index="05" label="Prizes" title="Big ideas. Bigger rewards." />
            <p className="hidden max-w-[44ch] text-muted sm:block">
              The pool ships encrypted. Keep scrolling and the machine decrypts it one place at a time — {inr(TOTAL)} across the
              top three, plus special awards.
            </p>
          </div>

          {/* ---------------- the stage ---------------- */}
          <div className="grid min-h-0 flex-1 items-center gap-4 pt-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-10 lg:pt-3">
            {/* the machine */}
            <div data-trace className="relative mx-auto w-[min(100%,calc(100svh_-_330px))] min-w-0 sm:w-[min(100%,calc(100svh_-_470px))] lg:w-[min(100%,calc(100vh_-_268px))]">
              {/* On phones the frame crops in on the tube, so the screen stays readable; from lg up the
                  whole machine is in shot and sized to whatever height the pinned stage has. */}
              <div className="relative aspect-square w-full overflow-hidden">
                <div className="absolute inset-0">
                  <Image
                    src="/assets/prizes/retro-computer.webp"
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 640px, 92vw"
                    className="pointer-events-none select-none object-contain"
                  />

                  {/* the live tube, sat inside the bezel (percentages measured off the photo) */}
                  <div
                    className="absolute overflow-hidden rounded-[7%/9%] bg-[#060f0c] shadow-[inset_0_0_70px_rgba(0,0,0,0.95)]"
                    style={{ left: "25.4%", top: "11.2%", width: "48.4%", height: "35%" }}
                  >
                    <CrtScreen stage={stage} active={active} t={view.t} mounted={ids} reduce={reduce} />
                  </div>

                  {/* drive light, over the amber LED on the case: lit while a place is decrypting */}
                  <span
                    aria-hidden
                    className={`absolute rounded-[1px] transition-opacity duration-150 ${
                      active ? "opacity-100 motion-safe:animate-[flicker_0.25s_linear_infinite]" : "opacity-0"
                    }`}
                    style={{ left: "80.2%", top: "66.2%", width: "2.4%", height: "1.3%", backgroundColor: "#ff8a3d", boxShadow: "0 0 14px 4px rgba(255,138,61,0.85)" }}
                  />

                  {/* power light: the photo has none, so one goes under the bezel */}
                  <motion.span
                    aria-hidden
                    className="absolute rounded-full"
                    style={{ left: "75.2%", top: "50.4%", width: "1.2%", height: "1.2%" }}
                    initial={false}
                    animate={{
                      backgroundColor: stage === "off" ? "#8a826f" : "#5dff9a",
                      boxShadow: stage === "off" ? "0 0 0 transparent" : "0 0 10px 2px rgba(93,255,154,0.8)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* the desktop: a window lands as each place comes out of the payload */}
            <div className="min-w-0">
              <div className="mb-3 flex items-center justify-between gap-3 border-b border-ink/15 pb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                <span className="flex items-center gap-2">
                  <SquaresFour size={13} weight="bold" className="text-accent" />
                  My prizes
                </span>
                <span className={done ? "text-accent" : ""}>
                  {revealed.length} of {PRIZES.length} objects
                </span>
              </div>

              <div className="hidden gap-3 lg:grid">
                {PRIZES.map((p, i) => (
                  <PrizeWindow key={p.id} prize={p} slot={i + 1} open={ids.includes(p.id)} reduce={reduce} />
                ))}
              </div>
              <ul className="grid grid-cols-3 gap-2 sm:gap-3 lg:hidden">
                {PRIZES.map((p) => {
                  const open = ids.includes(p.id);
                  const Icon = p.icon;
                  return (
                    <li
                      key={p.id}
                      className={`relative overflow-hidden border-2 px-2 py-2 text-center transition-[border-color,box-shadow,translate] duration-500 ${
                        open ? "-translate-y-0.5 border-ink bg-panel shadow-[3px_3px_0_var(--fg)]" : "border-dashed border-ink/25 bg-panel/40"
                      }`}
                    >
                      <span className="flex items-center justify-center gap-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                        <Icon size={12} weight="duotone" style={{ color: open ? p.hue : undefined }} />
                        {p.short}
                      </span>
                      <span className={`display-wide mt-1 block text-[15px] leading-none tabular-nums ${open ? "" : "text-ink/25"}`}>
                        {open ? inr(p.amount) : masked(p.amount)}
                      </span>
                      <span className="sr-only">{`${p.place}: ${p.name}, ${inr(p.amount)}`}</span>
                    </li>
                  );
                })}
              </ul>

            </div>
          </div>

          <p aria-live="polite" className="sr-only">
            {active
              ? `Decrypting ${active.file}`
              : done
                ? `All three prizes revealed. Total prize pool ${inr(TOTAL)}, plus special awards to be announced.`
                : revealed.length
                  ? `${revealed.length} of ${PRIZES.length} prizes revealed. Running total ${inr(runningTotal)}.`
                  : ""}
          </p>
        </div>
      </div>
    </section>
  );
}
