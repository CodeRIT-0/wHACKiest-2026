import Link from "next/link";

export default function RoutePage({ title, text }: { title: string; text: string }) {
  return (
    <section className="mx-auto min-h-[80vh] max-w-[1100px] px-6 py-20">
      <p className="text-xs uppercase tracking-[0.15em] text-muted">wHACKiest 2026</p>
      <h1 className="mb-6 mt-2 text-4xl font-bold uppercase md:text-6xl">{title}</h1>
      <p>{text}</p>
      <Link href="/" className="mt-6 inline-block border border-ink px-4 py-2 text-sm font-semibold uppercase">
        ← Back home
      </Link>
    </section>
  );
}
