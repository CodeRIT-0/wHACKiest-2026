import Section, { Accent } from "../Section";

export default function Contact() {
  return (
    <Section id="contact" eyebrow="Find us" title={<>Socials &amp; <Accent>location</Accent></>}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="min-h-36 border border-line p-5">Instagram / LinkedIn / Discord links</div>
        <div className="grid h-64 place-items-center border border-dashed border-line text-muted">
          Map embed goes here
        </div>
      </div>
    </Section>
  );
}
