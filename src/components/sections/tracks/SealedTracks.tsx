"use client";

import { useEffect, useRef } from "react";
import { LockSimple } from "@phosphor-icons/react";

// The tracks before they're announced: four sealed cards. Each name keeps trying to decode, gets
// to CLASSIFIED and starts over; hover or tap and a card lifts and glows, but stays shut. The real
// names (tracks/track-data) are deliberately not imported here: whatever this imports ships in the
// page's code, where anyone could read it. To reveal them, TrackLab goes back to TrackGallery.

const WORD = "CLASSIFIED";
const GLYPHS = "ABCDEFGHKLMNPRSTUVXYZ0123456789#%&?/";
// the site's palette, not one colour per real track: the colours give nothing away
const CARDS = ["#7aa7ff", "#fd9c36", "#5df2a8", "#ffb35c"];
const TICK = 90;

function Word({ delay }: { delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  // written straight to the DOM (no re-render per glyph), and only while on screen
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    let step = -delay;
    const tick = () => {
      step++;
      if (step > 0) {
        // settles left to right, holds, then scrambles again
        const settled = Math.min(WORD.length, Math.floor(step / 2));
        if (step > WORD.length * 2 + 28) step = 0;
        el.textContent = WORD.split("")
          .map((c, i) => (i < settled ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join("");
      }
    };
    const io = new IntersectionObserver(([e]) => {
      window.clearInterval(timer);
      if (e.isIntersecting) timer = window.setInterval(tick, TICK);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
      el.textContent = WORD;
    };
  }, [delay]);

  return (
    <span ref={ref} aria-hidden className="block overflow-hidden whitespace-nowrap font-mono text-[15px] font-bold tracking-[0.1em] text-[#fff9ec] sm:text-lg lg:text-[19px]">
      {WORD}
    </span>
  );
}

export default function SealedTracks() {
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {CARDS.map((hue, i) => (
        <li
          key={hue}
          data-touch
          className="group/seal relative isolate flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[18px] border border-[#050505] bg-[#0c0b0a] p-4 transition-[translate,box-shadow] duration-300 ease-out [contain:layout_paint] hover:-translate-y-1.5 hover:shadow-[0_24px_44px_-20px_var(--hue)] data-[active]:-translate-y-1.5 data-[active]:shadow-[0_24px_44px_-20px_var(--hue)] lg:aspect-[3/4] lg:rounded-[22px] lg:p-5"
          style={{ "--hue": hue } as React.CSSProperties}
        >
          {/* a colour wash under a print screen, like the photos these cards will carry */}
          <span aria-hidden className="absolute inset-0 -z-10 opacity-40 transition-opacity duration-500 group-hover/seal:opacity-70 group-data-[active]/seal:opacity-70" style={{ background: `radial-gradient(120% 80% at 50% 0%, ${hue}, transparent 70%)` }} />
          <span aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(5,5,5,0.7)_0.9px,transparent_1.3px)] bg-[length:5px_5px] opacity-50" />
          {/* a scan line that keeps sweeping the card, looking for a way in */}
          <span aria-hidden className="absolute inset-x-0 top-0 -z-10 h-1/3 bg-[linear-gradient(to_bottom,transparent,rgba(255,249,236,0.12),transparent)] motion-safe:animate-[seal-scan_3.6s_linear_infinite]" style={{ animationDelay: `${i * -0.9}s` }} />

          <span className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#fff9ec]/70">Track {String(i + 1).padStart(2, "0")}</span>
            <span aria-hidden className="grid h-9 w-9 place-items-center rounded-full border bg-[#050505]/50" style={{ borderColor: hue, color: hue }}>
              <LockSimple size={17} weight="duotone" />
            </span>
          </span>

          <span aria-hidden className="display-wide select-none self-center text-[clamp(64px,9vw,120px)] leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(255,249,236,0.3)]">
            ?
          </span>

          <span className="block min-w-0">
            <Word delay={i * 7} />
            <span className="sr-only">Track {i + 1}: to be announced.</span>
            <span aria-hidden className="mt-2 block font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: hue }}>
              To be announced
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
