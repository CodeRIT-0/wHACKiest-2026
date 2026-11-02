"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type Variants } from "motion/react";
import { timelineCheckpoints, type TimelineCheckpoints } from "./timeline-data";
import { timelineStations } from "./timeline-layout";
import styles from "./TimelineMobile.module.css";

// The timeline on phones: the same five checkpoints and the same circuit language as the wide
// version, but laid out down the page and driven by ordinary scrolling (no pin, no sideways
// camera). A copper rail fills as you read, each checkpoint's pad lights and its branch draws out
// to the card, the card nearest the middle of the screen becomes the live one, and a small HUD
// rides along at the top with the current signal. Everything that moves is a transform or an
// opacity, so it stays smooth on a phone.

// where the rail starts: level with the first pad (keep in step with .rail top in the CSS)
const RAIL_TOP = 30;

const CARD: Variants = {
  hidden: { opacity: 0, x: 48, rotate: 1.5 },
  shown: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", stiffness: 160, damping: 22, mass: 0.9, staggerChildren: 0.07, delayChildren: 0.12 } },
};
const PART: Variants = {
  hidden: { opacity: 0, y: 14 },
  shown: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 26 } },
};

export default function TimelineMobile({ id = "timeline", checkpoints = timelineCheckpoints }: { id?: string; checkpoints?: TimelineCheckpoints }) {
  const headingId = useId();
  const reduce = useReducedMotion() ?? false;
  const listRef = useRef<HTMLOListElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [complete, setComplete] = useState(false);

  // the rail fills as the list passes a line 70% down the screen: its tip rides that line, a little
  // ahead of the live card, and the circuit closes while the end chip is still well in view
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 70%"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 260, damping: 40, mass: 0.4 });
  const fill = reduce ? scrollYProgress : smooth;
  const railHeight = useRef(0);
  const [height, setHeight] = useState(0);
  const tipY = useTransform(fill, (v) => v * height);
  const hudBar = useTransform(fill, (v) => Math.max(0.02, v));

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      // the rail runs from the first pad (RAIL_TOP down) to the bottom of the list
      const h = Math.max(0, list.offsetHeight - RAIL_TOP);
      if (railHeight.current === h) return;
      railHeight.current = h;
      setHeight(h);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    measure();
    return () => ro.disconnect();
  }, []);

  // the live checkpoint is whichever card is crossing the middle band of the screen
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => fill.on("change", (v) => setComplete((c) => (c === v >= 0.985 ? c : v >= 0.985))), [fill]);

  const current = checkpoints[active];

  return (
    <section id={id} className={styles.root} data-stage={active} aria-labelledby={headingId}>
      <div className={styles.rule} aria-hidden="true">
        <span>03</span>
      </div>

      <header className={styles.header}>
        <p className={styles.eyebrow}>THE TIMELINE / FOLLOW THE CURRENT</p>
        <h2 id={headingId}>
          EVERY MILESTONE <span>MATTERS.</span>
        </h2>
        <p className={styles.era}>
          <span>1950s—1960s</span> THE TRANSISTOR AGE <small>DATES TO BE ANNOUNCED</small>
        </p>
      </header>

      {/* rides along at the top while the list is on screen */}
      <div className={styles.hud} aria-hidden="true">
        <div className={styles.hudRow}>
          <i data-complete={complete || undefined} />
          <span className={styles.hudSignal}>{complete ? "CIRCUIT COMPLETE" : `SIGNAL 00${active + 1}`}</span>
          <span className={styles.hudTitle}>{current.title}</span>
          <strong>
            0{active + 1}
            <small>/05</small>
          </strong>
        </div>
        <motion.div className={styles.hudBar} style={{ scaleX: hudBar }} />
      </div>

      <div className={styles.track}>
      {/* the copper rail: a dim trace, the live current over it, and the signal at its tip */}
      <div className={styles.rail} aria-hidden="true">
        <motion.div className={styles.railLive} style={{ scaleY: fill }} />
        <motion.div className={styles.signal} style={{ y: tipY }} />
      </div>
      <ol ref={listRef} className={styles.list}>

        {checkpoints.map((event, i) => {
          const state = i === active ? "active" : i < active ? "complete" : "upcoming";
          const asset = timelineStations[i].asset;
          return (
            <motion.li
              key={event.id}
              ref={(el) => {
                items.current[i] = el;
              }}
              data-index={i}
              data-state={state}
              className={styles.item}
              aria-current={state === "active" ? "step" : undefined}
              variants={CARD}
              initial={reduce ? false : "hidden"}
              whileInView="shown"
              viewport={{ once: true, amount: 0.3 }}
            >
              <span className={styles.pad} aria-hidden="true">
                <span />
              </span>
              <span className={styles.branch} aria-hidden="true" />

              <motion.article className={styles.card} whileTap={reduce ? undefined : { scale: 0.985 }}>
                <div className={styles.bar}>
                  <span>CHECKPOINT 0{i + 1}</span>
                  <span className={styles.state}>
                    {state === "active" ? "SIGNAL ACTIVE" : state === "complete" ? "CONNECTED" : "NEXT SIGNAL"}
                    <i />
                    <i />
                    <i />
                  </span>
                </div>

                <div className={styles.body}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- small decorative art, lazy */}
                  <img className={styles.art} src={`/images/circuit/retro-${asset}.webp`} alt="" loading="lazy" decoding="async" data-asset={asset} />

                  <motion.div variants={PART} className={styles.dateRow}>
                    <div className={styles.date}>
                      <strong aria-hidden="true">?</strong>
                      <span>
                        <small>Date &amp; time</small>
                        To be announced
                      </span>
                    </div>
                  </motion.div>
                  <motion.h3 variants={PART}>{event.title}</motion.h3>
                  <motion.p variants={PART}>{event.description}</motion.p>
                  <motion.div variants={PART} className={styles.footer}>
                    <span>{event.tag}</span>
                    <span aria-hidden="true">↗</span>
                  </motion.div>
                </div>
              </motion.article>
            </motion.li>
          );
        })}
      </ol>
      </div>

      {/* the end of the line: the circuit closes once the rail reaches it */}
      <div className={styles.terminal} data-complete={complete || undefined} aria-hidden="true">
        <span className={styles.terminalChip}>
          <b>EVERY</b>
          <b>SECOND</b>
          <b>COUNTS.</b>
        </span>
        <span className={styles.terminalText}>{complete ? "CIRCUIT COMPLETE / SEE YOU AT THE BUILD" : "KEEP SCROLLING TO CLOSE THE CIRCUIT"}</span>
      </div>
    </section>
  );
}
