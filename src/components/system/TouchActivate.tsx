"use client";

import { useEffect } from "react";

// Phones have no hover, so hover effects never play there. On touch devices this marks
// [data-touch] elements with `data-active`, and components pair each `group-hover/x:` style with a
// `group-data-[active]/x:` one, so the same effect plays without a mouse:
//   - scroll: whatever sits in the middle band of the screen is active
//   - tap: tapping an element makes it active straight away (and keeps it so until you scroll on)
// It follows the device as it changes, so switching Chrome DevTools into device mode (or rotating a
// tablet with a keyboard attached) works without a reload. Elements added later are picked up too.
const TOUCH = "(hover: none), (pointer: coarse)";

export default function TouchActivate() {
  useEffect(() => {
    const mq = window.matchMedia(TOUCH);
    let stop: (() => void) | null = null;

    const start = () => {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) e.target.toggleAttribute("data-active", e.isIntersecting);
        },
        // a band through the middle 40% of the screen
        { rootMargin: "-30% 0px -30% 0px" },
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
        for (const r of records)
          r.addedNodes.forEach((n) => {
            if (!(n instanceof Element)) return;
            if (n.matches("[data-touch]")) scan(n.parentElement ?? document);
            else scan(n);
          });
      });
      mo.observe(document.body, { childList: true, subtree: true });

      const tap = (e: PointerEvent) => {
        const el = (e.target as Element | null)?.closest("[data-touch]");
        if (el) el.setAttribute("data-active", "");
      };
      document.addEventListener("pointerdown", tap, { passive: true });

      return () => {
        io.disconnect();
        mo.disconnect();
        document.removeEventListener("pointerdown", tap);
        document.querySelectorAll("[data-touch][data-active]").forEach((el) => el.removeAttribute("data-active"));
      };
    };

    const sync = () => {
      if (mq.matches && !stop) stop = start();
      else if (!mq.matches && stop) {
        stop();
        stop = null;
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      stop?.();
    };
  }, []);

  return null;
}
