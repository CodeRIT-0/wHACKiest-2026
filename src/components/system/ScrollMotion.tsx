"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Page-wide scroll choreography, opted into with data attributes so sections stay declarative:
//   [data-words]         heading whose .word-inner spans rise out of their masks, one by one
//   [data-stagger]       its children rise in one after another as it enters
//   [data-draw]          line art inside draws itself in (stroke-dashoffset), scrubbed to scroll
//   [data-parallax="n"]  drifts at n x scroll speed while it passes through the viewport
//   [data-era-year]      the giant outlined year in an era divider, slid sideways by scroll
//   [data-era-rule]      the divider's ruled line, drawn across by scroll
// Nothing is hidden before this runs, and none of it runs with reduced motion.
const SHAPES = "path, line, polyline, polygon, circle, ellipse, rect";

export default function ScrollMotion() {
  // Everything here is below the first screen, so it's set up in small pieces while the browser
  // is idle after load, rather than in the block of work that brings the page to life (on a phone
  // that block was the main source of blocked time, and even run later as one piece it was a long
  // task). Each element's animation is one job; contextSafe keeps them all revertible on unmount
  useGSAP((_, contextSafe) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const jobs: (() => void)[] = [];
    const later = (job: () => void) => jobs.push(contextSafe!(job));
    let id = 0;
    const schedule = () => {
      id = typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(run, { timeout: 1500 }) : window.setTimeout(run, 50);
    };
    // a few milliseconds of jobs per idle slice, so no single task runs long
    const run = () => {
      const until = performance.now() + 8;
      do jobs.shift()?.();
      while (jobs.length && performance.now() < until);
      if (jobs.length) schedule();
    };
    gsap.utils.toArray<HTMLElement>("[data-words]").forEach((el) => later(() => {
      gsap.from(el.querySelectorAll(".word-inner"), {
        yPercent: 110,
        rotate: 4,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
      });
    }));

    gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((el) => later(() => {
      gsap.from(el.children, {
        y: 48,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none reverse" },
      });
    }));

    gsap.utils.toArray<SVGElement>("[data-draw]").forEach((el) => later(() => {
      const shapes = [...el.querySelectorAll<SVGGeometryElement>(SHAPES)].filter((s) => !s.closest(".wire-pulse, .flow"));
      shapes.forEach((s) => s.setAttribute("pathLength", "1"));
      gsap.fromTo(
        shapes,
        { strokeDasharray: "1 1", strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: "none",
          stagger: { amount: 0.4 },
          scrollTrigger: { trigger: el, start: "top 88%", end: "top 30%", scrub: 0.6 },
        },
      );
    }));

    gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => later(() => {
      const speed = Number(el.dataset.parallax) || 0.15;
      gsap.fromTo(
        el,
        { y: () => -speed * window.innerHeight * 0.5 },
        { y: () => speed * window.innerHeight * 0.5, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true } },
      );
    }));

    gsap.utils.toArray<HTMLElement>("[data-era-year]").forEach((el) => later(() => {
      const dir = el.dataset.eraYear === "left" ? -1 : 1;
      gsap.fromTo(
        el,
        { xPercent: -12 * dir },
        { xPercent: 12 * dir, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
      );
    }));

    gsap.utils.toArray<HTMLElement>("[data-era-rule]").forEach((el) => later(() => {
      gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 90%", end: "top 45%", scrub: true } });
    }));
    schedule();
    return () => {
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(id);
      window.clearTimeout(id);
    };
  });

  return null;
}
