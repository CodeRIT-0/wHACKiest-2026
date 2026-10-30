"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { HACK_START } from "@/lib/event";

const pad = (n: number) => String(n).padStart(2, "0");
const LABELS = ["Days", "Hrs", "Min", "Sec"];

// a punched input card: columns of holes, deterministic so server and browser agree
const HOLES = Array.from({ length: 15 }, (_, c) => Array.from({ length: 6 }, (_, r) => ((c * 7 + r * 11) % 5 === 0 ? 2 : (c * 3 + r * 5) % 4 === 0 ? 1 : 0)));

// 1940s hardware counting down to wHACKiest 2026: eight Nixie tubes (days, hours, minutes,
// seconds) in a wooden case, an input card tucked behind it. Tubes stay dark until mounted (so
// server and browser render the same), tick once a second while on screen, and read zeros with
// "We're live" on the plate once the hackathon starts.
export default function NixieClock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const reduce = useReducedMotion();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [inView]);

  const left = now === null ? null : Math.max(0, Math.floor((HACK_START - now) / 1000));
  const groups = left === null ? null : [pad(Math.min(99, Math.floor(left / 86400))), pad(Math.floor((left % 86400) / 3600)), pad(Math.floor((left % 3600) / 60)), pad(left % 60)];
  const live = left === 0;
  const colon = now !== null && Math.floor(now / 1000) % 2 === 0;

  return (
    <figure ref={ref} className="mt-10">
      <div className="relative pt-[18%]">
        {/* input card tucked in behind the case */}
        <div aria-hidden className="absolute left-[9%] right-[5%] top-0 h-[55%] origin-bottom-left -rotate-[4deg] bg-[#e6dbbd] px-[5%] py-[3%] shadow-[0_10px_24px_-14px_rgba(60,40,10,0.5)]">
          <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#6b5a3a] sm:text-[9px]">wHACKiest / input card 01.12.2026</p>
          <div className="mt-[3%] flex justify-between">
            {HOLES.map((col, c) => (
              <div key={c} className="flex flex-col gap-[5px]">
                {col.map((h, r) => (
                  <span key={r} className={`block h-[7px] w-[3px] ${h === 2 ? "bg-[#2b2418]" : h === 1 ? "bg-[#2b2418]/25" : "bg-transparent"}`} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* the case */}
        <div className="relative rounded-[3px] border-[3px] border-[#9a7a48] bg-[linear-gradient(135deg,#5b4228,#3a2916_70%)] px-[4%] pb-4 pt-[4%] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_30px_50px_-28px_rgba(60,35,10,0.75)]">
          <div
            role="timer"
            aria-label={live ? "wHACKiest is live" : groups ? `${groups[0]} days ${groups[1]} hours ${groups[2]} minutes until wHACKiest 2026` : "Countdown to wHACKiest 2026"}
            className="flex items-start justify-center gap-[1.5%]"
          >
            {LABELS.map((label, g) => (
              <div key={label} className="flex items-start gap-[1.5%]" style={{ flex: "1 1 0" }}>
                {g > 0 && <Colon lit={colon && !live} />}
                <div className="flex-1">
                  <div className="flex justify-center gap-[6%]">
                    <Tube digit={groups?.[g][0] ?? null} reduce={!!reduce} />
                    <Tube digit={groups?.[g][1] ?? null} reduce={!!reduce} />
                  </div>
                  <p className="mt-2 text-center font-mono text-[8px] uppercase tracking-[0.18em] text-[#c7ad72] sm:text-[10px]">{label}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-3 w-fit bg-[linear-gradient(#e2cf9f,#c7ad72)] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[#4a3a20] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] sm:text-[10px]">
            {live ? "wHACKiest / We're live" : "wHACKiest / Starts 01.12.2026"}
          </p>
        </div>
        {/* plinth */}
        <div aria-hidden className="mx-[1%] h-2.5 rounded-b-sm bg-[#2c1f10]" />
      </div>

      <figcaption className="mt-4 flex flex-wrap justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
        <span>Fig. 02 / Electronic computing</span>
        <span>One spark. Endless possibilities.</span>
      </figcaption>
    </figure>
  );
}

function Tube({ digit, reduce }: { digit: string | null; reduce: boolean }) {
  return (
    <div className="relative grid aspect-[3/4.3] w-[46%] max-w-[64px] place-items-center overflow-hidden rounded-b-[8px] rounded-t-full border border-[#d9b878]/45 bg-[radial-gradient(ellipse_at_50%_42%,#3a2512,#120c07_75%)] shadow-[inset_0_0_0_2px_rgba(0,0,0,0.35)]">
      {/* inner glass + anode mesh */}
      <div className="absolute inset-[7%] rounded-b-[5px] rounded-t-full border border-white/10 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_4px)]" />
      <span aria-hidden className="absolute font-mono text-[clamp(18px,4.2vw,42px)] text-white/[0.05]">
        8
      </span>
      {digit !== null && (
        <motion.span
          key={digit}
          initial={reduce ? false : { opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.16 }}
          className="relative font-mono text-[clamp(18px,4.2vw,42px)] leading-none text-[#ffb36b] [text-shadow:0_0_5px_#ff7a1a,0_0_14px_#ff6a00,0_0_26px_rgba(255,106,0,0.55)]"
        >
          {digit}
        </motion.span>
      )}
      {/* brass contact bar */}
      <span aria-hidden className="absolute bottom-[7%] left-1/2 h-[4%] w-[56%] -translate-x-1/2 rounded-[1px] bg-[#d9b878]/90" />
      <span aria-hidden className="pointer-events-none absolute left-[16%] top-[10%] h-[40%] w-[8%] rounded-full bg-white/10 blur-[1px]" />
    </div>
  );
}

function Colon({ lit }: { lit: boolean }) {
  return (
    <div className="flex flex-col gap-2 self-center pb-5" aria-hidden>
      {[0, 1].map((i) => (
        <span key={i} className={`h-1.5 w-1.5 rounded-full transition-colors duration-150 ${lit ? "bg-[#ff9a3c] shadow-[0_0_6px_#ff7a1a]" : "bg-white/10"}`} />
      ))}
    </div>
  );
}
