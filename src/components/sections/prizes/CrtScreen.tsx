"use client";

import { useEffect, useReducer, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import TypeLine from "../../retro/TypeLine";
import { inr, PRIZES, TOTAL, type Prize } from "./prize-data";

export type Stage = "off" | "boot" | "idle" | "reading" | "done";

const AMBER = "#ffb35c";
const BAR_CELLS = 16;
const GLYPHS = "0123456789ABCDEF#%&@$*?/\\<>";
const HEX = "0123456789ABCDEF";
const NOISE_LEN = 20;

// Everything on the tube is sized in em off this, so the same screen reads correctly whether it
// is 230px wide on a phone or 330px on a desktop. 3.05cqw of the tube, clamped at both ends.
const ROOT_SIZE = "clamp(7.5px, 3.05cqw, 12px)";

// a scrambled-looking but pure glyph, so the churn survives a re-render and never trips hydration
const glyph = (i: number, churn: number) => GLYPHS[(Math.imul(i * 2654435761 + churn * 40503, 2246822519) >>> 0) % GLYPHS.length];

// Random-glyph decode. `locked` comes from scroll position: characters settle left to right as
// the page moves, so scrolling back up scrambles them again.
function Scramble({ text, locked }: { text: string; locked: number }) {
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

// A still-encrypted row of the payload: hex that keeps churning so it never settles.
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
    <span aria-hidden className="min-w-0 flex-1 truncate opacity-45">
      {out}
    </span>
  );
}

// The CRT's contents: a boot log, then the prize pool as three rows of ciphertext. PrizeMachine
// reads the scroll position and hands down which row is decrypting and how far through it is.
export default function CrtScreen({
  stage,
  active,
  t,
  mounted,
  reduce,
}: {
  stage: Stage;
  /** the place currently being decrypted, if any */
  active: Prize | null;
  /** how far through that decrypt the scroll has got, 0-1 */
  t: number;
  /** ids of the places already decrypted */
  mounted: string[];
  reduce: boolean;
}) {
  const [line, setLine] = useState(0);
  const on = stage !== "off";
  // scrolling fast past the boot log should not strand it half-typed
  const past = on && stage !== "boot";
  const shown = reduce || past ? 1 : line;
  const done = stage === "done";
  const left = PRIZES.length - mounted.length;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ containerType: "inline-size" }}>
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
          className="flex shrink-0 items-center justify-between gap-2 border-b border-dashed pb-[0.3em] text-[0.82em] uppercase tracking-[0.12em] opacity-70"
          style={{ borderColor: `${AMBER}55` }}
        >
          <span className="truncate">wHACKiest OS 26.1</span>
          <span className="shrink-0">mem 640K ok</span>
        </div>

        {/* boot log */}
        <p className="phosphor shrink-0 truncate">
          <TypeLine text="C:\WHACKIEST> prizes.exe" start={on} onDone={() => setLine((l) => Math.max(l, 1))} />
        </p>

        {/* the payload: one row per place, ciphertext until the scroll decrypts it */}
        {shown >= 1 && (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-auto shrink-0 border px-[0.7em] py-[0.55em]"
            style={{ borderColor: `${AMBER}44`, backgroundColor: "rgba(255,179,92,0.05)" }}
          >
            <p className="mb-[0.5em] flex items-center justify-between gap-2 text-[0.82em] uppercase tracking-[0.14em] opacity-55">
              <span className="truncate">prize_pool.img</span>
              <span className="shrink-0">
                {mounted.length}/{PRIZES.length} ok
              </span>
            </p>
            <div className="grid gap-[0.45em]">
              {PRIZES.map((p) => {
                const ok = mounted.includes(p.id);
                const reading = active?.id === p.id && stage === "reading";
                return (
                  <div key={p.id} className="flex min-w-0 items-center gap-[0.55em]">
                    <span className="w-[2.9em] shrink-0 text-[0.86em] uppercase tracking-[0.1em] opacity-60">{p.short}</span>
                    {reading ? (
                      <>
                        {/* the progress bar is the scroll bar: each cell lights as the page moves */}
                        <span aria-hidden className="flex min-w-0 flex-1 gap-[1px]">
                          {Array.from({ length: BAR_CELLS }, (_, i) => (
                            <span
                              key={i}
                              className="h-[0.75em] flex-1 rounded-[1px] transition-opacity duration-150"
                              style={{ backgroundColor: p.hue, opacity: (i + 1) / BAR_CELLS <= t ? 1 : 0.16 }}
                            />
                          ))}
                        </span>
                        <span className="phosphor shrink-0 font-bold tabular-nums" style={{ color: p.hue }}>
                          <Scramble text={inr(p.amount)} locked={Math.round(t * inr(p.amount).length)} />
                        </span>
                      </>
                    ) : ok ? (
                      <>
                        <span
                          aria-hidden
                          className="mb-[0.35em] min-w-0 flex-1 self-end border-b border-dotted"
                          style={{ borderColor: `${p.hue}66` }}
                        />
                        <motion.span
                          initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 420, damping: 18 }}
                          className="phosphor shrink-0 font-bold tabular-nums"
                          style={{ color: p.hue }}
                        >
                          {inr(p.amount)}
                        </motion.span>
                      </>
                    ) : (
                      <>
                        <Noise live={on && !reduce} />
                        <span aria-hidden className="shrink-0 text-[0.86em] opacity-35">
                          [lock]
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* prompt line */}
        <div className="mt-[0.4em] min-h-[2.6em] shrink-0">
          <AnimatePresence mode="wait">
            {stage === "reading" && active ? (
              <motion.p
                key={`read-${active.id}`}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                className="truncate text-[0.86em] uppercase tracking-[0.12em]"
                style={{ color: active.hue }}
              >
                &gt; {active.file} · <Scramble text="key 0x9C04 ok" locked={Math.round(t * 13)} />
              </motion.p>
            ) : done ? (
              <motion.div
                key="done"
                initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
                className="min-w-0"
              >
                <span className="block text-[0.82em] uppercase tracking-[0.16em] opacity-60">total prize pool</span>
                <span className="phosphor display-wide block text-[2.9em] leading-none tabular-nums" style={{ color: AMBER }}>
                  {inr(TOTAL)}
                </span>
              </motion.div>
            ) : stage === "idle" ? (
              <motion.p
                key="idle"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                className="phosphor truncate uppercase tracking-[0.12em]"
              >
                <TypeLine key={left} text={`▾ keep scrolling · ${left} of ${PRIZES.length} left`} speed={20} caret />
              </motion.p>
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
      <span aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-70" />
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_48%,rgba(0,0,0,0.72))]" />
      <span aria-hidden className="pointer-events-none absolute -left-1/4 -top-1/3 h-2/3 w-2/3 rotate-[-20deg] bg-[radial-gradient(closest-side,rgba(255,255,255,0.08),transparent)]" />
    </div>
  );
}
