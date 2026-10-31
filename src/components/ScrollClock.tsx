"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import FRAMES from "@/lib/clock-frames.json";

// Red Bull style travelling clock, driven entirely by scroll position (so scrolling back up
// replays everything in reverse). The page sets up its route with three kinds of markers:
//
//   [data-clock-slot]          the empty half of a SplitSection. The clock holds still there while
//                              the section fills the screen, and flies to the next slot between
//                              sections, scrubbing the "turn" clip (scripts/extract-clock-frames.py).
//   [data-clock-stage]         a tall pinned section (ShatterInterlude). The clock moves to the
//                              centre and scrubs the "shatter" clip, then bursts and fades away.
//   [data-clock-dial]          a spot inside a pinned section (the prize vault's dial). The shatter
//                              plays backwards as the section scrolls in, so the clock pulls itself
//                              back together, then sinks into the dial and hands over to it.

const SPLIT_MIN_WIDTH = 1024; // below this sections stack and the clock retreats to a corner
const TURN_END = FRAMES.turn.count - 1;
const SHATTER_END = FRAMES.shatter.count - 1;

type Seq = keyof typeof FRAMES;
type Pose = { x: number; y: number; size: number; rotate: number; opacity: number };
// `seq`/`frame` describe the clip used on the way *into* this key; `fly` adds a toss arc
type Key = { at: number; pose: Pose; seq: Seq; frame: number; ease: "glide" | "linear"; fly?: boolean };
type Sample = Pose & { seq: Seq; frame: number };

const frameSrc = (seq: Seq, i: number) => `/assets/clock-seq/${seq}/${String(i).padStart(3, "0")}.webp`;

// smootherstep: zero acceleration at both ends, so take-off and landing feel weightless
const glide = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function sample(keys: Key[], scroll: number, reduce: boolean): Sample | null {
  if (!keys.length) return null;
  const first = keys[0];
  if (scroll <= first.at) return { ...first.pose, seq: first.seq, frame: first.frame };
  let i = 0;
  while (i < keys.length - 1 && scroll >= keys[i + 1].at) i++;
  const a = keys[i];
  const b = keys[i + 1];
  if (!b) return { ...a.pose, seq: a.seq, frame: a.frame };

  const raw = (scroll - a.at) / Math.max(1, b.at - a.at);
  let t = b.ease === "glide" ? glide(raw) : Math.min(1, Math.max(0, raw));
  if (reduce) t = t < 0.5 ? 0 : 1;
  const arc = b.fly && !reduce ? Math.sin(Math.PI * t) : 0;
  // both clips open on the same shot, so a clip change starts from frame 0
  const from = a.seq === b.seq ? a.frame : 0;

  return {
    x: lerp(a.pose.x, b.pose.x, t),
    y: lerp(a.pose.y, b.pose.y, t) - arc * window.innerHeight * 0.05, // slight lift mid-flight, like a toss
    size: lerp(a.pose.size, b.pose.size, t) * (1 - arc * 0.05),
    rotate: lerp(a.pose.rotate, b.pose.rotate, t) + arc * (b.pose.x < a.pose.x ? -8 : 8), // banks into the turn
    opacity: lerp(a.pose.opacity, b.pose.opacity, t),
    seq: b.seq,
    frame: lerp(from, b.frame, t),
  };
}

