"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// A hand-over between a light and a dark section, as a stack of sheets: the section above (`under`) holds still once
// its end is on screen, and the next section (`children`, a rounded sheet in the other tone) slides up over it while
// it sinks back a little and dims, as if the new sheet were laid on top of it. When the sheet has
// covered the screen, the one beneath is out of sight, and scrolling back up lifts it off again.
//
// The hold is plain CSS (sticky, with `top` set so it holds by its bottom edge, whatever its
// height); the sink and the dim are one scrubbed tween on transform and opacity, so nothing
// repaints or re-lays out while it plays. With reduced motion the sheet simply scrolls over.
export default function SheetStack({
  under,
  tone = "dark",
  sink = true,
  className = "",
  children,
}: {
  under: React.ReactNode;
  /** the sheet that slides over: dark (night) or light (paper) */
  tone?: "dark" | "light";
  /** the one beneath sinks back and dims. It needs to be opaque for that: as it shrinks, the
   *  night shows round its edges, like a card pushed back into the dark */
  sink?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const held = useRef<HTMLDivElement>(null);
  const dim = useRef<HTMLSpanElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = held.current!;
    // hold by the bottom edge: for anything taller than the screen, top goes negative
    const fit = () => {
      el.style.top = `${Math.min(0, window.innerHeight - el.offsetHeight)}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener("resize", fit);

    let tween: gsap.core.Timeline | undefined;
    if (sink && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tween = gsap
        .timeline({ scrollTrigger: { trigger: sheet.current, start: "top bottom", end: "top top", scrub: true } })
        .fromTo(el, { scale: 1 }, { scale: 0.94, ease: "none" }, 0)
        .fromTo(dim.current, { opacity: 0 }, { opacity: 0.6, ease: "power1.in" }, 0);
    }
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [sink]);

  return (
    <div className={`relative isolate ${sink ? "bg-[#0c0b0a]" : ""} ${className}`}>
      {/* scaled about the middle of what's on screen while it's held (its last screenful) */}
      <div ref={held} className="sticky z-0 origin-[50%_calc(100%-50svh)]">
        {under}
        {sink && <span ref={dim} aria-hidden className="pointer-events-none absolute inset-0 z-50 bg-[#0c0b0a] opacity-0" />}
      </div>
      <div ref={sheet} className={tone === "dark" ? "sheet sheet-dark theme-dark" : "sheet sheet-light"}>
        {children}
      </div>
    </div>
  );
}
