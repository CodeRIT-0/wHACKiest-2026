"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// The paper behind every page: a blueprint grid that drifts at its own speed, and faint line-art
// props from the history of computing (gears, clock faces, vacuum tubes, punch cards, chips,
// orbits) floating past at different depths and turning with the scroll. Everything moves with
// transforms on a fixed layer, so scrolling never repaints it. Static with reduced motion.

const GRID = 120; // the heavy grid square; the layer slides one square and wraps
const r2 = (n: number) => Math.round(n * 100) / 100;

function gearPath(teeth: number) {
  const step = (Math.PI * 2) / teeth;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    [
      [40, a],
      [48, a + step * 0.14],
      [48, a + step * 0.4],
      [40, a + step * 0.54],
    ].forEach(([r, t]) => pts.push(`${r2(50 + r * Math.cos(t))},${r2(50 + r * Math.sin(t))}`));
  }
  return `M${pts.join("L")}Z`;
}

const ART = {
  gear: (
    <>
      <path d={gearPath(14)} />
      <circle cx={50} cy={50} r={26} />
      <circle cx={50} cy={50} r={6} />
      <path d="M50 24V44M50 56V76M24 50H44M56 50H76" />
    </>
  ),
  clock: (
    <>
      <circle cx={50} cy={50} r={44} />
      <circle cx={50} cy={50} r={38} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        return <line key={i} x1={r2(50 + 31 * Math.sin(a))} y1={r2(50 - 31 * Math.cos(a))} x2={r2(50 + 37 * Math.sin(a))} y2={r2(50 - 37 * Math.cos(a))} />;
      })}
      <path d="M50 50V22M50 50L66 60" />
    </>
  ),
  tube: (
    <>
      <path d="M34 78V36a16 16 0 0 1 32 0v42Z" />
      <path d="M42 70V44h16v26M42 54h16" />
      <path d="M30 78h40v8H30ZM40 86v8M50 86v8M60 86v8" />
    </>
  ),
  card: (
    <>
      <path d="M8 24h76l8 8v44H8Z" />
      {Array.from({ length: 18 }, (_, i) => (
        <rect key={i} x={14 + (i % 9) * 8} y={34 + Math.floor(i / 9) * 18 + ((i * 7) % 3) * 4} width={3} height={6} />
      ))}
    </>
  ),
  chip: (
    <>
      <rect x={28} y={28} width={44} height={44} rx={3} />
      <rect x={38} y={38} width={24} height={24} />
      {[34, 44, 56, 66].map((p) => (
        <path key={p} d={`M${p} 28V14M${p} 72V86M28 ${p}H14M72 ${p}H86`} />
      ))}
    </>
  ),
  orbit: (
    <>
      <ellipse cx={50} cy={50} rx={46} ry={16} transform="rotate(-20 50 50)" />
      <ellipse cx={50} cy={50} rx={46} ry={16} transform="rotate(40 50 50)" />
      <circle cx={50} cy={50} r={5} />
    </>
  ),
  resistor: <path d="M2 50h26l4-10 8 20 8-20 8 20 8-20 8 20 4-10h22M2 50v0M98 50v0" />,
  cross: <path d="M50 30v40M30 50h40M44 50a6 6 0 1 0 12 0a6 6 0 1 0-12 0" />,
};
type Kind = keyof typeof ART;

