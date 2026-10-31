"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Category = "All" | "General" | "Deadline" | "Results" | "Venue" | "Sponsors";

type Announcement = {
  _id?: string;
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

const fallbackAnnouncements: Announcement[] = [
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
    href: "/#contact",
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
  const [list, setList] = useState<Announcement[]>(fallbackAnnouncements);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetch("/api/announcements");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
          setList(json.data);
        }
      } catch (err) {
        console.error("Failed to load live announcements:", err);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const visibleAnnouncements = useMemo(
    () => list.filter((item) => active === "All" || item.category === active),
    [active, list],
  );

  return (
    <section className="relative overflow-hidden border-b border-line px-6 py-12 md:py-16">
      <div className="pointer-events-none absolute -right-28 top-0 h-72 w-72 rounded-full border-[32px] border-accent/10 md:h-96 md:w-96" />
      <p aria-hidden="true" className="pointer-events-none absolute left-1/2 top-14 hidden -translate-x-1/2 whitespace-nowrap text-[11vw] font-black uppercase leading-none tracking-[-0.1em] text-ink/[0.035] lg:block">Dispatch</p>
      <div className="relative mx-auto max-w-[1100px]">
        <div className="border-b border-line pb-8">
          <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-muted"><span className="h-px w-8 bg-accent" /> Dispatch / 2026</p>
          <h1 className="mt-2 text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] md:text-6xl">
            The latest <span className="text-accent">word.</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-muted md:text-base">
            Problem statements, deadlines, results, and every important detail in one place.
          </p>
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

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-ink bg-ink px-4 py-3 text-bg md:px-5">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.1em]">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent" aria-hidden="true" />
            <span>Live now</span>
            <span className="font-normal text-bg/60">Registration is open</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-accent">Next · shortlist / 29 Nov</span>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="relative space-y-4" aria-live="polite">
            {visibleAnnouncements.map((item, idx) => (
              <article key={item._id || item.title || idx} className={`group relative isolate overflow-hidden border p-5 transition duration-300 md:p-6 ${item.featured ? "border-ink bg-ink text-bg shadow-[6px_6px_0_0_var(--color-accent)]" : "border-line bg-bg hover:-translate-y-1 hover:border-ink hover:shadow-[4px_4px_0_0_var(--color-ink)]"}`}>
                {item.featured && <><span aria-hidden="true" className="pointer-events-none absolute -right-7 -top-12 -z-10 text-[10rem] font-black leading-none tracking-[-0.12em] text-bg/[0.04]">24H</span><span aria-hidden="true" className="pointer-events-none absolute -bottom-16 -right-16 -z-10 h-48 w-48 rounded-full border-[22px] border-accent/25" /></>}
                <div className="flex gap-4 md:gap-6">
                  <DateStamp date={item.date} dark={item.featured} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                      <span className={`px-2.5 py-1 font-bold uppercase tracking-[0.08em] ${categoryStyles[item.category]}`}>{item.category}</span>
                      {item.featured && <span className="border border-accent px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-accent">Featured</span>}
                      {item.closed && <span className="border border-line bg-white/50 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted">Closed</span>}
                    </div>
                    <h2 className={`mt-5 max-w-2xl text-xl font-bold leading-tight tracking-[-0.035em] md:text-2xl ${item.featured ? "text-bg" : ""}`}>{item.title}</h2>
                    <p className={`mt-3 max-w-2xl text-sm leading-6 ${item.featured ? "text-bg/65" : "text-muted"}`}>{item.copy}</p>
                    {item.action && item.href && (
                      <Link href={item.href} className={`mt-5 inline-flex items-center gap-3 border px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] transition-colors ${item.featured ? "border-bg text-bg hover:bg-accent hover:text-ink" : "border-ink hover:bg-accent"}`}>
                        {item.action} <Arrow />
                      </Link>
                    )}
                  </div>
                </div>
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
        <p className="mt-16 max-w-2xl border-t border-line pt-6 text-2xl font-black uppercase leading-[0.95] tracking-[-0.05em] md:text-4xl">
          Stay curious.<br /><span className="text-accent">Keep building.</span>
        </p>
      </div>
    </section>
  );
}

function InfoCard({ title, mark, children }: { title: string; mark: string; children: React.ReactNode }) {
  return (
    <section className="border border-line bg-bg p-5 transition-colors hover:border-ink">
      <div className="mb-5 flex items-center justify-between border-b border-line pb-3">
        <h2 className="font-bold uppercase tracking-[-0.02em]">{title}</h2>
        <span className="grid h-6 w-6 place-items-center border border-accent text-[0.65rem] font-bold text-accent">{mark}</span>
      </div>
      {children}
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 first:pt-0 last:border-0 last:pb-0"><span className="text-sm text-muted">{label}</span><strong className="text-right text-sm tracking-[-0.02em]">{value}</strong></div>;
}

function DateStamp({ date, dark }: { date: string; dark?: boolean }) {
  const [day, ...rest] = date.split(" ");
  return <div className={`w-12 shrink-0 border-r pr-4 md:w-16 ${dark ? "border-bg/25" : "border-line"}`}><p className={`text-2xl font-black leading-none tracking-[-0.08em] md:text-3xl ${dark ? "text-accent" : ""}`}>{day}</p><p className={`mt-1 text-[0.65rem] font-bold uppercase leading-tight tracking-[0.08em] ${dark ? "text-bg/60" : "text-muted"}`}>{rest.join(" ") || "Soon"}</p><span aria-hidden="true" className={`mt-3 block h-1 w-5 ${dark ? "bg-accent" : "bg-ink"}`} /></div>;
}
