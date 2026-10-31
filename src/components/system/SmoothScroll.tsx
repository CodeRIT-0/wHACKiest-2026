"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let active: Lenis | null = null;

// scroll to a page position through Lenis when it's running, natively otherwise. Lenis clamps to
// the page height it last measured, which lags right after a route change, so re-measure first
export function scrollToPosition(top: number, reducedMotion = false) {
  if (active && !reducedMotion) {
    active.resize();
    active.scrollTo(top, { lerp: 0.12 });
  } else window.scrollTo({ top, behavior: reducedMotion ? "instant" : "smooth" });
}

// Lenis smooth scrolling, driven from GSAP's ticker so ScrollTrigger and Lenis share one frame.
// Skipped entirely for reduced motion. Also re-measures every ScrollTrigger when the page
// reflows (fonts, images, accordions), since their start/end points are cached.
export default function SmoothScroll() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const observer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    observer.observe(document.body);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      return () => {
        observer.disconnect();
        clearTimeout(timer);
      };
    }

    // in-page links land just below the floating nav
    const lenis = new Lenis({ anchors: { offset: -90 }, autoRaf: false });
    active = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      gsap.ticker.remove(tick);
      lenis.destroy();
      active = null;
    };
  }, []);

  return null;
}
