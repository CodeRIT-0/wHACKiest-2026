"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// The circuit trace that threads the whole page together. It leaves the hero clock, runs down
// a trunk in the left gutter, branches into every section's illustration ([data-trace] marks the
// spot) and finally wires into the closing clock. Scrolling draws it in (stroke-dashoffset);
// a faint copy of the full route sits underneath, like an unpowered board.

type Branch = { d: string; from: number; junction: [number, number]; end: [number, number] };
type Geometry = { w: number; h: number; trunk: string; branches: Branch[]; start: [number, number]; finish: [number, number] };

const CONTENT = 1100; // max content width
const C = 14; // chamfer on every bend, for that PCB look
const TIP = 0.62; // the current's tip rides this far down the viewport

function build(main: HTMLElement): Geometry | null {
  const anchors = [...main.querySelectorAll<HTMLElement>("[data-trace]")];
  if (anchors.length < 2) return null;
  const box = main.getBoundingClientRect();
  const w = main.clientWidth;
  const desktop = w >= 1024;
  // some sections run wider than CONTENT (prizes, the procedure), so keep clear of the leftmost
  // section heading too, not just the standard column
  const headLeft = Math.min(
    ...[...main.querySelectorAll("section h2")].map((el) => el.getBoundingClientRect().left - box.left).filter((l) => l > 0),
  );
  const tx = desktop ? Math.max(6, Math.min((w - CONTENT) / 2 - 36, headLeft - 28)) : 9;
  const rect = (el: Element) => {
    const r = el.getBoundingClientRect();
    return { left: r.left - box.left, top: r.top - box.top, width: r.width, height: r.height };
  };
  const sectionOf = (el: HTMLElement) => rect(el.closest("section") ?? el);

  const first = anchors[0];
  const last = anchors[anchors.length - 1];
  const a = rect(first);
  const z = rect(last);
  const heroBottom = sectionOf(first);
  const endSection = sectionOf(last);

  // leave the hero clock from its base, drop to the gutter, run down, cross to the final clock
  const sx = a.left + a.width / 2;
  const sy = a.top + a.height;
  const turnY = Math.max(sy + 40, heroBottom.top + heroBottom.height - 40);
  const fx = z.left + z.width / 2;
  const crossY = endSection.top + 48;
  const toLeft = sx > tx ? -1 : 1;
  const trunk = [
    `M${sx} ${sy}`,
    `V${turnY - C}`,
    `L${sx + toLeft * C} ${turnY}`,
    `H${tx - toLeft * C}`,
    `L${tx} ${turnY + C}`,
    `V${crossY - C}`,
    `L${tx + C} ${crossY}`,
    `H${fx - C}`,
    `L${fx} ${crossY + C}`,
    `V${z.top}`,
  ].join(" ");

  const branches = anchors.slice(1, -1).map((el): Branch => {
    const r = rect(el);
    if (desktop) {
      // across the gap just above the illustration, then the chamfer drops straight into it, so
      // the trace hugs the art and never runs through the text stacked above (prizes sits tight)
      const y = r.top - C;
      const x = r.left + r.width / 2;
      return { d: `M${tx} ${y} H${x - C} L${x} ${y + C} V${r.top}`, from: y, junction: [tx, y], end: [x, r.top] };
    }
    // stacked layout: straight in from the gutter to the illustration's left edge
    const y = r.top + 24;
    return { d: `M${tx} ${y} H${r.left}`, from: y, junction: [tx, y], end: [r.left, y] };
  });

  return { w, h: main.scrollHeight, trunk, branches, start: [sx, sy], finish: [fx, z.top] };
}

