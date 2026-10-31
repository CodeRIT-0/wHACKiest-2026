"use client";

import { useEffect, useState, type RefObject } from "react";

// True once the element has come within `margin` of the viewport (and stays true). For media that
// shouldn't load with the first screen: before the page hydrates it is much shorter than it ends
// up (nothing is pinned yet), so the browser's own lazy loading judges far-off images "near"
export function useNear(ref: RefObject<Element | null>, margin = "150% 0px") {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: margin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, margin, near]);
  return near;
}
