"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./ThemeTransition.module.css";
import { TextShimmer } from "./ui/text-shimmer";
import { useHydrated } from "@/hooks/useHydrated";

/** A real, scroll-linked handoff between two section surfaces, without covering content. */
export default function ThemeTransition({
  to = "dark",
  label,
}: {
  to?: "dark" | "light";
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const hydrated = useHydrated();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 35%"],
  });
  const draw = useTransform(scrollYProgress, [0, 0.85], [0, 1]);
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.85, 0.25]);
  // Great UI's opposed half-panels, driven by section scroll rather than route timers.
  const leftCurtain = useTransform(
    scrollYProgress,
    [0.05, 0.8],
    ["0%", "-100%"],
  );
  const rightCurtain = useTransform(
    scrollYProgress,
    [0.05, 0.8],
    ["0%", "100%"],
  );

  return (
    <div
      ref={ref}
      className={styles.transition}
      data-to={to}
      data-theme-transition
      aria-hidden="true"
    >
      <div className={styles.grain} />
      <svg
        className={styles.traces}
        viewBox="0 0 1200 240"
        preserveAspectRatio="none"
      >
        {[-3, -2, -1, 1, 2, 3].map((lane) => (
          <path
            key={lane}
            d={`M${600 + lane * 76} 0V40L${600 + lane * 18} 110V240`}
          />
        ))}
        <path className={styles.bus} d="M600 0V240" />
        <motion.path
          className={styles.power}
          d="M600 0V240"
          style={{ pathLength: reducedMotion ? 1 : draw }}
          data-transition-current
        />
        <motion.circle
          cx="600"
          cy="154"
          r="16"
          className={styles.halo}
          style={{ opacity: reducedMotion ? 0 : glow }}
        />
        <circle cx="600" cy="154" r="4" className={styles.contact} />
      </svg>
      <motion.div
        className={`${styles.curtainPanel} ${styles.curtainLeft}`}
        style={{ x: !hydrated || reducedMotion ? "-100%" : leftCurtain }}
        data-curtain-panel="left"
      />
      <motion.div
        className={`${styles.curtainPanel} ${styles.curtainRight}`}
        style={{ x: !hydrated || reducedMotion ? "100%" : rightCurtain }}
        data-curtain-panel="right"
      />
      <div className={styles.caption}>
        <span>WHACKIEST / 2026</span>
        <span>
          <i />
          <TextShimmer>{label}</TextShimmer>
          <b>↓</b>
        </span>
      </div>
    </div>
  );
}

/** Curtain geometry adapted from Great UI CurtainPageTransition by Saurabh Sharma.
 * https://great-ui.com/components/curtain-page-transition
 * License: docs/licenses/great-ui.txt.
 */
