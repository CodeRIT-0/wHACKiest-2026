"use client";

import { useEffect } from "react";

// Pauses the looping CSS animations (pulsing dots, pings, the marquee, glows) of every section
// that is well off screen, and plays them again as it comes back (with half a screen of margin,
// so they're already moving by the time they appear). A running animation costs a style update on
// every frame wherever it is on the page, and the page has a couple of dozen of them: while
// scrolling on a phone, that was most of the style work done.
//
// It works through the Web Animations API rather than an attribute and a CSS rule, so nothing in
// React's markup changes. That lets it start straight away, without waiting for every section to
// hydrate (changing a section's server HTML before React takes it over is a hydration mismatch).
// Only CSS animations are touched: motion's own animations are left to motion.
//
// Asking for animations makes the browser bring styles up to date first, so it's only ever asked
// of the sections that just changed, and at an idle moment (asking the whole document while the
// page loaded was a long, blocking style pass).
const SCOPES = "main section, [data-pause-offscreen]";

export default function OffscreenPause() {
  useEffect(() => {
    if (typeof Element.prototype.getAnimations !== "function" || typeof CSSAnimation === "undefined") return;
    // only what this paused gets played again (the FAQ section pauses its own, for instance)
    const mine = new WeakSet<Animation>();
    const pending = new Map<Element, boolean>(); // section -> off screen?
    let idle = 0;
    const flush = () => {
      idle = 0;
      for (const [scope, off] of pending) {
        for (const a of scope.getAnimations({ subtree: true })) {
          // CSS loops only; scroll-driven ones (the hero clock's drift) follow the scroll anyway
          if (!(a instanceof CSSAnimation) || a.timeline !== document.timeline) continue;
          if (off && a.playState === "running") {
            a.pause();
            mine.add(a);
          } else if (!off && mine.has(a)) {
            a.play();
            mine.delete(a);
          }
        }
      }
      pending.clear();
    };
    const queue = () => {
      if (idle) return;
      idle = typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(flush, { timeout: 600 }) : window.setTimeout(flush, 200);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) pending.set(e.target, !e.isIntersecting);
        queue();
      },
      { rootMargin: "50% 0px" },
    );
    const scopes = document.querySelectorAll(SCOPES);
    scopes.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
      pending.clear();
      scopes.forEach((el) => pending.set(el, false));
      flush();
    };
  }, []);
  return null;
}
