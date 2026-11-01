import SectionHeader from "../SectionHeader";
import Reveal from "../motion/Reveal";
import { TrackProvider } from "./tracks/TrackContext";
import TrackGallery from "./tracks/TrackGallery";
import ProblemDeck from "./tracks/ProblemDeck";
import { PROBLEM_COUNT, TRACKS } from "./tracks/track-data";

const pad = (n: number) => String(n).padStart(2, "0");

// Tracks and problem statements, on the paper: an expanding gallery of the four tracks,
// and below it the selected track's problem statements (the two share the selection).
// `problems` is kept as an anchor on the statements, so links and the era counter still find it.
export default function TrackLab() {
  return (
    <section id="tracks" className="relative">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_50%_30%,black,transparent_75%)]" />
      <TrackProvider>
        <div className="relative z-10 mx-auto max-w-[1100px] px-6 pb-20 pt-24 sm:px-10">
          <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
            <SectionHeader index="04" label="Tracks & problem statements" title="Real problems. Bigger possibilities." />
            <Reveal delay={0.1}>
              <p className="max-w-[44ch] text-muted">
                Four tracks, one weekend. Pick the one that pulls you in, then choose the problem statement you want to build for.
              </p>
              <dl className="mt-6 flex gap-8 border-t border-ink/15 pt-4">
                {[
                  [pad(TRACKS.length), "Tracks"],
                  [pad(PROBLEM_COUNT), "Problem statements"],
                  ["24", "Hours to build"],
                ].map(([n, label]) => (
                  <div key={label} className="flex flex-col-reverse">
                    <dt className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{label}</dt>
                    <dd className="display-wide text-3xl leading-none text-accent">{n}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* the two steps are labelled, so it reads as "pick a track, then its problems" */}
          <div className="mt-14 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-ink/15 pt-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em]">
              <span className="text-accent">Step 1</span> <span className="text-muted">/</span> Pick a track
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              <span className="hidden lg:inline">Hover or click</span>
              <span className="lg:hidden">Tap</span> a track to open it
            </p>
          </div>
          <div data-trace className="mt-5">
            <TrackGallery tracks={TRACKS} />
          </div>

          <div id="problems" className="scroll-mt-24">
            <ProblemDeck tracks={TRACKS} />
          </div>
        </div>
      </TrackProvider>
    </section>
  );
}
