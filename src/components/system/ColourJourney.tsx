"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ERAS, PALETTE_KEYS, type Palette } from "@/lib/eras";
import { clamp01, mixHex, publishPosition, smoothstep } from "@/lib/journey";

gsap.registerPlugin(ScrollTrigger);

// Blends the page's paper/ink/line colours between era stops as you scroll, by writing CSS
// variables on <html>. Every colour on the page reads those variables, so the whole site shifts
// together: warm cream (past) -> cool blue-tinted cream (present) -> deep navy (future).
// With reduced motion it jumps between stops instead of blending. It only ever sets the page's
// variables: a section's own colours come from .theme-dark, which this must never override.

// what each variable was last set to: a variable on <html> is inherited by every element, so even
// re-setting it to the same value can send the browser restyling the whole page, on every scroll
// frame. Only real changes are written (with today's single palette, that's never after the first)
const written = new Map<string, string>();

function apply(target: HTMLElement, a: Palette, b: Palette, t: number) {
  const eased = smoothstep(0, 1, t);
  // crossing between light and dark paper, the text flips over a short stretch in the middle
  // instead of fading through grey
  const ink = a.dark === b.dark ? eased : smoothstep(0.42, 0.58, t);
  for (const key of PALETTE_KEYS) {
    const k = key === "fg" || key === "muted" ? ink : eased;
    const value = mixHex(a[key], b[key], k);
    if (written.get(key) === value) continue;
    written.set(key, value);
    target.style.setProperty(`--${key}`, value);
  }
}

export default function ColourJourney() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (pathname !== "/") {
      for (const key of PALETTE_KEYS) root.style.removeProperty(`--${key}`);
      written.clear();
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = ERAS.map((e) => document.getElementById(e.id));
    let stops: number[] = [];

    const measure = () => {
      const vh = window.innerHeight;
      let last = 0;
      stops = ERAS.map((e, i) => {
        const el = sections[i];
        if (!el) return last;
        const r = el.getBoundingClientRect();
        const y = r.top + window.scrollY + (e.at ?? 0.3) * r.height - vh / 2;
        last = Math.max(last, y);
        return last;
      });
    };

    const update = () => {
      const y = window.scrollY;
      let i = 0;
      while (i < stops.length - 2 && y >= stops[i + 1]) i++;
      const t = clamp01((y - stops[i]) / Math.max(1, stops[i + 1] - stops[i]));
      if (reduce) {
        // nearest stop, no blending
        const n = t >= 0.5 ? i + 1 : i;
        apply(root, ERAS[n].palette, ERAS[n].palette, 0);
        publishPosition(n);
        return;
      }
      apply(root, ERAS[i].palette, ERAS[i + 1].palette, t);
      publishPosition(i + t);
    };

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: update,
      onRefresh: () => {
        measure();
        update();
      },
    });
    measure();
    update();

    return () => trigger.kill();
  }, [pathname]);

  return null;
}
