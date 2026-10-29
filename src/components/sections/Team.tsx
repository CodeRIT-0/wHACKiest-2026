import Section, { Accent, PlaceholderGrid } from "../Section";

export default function Team() {
  return (
    <Section id="team" eyebrow="Team" title={<>Meet the minds <Accent>behind the heist.</Accent></>}>
      <PlaceholderGrid items={Array(8).fill("Member")} />
    </Section>
  );
}
