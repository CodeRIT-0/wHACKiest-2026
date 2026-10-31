import SplitSection from "../SplitSection";
import { Gear } from "../decor/Decor";
import NixieClock from "./about/NixieClock";

// Just the vintage Nixie clock, counting down to wHACKiest 2026. The About story plays in the hero;
// this section is pulled up into the screen the hero leaves empty after its shatter, so the clock
// rises in under the falling gears (only when the hero is pinned, i.e. not with reduced motion).
export default function About() {
  return (
    <SplitSection
      id="about"
      className="motion-safe:-mt-[55svh]"
      backdrop={
        <div data-parallax="0.3" className="absolute inset-0 text-ink/[0.07]">
          <Gear teeth={18} speed={-0.04} className="-left-28 top-1/3 w-72" />
          <Gear teeth={11} speed={0.06} className="-right-12 bottom-8 w-44" />
        </div>
      }
    >
      <div className="relative">
        <div data-trace className="absolute inset-x-0 top-8" />
        <NixieClock />
      </div>
    </SplitSection>
  );
}
