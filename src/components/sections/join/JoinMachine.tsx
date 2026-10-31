"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

// The brass calculating engine that closes the page: it rises in once it scrolls into view, then
// floats over a brown glow and its own shadow, and leans toward the pointer. Reduced motion (the
// MotionConfig in the layout) drops every transform, so it simply fades in and stays put.
export default function JoinMachine() {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), { stiffness: 120, damping: 18 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), { stiffness: 120, damping: 18 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div onPointerMove={onMove} onPointerLeave={onLeave} className="relative mx-auto w-[min(620px,88vw)] [perspective:1100px]">
      {/* a brown glow from behind the brass, breathing slowly */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(176,104,46,0.5),rgba(122,70,30,0.2)_55%,transparent)]"
        animate={{ opacity: [0.65, 1, 0.65], scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 70, scale: 0.88, rotateX: 22 }}
        whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 1.3, ease: EASE }}
        className="relative"
      >
        {/* the shadow it floats above: tightens as the machine rises */}
        <motion.div
          aria-hidden
          className="absolute inset-x-[12%] -bottom-[6%] h-[12%] rounded-[50%] bg-black/70 blur-xl"
          animate={{ scaleX: [1, 0.86, 1], opacity: [0.75, 0.5, 0.75] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
          <motion.div style={{ rotateX, rotateY }} className="[transform-style:preserve-3d]">
            <Image
              src="/assets/join/machine.webp"
              alt="A brass mechanical calculating engine with number drums, dials and an orrery"
              width={805}
              height={525}
              sizes="(min-width: 768px) 620px, 88vw"
              className="h-auto w-full [filter:drop-shadow(0_0_28px_rgba(176,104,46,0.55))_drop-shadow(0_30px_40px_rgba(0,0,0,0.6))]"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
