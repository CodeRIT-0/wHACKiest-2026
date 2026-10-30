"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useHydrated } from "@/hooks/useHydrated";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Block adaptation of Great UI BlurScrollReveal; inherits the site's typography. */
export function ScrollReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 96%", "end 78%"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.55, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [12, 0]);
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        opacity: !hydrated || reduced ? 1 : opacity,
        y: !hydrated || reduced ? 0 : y,
      }}
      data-scroll-reveal
    >
      {children}
    </motion.div>
  );
}

/**
 * Adapted from Great UI BlurScrollReveal by Saurabh Sharma.
 * https://great-ui.com/components/blur-scroll-reveal
 * https://github.com/Saurabh-2607/GreatUI
 * Great UI Custom License Agreement; full notice: docs/licenses/great-ui.txt.
 */
