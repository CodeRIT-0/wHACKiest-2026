"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Adapted from Motion Primitives / 21st.dev TransitionPanel (MIT).
export function TransitionPanel({
  activeIndex,
  children,
}: {
  activeIndex: number;
  children: ReactNode[];
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <div className="transition-panel">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: reduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -8 }}
          transition={{ duration: reduced ? 0 : 0.22, ease: "easeOut" }}
        >
          {children[activeIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
