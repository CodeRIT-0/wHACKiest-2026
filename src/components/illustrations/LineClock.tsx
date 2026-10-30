// Thin-line technical drawing of a 1940s pocket clock. Ink strokes, orange highlights, all
// colours from the page variables so it reads on cream and on navy.
//   variant "hero":  orbit rings and the gear train peeking out from behind the face, 10:10
//   variant "final": the same clock wired into circuit traces, both hands on 12

const r2 = (n: number) => Math.round(n * 100) / 100;
const CX = 200;
const CY = 200;
const polar = (r: number, deg: number): [number, number] => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [r2(CX + r * Math.cos(a)), r2(CY + r * Math.sin(a))];
};

function gearPath(cx: number, cy: number, teeth: number, outer: number, inner: number) {
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

function Gear({ cx, cy, r, teeth, className }: { cx: number; cy: number; r: number; teeth: number; className?: string }) {
  return (
    <g className={className} style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <path d={gearPath(cx, cy, teeth, r, r * 0.86)} />
      <circle cx={cx} cy={cy} r={r * 0.62} />
      <circle cx={cx} cy={cy} r={r * 0.14} />
      {[0, 72, 144, 216, 288].map((d) => {
        const a = (d * Math.PI) / 180;
        return <line key={d} x1={r2(cx + r * 0.14 * Math.cos(a))} y1={r2(cy + r * 0.14 * Math.sin(a))} x2={r2(cx + r * 0.62 * Math.cos(a))} y2={r2(cy + r * 0.62 * Math.sin(a))} />;
      })}
    </g>
  );
}

// deterministic fan of PCB traces leaving the bezel: out radially, then a 45° dog-leg
const TRACES = Array.from({ length: 36 }, (_, i) => {
  const deg = i * 10 + (i % 2 ? 3 : 0);
  const reach = 150 + ((i * 37) % 5) * 9;
  const bend = (i % 3) - 1; // -1, 0, 1
  const [x1, y1] = polar(132, deg);
  const [x2, y2] = polar(reach, deg);
  const [x3, y3] = polar(reach + 26, deg + bend * 9);
  return { d: `M${x1} ${y1}L${x2} ${y2}L${x3} ${y3}`, end: [x3, y3] as const, hot: i % 5 === 0 };
});

export function ClockTraces() {
  return (
    <g className="stroke-trace">
      {TRACES.map((t, i) => (
        <g key={i} className={t.hot ? "stroke-accent" : ""}>
          <path d={t.d} />
          <circle cx={t.end[0]} cy={t.end[1]} r={3} className={t.hot ? "fill-accent" : "fill-bg"} />
        </g>
      ))}
    </g>
  );
}

export function ClockOrbits() {
  return (
    <>
      <g className="clock-orbit stroke-ink/45">
        <ellipse cx={CX} cy={CY} rx={190} ry={58} transform={`rotate(-18 ${CX} ${CY})`} />
        <circle cx={r2(CX + 190 * Math.cos(0.5))} cy={r2(CY + 58 * Math.sin(0.5))} r={4} transform={`rotate(-18 ${CX} ${CY})`} className="fill-accent stroke-accent" />
      </g>
      <g className="clock-orbit-reverse stroke-ink/30">
        <ellipse cx={CX} cy={CY} rx={172} ry={46} transform={`rotate(26 ${CX} ${CY})`} strokeDasharray="2 6" />
        <circle cx={r2(CX - 172 * Math.cos(0.9))} cy={r2(CY - 46 * Math.sin(0.9))} r={3} transform={`rotate(26 ${CX} ${CY})`} className="fill-bg stroke-ink" />
      </g>
    </>
  );
}

// the gear train behind the face; each gear is its own group so it can fly off on its own
export const CLOCK_GEARS = [
  { cx: 302, cy: 292, r: 62, teeth: 18, spin: "clock-gear" },
  { cx: 96, cy: 300, r: 40, teeth: 12, spin: "clock-gear-reverse" },
  { cx: 318, cy: 110, r: 30, teeth: 10, spin: "clock-gear-reverse" },
] as const;

export function ClockGears() {
  return (
    <g className="stroke-ink/70">
      {CLOCK_GEARS.map((g) => (
        <g key={g.cx} data-gear>
          <Gear cx={g.cx} cy={g.cy} r={g.r} teeth={g.teeth} className={g.spin} />
        </g>
      ))}
    </g>
  );
}

// bow, case, dial and hands: the part that shatters
export function ClockFace({ final = false }: { final?: boolean }) {
  const hour = final ? 0 : 300;
  const minute = final ? 0 : 60;
  return (
    <>
      {/* bow + crown */}
      <g className="stroke-ink">
        <circle cx={CX} cy={50} r={15} />
        <circle cx={CX} cy={50} r={9} />
        <rect x={190} y={64} width={20} height={14} rx={2} className="fill-bg" />
        <line x1={194} y1={64} x2={194} y2={78} />
        <line x1={200} y1={64} x2={200} y2={78} />
        <line x1={206} y1={64} x2={206} y2={78} />
      </g>

      {/* case + face (filled, so it hides what's behind) */}
      <circle cx={CX} cy={CY} r={128} className="fill-bg stroke-ink" strokeWidth={1.5} />
      <circle cx={CX} cy={CY} r={120} className="stroke-ink" />
      <circle cx={CX} cy={CY} r={84} className="stroke-ink/25" strokeDasharray="1 5" />

      <g className="stroke-ink">
        {Array.from({ length: 60 }, (_, i) => {
          const long = i % 5 === 0;
          const [x1, y1] = polar(long ? 102 : 110, i * 6);
          const [x2, y2] = polar(116, i * 6);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={long ? 1.6 : 0.9} />;
        })}
      </g>
      <g className="fill-ink font-mono" fontSize={15} textAnchor="middle">
        {[
          ["12", 0],
          ["3", 90],
          ["6", 180],
          ["9", 270],
        ].map(([n, d]) => {
          const [x, y] = polar(88, Number(d));
          return (
            <text key={n} x={x} y={r2(y + 5)}>
              {n}
            </text>
          );
        })}
      </g>
      <text x={CX} y={146} textAnchor="middle" fontSize={8} letterSpacing={2} className="fill-ink/60 font-mono">
        {final ? "WH-2026" : "WH-1946"}
      </text>

      {/* small seconds dial */}
      <g className="stroke-ink/70">
        <circle cx={CX} cy={250} r={20} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          return <line key={i} x1={r2(CX + 16 * Math.sin(a))} y1={r2(250 - 16 * Math.cos(a))} x2={r2(CX + 19 * Math.sin(a))} y2={r2(250 - 19 * Math.cos(a))} />;
        })}
        <g className="clock-seconds" style={{ transformOrigin: `${CX}px 250px` }}>
          <line x1={CX} y1={254} x2={CX} y2={234} className="stroke-accent" strokeWidth={1.4} />
        </g>
        <circle cx={CX} cy={250} r={1.8} className="fill-accent stroke-accent" />
      </g>

      {/* hands: the outer groups are free for scroll animation to turn */}
      <g className="stroke-ink">
        <g data-hand="hour">
          <path d="M200 214 L193 200 L200 138 L207 200 Z" className="fill-bg" strokeWidth={1.5} transform={`rotate(${hour} ${CX} ${CY})`} />
        </g>
        <g data-hand="minute">
          <path d="M200 218 L195 200 L200 100 L205 200 Z" className="fill-bg" strokeWidth={1.5} transform={`rotate(${minute} ${CX} ${CY})`} />
        </g>
        {final && <line x1={CX} y1={CY} x2={CX} y2={96} className="stroke-accent" strokeWidth={2} />}
      </g>
      <circle cx={CX} cy={CY} r={6} className="fill-accent stroke-accent" />
      <circle cx={CX} cy={CY} r={2} className="fill-bg stroke-none" />
    </>
  );
}

export default function LineClock({ variant = "hero", className = "" }: { variant?: "hero" | "final"; className?: string }) {
  const final = variant === "final";
  return (
    <svg viewBox="0 0 400 400" aria-hidden className={`line-art overflow-visible ${className}`} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {final ? (
        <ClockTraces />
      ) : (
        <>
          <ClockOrbits />
          <ClockGears />
        </>
      )}
      <ClockFace final={final} />
    </svg>
  );
}
