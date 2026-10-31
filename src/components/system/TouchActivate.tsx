"use client";

import { useEffect } from "react";

// Phones have no hover, so hover effects never play there. On touch-only devices this marks
// whichever [data-touch] element sits in the middle band of the screen with `data-active`, and
// components pair each `group-hover/x:` style with a `group-data-[active]/x:` one, so the same
// effect plays as the element scrolls under your thumb. Nothing happens on devices with a mouse.
// Elements added later (a track switch re-renders its cards) are picked up as they appear.
export default function TouchActivate() {
  useEffect(() => {
    if (!window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.toggleAttribute("data-active", e.isIntersecting);
      },
      // a band through the middle 30% of the screen
      { rootMargin: "-35% 0px -35% 0px" },
    );
    const seen = new WeakSet<Element>();
    const scan = (root: ParentNode) => {
      root.querySelectorAll("[data-touch]").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };
    scan(document);

    const mo = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => n instanceof Element && (n.matches("[data-touch]") ? scan(n.parentElement ?? n) : scan(n)));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
