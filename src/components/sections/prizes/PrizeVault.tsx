"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import SectionHeader from "../../SectionHeader";
import PrizeChrono from "./PrizeChrono";

// The prize heist. A pinned stage: the travelling clock (ScrollClock, via [data-clock-dial])
// rebuilds itself and sinks into the vault's dial, then scrolling cracks the combination
// 25-15-10 (the prizes, in thousands), the bolts slide back, the door swings open and the
// gold comes out. Scroll position drives everything, so scrolling up locks it again.

// TODO: confirm the split with the organising team (must add up to the ₹50,000 pool)
const BARS = [
  { rank: "1st", name: "Winner", amount: 25000, metal: "linear-gradient(#fff6cc, #ffd45e 30%, #e0a526 62%, #ffe08a)", ink: "#4a2c00", glow: "rgba(255,200,70,0.75)" },
  { rank: "2nd", name: "Runner-up", amount: 15000, metal: "linear-gradient(#ffffff, #e4e8ee 30%, #a9b1bc 62%, #f1f3f6)", ink: "#1f2630", glow: "rgba(220,230,245,0.6)" },
  { rank: "3rd", name: "2nd runner-up", amount: 10000, metal: "linear-gradient(#ffe0c2, #f0a465 30%, #b8682c 62%, #f5c08f)", ink: "#3d1d04", glow: "rgba(240,150,80,0.6)" },
];
const COMBO = [25, 15, 10];
const TOTAL = BARS.reduce((sum, b) => sum + b.amount, 0);
const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const r2 = (n: number) => Math.round(n * 100) / 100;

// scroll beats, as fractions of the pinned stretch
const SPIN = [0.1, 0.24, 0.36, 0.48]; // dial lands on 25, 15, 10 at the last three
const UNBOLT = [0.48, 0.54];
const OPEN = [0.55, 0.7];

