import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = { title: "Page not found | wHACKiest 2026" };

// Our own 404. Next's built-in one brings a <style> that sets the body's colours (white, or black
// on a device in dark mode), and that style stays on after a client-side navigation away, so the
// whole site came back with the wrong colours until the next full reload.
export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[80svh] max-w-[1100px] flex-col justify-center px-6 py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">Error 404 / signal lost</p>
      <p aria-hidden className="display-wide mt-4 text-[min(30vw,180px)] leading-[0.9] text-transparent [-webkit-text-stroke:2px_var(--fg)]">
        404
      </p>
      <h1 className="display-wide mt-6 max-w-[18ch] text-3xl leading-[1.05] sm:text-5xl">
        This page isn&apos;t on the circuit<span className="text-accent">.</span>
      </h1>
      <p className="mt-4 max-w-[46ch] text-muted">The link may be old or mistyped. Everything about wHACKiest 2026 is one click away.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="inline-flex items-center gap-2 border-2 border-ink bg-accent px-5 py-3 text-[13px] font-bold uppercase tracking-[0.04em] text-[#050505] shadow-[4px_4px_0_var(--fg)]">
          <ArrowLeft size={15} weight="bold" />
          Back home
        </Link>
        <Link href="/announcements" className="inline-flex items-center gap-2 border-2 border-ink px-5 py-3 text-[13px] font-bold uppercase tracking-[0.04em]">
          Announcements
          <ArrowUpRight size={15} weight="bold" />
        </Link>
      </div>
    </section>
  );
}
