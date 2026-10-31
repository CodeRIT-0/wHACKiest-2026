import { Suspense } from "react";
import Hero from "@/components/sections/Hero";
import Timeline from "@/components/sections/circuit-timeline/Timeline";
import TrackLab from "@/components/sections/TrackLab";
import Prizes from "@/components/sections/Prizes";
import Sponsors from "@/components/sections/Sponsors";
import Procedure from "@/components/sections/Procedure";
import Faqs from "@/components/sections/Faqs";
import Team from "@/components/sections/Team";
import Join from "@/components/sections/Join";
import CircuitSpine from "@/components/system/CircuitSpine";
import ScrollMotion from "@/components/system/ScrollMotion";
import EraDivider from "@/components/EraDivider";

// One scroll through computing history: 1946 (Hero) to 2026 (Join). Order matters: each section
// is a stop in src/lib/eras.ts, which sets its colours and the era rail's year.
//
// Each section below the hero sits in its own Suspense boundary. Nothing in them suspends (they're
// all in the static HTML); the boundaries are there so React hydrates the page a section at a time,
// handing the main thread back in between, instead of in one long block that freezes a phone for
// a second or two after load (and lets the hero, the only thing on screen, come alive first).
const Lazy = ({ children }: { children: React.ReactNode }) => <Suspense fallback={null}>{children}</Suspense>;

export default function Home() {
  return (
    <>
      <CircuitSpine />
      <ScrollMotion />
      <Hero />
      {/* the circuit spine starts where the hero's shards land */}
      <div data-trace aria-hidden className="relative mx-auto h-px w-px" />
      {/* pulled up into the screen the hero leaves empty after its shatter, so the next era's year
          rises in under the falling gears (only when the hero is pinned, i.e. not with reduced motion) */}
      {/* (the pull only applies once the hero has pinned and made its scroll room; applied from the
          first paint, it put the year on screen and then shoved it down = a big layout shift) */}
      <div className="relative z-10 [[data-hero-pinned]_&]:-mt-[55svh]">
        <EraDivider era="timeline" />
      </div>
      {/* the circuit timeline (from the pranav-timeLine branch), straight before tracks */}
      <Lazy>
        <Timeline />
      </Lazy>
      <EraDivider era="tracks" direction="left" />
      <Lazy>
        <TrackLab />
      </Lazy>
      <Lazy>
        <Prizes />
      </Lazy>
      <Lazy>
        <Sponsors />
      </Lazy>
      {/* how to register + FAQs (from the roopinwork branch) */}
      <Lazy>
        <Procedure />
      </Lazy>
      <Lazy>
        <Faqs />
      </Lazy>
      <Lazy>
        <Team />
      </Lazy>
      <EraDivider era="join" direction="left" />
      <Lazy>
        <Join />
      </Lazy>
    </>
  );
}
