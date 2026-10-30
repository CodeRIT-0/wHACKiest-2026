"use client";

import { useEffect, useRef, useState } from "react";
import {
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  CIRCUIT_WIDTH,
  CIRCUIT_HEIGHT,
  JOURNEY_INPUT,
  JOURNEY_OUTPUT,
  timelineStations,
  TIMELINE_PIN_TOP,
} from "./timeline-layout";
import { scrollToPosition } from "@/components/system/SmoothScroll";

export const clamp = (value: number) => Math.max(0, Math.min(1, value));
export { usePrefersReducedMotion as useTimelineReducedMotion } from "@/hooks/usePrefersReducedMotion";
export { useHydrated as useTimelineHydrated } from "@/hooks/useHydrated";

/** A single scroll source moves the entire landscape, electrical signal and stage focus. */
export function useCircuitProgress(reducedMotion: boolean) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [worldSize, setWorldSize] = useState({
    width: CIRCUIT_WIDTH,
    height: CIRCUIT_HEIGHT,
    compact: false,
    scale: 1,
    designHeight: CIRCUIT_HEIGHT,
    gap: 28,
    cardRoom: 352,
  });
  const dimensions = useMotionValue({ width: 1440, scale: 1 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: [`start ${TIMELINE_PIN_TOP}px`, "end end"],
  });
  const softened = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 32,
    mass: 0.22,
    restDelta: 0.00001,
  });
  const progress = useTransform(() => {
    const value = reducedMotion ? scrollYProgress.get() : softened.get();
    return value >= 0.999 ? 1 : value <= 0.001 ? 0 : clamp(value);
  });
  // Nearly linear travel avoids bursts between stationary reading stops.
  // The final two percent lets the completed circuit settle before the section exits.
  const journey = useTransform(progress, JOURNEY_INPUT, JOURNEY_OUTPUT);
  const signalX = useTransform(
    journey,
    [0, 1, 2, 3, 4],
    timelineStations.map((station): number => station.x),
  );
  const cameraX = useTransform(
    () => dimensions.get().width * 0.5 - signalX.get() * dimensions.get().scale,
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const measure = () => {
      const height = Math.max(1, viewport.clientHeight);
      const scale = Math.min(1, Math.max(0.72, viewport.clientWidth / 1600));
      const gap = Math.max(10, Math.min(28, height * 0.035));
      const cardRoom = Math.max(80, Math.floor(height / 2 - gap - 10));
      const compact = cardRoom < 260;
      dimensions.set({ width: viewport.clientWidth, scale });
      setWorldSize((previous) =>
        previous.height === height &&
        previous.scale === scale &&
        previous.gap === gap
          ? previous
          : {
              width: CIRCUIT_WIDTH * scale,
              height,
              compact,
              scale,
              gap,
              cardRoom,
              designHeight: height / scale,
            },
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    measure();
    return () => observer.disconnect();
  }, [dimensions]);

  const goToStep = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const start = top - TIMELINE_PIN_TOP;
    const end = top + section.offsetHeight - window.innerHeight;
    const target =
      index < 5
        ? start + timelineStations[Math.max(0, index)].stop * (end - start)
        : top + section.offsetHeight - TIMELINE_PIN_TOP;
    scrollToPosition(target, reducedMotion);
  };
  return {
    sectionRef,
    viewportRef,
    progress,
    journey,
    signalX,
    cameraX,
    worldSize,
    goToStep,
  };
}
