"use client";

import type { CSSProperties, HTMLAttributes } from "react";

// Prompt Kit TextShimmer, MIT © 2025 Julien Thibeaut. See docs/component-sources.md.
export function TextShimmer({
  duration = 4,
  spread = 20,
  children,
  className = "",
  style,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { duration?: number; spread?: number }) {
  const dynamicSpread = Math.min(Math.max(spread, 5), 45);
  return (
    <span
      {...props}
      className={`text-shimmer ${className}`}
      style={
        {
          backgroundImage: `linear-gradient(to right, var(--shimmer-base, #9b6332) ${50 - dynamicSpread}%, var(--shimmer-light, #fd9c36) 50%, var(--shimmer-base, #9b6332) ${50 + dynamicSpread}%)`,
          animationDuration: `${duration}s`,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </span>
  );
}
