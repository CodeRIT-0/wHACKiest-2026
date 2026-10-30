"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import TypeLine from "../../retro/TypeLine";
import type { ArtKind } from "./TrackArt";
import { useTrack } from "./TrackContext";

export type Track = { title: string; dir: string; blurb: string; art: ArtKind };

// Tracks as a terminal (always a dark screen, so its text is fixed ivory, not the page colour):
// `ls` types out and the rows appear. Picking one (hover, click or arrow keys) selects that track
// for the problem statement cards below, which carry the details.
export default function TrackTerminal({ tracks }: { tracks: Track[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();
  const [listed, setListed] = useState(false);
  // shared with the problem statement board below
  const { track: active, setTrack: setActive } = useTrack();
  const showRows = listed || !!reduce;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a + (e.key === "ArrowDown" ? 1 : tracks.length - 1)) % tracks.length);
    }
  };

  return (
    <div ref={ref} data-trace className="mt-10 overflow-hidden rounded-lg border border-[#fff9ec]/15 bg-[#070b13] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9),0_0_0_1px_rgba(111,155,255,0.08)]">
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-[#fff9ec]/10 bg-[#111a2a] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b5f]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd4a]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#3ccf6e]/80" />
        <span className="mx-auto font-mono text-[11px] text-[#fff9ec]/45">tracks.sh / zsh</span>
        <span className="w-10" />
      </div>

      <div className="relative p-4 font-mono text-[12px] leading-relaxed text-[#fff9ec]/80 sm:p-5 sm:text-[13px]">
        <p>
          <span className="text-[#3ccf6e]">hacker@whackiest</span>
          <span className="text-[#fff9ec]/40">:</span>
          <span className="text-[#7aa7ff]">~</span>
          <span className="text-[#fff9ec]/40">$ </span>
          <TypeLine text="ls ./tracks" start={inView} speed={70} delay={300} onDone={() => setListed(true)} />
        </p>

        {/* track list: a listbox you can drive with the arrow keys */}
        <ul role="listbox" aria-label="Tracks" tabIndex={0} onKeyDown={onKey} className="mt-2 outline-none focus-visible:ring-1 focus-visible:ring-accent/60">
          {tracks.map((t, i) => {
            const on = active === i;
            return (
              <motion.li
                key={t.dir}
                role="option"
                aria-selected={on}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                initial={reduce ? false : { opacity: 0, x: -8 }}
                animate={showRows ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                transition={{ duration: 0.25, delay: showRows && !reduce ? i * 0.12 : 0 }}
                className={`flex cursor-pointer items-center gap-3 rounded-sm px-2 py-1.5 transition-colors ${
                  on ? "bg-accent/15 text-[#fff9ec]" : "text-[#fff9ec]/55 hover:text-[#fff9ec]/80"
                }`}
              >
                <span className={`w-3 ${on ? "text-accent" : "text-transparent"}`}>{">"}</span>
                <span className="hidden text-[#fff9ec]/30 sm:inline">drwxr-x</span>
                <span className="text-accent/80">{String(i + 1).padStart(2, "0")}</span>
                <span className={on ? "font-bold text-[#7aa7ff]" : ""}>{t.dir}/</span>
              </motion.li>
            );
          })}
        </ul>

        <div className="scanlines pointer-events-none absolute inset-0 opacity-40" />
      </div>
    </div>
  );
}
