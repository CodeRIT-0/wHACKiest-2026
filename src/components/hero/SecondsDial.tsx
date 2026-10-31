"use client";

import { useNow } from "@/hooks/useNow";

const r2 = (n: number) => Math.round(n * 100) / 100;

const TICKS = Array.from({ length: 60 }, (_, i) => {
  const a = (i * Math.PI) / 30;
  const major = i % 5 === 0;
  const inner = major ? 85 : 89;
  return {
    major,
    x1: r2(100 + inner * Math.sin(a)),
    y1: r2(100 - inner * Math.cos(a)),
    x2: r2(100 + 95 * Math.sin(a)),
    y2: r2(100 - 95 * Math.cos(a)),
  };
});

const NUMERALS = [0, 15, 30, 45].map((s) => {
  const a = (s * Math.PI) / 30;
  return { s, x: r2(100 + 76 * Math.sin(a)), y: r2(100 - 76 * Math.cos(a) + 2.6) };
});

// A blueprint dial behind the hero clock that keeps real time: its sixty ticks fill orange as the
// current minute passes, with the live second glowing at the head, then all empty together on
// the minute. Unlit until hydration, so the server and browser render the same markup.
export default function SecondsDial({ className }: { className?: string }) {
  const now = useNow();
  const sec = now === null ? -1 : now % 60;

  return (
    <svg viewBox="0 0 200 200" aria-hidden className={className} fill="none" strokeLinecap="round">
      <circle cx={100} cy={100} r={98.5} className="stroke-ink/20" strokeWidth={0.6} />
      <circle cx={100} cy={100} r={81} className="stroke-ink/10" strokeWidth={0.5} strokeDasharray="0.6 2.4" />
      {TICKS.map((t, i) => {
        const head = i === sec;
        const lit = i < sec;
        return (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            strokeWidth={t.major ? 1.5 : 0.8}
            className={`transition-[stroke,opacity] duration-500 ${head ? "stroke-accent" : lit ? "stroke-accent/55" : t.major ? "stroke-ink/35" : "stroke-ink/20"}`}
            style={head ? { filter: "drop-shadow(0 0 2.5px var(--accent))" } : undefined}
          />
        );
      })}
      {NUMERALS.map((n) => (
        <text key={n.s} x={n.x} y={n.y} textAnchor="middle" fontSize={7} className="fill-ink/35 font-mono" stroke="none">
          {String(n.s).padStart(2, "0")}
        </text>
      ))}
    </svg>
  );
}
