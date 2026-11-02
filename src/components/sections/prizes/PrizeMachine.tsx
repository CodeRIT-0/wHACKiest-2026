"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { ArrowUpRight, LockSimple, X } from "@phosphor-icons/react";
import SectionHeader from "../../SectionHeader";
import { useHydrated } from "@/hooks/useHydrated";
import CrtScreen, { Scramble, type Stage } from "./CrtScreen";
import { inr, TOTAL } from "./prize-data";

// The prize tease, driven by scroll. The section is a tall stretch with a pinned stage: the machine
// boots as it arrives, the pool decodes out of random glyphs as the page moves (the progress bar on
// the tube *is* the scroll bar), and then the rest of the file refuses to open. The split and the
// awards stay encrypted and a TO BE ANNOUNCED stamp lands on them. Scrolling back up re-encrypts.

const BOOT_END = 0.08;
const READ_END = 0.62;
const STEP = 1 / 24; // the scroll position is quantised to this, so React re-renders stay cheap

type View = { stage: Stage; t: number };

function read(v: number): View {
  if (v < BOOT_END) return { stage: "boot", t: 0 };
  if (v >= READ_END) return { stage: "done", t: 1 };
  return { stage: "reading", t: Math.round((v - BOOT_END) / (READ_END - BOOT_END) / STEP) * STEP };
}

