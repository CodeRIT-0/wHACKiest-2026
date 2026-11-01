"use client";

import { useEffect, useRef } from "react";

// Sits inside each lazily hydrated Suspense boundary on the home page (see Lazy in app/page.tsx).
// Its hidden span carries data-hydration-pending in the server HTML; once this boundary hydrates,
// the effect drops the attribute and fires "lazyhydrated". ScrollMotion waits for every mark to
// clear before it writes inline styles, since styling a boundary's server HTML before React
// hydrates it causes a hydration mismatch.
export const HYDRATED_EVENT = "lazyhydrated";
export const PENDING_SELECTOR = "[data-hydration-pending]";

export default function HydrationMark() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    ref.current?.removeAttribute("data-hydration-pending");
    window.dispatchEvent(new Event(HYDRATED_EVENT));
  }, []);
  return <span ref={ref} hidden data-hydration-pending="" />;
}