// read the markers and lay out the clock's whole journey as scroll-position keyframes
function buildRoute(): Key[] {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const split = vw >= SPLIT_MIN_WIDTH;
  const top = (el: Element) => el.getBoundingClientRect().top + window.scrollY;

  const markers = [...document.querySelectorAll<HTMLElement>("[data-clock-slot], [data-clock-stage], [data-clock-dial]")]
    .map((el) => ({ el, section: el.closest("section") ?? el }))
    .sort((a, b) => top(a.section) - top(b.section));
  const stageAt = markers.findIndex((m) => m.el.hasAttribute("data-clock-stage"));

  const slotPose = (slot: HTMLElement, first: boolean): Pose => {
    const rotate = Number(slot.dataset.rotate ?? 0);
    if (split) {
      const r = slot.getBoundingClientRect();
      // a touch larger than its slot: edges tuck behind the content, which sits above
      return { x: r.left + r.width / 2, y: vh / 2 + 24, size: Math.min(r.width * 1.22, vh * 0.86), rotate, opacity: 1 };
    }
    if (first) return { x: vw * 0.5, y: vh * 0.8, size: vw * 0.95, rotate, opacity: 1 };
    const left = slot.classList.contains("lg:order-1");
    return { x: vw * (left ? 0.16 : 0.84), y: vh * 0.86, size: vw * 0.42, rotate, opacity: 0.28 };
  };

  const keys: Key[] = [];
  markers.forEach(({ el, section }, i) => {
    const start = top(section);
    const height = section.getBoundingClientRect().height;
    const end = start + height - vh;

    if (el.hasAttribute("data-clock-stage")) {
      // pinned stage: arrive at the centre, scrub the shatter, then burst toward the viewer
      const length = Math.max(1, end - start);
      const centre: Pose = { x: vw / 2, y: vh / 2, size: split ? Math.min(vw * 0.5, vh * 0.78) : vw * 0.9, rotate: 0, opacity: 1 };
      keys.push(
        { at: start, pose: centre, seq: "turn", frame: 0, ease: "glide", fly: true },
        { at: start + length * 0.06, pose: centre, seq: "turn", frame: 0, ease: "linear" },
        { at: start + length * 0.42, pose: { ...centre, size: centre.size * 1.12, rotate: -4 }, seq: "shatter", frame: SHATTER_END, ease: "linear" },
        { at: start + length * 0.6, pose: { ...centre, size: centre.size * 2.1, rotate: -10, opacity: 0 }, seq: "shatter", frame: SHATTER_END, ease: "glide" },
      );
      return;
    }

    if (el.hasAttribute("data-clock-dial")) {
      // the dial sits in a sticky, full-height stage, so while pinned its viewport position is
      // just its offset inside that stage
      const stage = el.closest<HTMLElement>("[data-clock-pin]") ?? section;
      const r = el.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top - stage.getBoundingClientRect().top + r.height / 2;
      const size = r.width * 2.3; // the clock body fills about 45% of a frame
      const length = Math.max(1, end - start);
      const docked: Pose = { x, y, size, rotate: 0, opacity: 1 };
      // rising keys move at scroll speed, so the clock rides up with the stage until it pins
      keys.push(
        { at: start - vh * 0.75, pose: { ...docked, y: y + vh * 0.75, opacity: 0 }, seq: "shatter", frame: SHATTER_END, ease: "linear" },
        { at: start - vh * 0.6, pose: { ...docked, y: y + vh * 0.6 }, seq: "shatter", frame: SHATTER_END, ease: "linear" },
        { at: start, pose: docked, seq: "shatter", frame: 0, ease: "linear" },
        { at: start + length * 0.09, pose: { ...docked, size: r.width * 1.1, rotate: 90, opacity: 0 }, seq: "shatter", frame: 0, ease: "glide" },
      );
      return;
    }

    const pose = slotPose(el, i === 0);

    // ordinary slot. Rest poses alternate between the ends of the turn clip, counted back from
    // the stage so the slot before it rests on frame 0, the shatter clip's opening shot.
    const before = stageAt > i ? stageAt - 1 - i : 0;
    const frame = before % 2 === 0 ? 0 : TURN_END;
    // hold while the section fills the screen; short sections hold at their centre
    const holdStart = i === 0 ? Math.min(0, start) : end > start ? start : start + height / 2 - vh / 2;
    const holdEnd = Math.max(holdStart, end);
    keys.push(
      { at: holdStart, pose, seq: "turn", frame, ease: "glide", fly: true },
      { at: holdEnd, pose, seq: "turn", frame, ease: "linear" },
    );
  });
  return keys;
}

