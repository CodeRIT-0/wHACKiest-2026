"use client";

import Image from "next/image";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Gear } from "../ui/era-art";
import { mechanicalEngine } from "@/lib/illustrations";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./HeroExperience.module.css";

type HeroMotion = {
  x: MotionValue<number>;
  y: MotionValue<number>;
  enabled: boolean;
};
const HeroMotionContext = createContext<HeroMotion | null>(null);

/** Pointer motion stays in MotionValues; moving the cursor never re-renders the copy. */
export function HeroExperience({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, { amount: 0.06, margin: "-112px 0px 0px 0px" });
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const hover = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 100, damping: 25, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 100, damping: 25, mass: 0.5 });
  const haloX = useTransform(x, [-1, 1], [-18, 18]);
  const haloY = useTransform(y, [-1, 1], [-12, 12]);
  const reticleLeft = useTransform(x, (value) => `${(value + 1) * 50}%`);
  const reticleTop = useTransform(y, (value) => `${(value + 1) * 50}%`);
  const reticleOpacity = useSpring(hover, { stiffness: 110, damping: 25 });
  const enabled = !reduced && !paused && visible && inView;
  const context = useMemo(() => ({ x, y, enabled }), [x, y, enabled]);

  useEffect(() => {
    const update = () => setVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    if (!enabled) {
      rawX.set(0);
      rawY.set(0);
      hover.set(0);
    }
  }, [enabled, rawX, rawY, hover]);

  function resetPointer() {
    rawX.set(0);
    rawY.set(0);
    hover.set(0);
  }
  function movePointer(event: PointerEvent<HTMLElement>) {
    if (!enabled || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    rawX.set(
      Math.max(
        -1,
        Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1),
      ),
    );
    rawY.set(
      Math.max(
        -1,
        Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1),
      ),
    );
    hover.set(0.6);
  }

  return (
    <HeroMotionContext.Provider value={context}>
      <section
        ref={ref}
        id="home"
        className={`hero-section ${styles.scene}`}
        data-hero-running={enabled}
        data-hero-reduced={reduced}
        onPointerMove={movePointer}
        onPointerLeave={resetPointer}
      >
        <motion.div
          className={styles.backdrop}
          style={{ x: reduced ? 0 : haloX, y: reduced ? 0 : haloY }}
          aria-hidden="true"
        >
          <div className={styles.blueprintGrid} />
          <Gear className={`${styles.gear} ${styles.gearOne}`} />
          <Gear className={`${styles.gear} ${styles.gearTwo}`} />
          <Gear className={`${styles.gear} ${styles.gearThree}`} />
          <svg
            className={styles.schematic}
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
          >
            <g className={styles.dial}>
              <circle cx="860" cy="410" r="292" />
              <circle cx="860" cy="410" r="270" strokeDasharray="1 11" />
              {Array.from({ length: 60 }, (_, i) => (
                <path
                  key={i}
                  d={`M860 118V${i % 5 === 0 ? 134 : 125}`}
                  transform={`rotate(${i * 6} 860 410)`}
                />
              ))}
            </g>
            <g className={styles.orbitCarrier}>
              <circle
                cx="860"
                cy="118"
                r="5"
                fill="#FD9C36"
                stroke="#FFF9EC"
                strokeWidth="2"
              />
              <circle cx="860" cy="702" r="3" fill="#0357D6" />
            </g>
            <g className={`${styles.orbitCarrier} ${styles.orbitReverse}`}>
              <circle
                cx="1130"
                cy="410"
                r="4"
                fill="#0357D6"
                stroke="#FFF9EC"
                strokeWidth="2"
              />
            </g>
            <path
              className={styles.wire}
              d="M30 660H185L225 620H520L560 660H800L840 620H1170"
            />
            <path
              className={styles.signal}
              d="M30 660H185L225 620H520L560 660H800L840 620H1170"
            />
            <g className={styles.terminals}>
              {[30, 185, 520, 800, 1170].map((n) => (
                <circle
                  key={n}
                  cx={n}
                  cy={n === 520 || n === 1170 ? 620 : 660}
                  r="3"
                />
              ))}
            </g>
          </svg>
        </motion.div>
        <motion.div
          className={styles.reticle}
          style={{
            left: reticleLeft,
            top: reticleTop,
            opacity: reduced ? 0 : reticleOpacity,
          }}
          aria-hidden="true"
        >
          <i />
          <span>+</span>
        </motion.div>
        {children}
        {!reduced && (
          <div className={styles.motionControls}>
            <span className={styles.pointerHint}>
              MOVE TO EXPLORE THE MECHANISM
            </span>
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-pressed={paused}
              aria-label={
                paused ? "Resume hero animation" : "Pause hero animation"
              }
            >
              <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
              {paused ? "MOTION PAUSED" : "MOTION ON"}
            </button>
          </div>
        )}
      </section>
    </HeroMotionContext.Provider>
  );
}

/** The photograph floats independently from its pointer-responsive perspective layer. */
export function HeroMachine() {
  const context = useContext(HeroMotionContext);
  if (!context) throw new Error("HeroMachine must be inside HeroExperience");
  return <MachineLayer {...context} />;
}

function MachineLayer({ x, y, enabled }: HeroMotion) {
  const translateX = useTransform(x, [-1, 1], [-11, 11]);
  const translateY = useTransform(y, [-1, 1], [-7, 7]);
  const rotateX = useTransform(y, [-1, 1], [1.6, -1.6]);
  const rotateY = useTransform(x, [-1, 1], [-2, 2]);
  return (
    <motion.div
      className={styles.machineParallax}
      data-hero-machine-layer
      style={{
        x: enabled ? translateX : 0,
        y: enabled ? translateY : 0,
        rotateX: enabled ? rotateX : 0,
        rotateY: enabled ? rotateY : 0,
        transformPerspective: 1000,
      }}
    >
      <div className={styles.machineFloat}>
        <Image
          src={mechanicalEngine}
          alt="An intricate brass mechanical computer with clock dials and interlocking gears"
          preload
          className="hero-machine"
          sizes="(max-width: 800px) 100vw, 60vw"
        />
      </div>
    </motion.div>
  );
}
