// Line-art illustrations for the track terminal. Animations live in
// globals.css (.track-art) and only run while the card is hovered or focused.

const ORANGE = "#fd9c36";
const BLUE = "#0357d6";
const BROWN = "#b9875a";

const PALETTES = {
  light: { ink: "#121212", faint: "#cfc6b4", paper: "#fbf7ec", blue: BLUE, tile: "#c9d4f2" },
  dark: { ink: "#e8e2d4", faint: "rgba(232,226,212,0.18)", paper: "#0b111c", blue: "#6f9bff", tile: "rgba(111,155,255,0.22)" },
};

type Palette = (typeof PALETTES)["light"];

export type ArtKind = "network" | "browser" | "globe" | "orbit";

export default function TrackArt({ kind, tone = "light" }: { kind: ArtKind; tone?: "light" | "dark" }) {
  const c = PALETTES[tone];
  return (
    <svg viewBox="0 0 200 120" aria-hidden className="track-art h-full w-full" fill="none" strokeWidth={1.5}>
      {kind === "network" && <Network c={c} />}
      {kind === "browser" && <Browser c={c} />}
      {kind === "globe" && <Globe c={c} />}
      {kind === "orbit" && <Orbit c={c} />}
    </svg>
  );
}

function Network({ c }: { c: Palette }) {
  const layers = [
    { x: 38, ys: [36, 60, 84], color: c.blue },
    { x: 80, ys: [24, 48, 72, 96], color: BROWN },
    { x: 122, ys: [36, 60, 84], color: ORANGE },
  ];
  const out = { x: 164, y: 60 };
  const edges: [number, number, number, number][] = [];
  for (let l = 0; l < layers.length - 1; l++)
    for (const a of layers[l].ys) for (const b of layers[l + 1].ys) edges.push([layers[l].x, a, layers[l + 1].x, b]);
  for (const a of layers[2].ys) edges.push([layers[2].x, a, out.x, out.y]);

  return (
    <>
      {edges.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c.faint} strokeWidth={0.8} />
      ))}
      <polyline points="38,36 80,48 122,60 164,60" stroke={ORANGE} className="flow" />
      <polyline points="38,84 80,72 122,36" stroke={ORANGE} className="flow" />
      {layers.map((layer) =>
        layer.ys.map((y) => <circle key={`${layer.x}-${y}`} cx={layer.x} cy={y} r={5} fill={c.paper} stroke={layer.color} />),
      )}
      <circle cx={out.x} cy={out.y} r={7} fill={c.paper} stroke={c.blue} className="pop" />
    </>
  );
}

function Browser({ c }: { c: Palette }) {
  return (
    <>
      <rect x={44} y={18} width={112} height={80} rx={4} fill={c.paper} stroke={c.ink} />
      <line x1={44} y1={30} x2={156} y2={30} stroke={c.ink} />
      {[52, 59, 66].map((cx) => (
        <circle key={cx} cx={cx} cy={24} r={2} stroke={ORANGE} strokeWidth={1.2} />
      ))}
      <rect x={124} y={38} width={24} height={8} rx={1} fill={ORANGE} className="pop" />
      <line x1={54} y1={42} x2={104} y2={42} stroke={c.faint} strokeWidth={3} />
      <line x1={54} y1={50} x2={92} y2={50} stroke={c.faint} strokeWidth={3} />
      {[54, 87, 120].map((x) => (
        <rect key={x} x={x} y={62} width={26} height={22} rx={1} fill={c.tile} stroke={c.blue} strokeWidth={0.8} />
      ))}
      <g className="cursor">
        <path d="M170 88 L170 104 L174 100 L178 108 L181 106 L177 99 L183 99 Z" fill={c.ink} />
      </g>
    </>
  );
}

function Globe({ c }: { c: Palette }) {
  return (
    <>
      <circle cx={100} cy={60} r={42} fill={c.paper} stroke={c.ink} />
      <ellipse cx={100} cy={60} rx={42} ry={14} stroke={c.faint} strokeWidth={0.8} />
      <ellipse cx={100} cy={60} rx={16} ry={42} stroke={c.faint} strokeWidth={0.8} className="globe" />
      <ellipse cx={100} cy={60} rx={30} ry={42} stroke={c.faint} strokeWidth={0.8} className="globe" />
      <path d="M76 44 C 92 30, 128 36, 124 62 S 102 84, 112 92" stroke={ORANGE} className="flow" />
      <circle cx={76} cy={44} r={4} fill={ORANGE} />
      <circle cx={124} cy={62} r={4} fill={ORANGE} className="pop" />
      <circle cx={112} cy={92} r={4} fill={ORANGE} />
    </>
  );
}

function Orbit({ c }: { c: Palette }) {
  const rays = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);
  return (
    <>
      <g className="spin">
        <ellipse cx={100} cy={60} rx={70} ry={22} stroke={c.blue} transform="rotate(-12 100 60)" />
        <circle cx={160} cy={42} r={4} fill={c.blue} />
      </g>
      <g className="spin-reverse">
        <ellipse cx={100} cy={60} rx={58} ry={18} stroke={ORANGE} transform="rotate(10 100 60)" />
        <circle cx={150} cy={70} r={4} fill={ORANGE} />
      </g>
      {rays.map((a) => (
        <line
          key={a}
          x1={(100 + Math.cos(a) * 14).toFixed(2)}
          y1={(60 + Math.sin(a) * 14).toFixed(2)}
          x2={(100 + Math.cos(a) * 21).toFixed(2)}
          y2={(60 + Math.sin(a) * 21).toFixed(2)}
          stroke={c.ink}
          strokeLinecap="round"
        />
      ))}
      <circle cx={100} cy={60} r={9} fill={c.paper} stroke={c.ink} />
      <circle cx={100} cy={60} r={3.5} fill={c.ink} className="pop" />
    </>
  );
}
