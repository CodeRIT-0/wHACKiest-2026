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
//   [data-panel]         a black panel that opens out from a narrow rounded card as it arrives
// Nothing is hidden before this runs, and none of it runs with reduced motion.
const SHAPES = "path, line, polyline, polygon, circle, ellipse, rect";

export default function ScrollMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-words]").forEach((el) => {
        gsap.from(el.querySelectorAll(".word-inner"), {
          yPercent: 110,
          rotate: 4,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((el) => {
        gsap.from(el.children, {
          y: 48,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none reverse" },
        });
      });

      gsap.utils.toArray<SVGElement>("[data-draw]").forEach((el) => {
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
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = Number(el.dataset.parallax) || 0.15;
        gsap.fromTo(
          el,
          { y: () => -speed * window.innerHeight * 0.5 },
          { y: () => speed * window.innerHeight * 0.5, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true } },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-era-year]").forEach((el) => {
        const dir = el.dataset.eraYear === "left" ? -1 : 1;
        gsap.fromTo(
          el,
          { xPercent: -12 * dir },
          { xPercent: 12 * dir, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });

      // clip-path rather than scale, so layout (and everything measured from it) never moves
      gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0px 9% 0px 9% round 72px)" },
          {
            // matches .dark-panel's resting shape in globals.css
            clipPath: () => (window.innerWidth < 640 ? "inset(0px 8px 0px 8px round 22px)" : "inset(0px 16px 0px 16px round 32px)"),
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "top 25%", scrub: true, invalidateOnRefresh: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-era-rule]").forEach((el) => {
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 90%", end: "top 45%", scrub: true } });
      });
    });
  });

  return null;
}
