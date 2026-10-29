import Section, { Accent, PlaceholderGrid } from "../Section";

export default function Tracks() {
  return (
    <Section id="tracks" dark eyebrow="Problem statements" title={<>Explore the <Accent>tracks.</Accent></>}>
      <PlaceholderGrid items={["01 Track", "02 Track", "03 Track", "04 Track"]} />
    </Section>
  );
}
