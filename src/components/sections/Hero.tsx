"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Camera } from "@phosphor-icons/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import FRAMES from "@/lib/clock-frames.json";
import { Gear } from "../decor/Decor";
import Words from "../motion/Words";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// 1946, the mechanical age. A pinned, scroll-scrubbed opener built on the wHACKiest clock
// (frame sequences in public/assets/clock-seq, see scripts/extract-clock-frames.py):
//   1. the clock travels left to right across the stage, turning as it goes ("turn" clip,
//      played out and back so it lands on the shot the shatter clip opens with); the copy clears
//   2. the "shatter" clip: the glass cracks and the clock flips to show its gear train
//   3. it bursts into line-art glass shards and gears that fall toward the vacuum-tube era below
// The frames are transparent, so the paper stays one flat colour. The shatter clip is cut before
// its smoke. Reduced motion: no pin, no scrub, just the clock beside the copy.

// TODO: swap in real photos from wHACKiest 2025 (add `src` and render with next/image)
const POLAROIDS = [
  { caption: "Kick-off, 2025", tilt: "-rotate-6" },
  { caption: "3am debugging", tilt: "rotate-3" },
  { caption: "Final demos", tilt: "-rotate-2" },
];

const TURN_END = FRAMES.turn.count - 1;
const SHATTER_STOP = 52; // smoke takes over after this frame
const frameSrc = (seq: Seq, i: number) => `/assets/clock-seq/${seq}/${String(i).padStart(3, "0")}.webp`;
type Seq = keyof typeof FRAMES;

const r2 = (n: number) => Math.round(n * 100) / 100;
// line-art debris for the burst, spread by the golden angle so neighbours never fly the same way
const SHARDS = Array.from({ length: 22 }, (_, i) => {
  const a = i * 2.399963;
  const size = 10 + ((i * 37) % 7) * 5;
  const pts = [0, 1, 2, 3].slice(0, i % 3 ? 3 : 4).map((k) => {
    const t = a + (k * Math.PI * 2) / (i % 3 ? 3 : 4) + ((i * k * 13) % 5) * 0.2;
    return `${r2(200 + Math.cos(t) * size)},${r2(200 + Math.sin(t) * size * 0.8)}`;
  });
  const dist = 180 + ((i * 53) % 9) * 45;
  return {
    points: pts.join(" "),
    from: { x: r2(Math.cos(a) * 40), y: r2(Math.sin(a) * 34) },
    to: { x: r2(Math.cos(a) * dist), y: r2(Math.sin(a) * dist * 0.75 + 220), rotate: (i % 2 ? 1 : -1) * (90 + ((i * 29) % 7) * 40) },
    tint: i % 4 === 0,
  };
});
// gears from the clock's insides, each heading somewhere below
const GEARS = [
  { r: 46, teeth: 16, from: [-30, 10], to: [-300, 430, 300] },
  { r: 30, teeth: 11, from: [34, -20], to: [260, 470, -340] },
  { r: 22, teeth: 9, from: [10, 36], to: [-90, 560, 260] },
  { r: 16, teeth: 8, from: [-44, -30], to: [-520, 330, -220] },
  { r: 26, teeth: 10, from: [50, 30], to: [480, 380, 280] },
];

function gearPath(teeth: number, outer: number, inner: number) {
  const step = (Math.PI * 2) / teeth;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    [
      [inner, a],
      [outer, a + step * 0.14],
      [outer, a + step * 0.4],
      [inner, a + step * 0.54],
    ].forEach(([r, t]) => pts.push(`${r2(200 + r * Math.cos(t))},${r2(200 + r * Math.sin(t))}`));
  }
  return `M${pts.join("L")}Z`;
}

