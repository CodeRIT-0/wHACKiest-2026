import Image from "next/image";
import { ArrowUpRight, InstagramLogo, LinkedinLogo, UsersThree } from "@phosphor-icons/react/dist/ssr";
import SectionHeader from "../SectionHeader";
import SplitSection from "../SplitSection";
import { NodeField } from "../decor/Decor";

const TEAM_PHOTO: string | null = "/assets/team/coderit-team.jpg";

const LINKS = [
  { label: "Instagram", handle: "@code_rit", href: "https://www.instagram.com/code_rit", icon: InstagramLogo },
  { label: "LinkedIn", handle: "CodeRIT Club", href: "https://www.linkedin.com/company/coderitclub/", icon: LinkedinLogo },
];

// From the wHACKiest 2026 brochure (Conveners, Coordinators, Chief Patrons, Advisory Committee)
const PATRONS = [
  { name: "Dr. R China Appala Naidu", role: "Convener · HoD, Dept. of CSE", photo: "/assets/patrons/china-appala-naidu.jpg" },
  { name: "Pradeep Kumar D", role: "Convener · Faculty Coordinator, Dept. of CSE", photo: "/assets/patrons/pradeep-kumar-d.jpg" },
];

const CHIEF_PATRONS = [
  ["Dr. M.R. Seetharam", "Chairman, GEF"],
  ["Sri. M.R. Janakiram", "Vice-Chairman, GEF"],
  ["Sri. M.R. Anandaram", "Secretary, GEF"],
  ["Sri. M.R. Sampangiramaiah", "Director, RIT"],
  ["Sri. M.R. Kodandaram", "Director, RIT"],
  ["Dr. Parswanath", "Chief Executive, GEF (Engg. & GS)"],
  ["Dr. Karisiddappa", "Chief Academic Advisor, GEF (Engg. & GS)"],
  ["Sri. G. Ramachandra", "Chief of Finance, GEF (Engg. & GS)"],
];

const ADVISORY = [
  ["Dr. B. Sathish Babu", "Principal, RIT"],
  ["Dr. G. M. Madhu", "Vice Principal, RIT"],
  ["Dr. Chandra Prabha M N", "Vice Principal, RIT"],
  ["Dr. Archna", "Registrar (Academics), RIT"],
];

