import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
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
export default function Home() {
  return (
    <>
      <CircuitSpine />
      <ScrollMotion />
      <Hero />
      {/* the circuit spine starts where the hero's shards land */}
      <div data-trace aria-hidden className="relative mx-auto h-px w-px" />
      <About />
      <EraDivider era="timeline" />
      {/* the circuit timeline (from the pranav-timeLine branch), straight before tracks */}
      <Timeline />
      <EraDivider era="tracks" direction="left" />
      <TrackLab />
      <Prizes />
      <Sponsors />
      {/* how to register + FAQs (from the roopinwork branch) */}
      <Procedure />
      <Faqs />
      <Team />
      <EraDivider era="join" direction="left" />
      <Join />
    </>
  );
}
