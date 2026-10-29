import Link from "next/link";
import Image from "next/image";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import CodeRitLogo from "@/components/ui/CodeRitLogo";
import DepthText from "@/components/ui/DepthText";
import EchoText from "@/components/ui/EchoText";
import clockImage from "@/app/clock-cutout.png";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden border-b border-line bg-bg px-6"
    >
      <AnimatedGridPattern
        className="pointer-events-none absolute inset-x-0 inset-y-[-30%] -z-10 h-[200%] w-full skew-y-12 text-accent [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
        numSquares={30}
        maxOpacity={0.16}
        duration={3}
        repeatDelay={1}
      />

      <div className="pointer-events-none absolute -right-32 top-10 h-72 w-72 rounded-full border-[28px] border-navy/5 md:-right-16 md:h-96 md:w-96 md:border-[34px]" />
      <div className="pointer-events-none absolute -bottom-52 -left-40 h-80 w-80 rounded-full border-[28px] border-navy/5 md:h-[30rem] md:w-[30rem] md:border-[38px]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-8rem)] w-full max-w-[1100px] flex-col py-10 md:py-14">
        <div className="grid flex-1 items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(300px,0.88fr)] md:gap-12">
          <div className="max-w-[640px]">
            <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1">
              <CodeRitLogo className="h-auto w-48 md:w-56" />
              <p className="border-l border-line pl-4 text-xs font-medium uppercase tracking-[0.18em] text-muted">
                presents
              </p>
            </div>

            <h1 className="mt-2 max-w-full leading-none">
              <EchoText
                text="wHACKiest"
                echoes={14}
                lag={0.2}
                offset={30}
                direction="right"
                fade={0.7}
                blur={2.5}
                echoColors={["#c4572d", "#7f2f1f"]}
                echoScale={0.98}
                mode="both"
                trail="pointer"
                duration={1000}
                ease="snappy"
                fontSize="clamp(3rem, 12vw, 7rem)"
                fontWeight={900}
                color="#c4572d"
                className="max-w-full"
              />
            </h1>

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

            <p className="mt-5 text-lg font-bold uppercase tracking-[-0.02em] md:text-xl">
              Every second counts.
            </p>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted md:text-base">
              A 24-hour national hackathon for the bold, the curious, and the relentlessly inventive.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-3 border border-ink px-5 py-3 text-sm font-semibold uppercase transition-colors active:border-accent active:bg-accent active:text-ink"
              >
                Register now <span aria-hidden="true">↗</span>
              </Link>
              <a
                href="#details"
                className="inline-flex items-center gap-3 border border-ink px-5 py-3 text-sm font-semibold uppercase transition-colors hover:border-accent hover:bg-accent"
              >
                View brochure <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[390px] md:max-w-[440px] md:justify-self-end">
            <span className="absolute -top-1 right-0 z-10 -rotate-[-4deg] bg-ink px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-bg shadow-sm">
              24H / offline
            </span>
            <Image
              src={clockImage}
              alt="Mechanical clock breaking through time"
              priority
              sizes="(max-width: 768px) 85vw, 38vw"
              className="h-auto w-full drop-shadow-[0_1.5rem_2rem_rgba(26,26,26,0.12)]"
            />
            <span className="absolute bottom-[13%] left-[3%] z-10 rotate-[-10deg] bg-ink px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-bg shadow-sm">
              Make it count
            </span>
          </div>
        </div>

        <div className="mt-8 grid border-y border-line md:mt-10 md:grid-cols-3">
          <article id="brief" className="py-5 md:border-r md:border-line md:px-6 md:pl-0">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
              <span className="mr-4 text-accent">01</span> The brief
            </p>
            <p className="mt-3 max-w-[18rem] text-sm leading-6 text-muted">
              Turn a wild idea into something real, in just one day.
            </p>
          </article>
          <article id="details" className="border-t border-line py-5 md:border-t-0 md:border-r md:border-line md:px-6">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
              <span className="mr-4 text-accent">02</span> The details
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              01–02 December 2026<br />
              Ramaiah Institute of Technology, Bengaluru
            </p>
          </article>
          <article id="stakes" className="border-t border-line py-5 md:border-t-0 md:px-6 md:pr-0">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
              <span className="mr-4 text-accent">03</span> The stakes
            </p>
            <p className="mt-2 text-3xl font-black tracking-[-0.06em]">₹50,000</p>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-accent">Prize pool</p>
          </article>
        </div>
      </div>
    </section>
  );
}