export default function CircuitSpine() {
  const ref = useRef<HTMLDivElement>(null);
  const trunkRef = useRef<SVGPathElement>(null);
  const branchRefs = useRef<(SVGPathElement | null)[]>([]);
  const padRefs = useRef<(SVGCircleElement | null)[]>([]);
  const [geo, setGeo] = useState<Geometry | null>(null);

  useEffect(() => {
    const main = ref.current?.parentElement;
    if (!main) return;
    const rebuild = () => setGeo(build(main));
    rebuild();
    ScrollTrigger.addEventListener("refresh", rebuild);
    window.addEventListener("load", rebuild);
    return () => {
      ScrollTrigger.removeEventListener("refresh", rebuild);
      window.removeEventListener("load", rebuild);
    };
  }, []);

  useLayoutEffect(() => {
    const trunk = trunkRef.current;
    const main = ref.current?.parentElement;
    if (!geo || !trunk || !main) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = trunk.getTotalLength();
    // y -> length lookup along the trunk (it only ever runs down or sideways)
    const samples: [number, number][] = [];
    for (let l = 0; l <= total; l += 6) samples.push([trunk.getPointAtLength(l).y, l]);
    samples.push([trunk.getPointAtLength(total).y, total]);
    const lengthAt = (y: number) => {
      let best = 0;
      for (const [sy, l] of samples) {
        if (sy <= y) best = l;
        else break;
      }
      return best;
    };

    const branches = geo.branches.map((b, i) => {
      const el = branchRefs.current[i];
      const len = el?.getTotalLength() ?? 0;
      if (el) el.style.strokeDasharray = `${len} ${len}`;
      return { el, len, from: b.from };
    });
    trunk.style.strokeDasharray = `${total} ${total}`;

    let shown = 0;
    let target = 0;
    const draw = () => {
      trunk.style.strokeDashoffset = String(total - shown);
    };

    const update = () => {
      // in main's coordinates
      const tipY = reduce ? Infinity : window.innerHeight * TIP - main.getBoundingClientRect().top;
      target = reduce ? total : lengthAt(tipY);
      branches.forEach((b, i) => {
        const p = reduce ? 1 : Math.min(1, Math.max(0, (tipY - b.from) / (window.innerHeight * 0.3)));
        if (b.el) b.el.style.strokeDashoffset = String(b.len * (1 - p));
        padRefs.current[i]?.classList.toggle("is-lit", p >= 1);
      });
    };

    // ease the trunk toward its target so the jump across a sideways run reads as current flowing
    const tick = () => {
      if (Math.abs(target - shown) < 0.5) return;
      shown += (target - shown) * 0.16;
      draw();
    };

    update();
    shown = target;
    draw();
    if (reduce) return;
    const trigger = ScrollTrigger.create({ start: 0, end: "max", onUpdate: update });
    gsap.ticker.add(tick);
    return () => {
      trigger.kill();
      gsap.ticker.remove(tick);
    };
  }, [geo]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {geo && (
        <svg width={geo.w} height={geo.h} className="absolute left-0 top-0" fill="none" strokeLinejoin="round">
          {/* unpowered board */}
          <g className="stroke-trace/20" strokeWidth={1.25}>
            <path d={geo.trunk} />
            {geo.branches.map((b, i) => (
              <path key={i} d={b.d} />
            ))}
          </g>
          {/* live current */}
          <g className="stroke-trace" strokeWidth={1.5}>
            <path ref={trunkRef} d={geo.trunk} />
            {geo.branches.map((b, i) => (
              <path
                key={i}
                ref={(el) => {
                  branchRefs.current[i] = el;
                }}
                d={b.d}
              />
            ))}
          </g>
          {/* solder pads: junctions on the trunk, and the pad where each branch lands */}
          <g strokeWidth={1.25}>
            {geo.branches.map((b, i) => (
              <g key={i}>
                <circle cx={b.junction[0]} cy={b.junction[1]} r={3.5} className="fill-bg stroke-trace" />
                <circle
                  ref={(el) => {
                    padRefs.current[i] = el;
                  }}
                  cx={b.end[0]}
                  cy={b.end[1]}
                  r={4}
                  className="trace-pad fill-bg stroke-trace"
                />
              </g>
            ))}
            <circle cx={geo.start[0]} cy={geo.start[1]} r={4} className="fill-accent stroke-accent" />
            <circle cx={geo.finish[0]} cy={geo.finish[1]} r={4} className="fill-bg stroke-trace" />
          </g>
        </svg>
      )}
    </div>
  );
}
