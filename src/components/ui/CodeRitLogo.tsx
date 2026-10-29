import type { ComponentPropsWithoutRef } from "react";

type CodeRitLogoProps = Omit<ComponentPropsWithoutRef<"svg">, "children">;

/**
 * A background-free SVG lockup recreated from the supplied CodeRIT mark.
 * Keeping it inline makes the logo sharp at every size and lets the page
 * background show through the open side of the C mark.
 */
export default function CodeRitLogo({ className, ...props }: CodeRitLogoProps) {
  return (
    <svg
      viewBox="0 0 590 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="coderit-logo-title"
      className={className}
      {...props}
    >
      <title id="coderit-logo-title">CodeRIT</title>
      <defs>
        <mask id="coderit-c-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="160" height="160">
          <rect width="160" height="160" fill="black" />
          <circle cx="80" cy="80" r="67" fill="white" />
          <path d="M78 79L153 31V129L78 81Z" fill="black" />
        </mask>
      </defs>

      <g mask="url(#coderit-c-mask)">
        <rect width="160" height="160" fill="#171B72" />
        <g fill="#A7B8FF" fillOpacity="0.62" fontFamily="monospace" fontSize="10" fontWeight="700" letterSpacing="1">
          <text x="7" y="28">101010101010</text>
          <text x="-4" y="43">01010101010101</text>
          <text x="4" y="58">110010101001</text>
          <text x="-7" y="73">00101010101010</text>
          <text x="2" y="88">101001010100</text>
          <text x="-4" y="103">01010101010101</text>
          <text x="5" y="118">101010010101</text>
          <text x="-6" y="133">01010101010101</text>
        </g>
      </g>
      <circle cx="80" cy="80" r="10" fill="var(--color-bg, #EFE9DD)" />
      <circle cx="80" cy="80" r="4" fill="#171B72" />

      <text
        x="150"
        y="106"
        fill="#151515"
        fontFamily="Arial Black, Arial, sans-serif"
        fontSize="76"
        fontWeight="900"
        letterSpacing="-6"
      >
        Code
      </text>
      <text
        x="372"
        y="105"
        fill="none"
        stroke="#151515"
        strokeWidth="3.2"
        fontFamily="Arial, sans-serif"
        fontSize="70"
        fontWeight="500"
        letterSpacing="-6"
      >
        RIT
      </text>
    </svg>
  );
}
