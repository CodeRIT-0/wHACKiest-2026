"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

const format = (n: number) => Math.round(n).toLocaleString("en-IN");

// Counts from 0 to `value` once visible; writes to the DOM directly so React doesn't re-render per frame
export default function CountUp({
  value,
  delay = 0,
  duration = 1.4,
}: {
  value: number;
  delay?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduce) {
      ref.current.textContent = format(value);
      return;
    }
    const controls = animate(0, value, {
      delay,
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, delay, duration]);

  return (
    <>
      <span ref={ref} aria-hidden className="tabular-nums">
        0
      </span>
      <span className="sr-only">{format(value)}</span>
    </>
  );
}
