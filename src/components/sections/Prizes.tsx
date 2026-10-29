import Section, { Accent, PlaceholderGrid } from "../Section";

export default function Prizes() {
  return (
    <Section id="prizes" eyebrow="Prizes" title={<>Big ideas. <Accent>Bigger rewards.</Accent></>}>
      <PlaceholderGrid items={["Winner", "Runner up", "Special awards"]} />
    </Section>
  );
}
