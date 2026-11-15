import type { Metadata } from "next";
import Link from "next/link";
import SubmissionForm from "@/components/register/SubmissionForm";

// PPT submission for registered teams. Deliberately unlinked from the rest of the site and kept
// out of search: share the URL with teams (WhatsApp community / email) when submissions open.
export const metadata: Metadata = { title: "Uplink | wHACKiest 2026", robots: { index: false, follow: false } };

const ENDPOINT = process.env.NEXT_PUBLIC_REGISTRATION_ENDPOINT;

export default function Page() {
  return (
    <section className="mx-auto min-h-[80vh] max-w-[900px] px-4 py-16 sm:px-6 md:py-24">
      <header className="mb-12 border-b-2 border-ink pb-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-trace">Uplink / idea submission</p>
        <h1 className="display-wide mt-3 text-[clamp(40px,7vw,88px)] uppercase leading-[0.9]">
          Send your
          <br />
          idea<span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-[52ch]">
          Registered teams only. Enter the team ID you got after registering and the leader&apos;s email, then pick your track and upload your idea PPT following the submission guidelines.
        </p>
      </header>

      {ENDPOINT ? (
        <SubmissionForm endpoint={ENDPOINT} />
      ) : (
        <div className="border-2 border-ink bg-panel px-6 py-16 text-center shadow-[8px_8px_0_var(--accent)]">
          <p className="font-mono text-sm uppercase tracking-[0.16em]">Submissions open soon</p>
        </div>
      )}

      <p className="mt-12 text-sm text-muted">
        Not registered yet?{" "}
        <Link href="/register" className="text-ink underline underline-offset-4">
          Register your team
        </Link>
        .
      </p>
    </section>
  );
}
