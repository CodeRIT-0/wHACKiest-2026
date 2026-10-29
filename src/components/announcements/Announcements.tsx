"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Category = "All" | "General" | "Deadline" | "Results" | "Venue" | "Sponsors";

type Announcement = {
  category: Exclude<Category, "All">;
  date: string;
  title: string;
  copy: string;
  action?: string;
  href?: string;
  featured?: boolean;
  closed?: boolean;
};

const filters: Category[] = ["All", "General", "Deadline", "Results", "Venue", "Sponsors"];

const announcements: Announcement[] = [
  {
    category: "General",
    date: "29 Oct 2026 · 10:00 AM",
    title: "Registrations for wHACKiest 2026 are now open",
    copy: "Bring your sharpest idea. Team registrations are open for the 24-hour national hackathon.",
    action: "Register your team",
    href: "/register",
    featured: true,
  },
  {
    category: "Deadline",
    date: "28 Nov 2026 · 11:59 PM",
    title: "Registration closes on 28 November",
    copy: "Complete your registration before the deadline to be considered for shortlisting.",
    action: "Register now",
    href: "/register",
  },
  {
    category: "Results",
    date: "29 Nov 2026 · 6:00 PM",
    title: "Shortlisted teams will be announced here",
    copy: "Keep an eye on this page and our social channels for the final shortlist.",
  },
  {
    category: "Venue",
    date: "01 Dec 2026 · 8:00 AM",
    title: "wHACKiest 2026 takes over MSRIT, Bengaluru",
    copy: "Report to the Ramaiah Institute of Technology campus for check-in and the opening briefing.",
    action: "Event details",
    href: "/#details",
  },
  {
    category: "Sponsors",
    date: "Coming soon",
    title: "More partners. More possibilities.",
    copy: "We are lining up a brilliant set of sponsors, mentors, and special prizes for this edition.",
  },
];

const categoryStyles: Record<Announcement["category"], string> = {
  General: "bg-ink text-bg",
  Deadline: "bg-[#eabf48] text-ink",
  Results: "bg-accent text-ink",
  Venue: "bg-[#b6d8c0] text-ink",
  Sponsors: "bg-[#d8c1e8] text-ink",
};

function Arrow() {
  return <span aria-hidden="true" className="text-lg leading-none">↗</span>;
}

export default function Announcements() {
  const [active, setActive] = useState<Category>("All");
  const visibleAnnouncements = useMemo(
    () => announcements.filter((item) => active === "All" || item.category === active),
    [active],
  );

  return (
    <section className="relative overflow-hidden border-b border-line px-6 py-12 md:py-16">
      <div className="pointer-events-none absolute -right-28 top-0 h-72 w-72 rounded-full border-[32px] border-accent/10 md:h-96 md:w-96" />
      <div className="relative mx-auto max-w-[1100px]">
        <div className="flex flex-col justify-between gap-7 border-b border-line pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Dispatch / 2026</p>
            <h1 className="mt-2 text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] md:text-6xl">
              The latest <span className="text-accent">word.</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-muted md:text-base">
              Problem statements, deadlines, results, and every important detail in one place.
            </p>
          </div>
          <div className="border border-ink bg-bg px-4 py-3 text-right shadow-[4px_4px_0_0_var(--color-accent)]">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.15em] text-muted">Last updated</p>
            <p className="mt-1 text-sm font-bold">29 Oct 2026 · 10:00 AM</p>
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto border-y border-line py-3 [scrollbar-width:none]">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
              aria-pressed={active === filter}
              className={`shrink-0 border px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] transition-colors ${
                active === filter ? "border-ink bg-ink text-bg" : "border-line hover:border-ink hover:bg-[#e7dfd0]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="space-y-4" aria-live="polite">
            {visibleAnnouncements.map((item) => (
              <article key={item.title} className="group border border-line bg-bg p-5 transition-colors hover:border-ink md:p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                  <span className={`px-2.5 py-1 font-bold uppercase tracking-[0.08em] ${categoryStyles[item.category]}`}>{item.category}</span>
                  <span className="text-muted">{item.date}</span>
                  {item.featured && <span className="ml-auto border border-accent px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-accent">Featured</span>}
                </div>
                <h2 className="mt-5 max-w-2xl text-xl font-bold leading-tight tracking-[-0.035em] md:text-2xl">{item.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{item.copy}</p>
                {item.action && item.href && (
                  <Link href={item.href} className="mt-5 inline-flex items-center gap-3 border border-ink px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] transition-colors hover:bg-accent">
                    {item.action} <Arrow />
                  </Link>
                )}
              </article>
            ))}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <InfoCard title="Quick facts" mark="01">
              <Fact label="Prize pool" value="₹50,000" />
              <Fact label="Team size" value="2–4 people" />
              <Fact label="Entry fee" value="Free" />
              <Fact label="Format" value="24H / Offline" />
            </InfoCard>
            <InfoCard title="Key dates" mark="02">
              <ol className="relative ml-1 border-l border-ink/40 pl-5">
                {[
                  ["29 Oct", "Registration opens", true],
                  ["28 Nov", "Registration closes", false],
                  ["29 Nov", "Shortlist announced", false],
                  ["01–02 Dec", "wHACKiest 2026", false],
                ].map(([date, label, current]) => (
                  <li key={label as string} className="relative pb-5 last:pb-0">
                    <span className={`absolute -left-[1.66rem] top-1 h-3 w-3 rounded-full border border-ink ${current ? "bg-accent" : "bg-bg"}`} />
                    <p className={`text-xs font-bold ${current ? "text-accent" : "text-muted"}`}>{date}</p>
                    <p className="mt-0.5 text-sm font-medium">{label}</p>
                  </li>
                ))}
              </ol>
            </InfoCard>
            <InfoCard title="Stay in the loop" mark="03">
              <p className="text-sm leading-6 text-muted">Follow CodeRIT for reminders, behind-the-scenes, and important announcements.</p>
              <div className="mt-4 flex gap-2">
                <a href="https://www.instagram.com/coderit.msr" target="_blank" rel="noreferrer" className="flex-1 border border-ink px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.08em] hover:bg-accent">Instagram</a>
                <a href="https://www.linkedin.com/company/coderit" target="_blank" rel="noreferrer" className="flex-1 border border-ink px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.08em] hover:bg-accent">LinkedIn</a>
              </div>
            </InfoCard>
          </aside>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ title, mark, children }: { title: string; mark: string; children: React.ReactNode }) {
  return <section className="border border-line bg-bg p-5"><div className="mb-5 flex items-center justify-between border-b border-line pb-3"><h2 className="font-bold uppercase tracking-[-0.02em]">{title}</h2><span className="text-xs font-bold text-accent">{mark}</span></div>{children}</section>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 first:pt-0 last:border-0 last:pb-0"><span className="text-sm text-muted">{label}</span><strong className="text-right text-sm">{value}</strong></div>;
}
