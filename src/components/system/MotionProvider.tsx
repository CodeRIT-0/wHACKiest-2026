"use client";

import { MotionConfig } from "motion/react";

// "user": with prefers-reduced-motion, motion drops transform animations and keeps fades
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
