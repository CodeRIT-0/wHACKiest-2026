"use client";

import * as React from "react";
import { motion } from "motion/react";

type AnimatedGridPatternProps = React.SVGProps<SVGSVGElement> & {
  numSquares?: number;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
  width?: number;
  height?: number;
  strokeDasharray?: string;
};

export function AnimatedGridPattern({
  numSquares = 30,
  maxOpacity = 0.15,
  duration = 3,
  repeatDelay = 1,
  width = 40,
  height = 40,
  strokeDasharray = "4 4",
  className,
  ...props
}: AnimatedGridPatternProps) {
  const patternId = React.useId().replace(/:/g, "");
  const squares = React.useMemo(
    () =>
      Array.from({ length: numSquares }, (_, index) => ({
        id: index,
        x: (index * 7 + 3) % 20,
        y: (index * 11 + 5) % 12,
      })),
    [numSquares],
  );

  return (
    <svg
      aria-hidden="true"
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 800 480"
      preserveAspectRatio="none"
      {...props}
    >
      <defs>
        <pattern
          id={`${patternId}-pattern`}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${width} 0 L 0 0 0 ${height}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray={strokeDasharray}
            opacity="0.35"
          />
        </pattern>
      </defs>

      <rect
        width="100%"
        height="100%"
        fill={`url(#${patternId}-pattern)`}
      />

      {squares.map((square) => (
        <motion.rect
          key={square.id}
          width={width - 1}
          height={height - 1}
          x={square.x * width + 1}
          y={square.y * height + 1}
          fill="currentColor"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, maxOpacity, 0] }}
          transition={{
            duration,
            repeat: Infinity,
            repeatDelay,
            delay: square.id * 0.12,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}
