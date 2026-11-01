import { Suspense } from "react";
import Hero from "@/components/sections/Hero";
import Timeline from "@/components/sections/circuit-timeline/Timeline";
import TrackLab from "@/components/sections/TrackLab";
import Prizes from "@/components/sections/Prizes";
import Procedure from "@/components/sections/Procedure";
import Faqs from "@/components/sections/Faqs";
import Team from "@/components/sections/Team";
import Join from "@/components/sections/Join";
import CircuitSpine from "@/components/system/CircuitSpine";
import ScrollMotion from "@/components/system/ScrollMotion";
import HydrationMark from "@/components/system/HydrationMark";
import EraDivider from "@/components/EraDivider";
import SheetStack from "@/components/system/SheetStack";
import OffscreenPause from "@/components/system/OffscreenPause";

// One scroll through computing history: 1946 (Hero) to 2026 (Join). Order matters: each section
// is a stop in src/lib/eras.ts, which sets its colours and the era rail's year.
//
// Each section below the hero sits in its own Suspense boundary. Nothing in them suspends (they're
// all in the static HTML); the boundaries are there so React hydrates the page a section at a time,
// handing the main thread back in between, instead of in one long block that freezes a phone for
// a second or two after load (and lets the hero, the only thing on screen, come alive first).
// HydrationMark tells ScrollMotion when a boundary has hydrated, so it never styles server HTML early.
// (wide screens, where a section holds while the next sheet slides over it) a stretch of paper
// after a section's last content, so it is seen whole before the next sheet starts to cover it
const HOLD_ROOM = "[@media(min-width:1024px)_and_(hover:hover)]:pb-[28svh]";

const Lazy = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={null}>
    <HydrationMark />
    {children}
  </Suspense>
);

export default function Home() {
  return (
    <>
      <CircuitSpine />
      <ScrollMotion />
      <OffscreenPause />
      <Hero />
      {/* the circuit spine starts where the hero's shards land */}
      <div data-trace aria-hidden className="relative mx-auto h-px w-px" />
      {/* Light and dark alternate from here, as a stack of sheets: each dark section slides up over
          the light one before it (which holds, sinks back and dims), and each light one rises over
          the dark one with rounded paper corners. See SheetStack. */}
      {/* The first stack is pulled up into the screen the hero leaves empty after its shatter, so the
          next era's year rises in under the falling gears (only when the hero is pinned, i.e. not
          with reduced motion; applied from the first paint, it put the year on screen and then
          shoved it down = a big layout shift) */}
      {/* (the divider here is see-through, for the gears, so it holds but does not sink) */}
      <SheetStack sink={false} plain className="z-10 [[data-hero-pinned]_&]:-mt-[35svh]" under={<EraDivider era="timeline" />}>
        <Lazy>
          <Timeline />
        </Lazy>
      </SheetStack>
      <SheetStack
        under={
          <div className={`sheet sheet-light ${HOLD_ROOM}`}>
            <EraDivider era="tracks" direction="left" />
            <Lazy>
              <TrackLab />
            </Lazy>
          </div>
        }
      >
        <Lazy>
          <Prizes />
        </Lazy>
      </SheetStack>
      <SheetStack
        under={
          <div className={`sheet sheet-light ${HOLD_ROOM}`}>
            {/* how to register (from the roopinwork branch) */}
            <Lazy>
              <Procedure />
            </Lazy>
          </div>
        }
      >
        <Lazy>
          <Faqs />
        </Lazy>
      </SheetStack>
      <SheetStack
        under={
          <div className={`sheet sheet-light ${HOLD_ROOM}`}>
            <Lazy>
              <Team />
            </Lazy>
            <EraDivider era="join" direction="left" />
          </div>
        }
      >
        <Lazy>
          <Join />
        </Lazy>
      </SheetStack>
    </>
  );
}
