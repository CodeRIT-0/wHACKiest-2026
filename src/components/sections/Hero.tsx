"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, Camera } from "@phosphor-icons/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import FRAMES from "@/lib/clock-frames.json";
import { useNow } from "@/hooks/useNow";
import { Gear } from "../decor/Decor";
import Words from "../motion/Words";
import FlipBoard from "../hero/FlipBoard";
import SecondsDial from "../hero/SecondsDial";
import { phaseAt, STATUS } from "../hero/hero-status";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// 1946, the mechanical age. At rest: the name on the left, the wHACKiest clock on the right over a
// dial that keeps real time, and a split-flap board counting down to kick-off along the bottom.
// Then a pinned, scroll-scrubbed opener built on the clock (frame sequences in
// public/assets/clock-seq, see scripts/extract-clock-frames.py):
//   1. the clock travels right to left into the space the copy leaves, turning as it goes ("turn"
//      clip, played out and back so it lands on the shot the shatter clip opens with)
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

// "2026" rolls in like counter drums: each strip runs down through two turns of digits and
// settles on its own. The settled digit is first, so without the script it just reads 2026.
const YEAR = "2026";
const STRIP_LEN = 21;
const strip = (d: string) => Array.from({ length: STRIP_LEN }, (_, k) => (Number(d) + k) % 10);

// the cursor spotlight: a dot matrix that only shows near the pointer, and a warm glow under it
const SPOT_DOTS: React.CSSProperties = {
  opacity: "var(--spot, 0)",
  backgroundImage: "radial-gradient(color-mix(in srgb, var(--accent) 75%, transparent) 1.1px, transparent 1.6px)",
  backgroundSize: "22px 22px",
  maskImage: "radial-gradient(260px circle at var(--mx, 50%) var(--my, 40%), #000, transparent 72%)",
  WebkitMaskImage: "radial-gradient(260px circle at var(--mx, 50%) var(--my, 40%), #000, transparent 72%)",
};
const SPOT_GLOW: React.CSSProperties = {
  opacity: "var(--spot, 0)",
  background: "radial-gradient(560px circle at var(--mx, 50%) var(--my, 40%), rgba(253,156,54,0.11), transparent 62%)",
};

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

