import Section, { Accent } from "../Section";

const faqs = [
  { q: "Question one?", a: "Answer goes here." },
  { q: "Question two?", a: "Answer goes here." },
  { q: "Question three?", a: "Answer goes here." },
];

export default function Faqs() {
  return (
    <Section id="faqs" eyebrow="FAQs" title={<>Got <Accent>questions?</Accent></>}>
      {faqs.map((f) => (
        <details key={f.q} className="mb-3 border border-line px-5 py-4">
          <summary className="cursor-pointer font-semibold">{f.q}</summary>
          <p className="mt-2 text-muted">{f.a}</p>
        </details>
      ))}
    </Section>
  );
}
