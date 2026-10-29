import Section, { Accent, PlaceholderGrid } from "../Section";

export default function Sponsors() {
  return (
    <Section id="sponsors" eyebrow="Sponsors" title={<>Our <Accent>sponsors</Accent></>}>
      <PlaceholderGrid items={["Sponsor", "Sponsor", "Sponsor", "Sponsor"]} />
    </Section>
  );
}
