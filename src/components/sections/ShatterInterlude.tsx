"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

// Pinned bridge between the timeline and the tracks. ScrollClock reads [data-clock-stage]: the
// clock flies to the centre and scrubs its shatter clip over the first ~40% of this section.
// This component does the rest on the same scroll progress: glass shards burst outward, the
// paper darkens into the tracks' night sky, and the two lines land.

const SHAPES = [
  "polygon(50% 0,100% 80%,10% 100%)",
  "polygon(0 20%,80% 0,100% 100%,30% 85%)",
  "polygon(20% 0,100% 35%,60% 100%,0 70%)",
  "polygon(0 0,100% 40%,40% 100%)",
  "polygon(35% 0,100% 15%,70% 100%,0 60%)",
];
const r3 = (n: number) => Math.round(n * 1000) / 1000;

// spread around the circle by the golden angle so no two neighbours fly the same way
const SHARDS = Array.from({ length: 28 }, (_, i) => {
  const angle = i * 2.399963;
  const reach = 0.5 + ((i * 37) % 10) / 20; // 0.5 to 0.95 of the viewport
  return {
    dx: r3(Math.cos(angle) * reach * 62),
    dy: r3(Math.sin(angle) * reach * 62),
    size: 26 + ((i * 53) % 9) * 9,
    spin: (i % 2 ? 1 : -1) * (140 + ((i * 29) % 7) * 45),
    shape: SHAPES[i % SHAPES.length],
    lag: ((i * 13) % 5) * 0.012,
  };
});

export default function ShatterInterlude() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const background = useTransform(p, [0.44, 0.66], ["#fbf7ec", "#0b111c"]);
  const flash = useTransform(p, [0.39, 0.44, 0.56], [0, 0.85, 0]);
  const stars = useTransform(p, [0.6, 0.8], [0, 0.6]);

  const oneOpacity = useTransform(p, [0.56, 0.64], [0, 1]);
  const oneY = useTransform(p, [0.56, 0.64], [40, 0]);
  const oneBlur = useTransform(p, [0.56, 0.64], ["blur(10px)", "blur(0px)"]);

  const manyOpacity = useTransform(p, [0.68, 0.76], [0, 1]);
  const manyY = useTransform(p, [0.68, 0.76], [40, 0]);
  const ghostOpacity = useTransform(p, [0.72, 0.8, 0.95], [0, 0.7, 0.45]);
  const split = useTransform(p, [0.72, 0.95], [0, 1]);
  const ghostA = useTransform(split, [0, 1], ["translate(0px,0px)", "translate(-18px,-10px)"]);
  const ghostB = useTransform(split, [0, 1], ["translate(0px,0px)", "translate(18px,10px)"]);

  const cueOpacity = useTransform(p, [0.84, 0.92], [0, 1]);

  return (
    <section ref={ref} id="shatter" data-clock-stage aria-label="One idea. Multiple realities." className="relative h-[340vh]">
      <motion.div style={{ backgroundColor: background }} className="sticky top-0 h-screen overflow-hidden">
        {/* the tracks' starfield, faded in as the room goes dark */}
        <motion.div
          aria-hidden
          style={{ opacity: stars }}
          className="absolute inset-0 [background-image:radial-gradient(1px_1px_at_12%_18%,#fff_50%,transparent),radial-gradient(1px_1px_at_68%_32%,#fff_50%,transparent),radial-gradient(1.5px_1.5px_at_38%_76%,#fff_50%,transparent),radial-gradient(1px_1px_at_84%_64%,#fff_50%,transparent),radial-gradient(1px_1px_at_52%_12%,#fff_50%,transparent),radial-gradient(1px_1px_at_22%_58%,#fff_50%,transparent),radial-gradient(1.5px_1.5px_at_92%_22%,#fff_50%,transparent)]"
        />

        {!reduce && (
          <>
            <motion.div
              aria-hidden
              style={{ opacity: flash }}
              className="absolute left-1/2 top-1/2 h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,#fff,rgba(255,240,220,0.6)_30%,transparent_70%)]"
            />
            {SHARDS.map((s, i) => (
              <Shard key={i} p={p} {...s} />
            ))}
          </>
        )}

        {/* z-20: above the clock canvas, which is z-10 */}
        <div className="relative z-20 grid h-full place-items-center px-6 text-center text-bg">
          <div>
            <motion.p style={{ opacity: oneOpacity, y: oneY, filter: oneBlur }} className="display-wide text-5xl leading-none sm:text-7xl md:text-8xl">
              One idea<span className="text-accent">.</span>
            </motion.p>

            <motion.div style={{ opacity: manyOpacity, y: manyY }} className="relative mt-4">
              {/* the same line, split into drifting copies: one idea, many outcomes */}
              <motion.p
                aria-hidden
                style={{ opacity: ghostOpacity, transform: ghostA }}
                className="display-wide absolute inset-0 text-5xl leading-none text-accent mix-blend-screen sm:text-7xl md:text-8xl"
              >
                Multiple realities.
              </motion.p>
              <motion.p
                aria-hidden
                style={{ opacity: ghostOpacity, transform: ghostB }}
                className="display-wide absolute inset-0 text-5xl leading-none text-[#6f9bff] mix-blend-screen sm:text-7xl md:text-8xl"
              >
                Multiple realities.
              </motion.p>
              <p className="display-wide relative text-5xl leading-none sm:text-7xl md:text-8xl">
                Multiple realities<span className="text-accent">.</span>
              </p>
            </motion.div>

            <motion.p style={{ opacity: cueOpacity }} className="mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-bg/60">
              Pick yours <span className="text-accent">↓</span> four tracks
            </motion.p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Shard({
  p,
  dx,
  dy,
  size,
  spin,
  shape,
  lag,
}: {
  p: MotionValue<number>;
  dx: number;
  dy: number;
  size: number;
  spin: number;
  shape: string;
  lag: number;
}) {
  const from = 0.41 + lag;
  const to = 0.8;
  const x = useTransform(p, [from, to], ["0vw", `${dx}vw`]);
  const y = useTransform(p, [from, to], ["0vh", `${dy}vh`]);
  const rotate = useTransform(p, [from, to], [0, spin]);
  const scale = useTransform(p, [from, to], [0.4, 1.35]);
  const opacity = useTransform(p, [from - 0.01, from + 0.02, 0.66, to], [0, 1, 0.9, 0]);

  return (
    <motion.span
      aria-hidden
      style={{ x, y, rotate, scale, opacity, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, clipPath: shape }}
      className="absolute left-1/2 top-1/2 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(170,200,235,0.45)_55%,rgba(255,255,255,0.75))] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.8)]"
    />
  );
}
