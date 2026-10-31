"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { AboutBlurb, POLAROIDS, STATS } from "./about-content";
import { STORY_HASH } from "./story-scroll";

// The About story on phones and tablets. On a desktop it's told inside the pinned hero as you
// scroll; on a phone that scroll-scrubbed sequence was the main source of jank, so here it's simply
// the next section, with light reveals as it comes into view (transforms and opacity only, played
// once, never tied to the scroll position).

const EASE = [0.16, 1, 0.3, 1] as const;
const GROUP: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const UP: Variants = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } };
const RISE: Variants = { hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 0.8, ease: EASE } } };

export default function MobileAbout() {
  const headingId = useId();
  const reduce = useReducedMotion() ?? false;
  // a tapped print grows (tap it again, or another, to swap)
  const [zoomed, setZoomed] = useState<number | null>(null);
  // with reduced motion nothing is wired up to reveal: everything simply renders in place
  const reveal = reduce ? {} : { initial: "hidden" as const, whileInView: "show", viewport: { once: true, amount: 0.25 } };

  // the nav's About link lands here on phones
  useEffect(() => {
    if (window.location.hash !== STORY_HASH || !window.matchMedia("(max-width: 1023px)").matches) return;
    const t = window.setTimeout(() => document.getElementById("about")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }), 300);
    return () => window.clearTimeout(t);
  }, [reduce]);

  return (
    <section id="about" aria-labelledby={headingId} className="relative z-10 lg:hidden">
      <div className="mx-auto w-[min(1100px,calc(100vw-2rem))] pb-24 pt-16 sm:pt-24">
        <motion.div variants={GROUP} {...reveal}>
          <motion.p variants={UP} className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em]">
            <span className="text-accent">02</span>
            <span className="text-muted">/</span>
            About
          </motion.p>

          <h2 id={headingId} className="display-wide mt-4 text-[min(11.5vw,64px)] leading-[1.02]">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span variants={RISE} className="block">
                What is
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.1em]">
              <motion.span variants={RISE} className="block">
                w<span className="text-accent [text-shadow:0.045em_0.045em_0_var(--fg)]">HACK</span>iest<span className="text-accent">?</span>
              </motion.span>
            </span>
          </h2>

          <motion.p variants={UP} className="mt-5 max-w-[52ch] text-base leading-relaxed text-muted sm:text-lg">
            <AboutBlurb />
          </motion.p>
        </motion.div>

        <motion.dl variants={GROUP} {...reveal} className="mt-8 grid grid-cols-3 border-y border-ink/15">
          {STATS.map(([n, label], i) => (
            <motion.div key={label} variants={UP} className={`flex flex-col-reverse justify-end py-4 ${i > 0 ? "border-l border-ink/15 pl-3 sm:pl-5" : "pr-2"}`}>
              <dt className="mt-1.5 font-mono text-[9px] uppercase leading-snug tracking-[0.12em] text-muted sm:text-[11px]">{label}</dt>
              <dd className="display-wide text-[min(6.2vw,34px)] leading-none text-accent">{n}</dd>
            </motion.div>
          ))}
        </motion.dl>

        <motion.div variants={GROUP} {...reveal} className="mt-10">
          <motion.p variants={UP} className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            From the archive <span className="text-accent">/</span> wHACKiest 2025 drew a packed house
          </motion.p>
          <ul className="mt-6 flex gap-3 sm:gap-5">
            {POLAROIDS.map((p, i) => (
              <motion.li
                key={p.caption}
                variants={{
                  hidden: { opacity: 0, y: 46, rotate: p.turn * 3 },
                  show: { opacity: 1, y: 0, rotate: p.turn, transition: { type: "spring", stiffness: 170, damping: 17 } },
                }}
                style={{ rotate: reduce ? p.turn : undefined }}
                className={`relative w-1/3 ${zoomed === i ? "z-20" : "z-0"}`}
              >
                <button
                  type="button"
                  aria-label={`${p.caption}: ${zoomed === i ? "shrink" : "enlarge"} photo`}
                  aria-pressed={zoomed === i}
                  data-zoom={zoomed === i ? "" : undefined}
                  onClick={() => setZoomed((z) => (z === i ? null : i))}
                  className={`${["origin-bottom-left", "origin-bottom", "origin-bottom-right"][i]} block w-full bg-white p-1.5 pb-2.5 text-left shadow-[0_12px_24px_-12px_rgba(60,40,10,0.45)] transition-[scale,box-shadow] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] data-[zoom]:scale-[1.55] data-[zoom]:shadow-[0_30px_60px_-20px_rgba(60,40,10,0.55)] sm:p-2 sm:pb-3 sm:data-[zoom]:scale-[1.3]`}
                >
                  <span className="relative block aspect-square overflow-hidden bg-[#d9d3c4]">
                    <Image src={p.src} alt={p.alt} fill sizes="(min-width: 640px) 220px, 31vw" className="object-cover" />
                  </span>
                  <span className="mt-2 block truncate text-center font-mono text-[10px] text-muted sm:text-xs">{p.caption}</span>
                </button>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