const ready = (img?: HTMLImageElement) => (img?.complete && img.naturalWidth > 0 ? img : undefined);
// closest frame that has finished loading, so a slow network shows a nearby angle, not a gap
function nearest(list: HTMLImageElement[], i: number) {
  for (let d = 0; d < list.length; d++) {
    const img = ready(list[i - d]) ?? ready(list[i + d]);
    if (img) return img;
  }
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const images = useRef<Record<Seq, HTMLImageElement[]>>({ turn: [], shatter: [] });
  // scroll-driven playhead: `turn` 0-1 plays the turn clip out and back, `shatter` is a frame index
  const play = useRef({ turn: 0, shatter: 0 });
  const drawn = useRef("");

  // paint the current frame, cross-fading into the next one for in-between scroll positions
  const draw = useCallback((force = false) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { turn, shatter } = play.current;
    const seq: Seq = shatter > 0 ? "shatter" : "turn";
    const frame = seq === "shatter" ? shatter : Math.sin(Math.PI * turn) * TURN_END;
    const key = `${seq}:${frame.toFixed(2)}`;
    if (key === drawn.current && !force) return;
    const list = images.current[seq];
    const base = Math.floor(frame);
    // the shatter clip loads second; until it has, hold the turn's opening frame (same shot)
    const a = nearest(list, base) ?? ready(images.current.turn[0]);
    if (!a) return;
    drawn.current = key;
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = 1;
    ctx.drawImage(a, 0, 0, width, height);
    const next = frame - base > 0.02 ? ready(list[base + 1]) : undefined;
    if (next) {
      ctx.globalAlpha = frame - base;
      ctx.drawImage(next, 0, 0, width, height);
    }
  }, []);

  // load the turn first; the shatter is further into the scroll, so it can follow after
  useEffect(() => {
    let cancelled = false;
    const load = (seq: Seq, count: number) =>
      Array.from({ length: count }, (_, i) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => !cancelled && draw(true);
        img.src = frameSrc(seq, i);
        return img;
      });
    const turn = load("turn", FRAMES.turn.count);
    images.current.turn = turn;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      Promise.allSettled(turn.map((img) => img.decode())).then(() => {
        if (!cancelled) images.current.shatter = load("shatter", SHATTER_STOP + 1);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [draw]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)", mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)" },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean };
          const q = gsap.utils.selector(root);
          const [stage] = q("[data-stage]") as HTMLElement[];
          const [copy] = q("[data-copy]") as HTMLElement[];

          // how far the clock travels: across into the copy's column; when stacked, in from the left
          // edge to the centre, rising into the space the copy leaves behind
          const from = () => (desktop ? 0 : -window.innerWidth * 0.18);
          const to = () => (desktop ? copy.offsetLeft - stage.parentElement!.offsetLeft + (copy.offsetWidth - stage.offsetWidth) / 2 : 0);
          const rise = () => (desktop ? 0 : -copy.offsetHeight * 0.42);

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            onUpdate: () => draw(),
            scrollTrigger: { trigger: root.current, start: "top top", end: "+=170%", pin: true, scrub: true, invalidateOnRefresh: true, refreshPriority: 1 },
          });

          // 1. travel left -> right, turning as it goes; the copy clears out of its way
          tl.fromTo(stage, { x: from, y: 0 }, { x: to, y: rise, duration: 0.4, ease: "power1.inOut" }, 0)
            .fromTo(play.current, { turn: 0 }, { turn: 1, duration: 0.4, ease: "power1.inOut" }, 0)
            .to(copy, { opacity: 0, x: desktop ? 60 : 0, y: desktop ? 0 : -40, duration: 0.18 }, 0.04)
            .to(q("[data-dims]"), { opacity: 0, duration: 0.12 }, 0)
            .to(q("[data-hero-gears], [data-hero-badge]"), { opacity: 0, scale: 0.85, duration: 0.2 }, 0)
            // 2. the glass cracks and the clock flips to show its gear train
            .fromTo(play.current, { shatter: 0 }, { shatter: SHATTER_STOP, duration: 0.34 }, 0.42)
            .fromTo(stage, { scale: 1 }, { scale: 1.08, duration: 0.34, ease: "power1.in" }, 0.42)
            // 3. burst: the photo gives way to line-art debris that falls into the next era
            .to(canvasRef.current, { opacity: 0, scale: 1.2, duration: 0.05 }, 0.76)
            .set(q("[data-burst]"), { opacity: 1 }, 0.75)
            // the About story fills the side the clock left behind
            .to(q("[data-story]"), { autoAlpha: 1, duration: 0.06 }, 0.26)
            .from(q('[data-story-line="a"] .word-inner'), { yPercent: 115, duration: 0.1, stagger: 0.02 }, 0.28)
            .from(q("[data-story-fade]"), { y: 20, opacity: 0, duration: 0.08, stagger: 0.03 }, 0.34)
            .from(q('[data-story-line="b"] .word-inner'), { yPercent: 115, duration: 0.1, stagger: 0.02 }, 0.46);
          // last year's prints drop onto the board as the clock breaks
          tl.from(q("[data-story-print]"), { y: 60, opacity: 0, duration: 0.1, stagger: 0.06, ease: "back.out(1.6)" }, 0.5);
          tl.to(q("[data-story]"), { autoAlpha: 0, duration: 0.06 }, 0.84);

          q("[data-shard]").forEach((el, i) => {
            const sh = SHARDS[i];
            tl.fromTo(el, { ...sh.from, rotate: 0, opacity: 1 }, { ...sh.to, svgOrigin: "200 200", duration: 0.24, ease: "power2.out" }, 0.75).to(el, { opacity: 0, duration: 0.06 }, 0.94);
          });
          q("[data-burst-gear]").forEach((el, i) => {
            const g = GEARS[i];
            tl.fromTo(
              el,
              { x: g.from[0], y: g.from[1], rotate: 0, opacity: 1 },
              { x: g.to[0], y: g.to[1], rotate: g.to[2], svgOrigin: "200 200", duration: 0.25, ease: "power1.in" },
              0.75,
            ).to(el, { opacity: 0, duration: 0.05 }, 0.95);
          });
        },
      );
    },
    { scope: root },
  );

  // on load: the headline rises word by word, the clock swings in and the blueprint lines draw;
  // after that the clock leans toward the pointer
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const dims = [...root.current!.querySelectorAll<SVGGeometryElement>("[data-dims] line, [data-dims] path")].map((el) => {
          el.setAttribute("pathLength", "1");
          return el;
        });
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(q("[data-intro-clock]"), { scale: 0.7, rotate: -25, opacity: 0, duration: 1.6 }, 0)
          .from(q("[data-hero-gears] > *"), { scale: 0, opacity: 0, duration: 1.2, stagger: 0.12 }, 0.1)
          .from(q("[data-hero-words] .word-inner"), { yPercent: 115, rotate: 6, duration: 1.1, stagger: 0.09 }, 0.15)
          .from(q("[data-intro-fade]"), { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.45)
          .fromTo(dims, { strokeDasharray: "1 1", strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, stagger: 0.06, ease: "power2.inOut" }, 0.5)
          .from(q("[data-hero-badge]"), { scale: 0, rotate: -90, opacity: 0, duration: 1.2 }, 0.7);
      });

      mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
        const q = gsap.utils.selector(root);
        const [tilt] = q("[data-tilt]") as HTMLElement[];
        const [gears] = q("[data-hero-gears]") as HTMLElement[];
        const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.8, ease: "power3.out" });
        const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.8, ease: "power3.out" });
        const tx = gsap.quickTo(tilt, "x", { duration: 0.8, ease: "power3.out" });
        const ty = gsap.quickTo(tilt, "y", { duration: 0.8, ease: "power3.out" });
        const gx = gsap.quickTo(gears, "x", { duration: 1.2, ease: "power3.out" });
        const gy = gsap.quickTo(gears, "y", { duration: 1.2, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          ry(nx * 18);
          rx(-ny * 14);
          tx(nx * 18);
          ty(ny * 14);
          gx(-nx * 30);
          gy(-ny * 24);
        };
        window.addEventListener("pointermove", move);
        return () => window.removeEventListener("pointermove", move);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="home" className="relative overflow-hidden">
      {/* faint drafting-table props */}
      <div aria-hidden className="pointer-events-none absolute inset-0 text-ink/[0.08]">
        <Gear teeth={16} speed={0.03} className="-right-24 -top-16 w-80" />
        <Gear teeth={10} speed={-0.06} className="-left-12 bottom-24 w-32" />
        <Gear teeth={22} speed={0.02} className="-bottom-40 left-[38%] w-72" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1100px] content-center items-center gap-6 px-6 pb-10 pt-28 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12 lg:pb-16">
        <div data-copy className="min-w-0 lg:order-2">
          <p data-intro-fade className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            CodeRIT presents <span className="text-accent">/</span> 01–02 Dec 2026
          </p>
          {/* the wordmark is the headline: ink letters over an orange outline echo (misregistered
              print, slides further on hover), HACK with a hard ink shadow, a blinking terminal cursor */}
          <h1 aria-label="wHACKiest 2026. Every second counts." className="group/word mt-3">
            <span data-hero-words aria-hidden className="display-wide block whitespace-nowrap text-[min(48px,12.2vw)] leading-[0.82] tracking-[-0.06em] sm:text-[82px] md:text-[96px] lg:text-[77px] xl:text-[84px]">
              <span className="inline-block overflow-hidden pb-[0.16em] pr-[0.14em] align-bottom">
                <span className="word-inner relative inline-block">
                  <span className="absolute inset-0 translate-x-[0.05em] translate-y-[0.05em] text-transparent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [-webkit-text-stroke:1.5px_var(--accent)] group-hover/word:translate-x-[0.09em] group-hover/word:translate-y-[0.08em]">
                    wHACKiest
                  </span>
                  <span className="relative">
                    w<span className="text-accent [text-shadow:0.045em_0.045em_0_var(--fg)]">HACK</span>iest
                  </span>
                  <span className="relative ml-[0.06em] inline-block h-[0.62em] w-[0.16em] translate-y-[0.02em] bg-accent motion-safe:animate-[blink_1s_steps(1)_infinite]" />
                </span>
              </span>
            </span>
            <span aria-hidden className="mt-4 flex flex-wrap items-center gap-3">
              <span className="font-display text-xl font-extrabold tracking-[-0.02em] [font-stretch:115%] sm:text-2xl">2026</span>
              <span data-intro-fade className="inline-flex items-center gap-2.5 bg-ink px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-bg shadow-[3px_3px_0_var(--accent)] sm:text-sm">
                {/* a seconds hand that ticks once a second */}
                <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none">
                  <circle cx="8" cy="8" r="7" className="stroke-accent" strokeWidth="1.5" />
                  <g className="clock-seconds" style={{ transformOrigin: "8px 8px", animationDuration: "60s" }}>
                    <path d="M8 8V3" className="stroke-accent" strokeWidth="1.5" strokeLinecap="round" />
                  </g>
                </svg>
                Every second counts<span className="text-accent">.</span>
              </span>
            </span>
          </h1>
          <p data-intro-fade className="mt-6 max-w-[36ch] text-lg text-muted">Real problems. Bigger possibilities. 24 hours to build what matters.</p>
          <div data-intro-fade className="mt-8 flex flex-wrap gap-3">
            <Link href="/register" className="inline-block bg-accent px-6 py-3.5 text-sm font-semibold uppercase text-[#1a1a1a] transition-transform active:scale-[0.98]">
              Register now
            </Link>
            <Link
              href="/#about"
              className="group inline-flex items-center gap-2 border border-ink px-6 py-3.5 text-sm font-semibold uppercase transition-colors hover:bg-ink hover:text-bg active:scale-[0.98]"
            >
              Explore the hackathon
              <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <dl data-intro-fade className="mt-8 grid max-w-md grid-cols-3 divide-x divide-ink/15 border-y border-ink/15">
            {[
              ["24", "hrs", "On the clock"],
              ["2–4", "", "Per team"],
              ["₹50K", "", "Prize pool"],
            ].map(([n, unit, label]) => (
              <div key={label} className="flex flex-col-reverse px-3 py-3 first:pl-0">
                <dt className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{label}</dt>
                <dd className="font-display text-2xl font-extrabold leading-none tracking-[-0.03em] [font-stretch:115%] sm:text-3xl">
                  {n}
                  {unit && <span className="ml-1 font-mono text-xs font-normal text-accent">{unit}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* About, told while the clock turns: takes over the half the clock rolls away from (the copy's spot on mobile) */}
        <div
          data-story
          aria-hidden
          className="pointer-events-none invisible absolute inset-x-6 top-28 z-20 opacity-0 lg:inset-y-0 lg:left-6 lg:right-auto lg:top-0 lg:flex lg:w-[calc(50%-3.5rem)] lg:items-center"
        >
          <div className="w-full">
            <p data-story-fade className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em]">
              <span className="text-accent">02</span>
              <span className="text-muted">/</span>
              About
            </p>
            <p className="display-wide mt-3 text-[34px] leading-[1] sm:text-5xl xl:text-6xl">
              <span data-story-line="a">
                <Words text="Where it all" />
              </span>{" "}
              <span data-story-line="b" className="text-accent">
                <Words text="began." />
              </span>
            </p>
            <p data-story-fade className="mt-4 hidden max-w-[46ch] text-muted sm:block">
              wHACKiest is CodeRIT&apos;s hackathon: <span className="font-semibold text-ink">24 hours</span>, teams of two to four, and one
              question. What can you build when every second counts? Last year set the bar. This year the clock starts again.
            </p>

            <p data-story-fade className="mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              From the archive <span className="text-accent">/</span> wHACKiest 2025
            </p>
            <ul className="mt-4 flex max-w-[460px] gap-3 sm:gap-4">
              {POLAROIDS.map((p) => (
                <li key={p.caption} data-story-print className={`w-1/3 ${p.tilt} bg-white p-1.5 pb-2.5 shadow-[0_12px_24px_-12px_rgba(60,40,10,0.45)] sm:p-2 sm:pb-3`}>
                  <div className="grid aspect-square place-items-center bg-[linear-gradient(135deg,#d9d3c4,#b8b09e)] text-ink/30 grayscale">
                    <Camera size={24} weight="duotone" />
                  </div>
                  <p className="mt-1.5 truncate text-center font-mono text-[9px] text-muted sm:text-[10px]">{p.caption}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[300px] sm:max-w-[440px] lg:order-1 lg:max-w-[600px]">
          {/* gear train turning behind the clock (with the scroll), leaning away from the pointer */}
          <div data-hero-gears aria-hidden className="pointer-events-none absolute inset-0 text-ink/25">
            <Gear teeth={24} speed={0.06} spokes={6} className="-left-[8%] top-[4%] w-[46%]" />
            <Gear teeth={14} speed={-0.1} className="left-[33%] -top-[6%] w-[27%]" />
            <Gear teeth={18} speed={-0.08} className="-bottom-[4%] right-[2%] w-[36%] text-accent/60" />
            <Gear teeth={10} speed={0.14} className="bottom-[22%] right-[30%] w-[16%]" />
          </div>

          {/* rotating badge */}
          <div data-hero-badge aria-hidden className="pointer-events-none absolute -right-2 -top-6 z-10 w-24 sm:w-28 lg:-right-6 lg:w-32">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <defs>
                <path id="hero-badge-ring" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
              </defs>
              <circle cx={50} cy={50} r={48} className="fill-bg stroke-ink" strokeWidth={1} />
              <g className="badge-spin">
                <text className="fill-ink font-mono" fontSize={8.6} textLength={236} lengthAdjust="spacing">
                  <textPath href="#hero-badge-ring">EVERY SECOND COUNTS · WHACKIEST 2026 · </textPath>
                </text>
              </g>
              <circle cx={50} cy={50} r={20} className="fill-accent" />
              <path d="M50 50V36M50 50l9 6" className="stroke-ink" strokeWidth={2.2} strokeLinecap="round" />
              <circle cx={50} cy={50} r={2.4} className="fill-ink" />
            </svg>
          </div>

          <div data-stage className="relative will-change-transform">
            <div data-tilt className="[transform-style:preserve-3d] [transform:perspective(900px)]">
              <div data-intro-clock>
                <canvas
                  ref={canvasRef}
                  width={FRAMES.turn.width}
                  height={FRAMES.turn.height}
                  aria-label="The wHACKiest clock"
                  role="img"
                  className="relative -ml-[6%] w-[112%] max-w-none"
                />
              </div>
            </div>

            {/* blueprint annotations + burst debris share the clock's box (400 units = its width) */}
            <svg viewBox="0 0 400 330" aria-hidden className="line-art pointer-events-none absolute inset-0 h-full w-full overflow-visible" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <g data-dims className="stroke-ink/35 font-mono" fontSize={9} letterSpacing={1.5}>
                <line x1={205} y1={-14} x2={205} y2={344} strokeDasharray="10 4 2 4" />
                <line x1={-10} y1={170} x2={410} y2={170} strokeDasharray="10 4 2 4" />
                <path d="M96 -6 V4 M314 -6 V4 M96 -1 H314" />
                <path d="M96 -1 l7 -3 v6 Z M314 -1 l-7 -3 v6 Z" className="fill-ink/40" />
                <text x={205} y={-10} textAnchor="middle" className="fill-ink/55 stroke-none">
                  Ø 256
                </text>
                <text x={0} y={340} className="fill-ink/55 stroke-none">
                  FIG. 01 / ESCAPEMENT CLOCK, 1946
                </text>
              </g>
              <g data-burst opacity={0} transform="translate(5 -30)">
                {SHARDS.map((sh, i) => (
                  <polygon key={i} data-shard points={sh.points} className={sh.tint ? "fill-[#9cc3e8]/30 stroke-ink" : "fill-bg stroke-ink/80"} />
                ))}
                {GEARS.map((g, i) => (
                  <g key={i} data-burst-gear className="stroke-ink">
                    <path d={gearPath(g.teeth, g.r, g.r * 0.84)} className="fill-bg" />
                    <circle cx={200} cy={200} r={r2(g.r * 0.55)} />
                    <circle cx={200} cy={200} r={r2(g.r * 0.15)} className={i === 0 ? "fill-accent stroke-accent" : ""} />
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
