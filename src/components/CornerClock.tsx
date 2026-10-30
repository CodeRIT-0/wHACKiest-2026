"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const r2 = (n: number) => Math.round(n * 100) / 100;

// A small clock pinned to the bottom-left corner for the whole page. Its hands are the scroll
// position: the hour hand goes once round from top to bottom of the page, the minute hand twelve
// times, so scrolling back up winds it back.
export default function CornerClock() {
  const pathname = usePathname();
  const hourRef = useRef<SVGGElement>(null);
  const minuteRef = useRef<SVGGElement>(null);
  const secondRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    const set = (p: number) => {
      hourRef.current?.setAttribute("transform", `rotate(${r2(p * 360)} 50 50)`);
      minuteRef.current?.setAttribute("transform", `rotate(${r2(p * 360 * 12)} 50 50)`);
      secondRef.current?.setAttribute("transform", `rotate(${r2(p * 360 * 60)} 50 50)`);
    };
    const trigger = ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => set(self.progress), onRefresh: (self) => set(self.progress) });
    set(trigger.progress);
    return () => trigger.kill();
  }, [pathname]);

  if (pathname !== "/") return null;

  return (
    <div aria-hidden className="pointer-events-none fixed bottom-3 left-3 z-40 h-11 w-11 rounded-full bg-panel/90 shadow-[0_6px_18px_-8px_color-mix(in_srgb,var(--fg)_35%,transparent)] backdrop-blur sm:bottom-6 sm:left-6 sm:h-[84px] sm:w-[84px]">
      <svg viewBox="0 0 100 100" className="line-art h-full w-full" fill="none" strokeLinecap="round">
        <circle cx={50} cy={50} r={47} className="stroke-ink" strokeWidth={1.5} />
        <circle cx={50} cy={50} r={41} className="stroke-ink/30" />
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i * Math.PI) / 30;
          const long = i % 5 === 0;
          const r1 = long ? 33 : 37;
          return (
            <line
              key={i}
              x1={r2(50 + r1 * Math.sin(a))}
              y1={r2(50 - r1 * Math.cos(a))}
              x2={r2(50 + 40 * Math.sin(a))}
              y2={r2(50 - 40 * Math.cos(a))}
              className={long ? "stroke-ink" : "stroke-ink/40"}
              strokeWidth={long ? 1.5 : 0.75}
            />
          );
        })}
        <g ref={hourRef}>
          <line x1={50} y1={54} x2={50} y2={28} className="stroke-ink" strokeWidth={3} />
        </g>
        <g ref={minuteRef}>
          <line x1={50} y1={56} x2={50} y2={16} className="stroke-ink" strokeWidth={2} />
        </g>
        <g ref={secondRef}>
          <line x1={50} y1={60} x2={50} y2={14} className="stroke-accent" strokeWidth={1.25} />
        </g>
        <circle cx={50} cy={50} r={3.5} className="fill-accent stroke-accent" />
      </svg>
    </div>
  );
}
