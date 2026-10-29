"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import "./EchoText.css";

type Direction = "right" | "left" | "up" | "down" | "diagonal";
type Mode = "entrance" | "pointer" | "both";
type Trail = "pointer" | "auto" | "scroll";
type Ease = "linear" | "ease-out" | "ease-in-out" | "snappy";

type EchoTextProps = {
  text?: string;
  echoes?: number;
  lag?: number;
  offset?: number;
  direction?: Direction;
  fade?: number;
  blur?: number;
  tint?: string | false;
  echoColors?: [string, string];
  echoStyle?: "solid" | "outline";
  echoScale?: number;
  mode?: Mode;
  trail?: Trail;
  clickBurst?: boolean;
  cursorRadius?: number;
  duration?: number;
  ease?: Ease;
  fontSize?: string | number;
  fontWeight?: string | number;
  color?: string;
  className?: string;
  style?: CSSProperties;
};

const vectors: Record<Direction, [number, number]> = {
  right: [1, 0],
  left: [-1, 0],
  up: [0, -1],
  down: [0, 1],
  diagonal: [0.72, 0.72],
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const easing: Record<Ease, (value: number) => number> = {
  linear: (value) => value,
  "ease-out": (value) => 1 - (1 - value) ** 3,
  "ease-in-out": (value) =>
    value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2,
  snappy: (value) => 1 - (1 - value) ** 5,
};

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function EchoText({
  text = "Motion Echo",
  echoes = 12,
  lag = 0.24,
  offset = 36,
  direction = "right",
  fade = 0.72,
  blur = 3,
  tint = "#7dd3fc",
  echoColors,
  echoStyle = "solid",
  echoScale = 1,
  mode = "both",
  trail = "pointer",
  clickBurst = true,
  cursorRadius = 320,
  duration = 900,
  ease = "ease-out",
  fontSize = "clamp(3rem, 9vw, 7rem)",
  fontWeight = 800,
  color = "currentColor",
  className = "",
  style,
}: EchoTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const copyRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const count = reducedMotion ? 0 : clamp(Math.round(echoes), 0, 24);
  const indexes = useMemo(
    () => Array.from({ length: count }, (_, index) => count - index),
    [count],
  );

  const echoColor = (index: number) => {
    if (echoColors) {
      const progress = count > 1 ? (index - 1) / (count - 1) : 0;
      return `color-mix(in srgb, ${echoColors[1]} ${Math.round(progress * 100)}%, ${echoColors[0]})`;
    }
    return tint
      ? `color-mix(in srgb, ${tint} ${Math.min(72, 18 + index * 5)}%, currentColor)`
      : undefined;
  };

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!media) return;
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion || count === 0) return;

    const [vectorX, vectorY] = vectors[direction];
    const safeOffset = clamp(Number(offset) || 0, 0, 120);
    const safeRadius = clamp(Number(cursorRadius) || 320, 40, 1200);
    const safeLag = clamp(Number(lag) || 0.16, 0.02, 0.5);
    const safeFade = clamp(Number(fade) || 0.64, 0.1, 0.95);
    const safeBlur = clamp(Number(blur) || 0, 0, 16);
    const safeScale = clamp(Number(echoScale) || 1, 0.25, 2.5);
    const entrance = mode === "entrance" || mode === "both";
    const followsPointer = mode === "pointer" || mode === "both";
    const canFollow = followsPointer && trail !== "scroll" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const start = performance.now();
    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    const positions = Array.from({ length: count + 1 }, (_, index) => ({
      x: entrance ? vectorX * safeOffset * (index + 0.35) : 0,
      y: entrance ? vectorY * safeOffset * (index + 0.35) : 0,
    }));

    for (let index = 1; index <= count; index += 1) {
      const copy = copyRefs.current[index];
      if (copy) copy.style.filter = safeBlur ? `blur(${(safeBlur * index / count).toFixed(2)}px)` : "none";
    }

    const render = (now: number) => {
      const progress = entrance ? clamp((now - start) / Math.max(0, duration), 0, 1) : 1;
      const entranceRest = entrance ? 1 - easing[ease](progress) : 0;
      let activity = entranceRest;

      for (let index = 0; index <= count; index += 1) {
        const copy = copyRefs.current[index];
        if (!copy) continue;
        const current = positions[index];
        const amount = entranceRest * safeOffset * (index + 0.35);
        const desiredX = targetX + vectorX * amount;
        const desiredY = targetY + vectorY * amount;
        const follow = 1 - (1 - clamp(0.34 / (1 + index * safeLag * 4.2), 0.018, 0.36)) ** (16.67 / 16.67);
        current.x += (desiredX - current.x) * follow;
        current.y += (desiredY - current.y) * follow;
        const depth = count ? index / count : 0;
        const x = current.x;
        const y = current.y;
        copy.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${(1 + (safeScale - 1) * depth).toFixed(4)})`;
        if (index > 0) copy.style.opacity = String(Math.pow(safeFade, index) * Math.max(activity, 0.02));
        activity = Math.max(activity, Math.min(1, Math.hypot(desiredX - current.x, desiredY - current.y) / Math.max(1, safeOffset)));
      }

      if (progress < 1 || activity > 0.01 || (canFollow && (targetX !== 0 || targetY !== 0))) {
        frame = requestAnimationFrame(render);
      }
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const onPointerMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);
      const reach = clamp(distance / safeRadius, 0, 1);
      targetX = distance ? (dx / distance) * reach * safeOffset : 0;
      targetY = distance ? (dy / distance) * reach * safeOffset * 0.72 : 0;
      wake();
    };
    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) {
        targetX = 0;
        targetY = 0;
        wake();
      }
    };

    if (canFollow) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerout", onPointerOut);
    }
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
    };
  }, [blur, count, cursorRadius, direction, duration, ease, echoScale, fade, lag, mode, offset, reducedMotion]);

  return (
    <span
      ref={rootRef}
      className={`echo-text ${className}`.trim()}
      style={{ fontSize, fontWeight, color, cursor: clickBurst ? "pointer" : undefined, ...style }}
    >
      {indexes.map((index) => (
        <span
          aria-hidden="true"
          className={`echo-text__echo${echoStyle === "outline" ? " echo-text__echo--outline" : ""}`}
          key={`echo-${index}`}
          ref={(element) => { copyRefs.current[index] = element; }}
          style={{ color: echoColor(index), opacity: 0 }}
        >
          {text}
        </span>
      ))}
      <span className="echo-text__echo echo-text__echo--front" ref={(element) => { copyRefs.current[0] = element; }}>
        {text}
      </span>
    </span>
  );
}
