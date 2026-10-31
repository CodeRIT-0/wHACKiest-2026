"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";

// The Google Maps embed pulls in ~600 KB of Google's scripts. loading="lazy" isn't enough: before
// the page hydrates it is much shorter (nothing is pinned yet), so the browser judges the map
// "near" and fetches it alongside the hero. This mounts the iframe only once it is within about a
// screen and a half of view.
export default function LazyMap(props: ComponentProps<"iframe">) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShow(true);
        observer.disconnect();
      },
      { rootMargin: "150% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="absolute inset-0">{show && <iframe {...props} />}</div>;
}
