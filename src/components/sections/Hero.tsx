import Link from "next/link";

export default function Hero() {
  return (
    <section id="home" className="flex min-h-[80vh] items-center border-b border-line px-6">
      <div className="mx-auto w-full max-w-[1100px]">
        <p className="text-xs uppercase tracking-[0.15em] text-muted">CodeRIT presents</p>
        <h1 className="mt-2 text-6xl font-bold uppercase leading-none md:text-8xl">
          w<span className="text-accent">HACK</span>iest
          <br />
          2026
        </h1>
        <p className="mt-4">Real problems. Bigger possibilities.</p>
        <Link href="/register" className="mt-6 inline-block bg-ink px-5 py-3 text-sm font-semibold uppercase text-bg">
          Register now
        </Link>
      </div>
    </section>
  );
}
