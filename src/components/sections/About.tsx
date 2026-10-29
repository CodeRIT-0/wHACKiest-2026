import Section, { Accent, PlaceholderGrid } from "../Section";

export default function About() {
  return (
    <Section id="about" eyebrow="About" title={<>About &amp; <Accent>last year&apos;s</Accent> wHACKiest</>}>
      <PlaceholderGrid items={["About the hackathon", "wHACKiest 2025 recap", "Highlights / stats"]} />
    </Section>
  );
}
