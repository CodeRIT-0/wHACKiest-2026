"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Puts the visitor where they meant to be when the home page opens part way down. The browser jumps
// to a shared link's #section (or a reload's old position) as soon as the HTML arrives, but the page
// then changes height: the hero's pin adds its scroll room and the timelines settle. So a shared
// link on a desktop landed thousands of pixels off, and Safari lost its place on reload. This waits
// out those changes and corrects the position, and stops the moment the visitor scrolls themselves.
const KEY = "home-scroll-y";
const OFFSET = 90; // just below the floating nav, like the page's in-page links
let firstMount = true;

const read = () => {
  try {
    return Number(sessionStorage.getItem(KEY)) || 0;
  } catch {
    return 0;
  }
};

export default function ScrollLanding() {
  useEffect(() => {
    const first = firstMount;
    firstMount = false;
    const save = () => {
      try {
        sessionStorage.setItem(KEY, String(Math.round(window.scrollY)));
      } catch {}
    };
    window.addEventListener("pagehide", save);

    const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const reopened = first && (entry?.type === "reload" || entry?.type === "back_forward") && new URL(entry.name).pathname === "/";
    const saved = reopened ? read() : 0;
    const hash = decodeURIComponent(window.location.hash.slice(1));
    // #story has its own handling: it points into the pinned hero, not at a section's top
    const el = hash && hash !== "story" ? document.getElementById(hash) : null;
    const target = saved > 0 ? () => saved : el ? () => (document.getElementById(hash) ?? el).getBoundingClientRect().top + window.scrollY - OFFSET : null;
    if (!target) return () => window.removeEventListener("pagehide", save);

    const timers: number[] = [];
    const place = () => {
      const y = target();
      if (Math.abs(window.scrollY - y) > 40) window.scrollTo({ top: y, behavior: "instant" });
    };
    const stop = () => {
      timers.forEach(clearTimeout);
      ScrollTrigger.removeEventListener("refresh", place);
      for (const type of INPUT) window.removeEventListener(type, stop);
    };
    for (const type of INPUT) window.addEventListener(type, stop, { passive: true });
    ScrollTrigger.addEventListener("refresh", place);
    for (const ms of [200, 800, 1800, 3200]) timers.push(window.setTimeout(place, ms));
    timers.push(window.setTimeout(stop, 4000));
    return () => {
      stop();
      window.removeEventListener("pagehide", save);
    };
  }, []);
  return null;
}

const INPUT = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
