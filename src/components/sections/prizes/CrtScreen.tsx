"use client";

import { useEffect, useReducer, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import TypeLine from "../../retro/TypeLine";
import { inr, TOTAL } from "./prize-data";

export type Stage = "off" | "boot" | "reading" | "done";

const AMBER = "#ffb35c";
const BAR_CELLS = 16;
const GLYPHS = "0123456789ABCDEF#%&@$*?/\\<>";
const HEX = "0123456789ABCDEF";
const NOISE_LEN = 20;
// the files that stay locked, whatever the scroll does (no figures here: see prize-data)
const LOCKED = ["split", "awards"];

// Everything on the tube is sized in em off this, so the same screen reads correctly whether it
// is 230px wide on a phone or 420px on a big desktop. It follows the tube's width, capped by its
// height (the full readout is about 18em tall), and is clamped at both ends.
const ROOT_SIZE = "clamp(7.5px, min(3.3cqw, 5.1cqh), 18px)";

// a scrambled-looking but pure glyph, so the churn survives a re-render and never trips hydration
const glyph = (i: number, churn: number) => GLYPHS[(Math.imul(i * 2654435761 + churn * 40503, 2246822519) >>> 0) % GLYPHS.length];

// Random-glyph decode. `locked` comes from scroll position: characters settle left to right as
// the page moves, so scrolling back up scrambles them again.
export function Scramble({ text, locked }: { text: string; locked: number }) {
  const [churn, next] = useReducer((n: number) => n + 1, 0);
  useEffect(() => {
    if (locked >= text.length) return;
    const id = setInterval(next, 70);
    return () => clearInterval(id);
  }, [locked, text.length]);

  const out = text
    .split("")
    .map((c, i) => (i < locked || c === "," || c === " " ? c : glyph(i, churn)))
    .join("");
  return <span aria-hidden>{out}</span>;
}

// A row that stays encrypted: hex that keeps churning so it never settles, and never decodes.
function Noise({ live }: { live: boolean }) {
  const [out, setOut] = useState("·".repeat(NOISE_LEN));
  useEffect(() => {
    if (!live) return;
    const roll = () =>
      setOut(
        Array.from({ length: NOISE_LEN }, (_, i) => {
          const c = HEX[Math.floor(Math.random() * HEX.length)];
          return (i + 1) % 4 === 0 ? `${c} ` : c;
        }).join(""),
      );
    roll();
    const id = setInterval(roll, 420);
    return () => clearInterval(id);
  }, [live]);
  return (
    <span aria-hidden className="min-w-0 flex-1 overflow-hidden whitespace-pre opacity-60">
      {out}
    </span>
  );
}

// The CRT's contents: a boot log, the pool decoding big as the page scrolls, and the rest of the
// file refusing to open: the split and the awards stay ciphertext, to be announced.
export default function CrtScreen({
  stage,
  t,
  live,
  reduce,
}: {
  stage: Stage;
  /** how far through decoding the pool the scroll has got, 0-1 */
  t: number;
  /** on screen: the ciphertext churns only then */
  live: boolean;
  reduce: boolean;
}) {
  const on = stage !== "off";
  const done = stage === "done";
  const reading = stage === "reading";
  const total = inr(TOTAL);

  return (
    // (strict containment: the tube is a fixed-size box, and its text changes on almost every scroll
    // frame while the pool decodes; this keeps each change inside it instead of laying out the page)
    <div className="absolute inset-0 overflow-hidden" style={{ containerType: "size", contain: "strict" }}>
      <motion.div
        initial={false}
        animate={{ opacity: on ? 1 : 0 }}
        transition={{ duration: 0.3, delay: on && !reduce ? 0.4 : 0 }}
        className="absolute inset-0 flex flex-col gap-[0.3em] p-[1.1em] font-mono leading-[1.45]"
        style={{ color: AMBER, fontSize: ROOT_SIZE, animation: on && !reduce ? "flicker 4s infinite" : undefined }}
      >
        {/* status strip burned into the top of the tube. Everything on the tube is shrink-0: a
            flex item that compresses below its line height is what makes lines overlap. */}
        <div
          className="flex shrink-0 items-center justify-between gap-2 border-b border-dashed pb-[0.3em] text-[0.82em] uppercase tracking-[0.12em] opacity-80 @max-[240px]:hidden"
          style={{ borderColor: `${AMBER}55` }}
        >
          <span className="truncate">wHACKiest OS 26.1</span>
          <span className="shrink-0">mem 640K ok</span>
        </div>

        <p className="phosphor shrink-0 truncate">
          <span className="@max-[140px]:hidden">
            <TypeLine text="C:\WHACKIEST> prizes.exe" start={on} />
          </span>
          <span className="hidden @max-[140px]:inline">
            <TypeLine text="> prizes.exe" start={on} />
          </span>
        </p>

        {/* the file: the pool is the only part of it that opens (too tight to read on the smallest tubes,
            which show just the pool; the cards beside the machine carry the rest) */}
        <div className="mt-auto shrink-0 border px-[0.7em] py-[0.55em] [@container_(max-height:118px)]:hidden" style={{ borderColor: `${AMBER}44`, backgroundColor: "rgba(255,179,92,0.05)" }}>
          <p className="mb-[0.5em] flex items-center justify-between gap-2 text-[0.82em] uppercase tracking-[0.14em] opacity-70">
            <span className="truncate">prize_pool.img</span>
            <span className="shrink-0">{done ? "1/3 open" : reading ? `${Math.round(t * 100)}%` : "0/3 open"}</span>
          </p>
          <div className="grid gap-[0.45em]">
            {LOCKED.map((name) => (
              <div key={name} className="flex min-w-0 items-center gap-[0.55em]">
                <span className="w-[4.4em] shrink-0 text-[0.86em] uppercase tracking-[0.1em] opacity-75">{name}</span>
                <Noise live={on && live && !reduce} />
                <span aria-hidden className="shrink-0 text-[0.86em] opacity-45">
                  [lock]
                </span>
              </div>
            ))}
            <div className="flex h-[1.45em] min-w-0 items-center gap-[0.55em]">
              {done ? (
                <motion.p
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="phosphor truncate font-bold uppercase tracking-[0.14em] motion-safe:animate-pulse"
                  style={{ color: "#fd9c36" }}
                >
                  to be announced
                </motion.p>
              ) : (
                // the progress bar is the scroll bar: each cell lights as the page moves
                <span aria-hidden className="flex min-w-0 flex-1 gap-[1px]">
                  {Array.from({ length: BAR_CELLS }, (_, i) => (
                    <span key={i} className="h-[0.75em] flex-1 rounded-[1px] transition-opacity duration-150" style={{ backgroundColor: AMBER, opacity: reading && (i + 1) / BAR_CELLS <= t ? 1 : 0.16 }} />
                  ))}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* the pool, big */}
        <div className="mt-[0.4em] min-h-[4.1em] shrink-0 [@container_(max-height:118px)]:mt-auto">
          <AnimatePresence mode="wait" initial={false}>
            {on && stage === "boot" ? (
              <motion.p key="boot" exit={{ opacity: 0, transition: { duration: 0.12 } }} className="phosphor truncate uppercase tracking-[0.12em]">
                <TypeLine text="▾ keep scrolling to decrypt" speed={20} caret />
              </motion.p>
            ) : reading || done ? (
              <motion.div key="pool" initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="min-w-0">
                <span className="block truncate text-[0.82em] uppercase tracking-[0.16em] opacity-70">{done ? "total prize pool" : "> decrypting pool"}</span>
                <span className="phosphor display-wide block text-[2.9em] leading-none tabular-nums @max-[240px]:text-[2.3em]">
                  <Scramble text={total} locked={done ? total.length : Math.round(t * total.length)} />
                </span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* tube power-on: a bright line that snaps open vertically, then fades */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 h-full -translate-y-1/2 bg-[#fff6e6]"
          initial={{ scaleY: 0.004, scaleX: 0, opacity: 0 }}
          animate={on ? { scaleX: [0, 1, 1, 1], scaleY: [0.004, 0.004, 1, 1], opacity: [1, 1, 0.9, 0] } : { scaleY: 0.004, scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.8, times: [0, 0.35, 0.6, 1], ease: "easeOut" }}
        />
      )}
      {/* a flash across the tube the moment the pool opens */}
      {!reduce && done && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[#fff1d6] mix-blend-overlay"
          initial={{ opacity: 0.85 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}
      <span aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-60" />
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_48%,rgba(0,0,0,0.72))]" />
      <span aria-hidden className="pointer-events-none absolute -left-1/4 -top-1/3 h-2/3 w-2/3 rotate-[-20deg] bg-[radial-gradient(closest-side,rgba(255,255,255,0.08),transparent)]" />
    </div>
  );
}
