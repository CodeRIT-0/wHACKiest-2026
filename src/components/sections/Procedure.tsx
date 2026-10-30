import Link from "next/link";
import { ArrowRight, CreditCard, IdentificationCard, ListChecks, UsersThree } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import Reveal from "../motion/Reveal";

const steps: { title: string; text: string; href: string; icon: Icon }[] = [
  { title: "Form your team", text: "Find one to three teammates. Teams are two to four.", href: "/register", icon: UsersThree },
  { title: "Register", text: "Fill in the form with your team and your idea.", href: "/register", icon: IdentificationCard },
  { title: "Get shortlisted", text: "We review every entry. Watch the Shortlisted page.", href: "/shortlisted", icon: ListChecks },
  { title: "Pay & confirm", text: "Shortlisted teams complete payment to lock their spot.", href: "/payments", icon: CreditCard },
];

// the four registration steps, shown inside the closing section
export default function Procedure() {
  return (
    <div id="procedure" className="scroll-mt-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">How to register</p>
      <h3 className="display-wide mt-2 text-2xl leading-tight sm:text-3xl">
        Four steps to the start line<span className="text-accent">.</span>
      </h3>

      <Reveal delay={0.1}>
        {/* 1990s browser window */}
        <div className="mt-6 border-2 border-ink bg-panel shadow-[6px_6px_0_var(--fg)]">
          <div className="flex items-center gap-2 border-b-2 border-ink bg-panel px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full border border-ink bg-accent" />
            <span className="h-2.5 w-2.5 rounded-full border border-ink bg-bg" />
            <span className="h-2.5 w-2.5 rounded-full border border-ink bg-bg" />
            <span className="ml-2 flex-1 truncate border border-ink/40 bg-bg px-2 py-0.5 font-mono text-[10px] text-muted">
              http://whackiest/register
            </span>
          </div>

          <ol data-stagger className="divide-y divide-line">
            {steps.map(({ title, text, href, icon: StepIcon }, i) => (
              <li key={title}>
                <Link href={href} className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent/[0.07] sm:px-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center bg-ink font-display text-lg font-bold text-bg transition-colors group-hover:bg-accent group-hover:text-ink">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold leading-snug">{title}</span>
                    <span className="block text-sm text-muted">{text}</span>
                  </span>
                  <span className="hidden h-14 w-16 shrink-0 place-items-center border border-line bg-bg text-ink/70 transition-[transform,color] duration-300 group-hover:-rotate-3 group-hover:text-accent sm:grid">
                    <StepIcon size={28} weight="duotone" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap items-center gap-4 border-t-2 border-ink px-4 py-4 sm:px-5">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-bg transition-transform active:scale-[0.98]"
            >
              Register your team
              <ArrowRight size={14} weight="bold" />
            </Link>
            <p className="text-xs text-muted">
              Already in?{" "}
              <Link href="/announcements" className="underline underline-offset-2 hover:text-accent">
                Check updates
              </Link>
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
