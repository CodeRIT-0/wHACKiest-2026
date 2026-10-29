import Link from "next/link";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import DepthText from "@/components/ui/DepthText";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-[80vh] items-center overflow-hidden border-b border-line px-6"
    >
      <AnimatedGridPattern
        className="pointer-events-none absolute inset-x-0 inset-y-[-30%] -z-10 h-[200%] w-full skew-y-12 text-accent [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
        numSquares={30}
        maxOpacity={0.16}
        duration={3}
        repeatDelay={1}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1100px]">
        <p className="text-xs uppercase tracking-[0.15em] text-muted">
          CodeRIT presents
        </p>

        <h1 className="mt-2 max-w-full leading-none">
          <DepthText
            text="wHACKiest"
            layers={34}
            depth={2.4}
            depthColor="#8f4227"
            hoverPush={0.25}
            tilt={5}
            pointerTracking
            smoothing={0.14}
            perspective={900}
            autoOrbit
            orbitSpeed={0.12}
            fontSize="clamp(3rem, 12vw, 7rem)"
            fontWeight={900}
            shadow
            intro
            faceColor="#c4572d"
            className="max-w-full"
          />
          <span className="block text-accent">
            <DepthText
              text="2026"
              layers={24}
              depth={2.4}
              depthColor="#d96532"
              hoverPush={0.5}
              tilt={7.5}
              pointerTracking
              smoothing={0.14}
              perspective={900}
              autoOrbit
              orbitSpeed={0.35}
              fontSize="clamp(2.5rem, 8vw, 5rem)"
              fontWeight={900}
              shadow
              outline={false}
              intro
              faceColor="#e0662a"
            />
          </span>
        </h1>

        <p className="mt-4">Real problems. Bigger possibilities.</p>

        <Link
          href="/register"
          className="mt-6 inline-block bg-ink px-5 py-3 text-sm font-semibold uppercase text-bg"
        >
          Register now
        </Link>
      </div>
    </section>
  );
}