export default function PrizeVault() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const done = useMotionValue(1);
  const p = reduce ? done : scrollYProgress;

  const [entered, setEntered] = useState(0);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const n = SPIN.slice(1).filter((t) => v >= t).length;
    if (n !== entered) setEntered(n);
    if (v >= UNBOLT[1] !== open) setOpen(v >= UNBOLT[1]);
  });
  const shownEntered = reduce ? COMBO.length : entered;
  const unlocked = reduce || open;

  const dialIn = useTransform(p, [0.03, 0.09], [0, 1]);
  // safe-style: right past 25, back left to 15, right again to 10
  const dialTurn = useTransform(p, SPIN, [0, -450, -54, -396]);
  const wheelTurn = useTransform(p, [UNBOLT[0], UNBOLT[1] + 0.02], [0, 135]);
  const bolt = useTransform(p, UNBOLT, ["0%", "-70%"]);
  const doorSwing = useTransform(p, OPEN, [0, -100]);
  const doorShade = useTransform(p, OPEN, ["brightness(1)", "brightness(0.72)"]);
  const glow = useTransform(p, [OPEN[0], OPEN[1]], [0, 1]);
  const totalIn = useTransform(p, [0.86, 0.93], [0, 1]);

  return (
    <section ref={ref} id="prizes" data-panel className={`theme-dark dark-panel relative ${reduce ? "" : "h-[420vh]"}`}>
      <div data-clock-pin className={reduce ? "relative" : "sticky top-0 h-screen overflow-hidden"}>
        {/* warm light spilling out of the vault once it opens */}
        <motion.div
          aria-hidden
          style={{ opacity: glow }}
          className="pointer-events-none absolute right-[-10%] top-1/2 h-[90vh] w-[90vh] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(245,196,81,0.35),transparent)] blur-2xl lg:right-[2%]"
        />

        <div className="relative mx-auto grid h-full max-w-[1100px] content-center items-center gap-6 px-6 pb-8 pt-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:pt-24">
          <div className="relative z-20">
            <SectionHeader index="05" label="Prizes" title="Big ideas. Bigger rewards." />
            <p className="mt-4 hidden max-w-[40ch] text-muted sm:block">
              The pool is locked in the vault. Scroll to crack the combination and see who takes what.
            </p>

            {/* combination readout */}
            <div className="mt-6 inline-flex items-center gap-2 border border-ink bg-panel p-2 shadow-[4px_4px_0_var(--fg)]">
              {COMBO.map((n, i) => (
                <span
                  key={n}
                  className={`grid h-11 w-11 place-items-center font-mono text-lg font-bold transition-colors duration-300 ${
                    i < shownEntered ? "bg-ink text-accent" : "bg-panel text-ink/30"
                  }`}
                >
                  {i < shownEntered ? n : "--"}
                </span>
              ))}
              <span className={`ml-2 pr-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] ${unlocked ? "text-accent" : "text-muted"}`}>
                {unlocked ? "Unlocked" : shownEntered ? "Cracking…" : "Locked"}
              </span>
            </div>

            <PrizeChrono value={TOTAL} armed={unlocked} />
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              Top three teams <span className="text-accent">/</span> special awards TBA
            </p>
          </div>

          {/* the vault */}
          <div data-trace className="relative isolate z-0 mx-auto aspect-square w-[min(100%,46vh)] [perspective:2600px] lg:mr-0 lg:w-[min(100%,60vh)]">
            {/* frame set into the wall */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#8e887c_58%,#b8b2a5_64%,#77716a_70%,#cfc9bc_100%)] shadow-[0_40px_70px_-30px_rgba(40,30,10,0.6),inset_0_0_0_2px_rgba(0,0,0,0.25)]" />
            {[0.28, 0.66].map((t) => (
              <span
                key={t}
                aria-hidden
                className="absolute -left-[2%] h-[12%] w-[9%] rounded-sm bg-[linear-gradient(90deg,#5d584f,#a7a093,#5d584f)] shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                style={{ top: `${t * 100}%` }}
              />
            ))}

            {/* inside: the vault is the back of a giant clock. Gold on a shelf, in front of the movement */}
            <div className="absolute inset-[7%] overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_45%,#3a2812,#140d06_72%)] shadow-[inset_0_10px_40px_rgba(0,0,0,0.8)]">
              <motion.div style={{ opacity: glow }} className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,214,120,0.6),transparent_66%)]" />
              <Clockwork p={p} />
              <div className="absolute inset-x-[8%] top-[68%] h-[3%] rounded-sm bg-[linear-gradient(#6b4a22,#2b1c0b)]" />
              <div className="absolute inset-x-0 top-[22%] flex flex-col items-center gap-[3%]">
                <GoldBar bar={BARS[0]} p={p} at={0.68} className="w-[54%]" big />
                <div className="flex w-full justify-center gap-[2%]">
                  <GoldBar bar={BARS[1]} p={p} at={0.73} className="w-[46%]" />
                  <GoldBar bar={BARS[2]} p={p} at={0.78} className="w-[46%]" />
                </div>
              </div>
              <motion.p
                style={{ opacity: totalIn }}
                className="absolute inset-x-0 top-[76%] text-center font-mono text-[9px] uppercase tracking-[0.2em] text-[#f5c451]/80 sm:text-[10px]"
              >
                + special awards
              </motion.p>
            </div>

            {/* the door, hinged on the left */}
            {/* (the shading filter sits on each face: a filter on the door itself would flatten the 3D) */}
            <motion.div
              style={{ rotateY: doorSwing, transformOrigin: "left center" }}
              className="absolute inset-[6%] rounded-full [transform-style:preserve-3d]"
            >
              {/* back of the door: seen once it swings past 90 degrees and rests beside the frame */}
              <motion.div
                aria-hidden
                style={{ filter: doorShade }}
                className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_60%_40%,#bdb7aa,#7c776d_70%,#5f5a52)] shadow-[inset_0_0_0_3px_#55514a] [backface-visibility:hidden] [transform:rotateY(180deg)]"
              >
                <div className="absolute inset-[14%] rounded-full border-[6px] border-[#6d685f]/70" />
                <div className="absolute inset-x-[18%] top-1/2 h-[7%] -translate-y-1/2 rounded-full bg-[linear-gradient(#a19b8f,#5f5a52)]" />
                <div className="absolute inset-y-[18%] left-1/2 w-[7%] -translate-x-1/2 rounded-full bg-[linear-gradient(90deg,#a19b8f,#5f5a52)]" />
              </motion.div>
              <motion.div style={{ filter: doorShade }} className="absolute inset-0 rounded-full [backface-visibility:hidden]">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f1eee7,#c9c3b6_45%,#8f897d_100%)] shadow-[inset_0_0_0_3px_#6f6a60,inset_0_6px_14px_rgba(255,255,255,0.6),inset_0_-10px_24px_rgba(0,0,0,0.3)]" />
                <div className="absolute inset-[9%] rounded-full border-2 border-[#7d776c]/60 shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)]" />
                <div className="absolute inset-[16%] rounded-full border border-[#7d776c]/40" />
                {/* rivets */}
                {Array.from({ length: 16 }, (_, i) => {
                  const a = (i / 16) * Math.PI * 2;
                  return (
                    <span
                      key={i}
                      aria-hidden
                      className="absolute h-[2.4%] w-[2.4%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff,#8a8478)]"
                      style={{ left: `${r2(50 + 45.5 * Math.cos(a))}%`, top: `${r2(50 + 45.5 * Math.sin(a))}%` }}
                    />
                  );
                })}
                {/* bolts: stick out into the frame until the combination is in */}
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <div key={deg} aria-hidden className="absolute inset-0" style={{ transform: `rotate(${deg}deg)` }}>
                    <motion.span
                      style={{ x: bolt }}
                      className="absolute right-[-5%] top-1/2 h-[6%] w-[14%] -translate-y-1/2 rounded-sm bg-[linear-gradient(#e9e5dc,#9b958a)] shadow-[inset_0_0_0_1px_#6f6a60]"
                    />
                  </div>
                ))}
                {/* handle wheel */}
                <motion.div style={{ rotate: wheelTurn }} aria-hidden className="absolute inset-[22%]">
                  {[0, 45, 90, 135].map((deg) => (
                    <span key={deg} className="absolute left-1/2 top-1/2 h-[5%] w-full" style={{ transform: `translate(-50%,-50%) rotate(${deg}deg)` }}>
                      <span className="absolute inset-0 rounded-full bg-[linear-gradient(#d8d3c8,#8b857a)] shadow-[0_2px_3px_rgba(0,0,0,0.35)]" />
                      <span className="absolute -left-[3%] top-1/2 h-[220%] w-[7%] -translate-y-1/2 rounded-full bg-[#5f5a52]" />
                      <span className="absolute -right-[3%] top-1/2 h-[220%] w-[7%] -translate-y-1/2 rounded-full bg-[#5f5a52]" />
                    </span>
                  ))}
                </motion.div>

                {/* combination dial: the travelling clock docks here (ScrollClock reads data-clock-dial) */}
                <div data-clock-dial className="absolute left-1/2 top-1/2 aspect-square w-[36%] -translate-x-1/2 -translate-y-1/2">
                  <motion.div style={{ opacity: dialIn }} className="absolute inset-0">
                    <motion.svg style={{ rotate: dialTurn }} viewBox="0 0 100 100" className="absolute inset-0 h-full w-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]">
                      <circle cx="50" cy="50" r="49" fill="#1b1b19" />
                      <circle cx="50" cy="50" r="44" fill="#262522" stroke="#3b3a36" />
                      {Array.from({ length: 50 }, (_, i) => {
                        const a = (i / 50) * Math.PI * 2;
                        const long = i % 5 === 0;
                        return (
                          <line
                            key={i}
                            x1={r2(50 + 43 * Math.sin(a))}
                            y1={r2(50 - 43 * Math.cos(a))}
                            x2={r2(50 + (long ? 36 : 39) * Math.sin(a))}
                            y2={r2(50 - (long ? 36 : 39) * Math.cos(a))}
                            stroke="#e8e2d4"
                            strokeWidth={long ? 1.4 : 0.7}
                          />
                        );
                      })}
                      {Array.from({ length: 10 }, (_, i) => {
                        const a = (i / 10) * Math.PI * 2;
                        return (
                          <text
                            key={i}
                            x={r2(50 + 28 * Math.sin(a))}
                            y={r2(50 - 28 * Math.cos(a) + 3)}
                            fontSize="8"
                            className="font-mono"
                            textAnchor="middle"
                            fill="#e8e2d4"
                          >
                            {i * 10}
                          </text>
                        );
                      })}
                      <circle cx="50" cy="50" r="14" fill="#3b3a36" stroke="#55534d" />
                      <circle cx="46" cy="46" r="5" fill="#ffffff" opacity="0.12" />
                    </motion.svg>
                    {/* fixed index mark */}
                    <span className="absolute -top-[9%] left-1/2 h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[10px] border-x-transparent border-t-accent" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GoldBar({
  bar,
  p,
  at,
  big,
  className,
}: {
  bar: (typeof BARS)[number];
  p: MotionValue<number>;
  at: number;
  big?: boolean;
  className: string;
}) {
  // lands with a little overshoot, then a glint runs across it
  const y = useTransform(p, [at, at + 0.06], [40, 0]);
  const opacity = useTransform(p, [at, at + 0.03], [0, 1]);
  const scale = useTransform(p, [at, at + 0.05, at + 0.08], [0.7, 1.12, 1]);
  const shine = useTransform(p, [at + 0.06, at + 0.13], ["-130%", "230%"]);
  const amount = useTransform(p, [at, at + 0.09], [0, bar.amount]);
  const label = useTransform(amount, inr);

  return (
    <motion.div style={{ y, opacity, scale, filter: `drop-shadow(0 0 16px ${bar.glow})` }} className={className}>
      <div
        className="relative aspect-[2/1] overflow-hidden [clip-path:polygon(8%_0,92%_0,100%_100%,0_100%)]"
        style={{ backgroundImage: bar.metal, color: bar.ink }}
      >
        <div className="absolute inset-x-[12%] inset-y-[10%] flex flex-col items-center justify-center rounded-[2px] border border-current/20 text-center leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
          <span className="rounded-full bg-current/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] sm:text-[10px]">
            {bar.rank}
          </span>
          <span className="sr-only">{bar.name}</span>
          <motion.span
            className={`mt-1 font-display font-extrabold tabular-nums tracking-[-0.03em] [text-shadow:0_1px_0_rgba(255,255,255,0.7),0_-1px_0_rgba(0,0,0,0.25)] ${
              big ? "text-xl sm:text-2xl lg:text-3xl" : "text-base sm:text-xl lg:text-2xl"
            }`}
          >
            {label}
          </motion.span>
        </div>
        <motion.span
          aria-hidden
          style={{ x: shine }}
          className="absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.85),transparent)]"
        />
      </div>
    </motion.div>
  );
}

