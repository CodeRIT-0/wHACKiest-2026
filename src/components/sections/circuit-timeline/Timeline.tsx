"use client";

import { useId, useState, type CSSProperties, type ReactNode } from "react";
import {
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "motion/react";
import { TimelineCircuit } from "./TimelineCircuit";
import CheckpointCountdown from "./CheckpointCountdown";
import { timelineCheckpoints, type TimelineCheckpoints } from "./timeline-data";
import { CIRCUIT_WIDTH, timelineStations } from "./timeline-layout";
import {
  useCircuitProgress,
  useTimelineHydrated,
  useTimelineReducedMotion,
} from "./useCircuitProgress";
import styles from "./Timeline.module.css";

type TimelineProps = {
  id?: string;
  checkpoints?: TimelineCheckpoints;
  datesAreTentative?: boolean;
};

function CheckpointContent({
  index,
  journey,
  reducedMotion,
  hydrated,
  children,
}: {
  index: number;
  journey: MotionValue<number>;
  reducedMotion: boolean;
  hydrated: boolean;
  children: ReactNode;
}) {
  const opacity = useTransform(() =>
    !hydrated || reducedMotion || index === 0
      ? 1
      : Math.max(0, Math.min(1, (journey.get() - index + 0.55) / 0.55)),
  );
  return (
    <motion.div
      className={styles.windowBody}
      style={{ opacity }}
      data-checkpoint-content={index}
      data-native-scroll
    >
      {children}
    </motion.div>
  );
}

export default function Timeline({
  id = "timeline",
  checkpoints = timelineCheckpoints,
  datesAreTentative = false,
}: TimelineProps) {
  const headingId = useId();
  const reducedMotion = useTimelineReducedMotion();
  const hydrated = useTimelineHydrated();
  const {
    sectionRef,
    viewportRef,
    progress,
    journey,
    signalX,
    cameraX,
    worldSize,
    goToStep,
  } = useCircuitProgress(reducedMotion);
  const [readout, setReadout] = useState({ percent: 0, activeIndex: 0 });
  const percentText = useTransform(
    progress,
    (value) =>
      `${Math.floor(value * 100 + 0.000001)
        .toString()
        .padStart(2, "0")}%`,
  );
  useMotionValueEvent(progress, "change", (value) => {
    const percent = Math.floor(value * 100 + 0.000001);
    const activeIndex = Math.max(
      0,
      timelineStations.filter((station) => value + 0.000001 >= station.progress)
        .length - 1,
    );
    setReadout((previous) =>
      previous.percent === percent && previous.activeIndex === activeIndex
        ? previous
        : { percent, activeIndex },
    );
  });

  return (
    <section
      ref={sectionRef}
      id={id}
      className={styles.timeline}
      data-progress={readout.percent}
      data-stage={readout.activeIndex}
      data-enhanced={hydrated}
      data-compact={worldSize.compact}
      data-tight={worldSize.cardRoom < 180}
      aria-labelledby={headingId}
    >
      <div className={styles.pinnedScene}>
        <div className={styles.sectionRule} aria-hidden="true">
          <span>03</span>
        </div>
        <header className={styles.headingBar}>
          <div>
            <p className={styles.eyebrow}>THE TIMELINE / FOLLOW THE CURRENT</p>
            <h2 id={headingId}>
              EVERY MILESTONE <span>MATTERS.</span>
            </h2>
          </div>
          <div className={styles.era}>
            <span>1950s—1960s</span>
            <strong>THE TRANSISTOR AGE</strong>
            <small>
              {datesAreTentative
                ? "PLANNING DATES / NOT CONFIRMED"
                : "EVENT SCHEDULE / IST"}
            </small>
          </div>
        </header>
        <div ref={viewportRef} className={styles.viewport}>
          <motion.div
            className={styles.artboard}
            data-journey-world
            style={{
              width: worldSize.width,
              height: worldSize.height,
              x: hydrated ? cameraX : 0,
            }}
          >
            <TimelineCircuit
              progress={progress}
              journey={journey}
              signalX={signalX}
              activeIndex={readout.activeIndex}
              reducedMotion={reducedMotion}
              designHeight={worldSize.designHeight}
            />
            <ol className={styles.checkpoints}>
              {checkpoints.map((event, index) => {
                const station = timelineStations[index];
                const state =
                  index === readout.activeIndex
                    ? "active"
                    : index < readout.activeIndex
                      ? "complete"
                      : "upcoming";
                const [day, ...rest] = event.date.split(" ");
                return (
                  <li
                    key={event.id}
                    className={styles.checkpoint}
                    data-state={state}
                    data-placement={station.placement}
                    aria-current={state === "active" ? "step" : undefined}
                    style={
                      {
                        "--station-left": `${(station.x / CIRCUIT_WIDTH) * 100}%`,
                        "--axis-gap": `${worldSize.gap}px`,
                        "--card-room": `${worldSize.cardRoom}px`,
                        "--connector-height": `${Math.max(0, worldSize.gap - 11 * worldSize.scale)}px`,
                      } as CSSProperties
                    }
                  >
                    <div className={styles.windowBar}>
                      <span>CHECKPOINT 0{index + 1}</span>
                      <span className={styles.windowState}>
                        {state === "active"
                          ? "SIGNAL ACTIVE"
                          : state === "complete"
                            ? "CONNECTED"
                            : "NEXT SIGNAL"}
                        <i />
                        <i />
                        <i />
                      </span>
                    </div>
                    <CheckpointContent
                      index={index}
                      journey={journey}
                      reducedMotion={reducedMotion}
                      hydrated={hydrated}
                    >
                      <div className={styles.dateRow}>
                        <time
                          dateTime={event.dateTime}
                          className={styles.dateStamp}
                        >
                          <strong>{day}</strong>
                          <span>
                            {rest.join(" ")}
                            <small>{event.time} IST</small>
                          </span>
                        </time>
                        <CheckpointCountdown dateTime={event.dateTime} />
                      </div>
                      <h3>{event.title}</h3>
                      <p>{event.description}</p>
                      <div className={styles.cardFooter}>
                        <span>{event.tag}</span>
                        <span aria-hidden="true">↗</span>
                      </div>
                      {datesAreTentative && (
                        <span className={styles.placeholderNote}>
                          PLANNING DATE / NOT CONFIRMED
                        </span>
                      )}
                    </CheckpointContent>
                    <span className={styles.cornerTL} aria-hidden="true" />
                    <span className={styles.cornerBR} aria-hidden="true" />
                  </li>
                );
              })}
            </ol>
          </motion.div>
          <div className={styles.edgeLeft} aria-hidden="true" />
          <div className={styles.edgeRight} aria-hidden="true" />
        </div>
        <footer className={styles.navigationBar}>
          <div
            className={styles.signalStatus}
            role="progressbar"
            aria-label="Circuit journey progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={readout.percent}
          >
            <i />
            <span>
              {readout.percent === 100
                ? "CIRCUIT COMPLETE"
                : `SIGNAL 00${readout.activeIndex + 1}`}
            </span>
            <motion.span>{percentText}</motion.span>
          </div>
          <nav className={styles.stageNav} aria-label="Timeline checkpoints">
            <button
              type="button"
              onClick={() => goToStep(readout.activeIndex - 1)}
              disabled={readout.activeIndex === 0}
              aria-label="Previous timeline checkpoint"
            >
              ←
            </button>
            <div className={styles.stageDots}>
              {checkpoints.map((event, index) => (
                <button
                  key={event.id}
                  type="button"
                  className={styles.stageDot}
                  onClick={() => goToStep(index)}
                  aria-label={`Checkpoint ${index + 1}: ${event.title}`}
                  aria-current={
                    index === readout.activeIndex ? "step" : undefined
                  }
                >
                  <span />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => goToStep(readout.activeIndex + 1)}
              aria-label={
                readout.activeIndex === 4
                  ? "Continue to the next section"
                  : "Next timeline checkpoint"
              }
            >
              →
            </button>
          </nav>
          <div className={styles.stageCount}>
            <strong>0{readout.activeIndex + 1}</strong>
            <span> / 05 CHECKPOINTS</span>
          </div>
        </footer>
        <div className={styles.exit} data-timeline-exit aria-hidden="true">
          <span>SCROLL TO TRAVEL THROUGH THE CIRCUIT →</span>
          <span>EVERY SECOND COUNTS.</span>
        </div>
      </div>
    </section>
  );
}
