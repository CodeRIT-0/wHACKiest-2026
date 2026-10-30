import type { CSSProperties } from "react";

/** Small engraved motifs stay vector sharp alongside the photographic hardware. */
export function Gear({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="8">
        {Array.from({ length: 16 }, (_, i) => (
          <path
            key={i}
            d="M100 14V32"
            transform={`rotate(${i * 22.5} 100 100)`}
          />
        ))}
        <circle cx="100" cy="100" r="66" />
        <circle cx="100" cy="100" r="20" />
        {[0, 60, 120, 180, 240, 300].map((n) => (
          <path key={n} d="M100 42V74" transform={`rotate(${n} 100 100)`} />
        ))}
      </g>
    </svg>
  );
}

export function TrackIcon({ index }: { index: number }) {
  const paths = [
    "M20 12h24v24H20zM26 18h12v12H26zM14 16h6m-6 8h6m-6 8h6m24-16h6m-6 8h6m-6 8h6M24 6v6m8-6v6m8-6v6M24 36v6m8-6v6m8-6v6",
    "M10 10h44v30H10zM10 18h44M16 14h1m4 0h1m4 0h1M25 24l-5 5 5 5m14-10 5 5-5 5M30 36l4-14",
    "M32 8c-5 7-18 11-18 11v12c0 10 18 17 18 17s18-7 18-17V19S37 15 32 8zM24 28l6 6 11-12",
    "M23 35c-7-3-10-8-10-14a19 19 0 0138 0c0 7-4 11-10 14v7H23zM25 47h14M32 12v12m-10-7 6 7m14-7-6 7",
  ];
  return (
    <svg
      viewBox="0 0 64 56"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[index % paths.length]} />
    </svg>
  );
}

export function NixieDisplay() {
  return (
    <div className="nixie-display" aria-label="2026">
      <div className="nixie-wires" aria-hidden="true" />
      {"2026".split("").map((digit, i) => (
        <div
          className="nixie-tube"
          key={i}
          style={{ "--tube-delay": `${i * 0.14}s` } as CSSProperties}
        >
          <span className="nixie-ghost" aria-hidden="true">
            8
          </span>
          <span>{digit}</span>
          <i />
        </div>
      ))}
      <span className="nixie-plate">WHACKIEST / MODEL 2026</span>
    </div>
  );
}
