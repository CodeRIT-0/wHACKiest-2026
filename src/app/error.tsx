"use client";

import Link from "next/link";

// If a page crashes while rendering, visitors get this and a way out, not a blank screen.
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="mx-auto flex min-h-[80svh] max-w-[1100px] flex-col justify-center px-6 py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">System fault</p>
      <h1 className="display-wide mt-4 max-w-[18ch] text-3xl leading-[1.05] sm:text-5xl">
        Something tripped a breaker<span className="text-accent">.</span>
      </h1>
      <p className="mt-4 max-w-[46ch] text-muted">It&apos;s not you. Try again, and if it keeps happening write to coderit@msrit.edu.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="border-2 border-ink bg-accent px-5 py-3 text-[13px] font-bold uppercase tracking-[0.04em] text-[#050505] shadow-[4px_4px_0_var(--fg)]">
          Try again
        </button>
        <Link href="/" className="border-2 border-ink px-5 py-3 text-[13px] font-bold uppercase tracking-[0.04em]">
          Back home
        </Link>
      </div>
    </section>
  );
}
