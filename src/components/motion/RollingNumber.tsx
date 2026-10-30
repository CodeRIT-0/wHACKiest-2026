"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";

const LOOPS = 3;
const DIGITS = Array.from({ length: LOOPS * 10 }, (_, i) => i % 10);

// Slot-machine digits: each column spins a couple of times and settles on its value
export default function RollingNumber({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const settled = inView || reduce;

  let column = 0;

  return (
    <span ref={ref} role="img" aria-label={label} className="inline-flex">
      {value.split("").map((char, i) => {
        if (!/\d/.test(char)) {
          return (
            <span key={i} aria-hidden>
              {char}
            </span>
          );
        }

        const target = (LOOPS - 1) * 10 + Number(char);
        const delay = column++ * 0.09;

        return (
          <span key={i} aria-hidden className="relative inline-block h-[1em] overflow-hidden">
            {/* invisible copy sizes the column to this digit's width */}
            <span className="invisible">{char}</span>
            <span
              className="absolute inset-x-0 top-0 flex flex-col"
              style={{
                transform: `translateY(-${settled ? target : 0}em)`,
                transition: reduce ? "none" : `transform 1.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
              }}
            >
              {DIGITS.map((d, j) => (
                <span key={j} className="block h-[1em] text-center">
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
