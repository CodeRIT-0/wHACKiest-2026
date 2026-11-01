"use client";

import { useEffect, useId, useRef } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { CIRCUIT_WIDTH, timelineStations } from "./timeline-layout";
import { clamp } from "./useCircuitProgress";
import { circuitHardwareGeometry } from "./timeline-geometry";
import styles from "./Timeline.module.css";

/** Bundled conductors physically join neighbouring components into one board. */
function CircuitInterconnect({
  index,
  journey,
  designHeight,
  reducedMotion,
}: {
  index: number;
  journey: MotionValue<number>;
  designHeight: number;
  reducedMotion: boolean;
}) {
  const left = timelineStations[index].x;
  const right = timelineStations[index + 1].x;
  const firstY = circuitHardwareGeometry(index, designHeight).cy;
  const lastY = circuitHardwareGeometry(index + 1, designHeight).cy;
  const midpoint = (left + right) / 2;
  const direction = lastY >= firstY ? 1 : -1;
  const draw = useTransform(journey, [index, index + 1], [0, 1]);
  const complete = useTransform(journey, (value) =>
    value >= index + 1 ? 1 : 0,
  );
  const signalLength = useTransform(draw, (value) => Math.min(0.09, value));
  const signalOffset = useTransform(draw, (value) => Math.max(0, value - 0.09));
  const signalOpacity = useTransform(draw, (value) =>
    value > 0 && value < 1 ? 1 : 0,
  );
  return (
    <g
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
      data-interconnect={index}
    >
      {[-3, -2, -1, 0, 1, 2, 3].map((lane) => {
        const y1 = firstY + lane * 7;
        const y2 = lastY + lane * 7;
        const turn = midpoint + lane * 8;
        const d =
          Math.abs(y2 - y1) < 44
            ? `M${left + 18} ${y1}H${turn - 32}L${turn} ${y1 + 24}H${turn + 40}L${turn + 72} ${y2}H${right - 18}`
            : `M${left + 18} ${y1}H${turn - 22}L${turn} ${y1 + direction * 22}V${y2 - direction * 22}L${turn + 22} ${y2}H${right - 18}`;
        return (
          <g key={lane}>
            <path d={d} className={styles.interconnectBase} />
            <motion.path
              d={d}
              className={styles.interconnectPowered}
              style={{
                pathLength: reducedMotion ? 1 : draw,
                opacity: reducedMotion ? complete : 1,
              }}
            />
            {lane === 0 && !reducedMotion && (
              <motion.path
                d={d}
                className={styles.interconnectSignal}
                style={{
                  pathLength: signalLength,
                  pathOffset: signalOffset,
                  opacity: signalOpacity,
                }}
              />
            )}
          </g>
        );
      })}
      <g transform={`translate(${midpoint} ${(firstY + lastY) / 2 + 73})`}>
        <path
          d="M0-16V-4M-8-4H8M-8 3H8M0 3V16"
          className={styles.chipFanBase}
        />
        <text x="13" y="4" className={styles.interconnectLabel}>
          C{index + 1} / 10nF
        </text>
      </g>
      <circle
        cx={left + 178}
        cy={firstY + 21}
        r="3.2"
        className={styles.interconnectPad}
      />
      <circle
        cx={right - 178}
        cy={lastY - 21}
        r="3.2"
        className={styles.interconnectPad}
      />
    </g>
  );
}

