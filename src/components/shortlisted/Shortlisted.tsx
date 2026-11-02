"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Team = {
  _id: string;
  teamName: string;
  institution: string;
  city?: string;
  track?: string;
  leader?: string;
  status: "Shortlisted" | "Waitlisted";
};

type Load = "loading" | "ready" | "error";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Shortlisted() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [load, setLoad] = useState<Load>("loading");
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState("All");

  useEffect(() => {
    let alive = true;
    fetch("/api/shortlisted")
      .then((res) => res.json())
      .then((json) => {
        if (!alive) return;
        if (json.success && Array.isArray(json.data)) {
          setTeams(json.data);
          setLoad("ready");
        } else setLoad("error");
      })
      .catch(() => alive && setLoad("error"));
    return () => {
      alive = false;
    };
  }, []);

  const tracks = useMemo(() => ["All", ...Array.from(new Set(teams.map((t) => t.track).filter((t): t is string => Boolean(t))))], [teams]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return teams.filter(
      (t) =>
        (track === "All" || t.track === track) &&
        (!q || [t.teamName, t.institution, t.city, t.leader].some((v) => v?.toLowerCase().includes(q))),
    );
  }, [teams, query, track]);

  const shortlisted = visible.filter((t) => t.status === "Shortlisted");
  const waitlisted = visible.filter((t) => t.status === "Waitlisted");
  const total = teams.filter((t) => t.status === "Shortlisted").length;

  return (
    <section className="relative overflow-hidden border-b border-line px-6 py-12 md:py-16">
      <div className="pointer-events-none absolute -right-28 top-0 h-72 w-72 rounded-full border-[32px] border-accent/10 md:h-96 md:w-96" />
      <p aria-hidden="true" className="pointer-events-none absolute left-1/2 top-14 hidden -translate-x-1/2 whitespace-nowrap text-[11vw] font-black uppercase leading-none tracking-[-0.1em] text-ink/[0.035] lg:block">
        Shortlist
      </p>
      <div className="relative mx-auto max-w-[1100px]">
        <div className="border-b border-line pb-8">
          <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-muted">
            <span className="h-px w-8 bg-accent" /> Results / 2026
          </p>
          <h1 className="mt-2 text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] md:text-6xl">
            The <span className="text-accent">shortlist.</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-muted md:text-base">
            The teams heading to Ramaiah Institute of Technology, Bengaluru, for 24 hours of building on 01–02 December 2026.
          </p>
        </div>

        {load === "loading" && <p className="py-16 text-center text-sm text-muted">Loading the shortlist…</p>}

        {load === "error" && (
          <Notice title="Couldn't load the shortlist" text="Something went wrong on our side. Refresh the page, or check back in a few minutes." />
        )}

        {load === "ready" && teams.length === 0 && (
          <Notice
            title="The shortlist date is to be announced"
            text="Shortlisted teams will be listed here once results are out. Watch the announcements page and our socials for the news."
            action={{ label: "Announcements", href: "/announcements" }}
          />
        )}

        {load === "ready" && teams.length > 0 && (
          <>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-ink bg-ink px-4 py-3 text-bg md:px-5">
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.1em]">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
                <span>Results are out</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.1em] text-accent">{pad(total)} teams shortlisted</span>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-y border-line py-3 md:flex-row md:items-center">
              <label className="flex-1">
                <span className="sr-only">Search teams</span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by team, institution, city or leader"
                  className="w-full border border-line bg-bg px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-ink"
                />
              </label>
              {tracks.length > 2 && (
                <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
                  {tracks.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTrack(t)}
                      aria-pressed={track === t}
                      className={`shrink-0 border px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] transition-colors ${
                        track === t ? "border-ink bg-ink text-bg" : "border-line hover:border-ink hover:bg-[#e7dfd0]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div aria-live="polite">
              {visible.length === 0 ? (
                <p className="py-16 text-center text-sm text-muted">No team matches that. Try fewer words or another track.</p>
              ) : (
                <>
                  {shortlisted.length > 0 && <TeamList title="Shortlisted" teams={shortlisted} />}
                  {waitlisted.length > 0 && (
                    <TeamList title="Waitlist" note="If a shortlisted team drops out, we'll reach out to waitlisted teams in this order." teams={waitlisted} />
                  )}
                </>
              )}
            </div>

            <p className="mt-10 max-w-2xl text-sm leading-6 text-muted">
              Made the list? Check your email for confirmation steps. Questions?{" "}
              <Link href="/#contact" className="font-semibold text-ink underline decoration-accent underline-offset-4 hover:text-accent">
                Get in touch
              </Link>
              .
            </p>
          </>
        )}

        <p className="mt-16 max-w-2xl border-t border-line pt-6 text-2xl font-black uppercase leading-[0.95] tracking-[-0.05em] md:text-4xl">
          Stay curious.
          <br />
          <span className="text-accent">Keep building.</span>
        </p>
      </div>
    </section>
  );
}

function TeamList({ title, note, teams }: { title: string; note?: string; teams: Team[] }) {
  return (
    <div className="mt-10">
      <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-3">
        <h2 className="text-xl font-black uppercase tracking-[-0.03em] md:text-2xl">{title}</h2>
        <span className="text-xs font-bold uppercase tracking-[0.1em] text-muted">{pad(teams.length)} teams</span>
      </div>
      {note && <p className="mt-3 text-sm text-muted">{note}</p>}
      <ol className="mt-2">
        {teams.map((t, i) => (
          <li
            key={t._id}
            className="group grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1 border-b border-line py-4 transition-colors hover:bg-[#e7dfd0]/40 md:grid-cols-[3rem_minmax(0,1.2fr)_minmax(0,1fr)_auto] md:items-center"
          >
            <span className="font-mono text-xs font-bold text-accent">{pad(i + 1)}</span>
            <div className="min-w-0">
              <p className="truncate text-base font-bold tracking-[-0.02em] md:text-lg">{t.teamName}</p>
              {t.leader && <p className="truncate text-xs text-muted">Led by {t.leader}</p>}
            </div>
            <p className="col-start-2 min-w-0 truncate text-sm text-muted md:col-start-auto">
              {t.institution}
              {t.city && <span>, {t.city}</span>}
            </p>
            {t.track ? (
              <span className="col-start-2 w-fit border border-ink px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.08em] md:col-start-auto">
                {t.track}
              </span>
            ) : (
              <span className="hidden md:block" />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Notice({ title, text, action }: { title: string; text: string; action?: { label: string; href: string } }) {
  return (
    <div className="mt-10 border border-ink bg-bg p-6 shadow-[6px_6px_0_0_var(--color-accent)] md:p-8">
      <h2 className="text-xl font-black uppercase tracking-[-0.03em] md:text-2xl">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted">{text}</p>
      {action && (
        <Link href={action.href} className="mt-5 inline-flex items-center gap-3 border border-ink px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] transition-colors hover:bg-accent">
          {action.label} <span aria-hidden="true">↗</span>
        </Link>
      )}
    </div>
  );
}
