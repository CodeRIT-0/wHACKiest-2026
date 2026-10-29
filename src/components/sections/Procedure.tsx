import Link from "next/link";
import Section, { Accent, PlaceholderGrid } from "../Section";

export default function Procedure() {
  return (
    <Section id="procedure" eyebrow="How to register" title={<>Procedure to <Accent>register</Accent></>}>
      <PlaceholderGrid items={["1. Form a team", "2. Fill the registration form", "3. Get shortlisted", "4. Complete payment"]} />
      <Link href="/register" className="mt-6 inline-block border border-ink px-4 py-2 text-sm font-semibold uppercase">
        Go to registration
      </Link>
    </Section>
  );
}
