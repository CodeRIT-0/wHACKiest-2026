import Link from "next/link";
import RegistrationForm from "@/components/register/RegistrationForm";

export const metadata = { title: "Register | wHACKiest 2026" };

// The deployed Google Apps Script web app URL (see apps-script/registration/README.md).
// Set REGISTRATION_ENDPOINT in .env and in the hosting provider's env settings.
const ENDPOINT = process.env.REGISTRATION_ENDPOINT;

export default function Page() {
  return (
    <section className="mx-auto min-h-[80vh] max-w-[1200px] px-4 py-16 sm:px-6 md:py-24">
      <header className="mb-14 grid gap-6 border-b-2 border-ink pb-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-trace">Registration / wHACKiest 2026</p>
          <h1 className="display-wide mt-3 text-[clamp(44px,8vw,104px)] uppercase leading-[0.9]">
            Assemble
            <br />
            your team<span className="text-accent">.</span>
          </h1>
        </div>
        <div className="max-w-[40ch] md:pb-2">
          <p>One registration per team, filled in by the team leader. Have every member&apos;s name and USN ready. Your track and idea PPT come later, with the team ID you get here.</p>
        </div>
      </header>

      {ENDPOINT ? (
        <RegistrationForm endpoint={ENDPOINT} />
      ) : (
        <div className="border-2 border-ink bg-panel px-6 py-16 text-center shadow-[8px_8px_0_var(--accent)]">
          <p className="font-mono text-sm uppercase tracking-[0.16em]">Registration opens soon</p>
          <p className="mt-3 text-muted">
            Keep an eye on{" "}
            <Link href="/announcements" className="text-ink underline underline-offset-4">
              Announcements
            </Link>
            .
          </p>
        </div>
      )}

      <Link href="/" className="mt-16 inline-block border border-ink px-4 py-2 text-sm font-semibold uppercase">
        ← Back home
      </Link>
    </section>
  );
}
