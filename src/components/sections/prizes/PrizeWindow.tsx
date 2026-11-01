"use client";

import { AnimatePresence, motion } from "motion/react";
import { LockSimple, X } from "@phosphor-icons/react";
import { inr, masked, type Prize } from "./prize-data";

// One slot on the desktop (three of them sit side by side, so each is a narrow column). Sealed — no filename, no figure — until the scroll decrypts its place,
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
    <div className="relative h-full">
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <motion.article
            key="open"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.14 } }}
            transition={{ type: "spring", stiffness: 280, damping: 20 }}
            className="relative flex h-full min-h-[148px] flex-col overflow-hidden border-2 border-ink bg-panel shadow-[5px_5px_0_var(--fg)]"
          >
            {/* title bar */}
            <div className="flex items-center gap-2 border-b-2 border-ink bg-[linear-gradient(90deg,var(--color-trace),color-mix(in_srgb,var(--color-trace)_55%,var(--bg)))] px-2 py-1">
              <span aria-hidden className="grid h-3.5 w-3.5 place-items-center bg-bg text-[8px] font-bold text-ink">
                ▣
              </span>
              <span className="min-w-0 truncate font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#fff9ec]">{prize.file}</span>
              <span aria-hidden className="ml-auto flex shrink-0 items-center gap-0.5">
                {[X].map((Glyph, i) => (
                  <span key={i} className="grid h-3.5 w-3.5 place-items-center border border-ink bg-panel text-ink">
                    <Glyph size={7} weight="bold" />
                  </span>
                ))}
              </span>
            </div>

            {/* contents */}
            <div className="flex flex-1 flex-col gap-3 px-3 pb-3.5 pt-3">
              <span className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="grid h-9 w-9 shrink-0 place-items-center border-2 border-ink"
                  style={{ backgroundColor: `${prize.hue}33`, color: prize.hue, boxShadow: `inset 0 0 18px ${prize.hue}55` }}
                >
                  <Icon size={20} weight="duotone" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{prize.place}</span>
              </span>
              <span className="min-w-0">
                <span className="display-wide block text-[clamp(20px,1.9vw,30px)] leading-none tabular-nums">{inr(prize.amount)}</span>
                <span className="mt-1.5 block truncate font-mono text-[9px] uppercase tracking-[0.08em] text-muted">{prize.name}</span>
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
            className="flex h-full min-h-[148px] flex-col gap-3 border-2 border-dashed border-ink/25 bg-panel/40 p-3"
          >
            <span className="flex items-center gap-2.5">
              <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center border border-ink/20 text-ink/35">
                <LockSimple size={18} weight="duotone" />
              </span>
              <span className="min-w-0 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Slot {slot}
                <span className="mt-0.5 block text-[9px] tracking-[0.1em] text-ink/35">sealed</span>
              </span>
            </span>
            <span aria-hidden className="display-wide mt-auto text-[clamp(20px,1.9vw,30px)] leading-none text-ink/20">
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
