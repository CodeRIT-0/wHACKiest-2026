"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Great UI Card's drawn divider, adapted to the paper-and-circuit card system. */
export function SchematicCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.article
      className={`schematic-card ${className}`}
      initial="rest"
      whileHover="hover"
      variants={{ rest: { y: 0 }, hover: { y: reduced ? 0 : -3 } }}
      transition={{ duration: reduced ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
      <motion.span
        aria-hidden="true"
        className="card-signal-divider"
        variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
        transition={{ duration: reduced ? 0 : 0.3, ease: "easeOut" }}
      />
    </motion.article>
  );
}

/** Adapted from Great UI Card by Saurabh Sharma; docs/licenses/great-ui.txt. */
