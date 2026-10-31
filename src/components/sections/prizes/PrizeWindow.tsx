"use client";

import { AnimatePresence, motion } from "motion/react";
import { LockSimple, Minus, Square, X } from "@phosphor-icons/react";
import { inr, masked, type Prize } from "./prize-data";

// One slot on the desktop. Sealed — no filename, no figure — until the scroll decrypts its place,
// at which point a window pops open. Scrolling back up seals it again.
export default function PrizeWindow({
  prize,
  slot,
  open,
  reduce,
}: {
  prize: Prize;
  slot: number;
  open: boolean;
  reduce: boolean;
}) {
  const Icon = prize.icon;
  const summary = `${prize.place}: ${prize.name}, ${inr(prize.amount)}. ${prize.blurb}`;

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <motion.article
            key="open"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.14 } }}
            transition={{ type: "spring", stiffness: 280, damping: 20 }}
            className="relative overflow-hidden border-2 border-ink bg-panel shadow-[5px_5px_0_var(--fg)]"
          >
            {/* title bar */}
            <div className="flex items-center gap-2 border-b-2 border-ink bg-[linear-gradient(90deg,var(--color-trace),color-mix(in_srgb,var(--color-trace)_55%,var(--bg)))] px-2 py-1">
              <span aria-hidden className="grid h-3.5 w-3.5 place-items-center bg-bg text-[8px] font-bold text-ink">
                ▣
              </span>
              <span className="truncate font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#fff9ec]">{prize.file}</span>
              <span aria-hidden className="ml-auto flex items-center gap-1">
                {[Minus, Square, X].map((Glyph, i) => (
                  <span key={i} className="grid h-4 w-4 place-items-center border border-ink bg-panel text-ink">
                    <Glyph size={7} weight="bold" />
                  </span>
                ))}
              </span>
            </div>

            {/* contents */}
            <div className="flex items-center gap-2.5 px-2.5 py-2 sm:gap-4 sm:px-3 sm:py-2.5">
              <span
                aria-hidden
                className="grid h-9 w-9 shrink-0 place-items-center border-2 border-ink sm:h-12 sm:w-12"
                style={{ backgroundColor: `${prize.hue}33`, color: prize.hue, boxShadow: `inset 0 0 18px ${prize.hue}55` }}
              >
                <Icon size={20} weight="duotone" className="sm:hidden" />
                <Icon size={23} weight="duotone" className="hidden sm:block" />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-muted">{prize.place}</span>
                <span className="display-wide block text-xl leading-none tabular-nums sm:text-2xl">{inr(prize.amount)}</span>
                <span className="mt-0.5 hidden truncate font-mono text-[9px] uppercase tracking-[0.08em] text-muted sm:block">
                  {prize.name} · {prize.blurb}
                </span>
                <span className="sr-only">{prize.name}. {prize.blurb}</span>
              </span>
            </div>

            {/* a glint sweeps across the moment it opens */}
            {!reduce && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.75),transparent)] mix-blend-overlay"
                initial={{ x: "-150%" }}
                animate={{ x: "320%" }}
                transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
              />
            )}
          </motion.article>
        ) : (
          <motion.div
            key="sealed"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2.5 border-2 border-dashed border-ink/25 bg-panel/40 px-2.5 py-2 sm:gap-3 sm:px-3 sm:py-3"
          >
            <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center border border-ink/20 text-ink/30 sm:h-10 sm:w-10">
              <LockSimple size={18} weight="duotone" />
            </span>
            <span className="min-w-0 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              Slot {slot} · sealed
              <span className="mt-0.5 block text-[9px] tracking-[0.1em] text-ink/35">encrypted</span>
            </span>
            <span aria-hidden className="display-wide ml-auto text-xl text-ink/20">
              {masked(prize.amount)}
            </span>
            {/* the real figure stays readable to screen readers whatever the scroll is doing */}
            <span className="sr-only">{summary}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
