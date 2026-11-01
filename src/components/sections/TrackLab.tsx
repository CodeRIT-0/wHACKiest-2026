import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import SectionHeader from "../SectionHeader";
import Reveal from "../motion/Reveal";
import SealedTracks from "./tracks/SealedTracks";

// The tracks, on the paper: sealed until they're announced. When they are, this goes back to
// TrackGallery with the data in tracks/track-data (still in the repo, just not imported from here,
// so the names stay out of the page's code until then).
export default function TrackLab() {
  return (
    <section id="tracks" className="relative">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_50%_30%,black,transparent_75%)]" />
      <div className="relative z-10 mx-auto max-w-[1100px] px-6 pb-20 pt-24 sm:px-10">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
          <SectionHeader index="04" label="Tracks" title="Real problems. Bigger possibilities." />
          <Reveal delay={0.1}>
            <p className="max-w-[44ch] text-muted">Four tracks are sealed and waiting. Start thinking big.</p>
            <dl className="mt-6 flex gap-8 border-t border-ink/15 pt-4">
              {[
                ["04", "Tracks"],
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

        <div className="mt-14 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-ink/15 pt-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">Tracks / to be announced</p>
          <Link href="/announcements" className="group/ann inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
            Be first to know
            <ArrowUpRight size={12} weight="bold" className="transition-transform duration-300 group-hover/ann:-translate-y-0.5 group-hover/ann:translate-x-0.5" />
          </Link>
        </div>
        <div data-trace className="mt-5">
          <SealedTracks />
        </div>
      </div>
    </section>
  );
}