export default function PrizeMachine() {
  const ref = useRef<HTMLElement>(null);
  // the tube snaps on the first time the section comes into view, and stays on from then
  const powered = useInView(ref, { amount: 0.05, once: true });
  const live = useInView(ref, { margin: "20% 0px" });
  // `useReducedMotion` is already true on the first client render but false on the server, so it
  // only takes effect once hydration is done — otherwise the markup the two produce disagrees
  const prefersReduced = useReducedMotion();
  const hydrated = useHydrated();
  const reduce = hydrated && !!prefersReduced;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [view, setView] = useState<View>(() => read(0));

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = read(v);
    setView((prev) => (prev.stage === next.stage && prev.t === next.t ? prev : next));
  });

  // with reduced motion the section is a normal block and the pool is simply already open
  const stage: Stage = reduce ? "done" : powered ? view.stage : "off";
  const done = stage === "done";
  const reading = stage === "reading";
  const total = inr(TOTAL);

  return (
    <section ref={ref} id="prizes" className={`relative overflow-x-clip ${reduce ? "" : "h-[170vh] lg:h-[180vh]"}`}>
      {/* the room warms up as the pool comes out */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: done ? 1 : stage === "off" ? 0.2 : 0.55 }}
        transition={{ duration: 1 }}
        className="pointer-events-none absolute left-1/2 top-1/3 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(253,156,54,0.28),transparent)] blur-2xl lg:left-[30%]"
      />

      <div className={reduce ? "relative" : "sticky top-0 h-[100svh] overflow-hidden lg:h-screen"}>
        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col px-6 pb-4 pt-20 sm:pb-5 short:grid short:grid-cols-[auto_minmax(0,1fr)] short:grid-rows-[minmax(0,1fr)_auto] short:gap-x-6 short:pb-3 short:pt-14 lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-12 lg:pb-6 lg:pt-24 xl:gap-x-16">
          {/* ---------------- heading ---------------- */}
          <div className="grid shrink-0 gap-4 max-lg:[&_h2]:mt-2 max-lg:[&_h2]:max-w-none max-lg:[&_h2]:text-[min(8.4vw,36px)] short:col-start-2 short:row-start-1 short:self-end short:[&_h2]:text-[min(4.4vw,28px)] short:[&_p]:hidden short:[&_p:first-child]:flex lg:col-start-2 lg:row-start-1 lg:self-end lg:pb-8">
            <SectionHeader index="05" label="Prizes" title="Big ideas. Bigger rewards." />
            <p className="hidden max-w-[44ch] text-muted sm:block lg:text-lg">
              The pool is out. Who takes home what is still locked on this machine, and it stays locked until the reveal.
            </p>
          </div>

          {/* ---------------- the stage ---------------- */}
          <div className="grid min-h-0 flex-1 items-center gap-4 pt-4 short:contents lg:contents">
            {/* the machine */}
            <div data-trace className="relative mx-auto w-[min(100%,calc(100svh_-_316px))] min-w-0 sm:w-[min(100%,calc(100svh_-_500px))] short:col-start-1 short:row-span-2 short:row-start-1 short:w-[calc(100svh_-_72px)] short:self-center lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:w-[min(calc(100vh_-_130px),48vw)] lg:self-center">
              <div className="relative aspect-square w-full overflow-hidden">
                <div className="absolute inset-0">
                  <Image src="/assets/prizes/retro-computer.webp" alt="" fill sizes="(min-width: 1024px) 780px, 92vw" className="pointer-events-none select-none object-contain" />

                  {/* the tube's glow spilling onto the bezel once it's on (opacity only, so it's cheap) */}
                  <span
                    aria-hidden
                    className={`absolute rounded-[12%] bg-[radial-gradient(closest-side,rgba(255,179,92,0.4),transparent)] blur-xl transition-opacity duration-700 ${
                      stage === "off" ? "opacity-0" : reading ? "opacity-100" : "opacity-60"
                    }`}
                    style={{ left: "19%", top: "4%", width: "61%", height: "50%" }}
                  />
                  {/* the live tube, sat inside the bezel (percentages measured off the photo) */}
                  <div className="absolute overflow-hidden rounded-[7%/9%] bg-[#060f0c] shadow-[inset_0_0_70px_rgba(0,0,0,0.95)]" style={{ left: "25.4%", top: "11.2%", width: "48.4%", height: "35%" }}>
                    <CrtScreen stage={stage} t={view.t} live={live} reduce={reduce} />
                  </div>

                  {/* drive light, over the amber LED on the case: lit while the pool is decoding */}
                  <span
                    aria-hidden
                    className={`absolute rounded-[1px] transition-opacity duration-150 ${reading ? "opacity-100 motion-safe:animate-[flicker_0.25s_linear_infinite]" : "opacity-0"}`}
                    style={{ left: "80.2%", top: "66.2%", width: "2.4%", height: "1.3%", backgroundColor: "#ff8a3d", boxShadow: "0 0 14px 4px rgba(255,138,61,0.85)" }}
                  />

                  {/* power light: the photo has none, so one goes under the bezel */}
                  <motion.span
                    aria-hidden
                    className="absolute rounded-full"
                    style={{ left: "75.2%", top: "50.4%", width: "1.2%", height: "1.2%" }}
                    initial={false}
                    animate={{ backgroundColor: stage === "off" ? "#8a826f" : "#5dff9a", boxShadow: stage === "off" ? "0 0 0 transparent" : "0 0 10px 2px rgba(93,255,154,0.8)" }}
                  />
                </div>
              </div>
            </div>

            {/* the desktop: the pool's window, and the sealed one with the stamp on it */}
            <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] short:col-start-2 short:row-start-2 short:mt-2 lg:col-start-2 lg:row-start-2 lg:self-start xl:gap-4">
              <article className="border-2 border-ink bg-panel shadow-[5px_5px_0_var(--fg)]">
                <div className="flex items-center gap-2 border-b-2 border-ink bg-[linear-gradient(90deg,var(--color-trace),color-mix(in_srgb,var(--color-trace)_55%,var(--bg)))] px-2 py-1">
                  <span className="whitespace-nowrap font-mono text-[9px] font-bold uppercase tracking-[0.04em] text-[#fff9ec] sm:text-[10px] sm:tracking-[0.1em]">PRIZE_POOL.DAT</span>
                  <span aria-hidden className="ml-auto grid h-3.5 w-3.5 shrink-0 place-items-center border border-ink bg-panel text-ink">
                    <X size={7} weight="bold" />
                  </span>
                </div>
                <div className="px-3 py-2.5 lg:py-4">
                  <p className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.06em] text-muted sm:text-[10px] sm:tracking-[0.16em]">Total prize pool</p>
                  <p className="display-wide mt-1 whitespace-nowrap text-[clamp(20px,6.4vw,30px)] leading-none lg:text-[clamp(28px,3vw,46px)] tabular-nums text-accent">
                    <Scramble text={total} locked={done || !live ? total.length : reading ? Math.round(view.t * total.length) : 0} />
                    <span className="sr-only">{total}</span>
                  </p>
                </div>
              </article>

              <article className="relative flex flex-col justify-center overflow-hidden border-2 border-dashed border-ink/30 bg-panel/40 px-3 py-2.5 lg:py-4">
                <p className="flex items-center gap-1.5 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.06em] text-muted sm:gap-2 sm:text-[10px] sm:tracking-[0.16em]">
                  <LockSimple size={13} weight="duotone" className="shrink-0 text-accent" />
                  Who wins what
                </p>
                {/* redaction bars, so not even the number of digits gives anything away */}
                <span aria-hidden className="mt-2 grid gap-1.5">
                  <span className="h-2 w-[85%] bg-ink/25" />
                  <span className="h-2 w-[60%] bg-ink/25" />
                </span>
                <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.06em] text-muted sm:text-[10px] sm:tracking-[0.1em]">Split + awards</p>
                <motion.p
                  initial={false}
                  animate={done ? { opacity: 1, scale: 1, rotate: -5 } : { opacity: 0, scale: reduce ? 1 : 1.9, rotate: reduce ? -5 : -14 }}
                  transition={{ type: "spring", stiffness: 420, damping: 18 }}
                  className="pointer-events-none absolute inset-0 m-auto h-fit w-fit whitespace-nowrap border-[3px] border-accent bg-bg/90 px-1.5 py-1 text-center font-mono text-[clamp(9px,2.9vw,12px)] font-bold uppercase tracking-[0.06em] text-accent shadow-[0_0_24px_rgba(253,156,54,0.45)] sm:px-2.5 sm:text-[13px] sm:tracking-[0.12em]"
                >
                  To be announced
                </motion.p>
              </article>

              <Link href="/announcements" className="group/ann inline-flex w-fit items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent sm:col-span-2 max-lg:[@media(max-height:720px)]:hidden">
                Be first to know
                <ArrowUpRight size={13} weight="bold" className="transition-transform duration-300 group-hover/ann:-translate-y-0.5 group-hover/ann:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <p aria-live="polite" className="sr-only">
            {done ? `Total prize pool ${total}. How it is split, and the special awards, are to be announced.` : ""}
          </p>
          {/* A ₹ in the CRT's typeface, drawn (invisibly) from the first render. The sign lives in the
              font's latin-ext file, which a browser only fetches once a ₹ is drawn in that face; the
              face arriving mid-scroll made the browser lay the whole page out again. This way it
              loads with the other fonts */}
          <span aria-hidden className="pointer-events-none absolute left-0 top-0 select-none font-mono text-[1px] opacity-0">
            ₹
          </span>
        </div>
      </div>
    </section>
  );
}
