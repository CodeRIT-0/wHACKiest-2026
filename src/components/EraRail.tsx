"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ERAS } from "@/lib/eras";
import { subscribePosition } from "@/lib/journey";

const LAST = ERAS.length - 1;

// "Computing eras" rail on the right edge: a dot rides down the line as you scroll, and the ticks
// double as jump links to each era. The dot moves straight in the DOM; only the active tick
// re-renders, when the era changes.
export default function EraRail() {
  const pathname = usePathname();
  const dotRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (pathname !== "/") return;
    return subscribePosition((pos) => {
      const p = Math.min(LAST, Math.max(0, pos));
      const pct = `${(p / LAST) * 100}%`;
      if (dotRef.current) dotRef.current.style.top = pct;
      if (fillRef.current) fillRef.current.style.height = pct;
      setActive(Math.round(p));
    });
  }, [pathname]);

  if (pathname !== "/") return null;

  return (
    <aside aria-label="Computing eras" className="pointer-events-none fixed right-1.5 top-1/2 z-40 flex h-[62vh] -translate-y-1/2 flex-col items-center gap-4 text-ink xl:right-6">
      <p className="hidden rotate-180 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/60 [writing-mode:vertical-rl] xl:block">
        Computing eras
      </p>

      <div className="relative w-px flex-1 bg-ink/20">
        <div ref={fillRef} className="absolute inset-x-0 top-0 bg-accent" />

        {ERAS.map((e, i) => (
          <a
            key={e.id}
            href={`#${e.id}`}
            aria-label={`${e.year}: ${e.tagline}`}
            aria-current={i === active ? "step" : undefined}
            className="pointer-events-auto group absolute left-1/2 hidden h-4 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center xl:grid"
            style={{ top: `${(i / LAST) * 100}%` }}
          >
            <span className={`h-px w-2 transition-[width,background-color] group-hover:w-3.5 ${i <= active ? "bg-accent" : "bg-ink/45"}`} />
          </a>
        ))}

        <div ref={dotRef} className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <span className="block h-1.5 w-1.5 rounded-full bg-accent ring-4 ring-accent/20 xl:h-3 xl:w-3" />
        </div>
      </div>
    </aside>
  );
}
