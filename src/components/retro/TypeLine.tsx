"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

// Types `text` out one character at a time once `start` is true. Remount (change `key`) to retype.
export default function TypeLine({
  text,
  start = true,
  speed = 28,
  delay = 0,
  caret = false,
  onDone,
  className,
}: {
  text: string;
  start?: boolean;
  speed?: number;
  delay?: number;
  caret?: boolean;
  onDone?: () => void;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start || reduce) return;
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setCount(i);
        if (i >= text.length) {
          clearInterval(interval);
          onDone?.();
        }
      }, speed);
    }, delay);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
    // onDone is intentionally excluded: callers pass inline callbacks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, reduce, text, speed, delay]);

  // reduced motion: show the whole line straight away
  useEffect(() => {
    if (start && reduce) onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, reduce]);

  const shown = reduce ? text : text.slice(0, count);
  const typing = start && !reduce && count < text.length;

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {shown}
        {(caret || typing) && start && <span className="ml-px inline-block w-[0.55em] animate-[blink_1s_steps(1)_infinite] bg-current">&nbsp;</span>}
      </span>
    </span>
  );
}
