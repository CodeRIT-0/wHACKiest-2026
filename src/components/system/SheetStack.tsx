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
// where the hold-and-sink plays: a wide screen with a mouse or trackpad
const HOLD = "(min-width: 1024px) and (hover: hover)";

export default function SheetStack({
  under,
  tone = "dark",
  sink = true,
  plain = false,
  className = "",
  children,
}: {
  /** leave the grid off the sliding sheet */
  plain?: boolean;
  under: React.ReactNode;
  /** the sheet that slides over: dark (night) or light (paper) */
  tone?: "dark" | "light";
  /** the one beneath sinks back and dims. It needs to be opaque for that: as it shrinks, the
   *  paper shows round its edges while the dim takes it down, like a card pushed back */
  sink?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const held = useRef<HTMLDivElement>(null);
  const dim = useRef<HTMLSpanElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = held.current!;
    // Phones and tablets (and anything touch-first) don't hold or sink: the sheet just scrolls up
    // over the section before it, rounded corners and shadow and all. Holding made a fling carry
    // straight past the end of a section (tracks went by in one swipe), and in a fast fling the
    // held section could not be painted in time, so the night behind it flashed through
    if (!window.matchMedia(HOLD).matches) return;
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
        .fromTo(el, { scale: 1 }, { scale: 0.96, ease: "none" }, 0)
        .fromTo(dim.current, { opacity: 0 }, { opacity: 0.35, ease: "power1.in" }, 0);
    }
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [sink]);

  return (
    // behind the held section: the paper, so if a fast scroll ever outruns painting, what shows
    // through is the same cream rather than a flash of the dark
    <div className={`relative isolate ${sink ? "lg:bg-[#fff9ec]" : ""} ${className}`}>
      {/* held (wide screens, see HOLD) and scaled about the middle of what's on screen while it's
          held: its last screenful */}
      <div ref={held} className="relative z-0 origin-[50%_calc(100%-50svh)] [@media(min-width:1024px)_and_(hover:hover)]:sticky">
        {under}
        {sink && <span ref={dim} aria-hidden className="pointer-events-none absolute inset-0 z-50 bg-[#0c0b0a] opacity-0" />}
      </div>
      <div ref={sheet} className={`${tone === "dark" ? "sheet sheet-dark theme-dark" : "sheet sheet-light"} ${plain ? "sheet-plain" : ""}`}>
        {children}
      </div>
    </div>
  );
}
