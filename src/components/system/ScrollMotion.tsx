"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { HYDRATED_EVENT, PENDING_SELECTOR } from "./HydrationMark";

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
    // The sections below the hero hydrate later, one Suspense boundary at a time. Touching their
    // server HTML before then (the inline styles below) makes React report a hydration mismatch, so
    // nothing is collected until every boundary's HydrationMark has gone.
    // We also re-measure all ScrollTriggers here: the hero's pin height and the sheet stack's
    // negative-margin pull-up were measured before the lazy sections had their real heights, which
    // caused the giant era-year dividers (1960, 2026 …) to flash on screen without the content
    // beneath them (clicking a rail link fixed it because it forced a reflow/re-measure).
    const start = () => {
      if (document.querySelector(PENDING_SELECTOR)) return;
      window.removeEventListener(HYDRATED_EVENT, start);
      // Re-measure now that every lazy boundary has its real height. This corrects the hero pin
      // and sheet-stack offsets that were computed against a partially-rendered page.
      ScrollTrigger.refresh();
      collect();
      schedule();
    };
    // Phones and tablets keep the reveals (they play once, as a heading or group arrives) but not
    // the effects tied to every pixel of scroll (line art drawing, parallax, the era years sliding):
    // each one is work on every scroll frame, and together they were what made a flick feel heavy
    const phone = window.matchMedia("(max-width: 1023px)").matches;
    const collect = () => {
    gsap.utils.toArray<HTMLElement>("[data-words]").forEach((el) => later(() => {
      gsap.from(el.querySelectorAll(".word-inner"), {
        yPercent: 110,
        rotate: 4,
        // starts the moment the heading's top enters the screen and is short, so the words have
        // landed while the heading is still low on screen (at "top 85%" with 0.8s + 0.06s per word,
        // headings were only readable once halfway up)
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.035,
        // (on phones they play once and their trigger is dropped: every live trigger is checked on
        // every scroll frame, and reversing them on the way back up is a nicety a phone can skip)
        scrollTrigger: { trigger: el, start: "top bottom", ...(phone ? { once: true } : { toggleActions: "play none none reverse" }) },
      });
    }));

    gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((el) => later(() => {
      gsap.from(el.children, {
        y: 48,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 82%", ...(phone ? { once: true } : { toggleActions: "play none none reverse" }) },
      });
    }));

    if (!phone) gsap.utils.toArray<SVGElement>("[data-draw]").forEach((el) => later(() => {
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

    if (!phone) gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => later(() => {
      const speed = Number(el.dataset.parallax) || 0.15;
      gsap.fromTo(
        el,
        { y: () => -speed * window.innerHeight * 0.5 },
        { y: () => speed * window.innerHeight * 0.5, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true } },
      );
    }));

    if (!phone) gsap.utils.toArray<HTMLElement>("[data-era-year]").forEach((el) => later(() => {
      const dir = el.dataset.eraYear === "left" ? -1 : 1;
      gsap.fromTo(
        el,
        { xPercent: -12 * dir },
        { xPercent: 12 * dir, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
      );
    }));

    gsap.utils.toArray<HTMLElement>("[data-era-rule]").forEach((el) => later(() => {
      // (on phones it draws across once as it arrives, instead of following the scroll)
      if (phone) gsap.from(el, { scaleX: 0, duration: 1.1, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      else gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 90%", end: "top 45%", scrub: true } });
    }));
    };
    window.addEventListener(HYDRATED_EVENT, start);
    start();
    return () => {
      window.removeEventListener(HYDRATED_EVENT, start);
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(id);
      window.clearTimeout(id);
    };
  });

  return null;
}
