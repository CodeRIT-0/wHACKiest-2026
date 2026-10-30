import { GithubLogo, InstagramLogo, LinkedinLogo, User } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import SectionHeader from "../SectionHeader";
import SplitSection from "../SplitSection";
import { NodeField } from "../decor/Decor";

type Member = { name: string; role: string; linkedin?: string; github?: string; instagram?: string };

// TODO: real names, roles, photos (render with next/image in the portrait slot) and profile links
const team: Member[] = Array.from({ length: 8 }, () => ({ name: "Member name", role: "Role", linkedin: "#", github: "#", instagram: "#" }));

// card centres in the network (as % of the grid), for the 4-across and 2-across layouts
const WIDE = { cols: 4, rows: 2 };
const NARROW = { cols: 2, rows: 4 };
const centre = (i: number, g: { cols: number; rows: number }) => [((i % g.cols) + 0.5) * (100 / g.cols), (Math.floor(i / g.cols) + 0.5) * (100 / g.rows)];

// the crew as a network: a CodeRIT hub wired down to every member, members linked to their
// neighbours. Lines show through the gaps between the ID-badge cards.
function Network({ g, className }: { g: { cols: number; rows: number }; className: string }) {
  const links: [number, number][] = [];
  team.forEach((_, i) => {
    if ((i + 1) % g.cols !== 0 && i + 1 < team.length) links.push([i, i + 1]);
    if (i + g.cols < team.length) links.push([i, i + g.cols]);
    if ((i + 1) % g.cols !== 0 && i + g.cols + 1 < team.length && i % 2 === 0) links.push([i, i + g.cols + 1]);
  });
  return (
    <svg aria-hidden data-draw viewBox="0 0 100 100" preserveAspectRatio="none" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} fill="none">
      {/* hub feed into the first row */}
      {Array.from({ length: g.cols }, (_, c) => (
        <path key={`hub-${c}`} d={`M50 0 V2 H${centre(c, g)[0]} V${centre(c, g)[1]}`} className="stroke-trace/60" strokeWidth={1.25} vectorEffect="non-scaling-stroke" />
      ))}
      {links.map(([a, b]) => {
        const [x1, y1] = centre(a, g);
        const [x2, y2] = centre(b, g);
        return <line key={`${a}-${b}`} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-ink/40" strokeWidth={1} strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />;
      })}
    </svg>
  );
}

const SOCIALS: { key: keyof Member; label: string; icon: Icon }[] = [
  { key: "linkedin", label: "LinkedIn", icon: LinkedinLogo },
  { key: "github", label: "GitHub", icon: GithubLogo },
  { key: "instagram", label: "Instagram", icon: InstagramLogo },
];

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
        <SectionHeader index="08" label="Team" title="Meet the minds behind the heist" />
        <p className="max-w-[40ch] text-muted">
          The CodeRIT crew wiring wHACKiest together: problem setters, designers, developers and the people who keep the lights on for 24
          hours.
        </p>
      </div>

      {/* hub */}
      <div className="relative mt-12 flex justify-center">
        <div className="relative z-10 flex items-center gap-3 border border-ink bg-ink px-4 py-2.5 text-bg shadow-[4px_4px_0_var(--accent)]">
          <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.16em]">CodeRIT / core crew</span>
          <span className="font-mono text-[11px] text-accent">{String(team.length).padStart(2, "0")} nodes</span>
        </div>
      </div>

      <div className="relative mt-8">
        <Network g={WIDE} className="hidden sm:block" />
        <Network g={NARROW} className="sm:hidden" />
        <ul data-trace data-stagger className="relative grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 sm:gap-y-10">
          {team.map((m, i) => (
            <li key={i}>
              <article className="group relative border border-ink/70 bg-panel transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[5px_5px_0_var(--accent)]">
                {/* node pin where the network meets the card */}
                <span aria-hidden className="absolute -top-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-ink bg-bg transition-colors group-hover:bg-accent" />
                <div className="flex items-center justify-between border-b border-ink/70 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em]">
                  <span className="text-muted">Crew-{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex items-center gap-1.5 text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Online
                  </span>
                </div>
                <div className="relative mx-2.5 mt-2.5 grid aspect-square place-items-end justify-center overflow-hidden border border-ink/15 bg-[linear-gradient(#e6decb,#cfc5ae)] text-ink/25">
                  <User size={72} weight="fill" className="translate-y-3 transition-transform duration-500 group-hover:scale-105" />
                  <span aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-20" />
                  <span aria-hidden className="pointer-events-none absolute inset-0 bg-accent/0 mix-blend-multiply transition-colors duration-300 group-hover:bg-accent/25" />
                </div>
                <div className="px-2.5 pb-2.5 pt-2">
                  <h3 className="truncate text-sm font-semibold">{m.name}</h3>
                  <p className="truncate font-mono text-[10px] uppercase tracking-[0.12em] text-accent">{m.role}</p>
                  <div className="mt-2 flex gap-1.5 border-t border-dashed border-ink/20 pt-2">
                    {SOCIALS.map(({ key, label, icon: SocialIcon }) =>
                      m[key] ? (
                        <a
                          key={key}
                          href={m[key]}
                          aria-label={`${m.name} on ${label}`}
                          className="grid h-7 w-7 place-items-center border border-ink/25 text-ink/70 transition-colors hover:border-accent hover:bg-accent hover:text-[#050505]"
                        >
                          <SocialIcon size={14} weight="bold" />
                        </a>
                      ) : null,
                    )}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">The people behind every breakthrough</p>
    </SplitSection>
  );
}
