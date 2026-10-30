import { User } from "@phosphor-icons/react/dist/ssr";
import Reveal from "../motion/Reveal";
import SectionHeader from "../SectionHeader";
import SplitSection from "../SplitSection";
import { NodeField, Sparkle } from "../decor/Decor";
import FaqAccordion, { type Faq } from "./faqs/FaqAccordion";

// TODO: confirm eligibility and fee details with the organising team
const faqs: Faq[] = [
  { q: "How big can a team be?", a: "Two to four members. Solo entries aren't accepted, so find a crew early." },
  { q: "How long is the hackathon?", a: "24 hours, start to finish. Plan for one long, caffeinated stretch." },
  { q: "Is there a registration fee?", a: "Only shortlisted teams pay, through the Payments page, to confirm their spot." },
  { q: "What can we build?", a: "Anything that fits one of the four tracks. If nothing fits, pitch it under Open Innovation." },
  { q: "What's up for grabs?", a: "A ₹50,000 prize pool, split across the top three teams." },
  { q: "Where do announcements go?", a: "On the Updates page. Shortlisted teams are listed on the Shortlisted page." },
];

// person nodes linked up: "information everywhere"
const PEOPLE = [
  { x: "8%", y: "55%" },
  { x: "30%", y: "18%" },
  { x: "52%", y: "62%" },
  { x: "74%", y: "22%" },
  { x: "92%", y: "58%" },
];

export default function Faqs() {
  return (
    <SplitSection
      id="faqs"
      backdrop={
        <div data-parallax="0.35" className="absolute inset-0 text-ink/[0.06]">
          <NodeField className="inset-0 h-full w-full" />
          <Sparkle className="bottom-16 right-[8%] w-6 text-ink/20" />
        </div>
      }
    >
      <SectionHeader index="07" label="FAQs" title="Got questions?" />

      <Reveal delay={0.1}>
        <div aria-hidden data-trace className="relative mt-8 h-24">
          <svg data-draw className="absolute inset-0 h-full w-full" fill="none">
            {PEOPLE.slice(1).map((p, i) => (
              <line key={i} x1={PEOPLE[i].x} y1={PEOPLE[i].y} x2={p.x} y2={p.y} className="stroke-ink/25" strokeWidth={1} />
            ))}
            {PEOPLE.slice(1).map((p, i) => (
              <line key={i} x1={PEOPLE[i].x} y1={PEOPLE[i].y} x2={p.x} y2={p.y} className="wire-pulse stroke-accent" strokeWidth={1.5} />
            ))}
          </svg>
          {PEOPLE.map((p, i) => (
            <span
              key={i}
              style={{ left: p.x, top: p.y }}
              className="absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ink/50 bg-bg text-ink/60"
            >
              <User size={16} weight="duotone" />
            </span>
          ))}
        </div>
      </Reveal>

      <FaqAccordion faqs={faqs} />
    </SplitSection>
  );
}
