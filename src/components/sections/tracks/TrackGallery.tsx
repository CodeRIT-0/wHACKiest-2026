"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { AppWindow, Brain, Cpu, GlobeHemisphereEast } from "@phosphor-icons/react";
import { useTrack } from "./TrackContext";
import { useNear } from "@/hooks/useNear";
import type { Track } from "./track-data";

const ICONS = { brain: Brain, window: AppWindow, globe: GlobeHemisphereEast, cpu: Cpu };
const EASE = "cubic-bezier(0.16,1,0.3,1)";
const pad = (n: number) => String(n).padStart(2, "0");

// The four tracks as an expanding gallery: the selected panel opens wide to show its photo,
// blurb and tags, the others fold down to a slim spine with a vertical title (rows on phones).
// Photos are printed in each track's colour: grayscale, multiplied by the hue, under a halftone
// screen and a scrim, so four very different shots read as one set on the black panel.
// Pick with a hover (fine pointers), a click or tap, or the arrow keys.
export default function TrackGallery({ tracks }: { tracks: Track[] }) {
  const { track: active, setTrack: setActive } = useTrack();
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const tabs = useRef<(HTMLDivElement | null)[]>([]);
  // the photos load as the gallery approaches, not with the first screen
  const rootRef = useRef<HTMLDivElement>(null);
  const near = useNear(rootRef);

  // a short delay, so sweeping the pointer across the row doesn't flick through every panel
  const hoverTo = (i: number) => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setActive(i), 110);
  };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (step) {
      e.preventDefault();
      const next = (i + step + tracks.length) % tracks.length;
      setActive(next);
      tabs.current[next]?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActive(i);
    }
  };

  // the cursor carries a soft light across the open panel
  const glow = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--px", `${Math.round(e.clientX - r.left)}px`);
    e.currentTarget.style.setProperty("--py", `${Math.round(e.clientY - r.top)}px`);
  };

  return (
    <div
      ref={rootRef}
      role="tablist"
      aria-label="Tracks"
      onPointerLeave={() => clearTimeout(hoverTimer.current)}
      className="flex h-[min(620px,calc(100svh-120px))] flex-col gap-2.5 lg:h-[min(540px,calc(100vh-200px))] lg:flex-row lg:gap-3"
    >
      {tracks.map((t, i) => {
        const on = i === active;
        const Icon = ICONS[t.icon];
        return (
          <motion.div
            key={t.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            id={`track-tab-${t.id}`}
            aria-selected={on}
            tabIndex={on ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            onPointerEnter={(e) => e.pointerType === "mouse" && hoverTo(i)}
            onPointerMove={glow}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            className="group/panel relative min-h-[60px] min-w-0 cursor-pointer overflow-hidden rounded-[18px] border outline-none transition-[flex-grow,border-color,box-shadow] duration-[800ms] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg motion-reduce:transition-none lg:min-w-[76px] lg:rounded-[22px]"
            style={{
              flexGrow: on ? 5.2 : 1,
              flexBasis: 0,
              transitionTimingFunction: EASE,
              borderColor: on ? t.hue : "rgba(255,249,236,0.12)",
              boxShadow: on ? `0 0 0 1px ${t.hue}55, 0 40px 80px -40px ${t.hue}88` : "none",
            }}
          >
            {/* ---- the photo, printed in the track's colour ---- */}
            {near && <Image
              src={t.image.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 680px, calc(100vw - 48px)"
              quality={60}
              className={`object-cover transition-transform duration-[1400ms] motion-reduce:transition-none ${on ? "scale-100" : "scale-[1.18]"}`}
              style={{
                objectPosition: t.image.position,
                transitionTimingFunction: EASE,
                filter: `grayscale(1) contrast(1.15) brightness(${t.image.lift ?? 1})`,
              }}
            />}
            <span aria-hidden className="absolute inset-0 mix-blend-multiply" style={{ backgroundColor: t.hue }} />
            {/* halftone screen, like a print */}
            <span aria-hidden className="absolute inset-0 bg-[radial-gradient(rgba(5,5,5,0.7)_0.9px,transparent_1.3px)] bg-[length:5px_5px] opacity-40" />
            {/* scrim: heavy at the bottom for the copy, and closed right down while folded */}
            <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,#050505_8%,rgba(5,5,5,0.72)_42%,rgba(5,5,5,0.18)_78%,rgba(5,5,5,0.35))]" />
            <span
              aria-hidden
              className={`absolute inset-0 bg-[#050505] transition-opacity duration-700 ${on ? "opacity-0" : "opacity-60 group-hover/panel:opacity-45"}`}
            />
            {/* the light that follows the cursor */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/panel:opacity-100"
              style={{ background: `radial-gradient(420px circle at var(--px, 50%) var(--py, 50%), ${t.hue}30, transparent 60%)` }}
            />

            {/* ---- always: number and icon ---- */}
            <div className="absolute left-4 top-4 flex items-center gap-2.5 lg:left-5 lg:top-5">
              <span
                className="grid h-9 w-9 place-items-center rounded-full border backdrop-blur-sm max-lg:backdrop-blur-none transition-colors duration-500"
                style={{ borderColor: on ? t.hue : "rgba(255,249,236,0.25)", color: on ? t.hue : "#fff9ec", backgroundColor: "rgba(5,5,5,0.45)" }}
              >
                <Icon size={17} weight="duotone" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#fff9ec]/70">{pad(i + 1)}</span>
            </div>

            {/* ---- folded: the title runs up the spine (across, on phones) ---- */}
            <div
              aria-hidden={on}
              className={`absolute inset-y-0 right-4 flex items-center transition-opacity duration-300 lg:inset-x-0 lg:bottom-6 lg:right-auto lg:top-auto lg:justify-center ${
                on ? "pointer-events-none opacity-0" : "opacity-100 delay-200"
              }`}
            >
              <span className="display-wide whitespace-nowrap text-lg text-[#fff9ec] lg:rotate-180 lg:text-2xl lg:[writing-mode:vertical-rl]">{t.title}</span>
            </div>

            {/* ---- open: the full card ---- */}
            <div
              className={`absolute inset-x-0 bottom-0 p-5 transition-[opacity,translate] duration-500 sm:p-6 lg:p-8 ${
                on ? "translate-y-0 opacity-100 delay-300" : "pointer-events-none translate-y-6 opacity-0"
              }`}
              style={{ transitionTimingFunction: EASE }}
            >
              <ul className="flex flex-wrap gap-1.5">
                {t.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#fff9ec]/85 backdrop-blur-sm max-lg:backdrop-blur-none"
                    style={{ borderColor: `${t.hue}66`, backgroundColor: "rgba(5,5,5,0.4)" }}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <h3 className="display-wide mt-4 text-[32px] leading-[0.95] text-[#fff9ec] sm:text-5xl lg:text-[56px]">
                {t.title}
                <span style={{ color: t.hue }}>.</span>
              </h3>
              <p className="mt-3 max-w-[42ch] text-[#fff9ec]/75 sm:text-lg">{t.blurb}</p>
            </div>          </motion.div>
        );
      })}
    </div>
  );
}