function CircuitCluster({
  index,
  progress,
  active,
  id,
  reducedMotion,
  designHeight,
}: {
  index: number;
  progress: MotionValue<number>;
  active: number;
  id: string;
  reducedMotion: boolean;
  designHeight: number;
}) {
  const station = timelineStations[index];
  const { axis, below, direction, cy, image, fanReach } =
    circuitHardwareGeometry(index, designHeight);
  const start = station.progress;
  const end = Math.min(1, start + 0.1);
  const draw = useTransform(progress, [start, end], [0, 1]);
  const power = useTransform(progress, (value) => (value >= end ? 1 : 0));
  const state =
    index === active ? "active" : index < active ? "complete" : "upcoming";
  const paths = [
    ...[-3, -2, -1, 1, 2, 3].map(
      (lane) =>
        `M${lane * 8} ${cy}V${cy + direction * Math.min(40, fanReach * 0.3)}L${lane * 29} ${cy + direction * Math.min(95, fanReach * 0.7)}V${cy + direction * (fanReach + Math.abs(lane % 2) * 18)}`,
    ),
    ...[-1, 1].flatMap((side) =>
      [0, 1, 2].map(
        (lane) =>
          `M${side * 32} ${cy + direction * lane * 7}H${side * (70 + lane * 9)}L${side * (117 + lane * 15)} ${cy + direction * Math.min(48 + lane * 13, fanReach)}H${side * (230 + lane * 20)}`,
      ),
    ),
  ];
  const asset = station.asset;
  const imageSize = { w: image.width, h: image.height };
  const face = image.width * 0.43;
  const technicalNote = [
    "GERMANIUM / 5V IN",
    "CARBON FILM / 220 OHM",
    "LOGIC ARRAY / REV. 26",
    "100uF / ENERGY STORE",
    "OUTPUT / 5V STABLE",
  ][index];
  return (
    <g
      transform={`translate(${station.x} 0)`}
      className={styles.cluster}
      data-state={state}
    >
      <path d={`M0 ${axis}V${cy}`} className={styles.clusterLead} />
      <g fill="none" strokeLinejoin="round">
        {paths.map((d, i) => (
          <g key={d}>
            <path d={d} className={styles.baseTrace} />
            <motion.path
              d={d}
              className={styles.poweredTrace}
              style={{
                pathLength: reducedMotion ? 1 : draw,
                opacity: reducedMotion ? power : 1,
              }}
            />
            {i < 6 && (
              <circle
                cx={[-3, -2, -1, 1, 2, 3][i] * 29}
                cy={
                  cy +
                  direction *
                    (fanReach + Math.abs([-3, -2, -1, 1, 2, 3][i] % 2) * 18)
                }
                r="3"
                className={styles.testPoint}
              />
            )}
            <motion.circle
              cx={
                i < 6
                  ? [-3, -2, -1, 1, 2, 3][i] * 29
                  : (i < 9 ? -1 : 1) * (230 + ((i - 6) % 3) * 20)
              }
              cy={
                cy +
                direction *
                  (i < 6
                    ? fanReach + Math.abs([-3, -2, -1, 1, 2, 3][i] % 2) * 18
                    : Math.min(48 + ((i - 6) % 3) * 13, fanReach))
              }
              r="2.7"
              className={styles.poweredPad}
              style={{ opacity: reducedMotion ? power : draw }}
            />
          </g>
        ))}
      </g>
      <ellipse
        cx="0"
        cy={cy}
        rx="128"
        ry={Math.max(1, Math.min(107, cy - 12, designHeight - cy - 12))}
        className={styles.componentGlow}
        fill={`url(#${id}-warmth)`}
      />
      {/* href is set by TimelineCircuit once the timeline is near (an SVG <image> can't lazy-load) */}
      <image
        data-src={`/images/circuit/retro-${asset}.webp`}
        x={-imageSize.w / 2}
        y={cy - imageSize.h / 2}
        width={imageSize.w}
        height={imageSize.h}
        className={styles.componentPhoto}
        data-retro-asset={asset}
      />
      {asset === "chip" && (
        <>
          <rect
            x={-face / 2}
            y={cy - face / 2 - 2}
            width={face}
            height={face}
            className={styles.chipScreen}
          />
          <g className={styles.chipWords} textAnchor="middle">
            {(index === 4
              ? ["MISSION", "COMPLETE", "5V / OUT"]
              : ["EVERY", "SECOND", "COUNTS."]
            ).map((line, i) => (
              <text
                key={line}
                x="0"
                y={cy + (i - 1) * face * 0.2}
                style={{ fontSize: Math.max(5, face * 0.12) }}
              >
                {line}
              </text>
            ))}
          </g>
        </>
      )}
      <text
        x={imageSize.w / 2 + 16}
        y={cy + 3}
        className={styles.componentLabel}
        textAnchor="start"
      >
        {station.component}
      </text>
      <text
        x={imageSize.w / 2 + 16}
        y={cy + 16}
        className={styles.componentSpec}
      >
        {technicalNote}
      </text>
    </g>
  );
}

