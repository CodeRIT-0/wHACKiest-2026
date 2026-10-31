import Link from "next/link";
import { ArrowDown } from "@phosphor-icons/react/dist/ssr";
import Reveal from "../motion/Reveal";
import SectionHeader from "../SectionHeader";
import TrackTerminal, { type Track } from "./tracks/TrackTerminal";
import { TrackProvider } from "./tracks/TrackContext";
import ProblemBoard, { type Problem } from "./problems/ProblemBoard";

// TODO: placeholder tracks
const tracks: Track[] = [
  {
    title: "AI & Beyond",
    dir: "ai_and_beyond",
    blurb: "Models, agents and tools that actually help people.",
    art: "network",
  },
  { title: "Web & Product", dir: "web_and_product", blurb: "Ship a product someone would open twice.", art: "browser" },
  {
    title: "Social Impact",
    dir: "social_impact",
    blurb: "Small builds that move big numbers for real communities.",
    art: "globe",
  },
  {
    title: "Open Innovation",
    dir: "open_innovation",
    blurb: "None of the above fits? Bring your own problem and make the case.",
    art: "orbit",
  },
];

// TODO: sample statements; replace with the real problem statements once they're released
const problems: Problem[] = [
  {
    id: "PS-01",
    track: "AI & Beyond",
    art: "network",
    title: "Campus copilot",
    blurb: "An assistant that answers the questions students actually ask.",
    detail: "Timetables, rules, deadlines, and where room 4B is. Build an assistant that knows the campus and gets the answer right the first time.",
  },
  {
    id: "PS-02",
    track: "Web & Product",
    art: "browser",
    title: "Lost & found, rebuilt",
    blurb: "Reunite people with their stuff faster than the noticeboard does.",
    detail: "Things go missing every day and the noticeboard is where they stay lost. Design a product people would actually open the moment they lose something.",
  },
  {
    id: "PS-03",
    track: "Social Impact",
    art: "globe",
    title: "Clean water map",
    blurb: "Verified water quality data for neighbourhoods that have none.",
    detail: "Many neighbourhoods have no reliable picture of their water quality. Collect, verify and show it in a way residents can trust and act on.",
  },
  {
    id: "PS-04",
    track: "Open Innovation",
    art: "orbit",
    title: "Your problem here",
    blurb: "Bring a problem you've lived and make the case for it.",
    detail: "None of the statements fit? Bring a problem you've lived through, convince the judges it matters, then solve it.",
  },
  {
    id: "PS-05",
    track: "AI & Beyond",
    art: "network",
    title: "Accessible classrooms",
    blurb: "Live captions, summaries and translations for every lecture.",
    detail: "Build tools that make lectures work for students who need captions, translations or a quick recap, without extra effort from the teacher.",
  },
  {
    id: "PS-06",
    track: "Web & Product",
    art: "browser",
    title: "Small shop, big web",
    blurb: "Get a neighbourhood store taking orders online in an afternoon.",
    detail: "Local shops lose customers to apps they can't afford to build. Make going online simple enough to set up in an afternoon.",
  },
  {
    id: "PS-07",
    track: "Social Impact",
    art: "globe",
    title: "Blood bank radar",
    blurb: "Match willing donors to nearby shortages in real time.",
    detail: "Shortages are local and urgent; donors are willing but unaware. Connect the two before it's too late.",
  },
  {
    id: "PS-08",
    track: "Open Innovation",
    art: "orbit",
    title: "Hardware hack",
    blurb: "If it blinks, beeps or moves, it fits here.",
    detail: "Sensors, boards and prototypes. Build something physical that solves a real problem, and bring it to the demo table.",
  },
];

// Tracks and problem statements as one black panel: pick a track in the terminal and the chip
// below routes its problem statements onto the cards (both share the selected track).
// `problems` is kept as an anchor inside, so links and the era counter still find it.
export default function TrackLab() {
  return (
    <section id="tracks" data-panel className="theme-dark dark-panel relative">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_50%_30%,black,transparent_75%)]" />
      <TrackProvider>
        <div className="relative z-10 mx-auto max-w-[1100px] px-6 pb-20 pt-24 sm:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
            <div>
              <SectionHeader index="04" label="Tracks & problem statements" title="Real problems. Bigger possibilities." />
              <Reveal delay={0.1}>
                <p className="mt-5 max-w-[42ch] text-muted">
                  Four tracks, one weekend. Pick a track in the terminal with your mouse or the arrow keys, then choose the problem
                  statement you want to build for.
                </p>
              </Reveal>
              <Link
                href="/#problems"
                className="mt-8 inline-flex w-fit items-center gap-2 border border-ink/40 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.06em] transition hover:border-accent hover:text-accent active:scale-[0.98]"
              >
                See the problem statements
                <ArrowDown size={14} weight="bold" />
              </Link>
            </div>
            <TrackTerminal tracks={tracks} />
          </div>

          <div id="problems" className="scroll-mt-24 pt-6">
            <ProblemBoard problems={problems} />
          </div>
        </div>
      </TrackProvider>
    </section>
  );
}