// where registration stands, read off the clock so it is never stale. A neutral label until
// hydration (the intro fades the eyebrow in after that, so the swap is never seen)
function StatusChip() {
  const now = useNow();
  const status = now === null ? null : STATUS[phaseAt(now)];
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-2.5 py-1 font-bold text-bg">
      <span className="relative flex h-1.5 w-1.5">
        {status?.pulse && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />}
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      {status?.label ?? "wHACKiest 2026"}
    </span>
  );
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
          const copies = q("[data-copy]") as HTMLElement[];
          const [headline] = copies;

          // desktop: across into the centre of the copy's column, measured without the stage's own
          // shift so a mid-scroll refresh still lands it in the right place. Stacked: the copy above
          // makes way for the story, so the clock settles a little lower instead
          const to = () => {
            if (!desktop) return 0;
            const c = headline.getBoundingClientRect();
            const s = stage.getBoundingClientRect();
            return c.left + c.width / 2 - (s.left + s.width / 2) - Number(gsap.getProperty(stage, "x"));
          };
          const drop = () => (desktop ? 0 : 56);

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            onUpdate: () => draw(),
            scrollTrigger: { trigger: root.current, start: "top top", end: "+=170%", pin: true, scrub: true, invalidateOnRefresh: true, refreshPriority: 1 },
          });

          // 1. travel right -> left, turning as it goes; the copy, board and dial clear out of its way
          tl.fromTo(stage, { x: 0, y: 0 }, { x: to, y: drop, duration: 0.4, ease: "power1.inOut" }, 0)
            .fromTo(play.current, { turn: 0 }, { turn: 1, duration: 0.4, ease: "power1.inOut" }, 0)
            .to(copies, { opacity: 0, x: desktop ? -50 : 0, y: desktop ? 0 : -30, duration: 0.18, stagger: 0.02 }, 0.04)
                        .to(q("[data-spotlight-wrap]"), { opacity: 0, duration: 0.1 }, 0)
            .to(q("[data-dims]"), { opacity: 0, duration: 0.12 }, 0)
            .to(q("[data-hero-gears], [data-hero-badge], [data-hero-dial]"), { opacity: 0, scale: 0.85, duration: 0.2 }, 0)
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
          // the board belongs to the resting frame: on desktop it clears for the story; stacked, it
          // can sit below the fold, so it stays put to be read once the pin lets go
          if (desktop) tl.to(q("[data-board-wrap]"), { opacity: 0, y: 40, duration: 0.14 }, 0.02);
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

  // on load: the clock swings in over its dial, the name rises word by word, 2026 rolls onto its
  // drums, the board's flaps fall into place and the blueprint lines draw. After that the clock
  // leans toward the pointer, a spotlight follows it, and the main button pulls toward it
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
          .from(q("[data-hero-dial]"), { scale: 0.6, rotate: -70, opacity: 0, duration: 1.9 }, 0.05)
          .from(q("[data-hero-gears] > *"), { scale: 0, opacity: 0, duration: 1.2, stagger: 0.12 }, 0.1)
          .from(q("[data-hero-words] .word-inner"), { yPercent: 115, rotate: 6, duration: 1.1, stagger: 0.09 }, 0.15)
          .from(q("[data-year-strip]"), { yPercent: (-(STRIP_LEN - 1) / STRIP_LEN) * 100, duration: 1.8, stagger: 0.12, ease: "power4.out" }, 0.25)
          .from(q("[data-intro-fade]"), { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.45)
          .from(q("[data-board]"), { y: 48, opacity: 0, duration: 1.1 }, 0.6)
          .from(q("[data-flap]"), { rotateX: -90, opacity: 0, transformPerspective: 400, duration: 0.7, stagger: 0.035, ease: "back.out(2.2)" }, 0.8)
          .fromTo(dims, { strokeDasharray: "1 1", strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, stagger: 0.06, ease: "power2.inOut" }, 0.5)
          .from(q("[data-hero-badge]"), { scale: 0, rotate: -90, opacity: 0, duration: 1.2 }, 0.7);
      });

      mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
        const q = gsap.utils.selector(root);
        const section = root.current!;
        const [tilt] = q("[data-tilt]") as HTMLElement[];
        const [gears] = q("[data-hero-gears]") as HTMLElement[];
        const [dial] = q("[data-hero-dial]") as HTMLElement[];
        const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.8, ease: "power3.out" });
        const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.8, ease: "power3.out" });
        const tx = gsap.quickTo(tilt, "x", { duration: 0.8, ease: "power3.out" });
        const ty = gsap.quickTo(tilt, "y", { duration: 0.8, ease: "power3.out" });
        const gx = gsap.quickTo(gears, "x", { duration: 1.2, ease: "power3.out" });
        const gy = gsap.quickTo(gears, "y", { duration: 1.2, ease: "power3.out" });
        // the dial sits a layer behind the clock and drifts less, which is what sells the depth
        const dx = gsap.quickTo(dial, "x", { duration: 1, ease: "power3.out" });
        const dy = gsap.quickTo(dial, "y", { duration: 1, ease: "power3.out" });

        const move = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          ry(nx * 18);
          rx(-ny * 14);
          tx(nx * 18);
          ty(ny * 14);
          gx(-nx * 30);
          gy(-ny * 24);
          dx(nx * 8);
          dy(ny * 6);
          const r = section.getBoundingClientRect();
          section.style.setProperty("--mx", `${Math.round(e.clientX - r.left)}px`);
          section.style.setProperty("--my", `${Math.round(e.clientY - r.top)}px`);
        };
        const enter = () => section.style.setProperty("--spot", "1");
        const leave = () => section.style.setProperty("--spot", "0");
        window.addEventListener("pointermove", move);
        section.addEventListener("pointerenter", enter);
        section.addEventListener("pointerleave", leave);

        // magnetic call to action: drifts toward the pointer while it is over the button
        const magnets = (q("[data-magnetic]") as HTMLElement[]).map((el) => {
          const mx = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
          const my = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
          const pull = (e: PointerEvent) => {
            const b = el.getBoundingClientRect();
            mx((e.clientX - (b.left + b.width / 2)) * 0.22);
            my((e.clientY - (b.top + b.height / 2)) * 0.32);
          };
          const release = () => {
            mx(0);
            my(0);
          };
          el.addEventListener("pointermove", pull);
          el.addEventListener("pointerleave", release);
          return () => {
            el.removeEventListener("pointermove", pull);
            el.removeEventListener("pointerleave", release);
          };
        });

        return () => {
          window.removeEventListener("pointermove", move);
          section.removeEventListener("pointerenter", enter);
          section.removeEventListener("pointerleave", leave);
          magnets.forEach((off) => off());
        };
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

      {/* the blueprint lights up under the pointer */}
      <div data-spotlight-wrap aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 transition-opacity duration-700" style={SPOT_GLOW} />
        <div className="absolute inset-0 transition-opacity duration-700" style={SPOT_DOTS} />
      </div>

      {/* same left edge as the floating navbar at every width: max(1rem, (100vw - 1100px) / 2) */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-[min(1100px,calc(100vw-2rem))] flex-col justify-center gap-4 pb-5 pt-[108px] sm:gap-6 lg:gap-[min(2rem,3.4vh)] lg:pb-[min(2.25rem,3vh)] lg:pt-[min(128px,calc(100px_+_2vh))]">
        <div className="grid items-center gap-x-10 gap-y-3 sm:gap-y-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-y-6">
          {/* ---------------- the name ---------------- */}
          <div data-copy className="min-w-0 lg:self-end">
            <p
              data-intro-fade
              className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-ink/15 bg-panel/80 p-1 pr-3.5 font-mono text-[10px] uppercase tracking-[0.14em] backdrop-blur sm:text-[11px]"
            >
              <StatusChip />
              <span className="truncate text-muted">
                <span className="hidden min-[440px]:inline">
                  National hackathon <span className="text-accent">/</span>{" "}
                </span>
                01–02 Dec 2026
              </span>
            </p>

            {/* the wordmark is the headline: HACK in orange on a hard ink shadow that deepens on
                hover, then a blinking terminal cursor; 2026 below at the same size on counter drums */}
            <h1 aria-label="wHACKiest 2026. Every second counts." className="group/word mt-4 sm:mt-5">
              <span
                data-hero-words
                aria-hidden
                className="display-wide block whitespace-nowrap text-[calc((100vw_-_2rem)/6.8)] leading-[0.86] tracking-[-0.06em] sm:text-[min(108px,calc((100vw_-_2rem)/6.8),10vh)] lg:text-[min(96px,calc((min(1100px,100vw_-_2rem)_-_40px)*0.0885),12vh)]"
              >
                <span className="inline-block overflow-hidden pb-[0.12em] pr-[0.1em] align-bottom">
                  <span className="word-inner relative inline-block">
                    w
                    <span className="text-accent transition-[text-shadow] duration-300 ease-out [text-shadow:0.045em_0.045em_0_var(--fg)] group-hover/word:[text-shadow:0.075em_0.075em_0_var(--fg)]">
                      HACK
                    </span>
                    iest
                    <span className="ml-[0.06em] inline-block h-[0.62em] w-[0.15em] translate-y-[0.02em] bg-accent motion-safe:animate-[blink_1s_steps(1)_infinite]" />
                  </span>
                </span>
              </span>

              <span aria-hidden className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-3 sm:mt-2 sm:gap-x-5">
                <span className="display-wide flex text-[calc((100vw_-_2rem)/6.4)] leading-none tracking-[-0.06em] text-accent sm:text-[min(108px,calc((100vw_-_2rem)/6.4),10.5vh)] lg:text-[min(112px,calc((min(1100px,100vw_-_2rem)_-_40px)*0.103),13.5vh)]">
                  {YEAR.split("").map((d, i) => (
                    <span key={i} className="-mr-[0.02em] inline-block h-[1.02em] overflow-hidden pr-[0.06em]">
                      <span data-year-strip className="flex flex-col [text-shadow:0.045em_0.045em_0_var(--fg)]">
                        {strip(d).map((n, k) => (
                          <span key={k} className="block h-[1.02em] leading-[1.02em]">
                            {n}
                          </span>
                        ))}
                      </span>
                    </span>
                  ))}
                </span>
                <span
                  data-intro-fade
                  className="inline-flex items-center gap-2 bg-ink py-1.5 pl-2 pr-3 font-mono text-[9.5px] font-bold uppercase leading-[1.3] tracking-[0.16em] text-bg shadow-[3px_3px_0_var(--accent)] sm:gap-3 sm:py-2 sm:pl-2.5 sm:pr-4 sm:text-xs sm:tracking-[0.18em]"
                >
                  {/* a seconds hand that ticks once a second */}
                  <svg viewBox="0 0 16 16" className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" fill="none">
                    <circle cx="8" cy="8" r="7" className="stroke-accent" strokeWidth="1.2" />
                    <g className="clock-seconds" style={{ transformOrigin: "8px 8px", animationDuration: "60s" }}>
                      <path d="M8 8V3" className="stroke-accent" strokeWidth="1.2" strokeLinecap="round" />
                    </g>
                    <circle cx="8" cy="8" r="0.9" className="fill-accent" />
                  </svg>
                  <span>
                    Every second
                    <br />
                    counts<span className="text-accent">.</span>
                  </span>
                </span>
              </span>
            </h1>
          </div>

          {/* ---------------- the clock ---------------- */}
          <div className="relative mx-auto w-[min(100%,31vh)] min-w-0 sm:w-[min(100%,28vh)] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:w-[min(104%,58vh)] xl:w-[min(118%,58vh)]">
            {/* warm light behind the movement */}
            <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[95%] w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(253,156,54,0.17),transparent)]" />

            {/* a dial that keeps real time, centred on the clock's face */}
            <div data-hero-dial aria-hidden className="pointer-events-none absolute left-[51%] top-[51.5%] w-[104%] -translate-x-1/2 -translate-y-1/2">
              <SecondsDial className="h-auto w-full" />
            </div>

            {/* gear train turning behind the clock (with the scroll), leaning away from the pointer */}
            <div data-hero-gears aria-hidden className="pointer-events-none absolute inset-0 text-ink/25">
              <Gear teeth={24} speed={0.06} spokes={6} className="-left-[8%] top-[4%] w-[46%]" />
              <Gear teeth={14} speed={-0.1} className="left-[33%] -top-[6%] w-[27%]" />
              <Gear teeth={18} speed={-0.08} className="-bottom-[4%] right-[2%] w-[36%] text-accent/60" />
              <Gear teeth={10} speed={0.14} className="bottom-[22%] right-[30%] w-[16%]" />
            </div>

            {/* rotating badge */}
            <div data-hero-badge aria-hidden className="pointer-events-none absolute -right-1 -top-4 z-10 w-20 sm:w-24 lg:right-1 lg:-top-6 lg:w-28 xl:-right-4">
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

          {/* ---------------- the pitch ---------------- */}
          <div data-copy className="min-w-0 lg:col-start-1 lg:row-start-2 lg:self-start">
            <p data-intro-fade className="hidden max-w-[40ch] text-lg text-muted lg:block">
              Real problems. Bigger possibilities. <span className="font-semibold text-ink">24 hours</span> to build what matters.
            </p>
            <div data-intro-fade className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4 lg:mt-7">
              <Link
                href="/register"
                data-magnetic
                className="group/cta relative inline-flex items-center justify-center gap-2.5 overflow-hidden border-2 border-ink bg-accent px-4 py-3 text-[13px] font-bold uppercase tracking-[0.04em] text-[#050505] shadow-[4px_4px_0_var(--fg)] transition-[translate,box-shadow] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--fg)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_var(--fg)] sm:px-6 sm:py-3.5 sm:text-sm"
              >
                {/* a sheen that crosses the button on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -translate-x-[130%] -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.7),transparent)] transition-transform duration-700 ease-out group-hover/cta:translate-x-[260%]"
                />
                Register now
                <ArrowRight size={15} weight="bold" className="transition-transform duration-300 group-hover/cta:translate-x-1" />
              </Link>
              <Link
                href="/#about"
                className="group/ex inline-flex items-center justify-center gap-2 border-2 border-ink bg-bg/70 px-4 py-3 text-[13px] font-bold uppercase tracking-[0.04em] backdrop-blur transition-colors duration-200 hover:bg-ink hover:text-bg sm:px-6 sm:py-3.5 sm:text-sm"
              >
                Explore<span className="-ml-1 hidden sm:inline">the hackathon</span>
                <ArrowDown size={15} weight="bold" className="transition-transform duration-300 group-hover/ex:translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ---------------- the countdown ---------------- */}
        <div data-board-wrap>
          <FlipBoard />
        </div>

        {/* About, told while the clock turns: takes over the half the clock rolls away from (the top
            on mobile, where the copy was) */}
        <div
          data-story
          aria-hidden
          className="pointer-events-none invisible absolute inset-x-0 top-[112px] z-20 opacity-0 lg:inset-y-0 lg:left-auto lg:right-0 lg:top-0 lg:flex lg:w-[calc(50%-1.5rem)] lg:items-center"
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
      </div>
    </section>
  );
}