const ROMAN = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

function gearPath(cx: number, cy: number, teeth: number, outer: number) {
  const inner = outer * 0.84;
  const step = (Math.PI * 2) / teeth;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    [
      [inner, a],
      [outer, a + step * 0.14],
      [outer, a + step * 0.4],
      [inner, a + step * 0.54],
    ].forEach(([r, t]) => pts.push(`${r2(cx + r * Math.cos(t))},${r2(cy + r * Math.sin(t))}`));
  }
  return `M${pts.join("L")}Z`;
}

const MOVEMENT = [
  { cx: 58, cy: 138, r: 36, teeth: 20, turns: 2 },
  { cx: 150, cy: 64, r: 26, teeth: 14, turns: -2.8 },
  { cx: 146, cy: 150, r: 17, teeth: 10, turns: -4.2 },
  { cx: 46, cy: 58, r: 14, teeth: 9, turns: 5 },
];

// The clock movement engraved on the vault's back wall: a numeral ring, a gear train that turns
// as the door is worked, and hands that sweep round while the vault opens. Gold line work, kept
// dim so the bars in front stay the stars.
function Clockwork({ p }: { p: MotionValue<number> }) {
  const minute = useTransform(p, [0, 1], [0, 720]);
  const hour = useTransform(p, [0, 1], [0, 60]);
  return (
    <svg viewBox="0 0 200 200" aria-hidden className="absolute inset-0 h-full w-full" fill="none" stroke="#d9b45a" strokeLinecap="round">
      <g opacity={0.65}>
        <circle cx={100} cy={100} r={93} strokeWidth={0.8} />
        <circle cx={100} cy={100} r={86} strokeWidth={0.5} />
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i * Math.PI) / 30;
          const r1 = i % 5 === 0 ? 80 : 83;
          return <line key={i} x1={r2(100 + r1 * Math.sin(a))} y1={r2(100 - r1 * Math.cos(a))} x2={r2(100 + 86 * Math.sin(a))} y2={r2(100 - 86 * Math.cos(a))} strokeWidth={i % 5 === 0 ? 1.1 : 0.5} />;
        })}
        {ROMAN.map((n, i) => {
          const a = (i * Math.PI) / 6;
          return (
            <text key={n} x={r2(100 + 70 * Math.sin(a))} y={r2(100 - 70 * Math.cos(a) + 3)} textAnchor="middle" fontSize={8} className="font-display" fill="#d9b45a" stroke="none">
              {n}
            </text>
          );
        })}
      </g>
      <g opacity={0.42}>
        {MOVEMENT.map((g) => (
          <Cog key={g.cx} p={p} {...g} />
        ))}
      </g>
      {/* hands sweep behind the bars */}
      <g opacity={0.7}>
        <motion.g style={{ rotate: hour, transformOrigin: "100px 100px", transformBox: "view-box" }}>
          <path d="M100 108V58" strokeWidth={2.4} />
        </motion.g>
        <motion.g style={{ rotate: minute, transformOrigin: "100px 100px", transformBox: "view-box" }}>
          <path d="M100 112V28" strokeWidth={1.4} />
          <circle cx={100} cy={40} r={3} strokeWidth={1} />
        </motion.g>
        <circle cx={100} cy={100} r={4} fill="#d9b45a" />
      </g>
    </svg>
  );
}

function Cog({ p, cx, cy, r, teeth, turns }: { p: MotionValue<number>; cx: number; cy: number; r: number; teeth: number; turns: number }) {
  const rotate = useTransform(p, [0, 1], [0, turns * 360]);
  return (
    <motion.g style={{ rotate, transformOrigin: `${cx}px ${cy}px`, transformBox: "view-box" }}>
      <path d={gearPath(cx, cy, teeth, r)} strokeWidth={1} />
      <circle cx={cx} cy={cy} r={r2(r * 0.55)} strokeWidth={0.8} />
      <circle cx={cx} cy={cy} r={r2(r * 0.14)} strokeWidth={0.8} />
      {[0, 1, 2, 3, 4].map((k) => {
        const a = (k * Math.PI * 2) / 5;
        return <line key={k} x1={r2(cx + r * 0.14 * Math.cos(a))} y1={r2(cy + r * 0.14 * Math.sin(a))} x2={r2(cx + r * 0.55 * Math.cos(a))} y2={r2(cy + r * 0.55 * Math.sin(a))} strokeWidth={0.8} />;
      })}
    </motion.g>
  );
}
