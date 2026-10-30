"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

let activeScroller: Lenis | null = null;

/** Buttons and wheel scrolling share the same native document scroll position. */
export function scrollToPosition(top: number, reducedMotion = false) {
  if (activeScroller && !reducedMotion)
    activeScroller.scrollTo(top, { lerp: 0.12 });
  else window.scrollTo({ top, behavior: reducedMotion ? "instant" : "smooth" });
}

export default function SmoothScrolling() {
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const root = document.documentElement;
    if (reduced) {
      root.dataset.scrollMode = "native";
      return () => {
        delete root.dataset.scrollMode;
      };
    }
    const scroller = new Lenis({
      autoRaf: true,
      lerp: 0.12,
      smoothWheel: true,
      syncTouch: false,
      anchors: { offset: -112 },
      stopInertiaOnNavigate: true,
      prevent: (node) =>
        node.hasAttribute("data-native-scroll") &&
        node.scrollHeight > node.clientHeight + 1,
    });
    activeScroller = scroller;
    root.dataset.scrollMode = "smooth";
    return () => {
      scroller.destroy();
      if (activeScroller === scroller) activeScroller = null;
      delete root.dataset.scrollMode;
    };
  }, [reduced]);
  return null;
}
