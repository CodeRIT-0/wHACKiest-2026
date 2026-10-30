"use client";

import { useEffect, useRef } from "react";
import "./ComputingBackdrop.css";

type ComputingBackdropProps = { variant: "procedure" | "faq"; choreographed?: boolean };

export default function ComputingBackdrop({ variant, choreographed = false }: ComputingBackdropProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const procedure = variant === "procedure";

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || choreographed) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        layer.dataset.entered = "true";
        observer.disconnect();
      }
    });
    observer.observe(layer.closest("section") ?? layer);
    return () => observer.disconnect();
  }, [choreographed]);

  return (
    <div ref={layerRef} className={`computing-backdrop computing-backdrop--${variant}${choreographed ? " computing-backdrop--choreographed" : ""}`} aria-hidden="true">
      <div className="computing-backdrop-grid" />
      <svg className="computing-backdrop-schematic" viewBox="0 0 660 660" fill="none" focusable="false">
        {procedure ? (
          <>
            <g className="computing-backdrop-outline">
              <path d="M142 348C46 348 35 216 132 207C138 103 281 82 322 163C398 105 502 167 483 250C588 242 592 366 487 366H142Z" />
              <path d="M198 366V451H129V555M385 366V510H480M297 130V80H406" />
              <circle cx="129" cy="555" r="18" /><rect x="453" y="486" width="53" height="46" rx="3" />
            </g>
            <g className="computing-backdrop-traces">
              <path className="computing-backdrop-draw" pathLength="1" d="M656 94H607V201L548 260V403H628V522H656" />
              <path className="computing-backdrop-draw" pathLength="1" d="M656 151H633V233L577 289V361H656" />
              <path className="computing-backdrop-detail" d="M574 571H626V609H655M596 70h20m-10-10v20" />
            </g>
            <g className="computing-backdrop-nodes">
              <circle cx="607" cy="94" r="3" /><circle cx="548" cy="403" r="3" /><circle cx="628" cy="522" r="3" />
            </g>
            <g className="computing-backdrop-annotations">
              <text x="525" y="133">UPLOAD</text><text x="545" y="340">CONNECT</text><text x="498" y="581">CONFIRM</text>
            </g>
          </>
        ) : (
          <>
            <g className="computing-backdrop-documents computing-backdrop-outline">
              <path d="M123 126h92l28 28v111H123Z M215 126v28h28M143 180h76M143 198h61M143 217h69" transform="rotate(-12 183 195)" />
              <path d="M346 88h84l28 28v117H346Z M430 88v28h28M367 143h65M367 164h54M367 185h63" transform="rotate(12 402 160)" />
            </g>
            <g className="computing-backdrop-traces">
              <path className="computing-backdrop-draw" pathLength="1" d="M84 283H158L241 365H316" />
              <path className="computing-backdrop-draw" pathLength="1" d="M506 141V263L405 365H316" />
              <path className="computing-backdrop-draw" pathLength="1" d="M566 433H456L388 365H316" />
              <path className="computing-backdrop-draw" pathLength="1" d="M143 559V471L249 365H316" />
            </g>
            <g className="computing-backdrop-knowledge-nodes">
              <g data-source="registration"><circle cx="84" cy="283" r="7" /><circle cx="84" cy="283" r="2" /></g>
              <g data-source="submission"><circle cx="506" cy="141" r="7" /><circle cx="506" cy="141" r="2" /></g>
              <g data-source="selection"><circle cx="566" cy="433" r="7" /><circle cx="566" cy="433" r="2" /></g>
              <g data-source="payment"><circle cx="143" cy="559" r="7" /><circle cx="143" cy="559" r="2" /></g>
            </g>
          </>
        )}
      </svg>
      <svg className="computing-backdrop-clock" viewBox="0 0 240 240" fill="none" focusable="false">
        <circle cx="120" cy="120" r="110" /><circle className="computing-backdrop-clock-inner" cx="120" cy="120" r="102" />
        <g className="computing-backdrop-clock-ticks">
          {Array.from({ length: 12 }, (_, index) => <path key={index} d="M120 20v10" transform={`rotate(${index * 30} 120 120)`} />)}
        </g>
        <path d="M120 48v72l43 27" /><circle cx="120" cy="120" r="4" />
      </svg>
      <svg className="computing-backdrop-handoff" viewBox="0 0 560 140" preserveAspectRatio="none" fill="none" focusable="false">
        <path className="computing-backdrop-draw" pathLength="1" d={procedure ? "M520 0H160L0 100V140" : "M560 0V28H500V110H220V140H0"} />
      </svg>
    </div>
  );
}
