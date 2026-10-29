import Section, { Accent } from "../Section";

const milestones = ["Registration opens", "Registration closes", "Shortlist announced", "Hackathon day", "Final judging"];

export default function Timeline() {
  return (
    <Section id="timeline" eyebrow="Timeline" title={<>Every milestone <Accent>matters.</Accent></>}>
      <ol className="mt-10 flex flex-col gap-6 md:flex-row md:justify-between md:border-t-2 md:border-accent">
        {milestones.map((m) => (
          <li key={m} className="relative pt-6 text-sm">
            <span className="absolute left-0 top-0 h-4 w-4 rounded-full bg-accent md:-top-[9px]" />
            {m}
          </li>
        ))}
      </ol>
    </Section>
  );
}
