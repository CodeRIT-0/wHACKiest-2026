"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

// Faint line-art props scattered behind sections, like the sketchy gears in the reference.
// Gears turn with the page scroll; pass a negative `speed` to mesh two gears together.

// rounded so server and browser render identical SVG (Math.cos can differ in the last digit)
const r2 = (n: number) => Math.round(n * 100) / 100;

function gearPath(teeth: number, outer: number, inner: number) {
  const step = (Math.PI * 2) / teeth;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    // each tooth: rise, flat top, fall, flat valley
    [
      [inner, a],
      [outer, a + step * 0.12],
      [outer, a + step * 0.42],
      [inner, a + step * 0.54],
    ].forEach(([r, t]) => pts.push(`${(50 + r * Math.cos(t)).toFixed(2)},${(50 + r * Math.sin(t)).toFixed(2)}`));
  }
  return `M${pts.join("L")}Z`;
}

export function Gear({
  teeth = 12,
  speed = 0.05,
  spokes = 5,
  className = "",
}: {
  teeth?: number;
  speed?: number;
  spokes?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, (y) => (reduce ? 0 : y * speed));

  return (
    <motion.svg aria-hidden viewBox="0 0 100 100" style={{ rotate }} className={`pointer-events-none absolute ${className}`} fill="none" stroke="currentColor" strokeWidth={1}>
      <path d={gearPath(teeth, 48, 41)} />
      <circle cx="50" cy="50" r="31" />
      <circle cx="50" cy="50" r="7" />
      {Array.from({ length: spokes }, (_, i) => {
        const t = (i / spokes) * Math.PI * 2;
        return <line key={i} x1={r2(50 + 7 * Math.cos(t))} y1={r2(50 + 7 * Math.sin(t))} x2={r2(50 + 31 * Math.cos(t))} y2={r2(50 + 31 * Math.sin(t))} />;
      })}
    </motion.svg>
  );
}

export function ClockFace({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={`pointer-events-none absolute ${className}`} fill="none" stroke="currentColor" strokeWidth={1}>
      <circle cx="50" cy="50" r="46" />
      <circle cx="50" cy="50" r="41" />
      {Array.from({ length: 60 }, (_, i) => {
        const t = (i / 60) * Math.PI * 2;
        const r = i % 5 === 0 ? 34 : 38;
        return <line key={i} x1={r2(50 + r * Math.cos(t))} y1={r2(50 + r * Math.sin(t))} x2={r2(50 + 40 * Math.cos(t))} y2={r2(50 + 40 * Math.sin(t))} />;
      })}
      <line x1="50" y1="50" x2="50" y2="22" strokeWidth={2} />
      <line x1="50" y1="50" x2="68" y2="58" strokeWidth={2} />
      <circle cx="50" cy="50" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={`pointer-events-none absolute ${className}`} fill="currentColor">
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  );
}

// a few connected nodes, used behind the FAQ and team sections
const NODES = [
  [8, 20], [22, 8], [30, 34], [48, 18], [56, 44], [74, 12], [88, 30], [70, 62], [92, 78], [40, 70], [14, 62], [24, 90], [60, 92],
];
const LINKS = [
  [0, 1], [1, 3], [0, 2], [2, 3], [3, 5], [3, 4], [5, 6], [4, 6], [4, 7], [6, 8], [7, 8], [4, 9], [2, 9], [9, 10], [10, 0], [10, 11], [9, 12], [7, 12],
];

export function NodeField({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className={`pointer-events-none absolute ${className}`}>
      {LINKS.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={NODES[a][0]}
          y1={NODES[a][1]}
          x2={NODES[b][0]}
          y2={NODES[b][1]}
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {NODES.map(([x, y], i) => (
        // circles would stretch with preserveAspectRatio=none; zero-length round-capped lines stay round
        <line key={i} x1={x} y1={y} x2={x} y2={y} stroke="currentColor" strokeWidth={i % 3 === 0 ? 14 : 9} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}
