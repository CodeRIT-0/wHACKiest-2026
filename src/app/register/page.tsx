import Link from "next/link";

export const metadata = { title: "Register | wHACKiest 2026" };

export default function Page() {
  return (
    <section className="mx-auto min-h-[80vh] max-w-[1100px] px-6 py-20">
      <p className="text-xs uppercase tracking-[0.15em] text-muted">wHACKiest 2026</p>
      <h1 className="mb-6 mt-2 text-4xl font-bold uppercase md:text-6xl">Register</h1>
      <p>Registration will take place on Devfolio. The official event link will be added here; applications cannot be submitted yet.</p>
      {/* No href until the official event URL is supplied. */}
      <span role="link" aria-disabled="true" className="mt-6 inline-block cursor-not-allowed border border-ink bg-accent px-4 py-2 text-sm font-semibold text-ink underline underline-offset-4">
        DEVFOLIO LINK COMING SOON
      </span>
      <div>
        <Link href="/" className="mt-6 inline-block border border-ink px-4 py-2 text-sm font-semibold uppercase">
          ← Back home
        </Link>
      </div>
    </section>
  );
}