// x as % of the viewport, y as a fraction of the wrap band, depth = parallax speed
const PROPS: { kind: Kind; x: number; y: number; size: number; depth: number; spin: number; tone: "ink" | "dense" | "orange"; mobile?: boolean }[] = [
  { kind: "gear", x: 4, y: 0.08, size: 150, depth: 0.35, spin: 0.08, tone: "ink", mobile: true },
  { kind: "clock", x: 82, y: 0.18, size: 110, depth: 0.22, spin: 0.03, tone: "ink" },
  { kind: "chip", x: 70, y: 0.62, size: 90, depth: 0.5, spin: 0, tone: "dense", mobile: true },
  { kind: "tube", x: 12, y: 0.48, size: 80, depth: 0.28, spin: 0, tone: "ink" },
  { kind: "orbit", x: 90, y: 0.82, size: 140, depth: 0.4, spin: -0.04, tone: "dense" },
  { kind: "card", x: 30, y: 0.92, size: 110, depth: 0.18, spin: 0, tone: "ink" },
  { kind: "resistor", x: 55, y: 0.3, size: 100, depth: 0.6, spin: 0, tone: "dense" },
  { kind: "gear", x: 92, y: 0.45, size: 70, depth: 0.55, spin: -0.12, tone: "orange", mobile: true },
  { kind: "cross", x: 40, y: 0.14, size: 40, depth: 0.7, spin: 0, tone: "orange" },
  { kind: "cross", x: 64, y: 0.86, size: 36, depth: 0.65, spin: 0, tone: "ink" },
  { kind: "clock", x: 22, y: 0.7, size: 64, depth: 0.45, spin: 0.06, tone: "dense" },
  { kind: "chip", x: 6, y: 0.86, size: 60, depth: 0.3, spin: 0, tone: "ink" },
  { kind: "tube", x: 76, y: 0.02, size: 56, depth: 0.62, spin: 0, tone: "orange" },
  { kind: "gear", x: 48, y: 0.56, size: 54, depth: 0.25, spin: 0.1, tone: "ink" },
];
// black ink on the ivory paper, with the odd orange highlight
const TONE = { ink: "text-ink/[0.1]", dense: "text-ink/[0.16]", orange: "text-accent/[0.4]" };

export default function BackgroundMotion() {
  const gridRef = useRef<HTMLDivElement>(null);
  const propRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // the position comes from ScrollTrigger, which reads it once per frame for every scroll effect.
    // Reading scrollY here too (every frame, or in a scroll listener) came after other effects had
    // written styles, so the browser had to recalculate the page's styles first, every frame
    let last = -1;
    const tick = (y: number) => {
      if (y === last) return;
      last = y;
      const band = window.innerHeight + 400; // props wrap through a band taller than the screen
      if (gridRef.current) gridRef.current.style.transform = `translate3d(0, ${-((y * 0.3) % GRID)}px, 0)`;
      PROPS.forEach((p, i) => {
        const el = propRefs.current[i];
        if (!el) return;
        const pos = (((p.y * band - y * p.depth) % band) + band) % band - 200;
        el.style.transform = `translate3d(0, ${pos}px, 0) rotate(${y * p.spin}deg)`;
      });
    };
    tick(window.scrollY);
    const trigger = ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => tick(self.scroll()) });
    return () => trigger.kill();
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        ref={gridRef}
        className="absolute inset-x-0 -top-[120px] h-[calc(100%+240px)] will-change-transform"
        style={{
          backgroundImage: [
            "linear-gradient(to right, color-mix(in srgb, var(--fg) 8%, transparent) 1px, transparent 1px)",
            "linear-gradient(to bottom, color-mix(in srgb, var(--fg) 8%, transparent) 1px, transparent 1px)",
            "linear-gradient(to right, color-mix(in srgb, var(--fg) 3.5%, transparent) 1px, transparent 1px)",
            "linear-gradient(to bottom, color-mix(in srgb, var(--fg) 3.5%, transparent) 1px, transparent 1px)",
          ].join(","),
          backgroundSize: `${GRID}px ${GRID}px, ${GRID}px ${GRID}px, 24px 24px, 24px 24px`,
        }}
      />
      {PROPS.map((p, i) => (
        <div
          key={i}
          ref={(el) => {
            propRefs.current[i] = el;
          }}
          className={`absolute top-0 will-change-transform ${TONE[p.tone]} ${p.mobile ? "" : "hidden md:block"}`}
          style={{ left: `${p.x}%`, width: p.size, height: p.size, transform: `translate3d(0, ${p.y * 100}vh, 0)` }}
        >
          <svg viewBox="0 0 100 100" className="line-art h-full w-full overflow-visible" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {ART[p.kind]}
          </svg>
        </div>
      ))}
    </div>
  );
}