export function TimelineCircuit({
  progress,
  journey,
  signalX,
  activeIndex,
  reducedMotion,
  designHeight,
}: {
  progress: MotionValue<number>;
  journey: MotionValue<number>;
  signalX: MotionValue<number>;
  activeIndex: number;
  reducedMotion: boolean;
  designHeight: number;
}) {
  const id = useId().replace(/:/g, "");
  const axis = designHeight / 2;
  const first = timelineStations[0].x;
  const last = timelineStations[4].x;
  const draw = useTransform(signalX, (x) =>
    clamp((x - first) / (last - first)),
  );
  const tail = useTransform(draw, (value) => Math.min(0.065, value));
  const offset = useTransform(draw, (value) => Math.max(0, value - 0.065));
  const axisPath = `M${first} ${axis}H${last}`;

  // the component photos (~230 KB) load once the timeline is within a couple of screens. An SVG
  // <image> ignores lazy loading, and before the page has hydrated it is short enough that these
  // were fetched alongside the hero, slowing its first paint on a phone connection
  const svgRef = useRef<SVGSVGElement>(null);
  const near = useRef(false);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const show = () =>
      svg.querySelectorAll<SVGImageElement>("image[data-src]").forEach((img) => {
        if (!img.getAttribute("href")) img.setAttribute("href", img.dataset.src!);
      });
    if (near.current) return show();
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.current = true;
        show();
        observer.disconnect();
      },
      { rootMargin: "200% 0px" },
    );
    observer.observe(svg);
    return () => observer.disconnect();
  }, [designHeight]);

  return (
    <svg
      ref={svgRef}
      className={styles.circuit}
      viewBox={`0 0 ${CIRCUIT_WIDTH} ${designHeight}`}
      role="img"
      aria-labelledby={`${id}-title ${id}-desc`}
    >
      <title id={`${id}-title`}>Five connected retro circuit stations</title>
      <desc id={`${id}-desc`}>
        The entire circuit landscape travels horizontally as you scroll,
        following an electrical signal from registration through the final
        reveal. Each station has vintage component imagery and branching
        conductive wires.
      </desc>
      <defs>
        <radialGradient id={`${id}-warmth`}>
          <stop stopColor="#FF8A24" stopOpacity=".4" />
          <stop offset="1" stopColor="#FF8A24" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d={`M40 ${axis}H${CIRCUIT_WIDTH - 40}`}
        className={styles.axisBase}
      />
      <motion.path
        d={axisPath}
        className={styles.axisPowered}
        style={{ pathLength: draw }}
        data-current-path
      />
      {[0, 1, 2, 3].map((index) => (
        <CircuitInterconnect
          key={index}
          index={index}
          journey={journey}
          designHeight={designHeight}
          reducedMotion={reducedMotion}
        />
      ))}
      {timelineStations.map((station, index) => (
        <CircuitCluster
          key={index}
          index={index}
          progress={progress}
          active={activeIndex}
          id={id}
          reducedMotion={reducedMotion}
          designHeight={designHeight}
        />
      ))}
      {timelineStations.map((station, index) => (
        <g
          key={index}
          className={styles.station}
          data-state={
            index === activeIndex
              ? "active"
              : index < activeIndex
                ? "complete"
                : "upcoming"
          }
          data-circuit-node={index}
        >
          <circle
            cx={station.x}
            cy={axis}
            r="22"
            className={styles.stationHalo}
          />
          <circle
            cx={station.x}
            cy={axis}
            r="11"
            className={styles.stationNode}
          />
          <circle
            cx={station.x}
            cy={axis}
            r="4"
            className={styles.stationCore}
          />
        </g>
      ))}
      {!reducedMotion && (
        <>
          <motion.path
            d={axisPath}
            className={styles.signalGlow}
            style={{ pathLength: tail, pathOffset: offset }}
          />
          <motion.path
            d={axisPath}
            className={styles.currentTrail}
            style={{ pathLength: tail, pathOffset: offset }}
          />
          <motion.circle
            cy={axis}
            r="5"
            className={styles.currentHead}
            style={{ cx: signalX }}
            data-current-head
          />
        </>
      )}
    </svg>
  );
}