// a name list in a framed card, one row per person, sliding in on hover
function Roll({ title, people }: { title: string; people: string[][] }) {
  return (
    <div className="border-2 border-ink bg-panel shadow-[6px_6px_0_var(--fg)]">
      <p className="border-b-2 border-ink px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em]">
        <span className="text-accent">●</span> {title}
      </p>
      <ul className="divide-y divide-dashed divide-ink/20 px-4">
        {people.map(([name, role]) => (
          <li key={name} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-2.5 transition-[padding,color] duration-300 hover:pl-1.5 hover:text-accent">
            <span className="font-semibold">{name}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Conveners first, as portrait cards that print in grayscale and come into colour on hover; then the
// organising team as one group photo in a single large frame, with CodeRIT's socials beneath.
export default function Team() {
  return (
    <SplitSection
      id="team"
      wide
      backdrop={
        <div data-parallax="0.3" className="absolute inset-0 text-ink/[0.07]">
          <NodeField className="inset-0 h-full w-full scale-x-[-1]" />
        </div>
      }
    >
      <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.6fr)]">
        <SectionHeader index="09" label="Team" title="Meet the minds behind the heist" />
        <p className="max-w-[40ch] text-muted">
          The CodeRIT crew wiring wHACKiest together: problem setters, designers, developers and the people who keep the lights on for 24
          hours.
        </p>
      </div>

      {/* ---------------- patrons ---------------- */}
      <div className="mt-14 flex items-center gap-4">
        <span className="h-px flex-1 bg-ink/25" />
        <h3 className="display-wide text-2xl sm:text-3xl">
          Conveners<span className="text-accent">.</span>
        </h3>
        <span className="h-px flex-1 bg-ink/25" />
      </div>
      <ul data-stagger className="mx-auto mt-8 grid max-w-[720px] grid-cols-2 gap-4 sm:gap-10">
        {PATRONS.map((p) => (
          <li key={p.name}>
            <article
              data-touch
              className="group/patron relative border-[3px] border-ink bg-ink shadow-[5px_5px_0_var(--fg)] transition-[translate,box-shadow] duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_var(--accent)] data-[active]:-translate-x-1 data-[active]:-translate-y-1 data-[active]:shadow-[8px_8px_0_var(--accent)] sm:border-[6px] sm:shadow-[8px_8px_0_var(--fg)]"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={p.photo}
                  alt={`${p.name}, ${p.role}`}
                  fill
                  sizes="(min-width: 640px) 340px, 90vw"
                  className="object-cover object-top grayscale transition-[filter,scale] duration-500 group-hover/patron:scale-[1.03] group-data-[active]/patron:scale-[1.03] group-hover/patron:grayscale-0 group-data-[active]/patron:grayscale-0"
                />
                <span aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-15 transition-opacity duration-500 group-hover/patron:opacity-0 group-data-[active]/patron:opacity-0" />
              </div>
              <div className="bg-panel px-3 pb-3 pt-2.5 sm:px-5 sm:pb-5 sm:pt-4">
                <p className="display-wide text-sm leading-tight transition-colors duration-300 group-hover/patron:text-accent group-data-[active]/patron:text-accent sm:text-xl">{p.name}</p>
                <p className="mt-1.5 border-b-2 border-dashed border-ink/40 pb-1.5 font-mono text-[8.5px] uppercase leading-snug tracking-[0.1em] text-muted sm:mt-2 sm:pb-2 sm:text-[11px] sm:tracking-[0.14em]">{p.role}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {/* ---------------- chief patrons + advisory committee ---------------- */}
      <div data-stagger className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start">
        <Roll title="Chief patrons" people={CHIEF_PATRONS} />
        <Roll title="Advisory committee" people={ADVISORY} />
      </div>

      {/* ---------------- organising team ---------------- */}
      <div className="mt-16 flex items-center gap-4">
        <span className="h-px flex-1 bg-ink/25" />
        <h3 className="display-wide text-2xl sm:text-3xl">
          Organising team<span className="text-accent">.</span>
        </h3>
        <span className="h-px flex-1 bg-ink/25" />
      </div>

      <figure
        data-trace
        data-touch
        className="group/team relative mt-8 border-2 border-ink bg-panel shadow-[6px_6px_0_var(--accent)] transition-[translate,box-shadow] duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_var(--accent)] data-[active]:-translate-x-1 data-[active]:-translate-y-1 data-[active]:shadow-[10px_10px_0_var(--accent)] sm:shadow-[8px_8px_0_var(--accent)]"
      >
        <figcaption className="flex items-center justify-between border-b-2 border-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em]">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
            CodeRIT / organising team
          </span>
          <span className="text-muted">wHACKiest 2026</span>
        </figcaption>

        <div className="relative m-3 aspect-[2000/858] overflow-hidden border border-ink/20 bg-[linear-gradient(#e6decb,#cfc5ae)] sm:m-4">
          {TEAM_PHOTO ? (
            <>
              {/* prints in black and white like the patrons, and comes into colour on hover */}
              <Image
                src={TEAM_PHOTO}
                alt="The CodeRIT organising team"
                fill
                sizes="(min-width: 1024px) 1050px, 100vw"
                className="object-cover grayscale transition-[filter,scale] duration-500 group-hover/team:scale-[1.02] group-data-[active]/team:scale-[1.02] group-hover/team:grayscale-0 group-data-[active]/team:grayscale-0"
              />
              <span aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-15 transition-opacity duration-500 group-hover/team:opacity-0 group-data-[active]/team:opacity-0" />
            </>
          ) : (
            <div className="grid h-full place-items-center text-ink/30">
              <div className="flex flex-col items-center gap-2">
                <UsersThree size={72} weight="duotone" />
                <span className="font-mono text-[11px] uppercase tracking-[0.16em]">Team photo coming soon</span>
              </div>
              <span aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-15" />
            </div>
          )}
        </div>
      </figure>

      <div className="mt-8 flex flex-wrap gap-4">
        {LINKS.map(({ label, handle, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 border-2 border-ink bg-panel px-4 py-3 shadow-[4px_4px_0_var(--fg)] transition-[translate,box-shadow] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--accent)]"
          >
            <Icon size={22} weight="bold" className="text-accent" />
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{label}</span>
              <span className="block text-sm font-semibold">{handle}</span>
            </span>
            <ArrowUpRight size={14} weight="bold" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        ))}
      </div>
    </SplitSection>
  );
}