const ready = (img?: HTMLImageElement) => (img?.complete && img.naturalWidth > 0 ? img : undefined);

// closest frame that has finished loading, so a slow network shows a nearby angle, not a gap
function nearest(list: HTMLImageElement[], i: number) {
  for (let d = 0; d < list.length; d++) {
    const img = ready(list[i - d]) ?? ready(list[i + d]);
    if (img) return img;
  }
}

export default function ScrollClock() {
  const pathname = usePathname();
  const reduce = useReducedMotion() ?? false;
  const { scrollY } = useScroll();
  // springy follow so wheel steps and trackpad flicks turn into one continuous motion
  const smoothY = useSpring(scrollY, { stiffness: 90, damping: 24, mass: 0.6 });
  const route = useMotionValue<Key[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const images = useRef<Record<Seq, HTMLImageElement[]>>({ turn: [], shatter: [] });
  const drawn = useRef("");

  // re-plan the route whenever the page reflows (fonts, images, resize)
  useEffect(() => {
    const measure = () => route.set(buildRoute());
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pathname, route]);

  const leg = useTransform(() => {
    const raw = scrollY.get();
    const smooth = smoothY.get();
    return sample(route.get(), reduce ? raw : smooth, reduce);
  });

  // paint the current frame, cross-fading into the next one for sub-frame scroll positions
  const draw = useCallback(
    (force = false) => {
      const p = leg.get();
      const ctx = canvasRef.current?.getContext("2d");
      if (!p || !ctx || p.opacity <= 0.001) return;
      const key = `${p.seq}:${p.frame.toFixed(2)}`;
      if (key === drawn.current && !force) return;
      const list = images.current[p.seq];
      const base = Math.floor(p.frame);
      const frac = p.frame - base;
      // the shatter clip loads last; until it has, hold the turn's opening frame (same shot)
      const a = nearest(list, base) ?? ready(images.current.turn[0]);
      if (!a) return;
      drawn.current = key;
      const { width, height } = ctx.canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = 1;
      ctx.drawImage(a, 0, 0, width, height);
      const b = frac > 0.02 ? ready(list[base + 1]) : undefined;
      if (b) {
        ctx.globalAlpha = frac;
        ctx.drawImage(b, 0, 0, width, height);
      }
    },
    [leg],
  );
  useMotionValueEvent(leg, "change", () => draw());

  // load the turn first; the shatter sits further down the page so it can follow after
  useEffect(() => {
    let cancelled = false;
    const load = (seq: Seq) =>
      Array.from({ length: FRAMES[seq].count }, (_, i) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => !cancelled && draw(true);
        img.src = frameSrc(seq, i);
        return img;
      });
    const turn = load("turn");
    images.current.turn = turn;
    Promise.allSettled(turn.map((img) => img.decode())).then(() => {
      if (!cancelled) images.current.shatter = load("shatter");
    });
    return () => {
      cancelled = true;
    };
  }, [draw]);

  const width = useTransform(() => leg.get()?.size ?? 0);
  const x = useTransform(() => {
    const p = leg.get();
    return p ? p.x - p.size / 2 : 0;
  });
  const y = useTransform(() => {
    const p = leg.get();
    return p ? p.y - p.size / 2 : 0;
  });
  const rotate = useTransform(() => leg.get()?.rotate ?? 0);
  const opacity = useTransform(() => leg.get()?.opacity ?? 0);

  return (
    <motion.div
      aria-hidden
      style={{ x, y, width, rotate, opacity }}
      className="pointer-events-none fixed left-0 top-0 z-10 aspect-square"
    >
      <div className="absolute inset-[16%] rounded-full bg-[radial-gradient(closest-side,rgba(243,150,60,0.16),transparent)] blur-2xl" />
      <canvas
        ref={canvasRef}
        width={FRAMES.turn.width}
        height={FRAMES.turn.height}
        className="absolute left-0 top-1/2 w-full -translate-y-1/2"
      />
    </motion.div>
  );
}
