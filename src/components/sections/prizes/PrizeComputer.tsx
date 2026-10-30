"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Trophy, X } from "@phosphor-icons/react";
import TypeLine from "../../retro/TypeLine";

// TODO: confirm the split with the organising team (must add up to the ₹50,000 pool)
const PRIZES = [
  { rank: 2, label: "2ND", name: "Runner-up", amount: 15000, color: "#7aa7ff" },
  { rank: 1, label: "1ST", name: "Winner", amount: 25000, color: "#ffb35c" },
  { rank: 3, label: "3RD", name: "Second runner-up", amount: 10000, color: "#e8e2d4" },
];
const BLOCKS_PER_10K = 4; // podium blocks are to scale: 10, 6 and 4 blocks
const ROW_DELAY = 0.075;
const MAX_ROWS = Math.max(...PRIZES.map((p) => (p.amount / 10000) * BLOCKS_PER_10K));
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// phases: 0 off -> 1 power on -> 2 command -> 3 loading -> 4 total -> 5 podium -> 6 ready
export default function PrizeComputer() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [popupClosed, setPopupClosed] = useState(false);
  const shown = reduce ? 6 : phase;

  useEffect(() => {
    if (!inView || reduce) return;
    const t1 = setTimeout(() => setPhase(1), 60);
    const t2 = setTimeout(() => setPhase(2), 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [inView, reduce]);

  useEffect(() => {
    if (shown !== 5) return;
    const t = setTimeout(() => setPhase(6), (MAX_ROWS * ROW_DELAY + 0.4) * 1000);
    return () => clearTimeout(t);
  }, [shown]);

  const focus = PRIZES.find((p) => p.rank === hover);
  const status = focus
    ? `${focus.label} PLACE / ${focus.name.toUpperCase()} / ${inr(focus.amount)}`
    : "24 HRS / TEAMS OF 2-4 / 3 WINNERS";

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[520px] pt-6">
      {/* monitor */}
      <div className="relative rounded-[22px] border border-[#d6ccb4] bg-[linear-gradient(#efe8d7,#e2d9c3)] p-4 pb-3 shadow-[inset_0_2px_0_rgba(255,255,255,0.7),inset_0_-6px_0_rgba(140,120,80,0.18),0_40px_60px_-34px_rgba(70,50,15,0.55)]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-[#0d1714] shadow-[inset_0_0_0_3px_#1b1b17,inset_0_0_50px_rgba(0,0,0,0.9)]">
          {/* screen content */}
          <motion.div
            className="absolute inset-0 flex flex-col p-4 font-mono text-[11px] leading-relaxed text-[#ffb35c] sm:p-5 sm:text-[12px]"
            initial={false}
            animate={{ opacity: shown >= 1 ? 1 : 0 }}
            transition={{ duration: 0.3, delay: shown === 1 ? 0.35 : 0 }}
            style={{ animation: shown >= 1 ? "flicker 4s infinite" : undefined }}
          >
            <p className="phosphor">
              <TypeLine text="C:\WHACKIEST> run prizes.exe" start={shown >= 2} onDone={() => setPhase((p) => Math.max(p, 3))} />
            </p>
            <p className="phosphor text-[#ffb35c]/80">
              <TypeLine
                text="loading prize_pool ............ OK"
                start={shown >= 3}
                speed={18}
                delay={250}
                onDone={() => setPhase((p) => Math.max(p, 4))}
              />
            </p>

            <AnimatePresence>
              {shown >= 4 && (
                <motion.div
                  key="total"
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  onAnimationComplete={() => setPhase((p) => Math.max(p, 5))}
                  className="mt-3"
                >
                  <span className="block text-[10px] tracking-[0.2em] text-[#ffb35c]/60">TOTAL POOL</span>
                  <span className="phosphor block text-3xl font-bold tracking-tight text-[#ffd29a] sm:text-4xl">{inr(50000)}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* pixel podium */}
            <div className="mt-auto grid grid-cols-3 items-end gap-3 sm:gap-4">
              {PRIZES.map((p) => {
                const rows = (p.amount / 10000) * BLOCKS_PER_10K;
                const lit = hover === null || hover === p.rank;
                return (
                  <button
                    key={p.rank}
                    type="button"
                    onMouseEnter={() => setHover(p.rank)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(p.rank)}
                    onBlur={() => setHover(null)}
                    aria-label={`${p.name}: ${inr(p.amount)}`}
                    className="flex cursor-default flex-col items-stretch outline-none transition-opacity duration-300 focus-visible:ring-1 focus-visible:ring-[#ffb35c]"
                    style={{ opacity: lit ? 1 : 0.35 }}
                  >
                    <motion.span
                      initial={false}
                      animate={{ opacity: shown >= 6 ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="phosphor mb-1.5 text-center leading-tight"
                      style={{ color: p.color }}
                    >
                      <span className="block text-[10px] tracking-[0.2em] opacity-80">{p.label}</span>
                      <span className="block text-[12px] font-bold sm:text-[13px]">{inr(p.amount)}</span>
                    </motion.span>
                    <span className="flex flex-col-reverse gap-[3px]">
                      {Array.from({ length: rows }, (_, r) => (
                        <motion.span
                          key={r}
                          className="block h-[9px] rounded-[1px] sm:h-[10px]"
                          style={{ backgroundColor: p.color, boxShadow: `0 0 8px ${p.color}66` }}
                          initial={reduce ? false : { opacity: 0, scaleX: 0.4 }}
                          animate={shown >= 5 ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0.4 }}
                          transition={{ duration: 0.12, delay: shown === 5 ? r * ROW_DELAY : 0 }}
                        />
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="phosphor mt-3 truncate border-t border-dashed border-[#ffb35c]/30 pt-2 text-[10px] tracking-[0.12em] sm:text-[11px]">
              {shown >= 6 ? <TypeLine key={status} text={`> ${status}`} speed={14} caret /> : <span>&nbsp;</span>}
            </p>
          </motion.div>

          {/* CRT power-on: a bright line that snaps open vertically, then fades */}
          {!reduce && (
            <motion.div
              className="pointer-events-none absolute inset-x-0 top-1/2 h-full -translate-y-1/2 bg-[#fff6e6]"
              initial={{ scaleY: 0.004, scaleX: 0, opacity: 0 }}
              animate={
                shown >= 1
                  ? { scaleX: [0, 1, 1, 1], scaleY: [0.004, 0.004, 1, 1], opacity: [1, 1, 0.9, 0] }
                  : { scaleY: 0.004, scaleX: 0, opacity: 0 }
              }
              transition={{ duration: 0.75, times: [0, 0.35, 0.6, 1], ease: "easeOut" }}
            />
          )}
          <div className="scanlines pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.65))]" />
          <div className="pointer-events-none absolute -left-1/4 -top-1/3 h-2/3 w-2/3 rotate-[-20deg] bg-[radial-gradient(closest-side,rgba(255,255,255,0.07),transparent)]" />
        </div>

        {/* bezel: badge, vents, power light */}
        <div className="mt-3 flex items-center justify-between px-1">
          <span className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-[#9a8f76]">CodeRIT</span>
          <span className="flex gap-1">
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className="h-3 w-[3px] rounded-full bg-[#cfc4aa] shadow-[inset_0_1px_0_rgba(0,0,0,0.15)]" />
            ))}
          </span>
          <span className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-[#9a8f76]">PWR</span>
            <motion.span
              className="h-2 w-2 rounded-full"
              initial={false}
              animate={{
                backgroundColor: shown >= 1 ? "#5dff9a" : "#8a826f",
                boxShadow: shown >= 1 ? "0 0 8px #5dff9a" : "0 0 0 transparent",
              }}
            />
          </span>
        </div>
      </div>
      {/* neck + base */}
      <div className="mx-auto h-5 w-24 bg-[linear-gradient(#ddd3bc,#cfc4aa)] [clip-path:polygon(12%_0,88%_0,100%_100%,0_100%)]" />
      <div className="mx-auto h-3 w-56 rounded-t-md rounded-b-xl bg-[linear-gradient(#e6dec9,#cdc2a7)] shadow-[0_16px_24px_-14px_rgba(70,50,15,0.5)]" />

      {/* pop-up window, like the "Personal Computing" dialog in the reference */}
      <AnimatePresence>
        {shown >= 6 && !popupClosed && (
          <motion.div
            key="popup"
            initial={reduce ? false : { opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: reduce ? 0 : 0.35 }}
            className="absolute -right-3 -top-4 w-44 origin-bottom-left border-2 border-ink bg-[#fdfaf2] shadow-[5px_5px_0_#121212] sm:-right-8 sm:w-52"
          >
            <div className="flex items-center justify-between border-b-2 border-ink bg-[repeating-linear-gradient(0deg,#121212_0_1px,transparent_1px_3px)] px-1.5 py-1">
              <span className="bg-[#fdfaf2] px-1.5 font-mono text-[10px] font-bold">WINNER.TXT</span>
              <button
                type="button"
                onClick={() => setPopupClosed(true)}
                aria-label="Close winner window"
                className="grid h-4 w-4 place-items-center border border-ink bg-[#fdfaf2] hover:bg-accent"
              >
                <X size={9} weight="bold" />
              </button>
            </div>
            <div className="flex items-center gap-3 p-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center bg-accent text-ink">
                <Trophy size={22} weight="duotone" />
              </span>
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-muted">1st place</span>
                <span className="display-wide block text-xl">{inr(25000)}</span>
              </span>
            </div>
            <Link
              href="/register"
              className="mx-3 mb-3 block border-2 border-ink bg-ink py-1.5 text-center font-mono text-[10px] font-bold uppercase text-bg transition hover:bg-accent hover:text-ink active:translate-y-px"
            >
              Claim it: register
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
