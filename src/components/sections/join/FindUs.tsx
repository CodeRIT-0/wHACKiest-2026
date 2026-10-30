import { ArrowUpRight, DiscordLogo, EnvelopeSimple, InstagramLogo, LinkedinLogo, MapPin } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

// TODO: real CodeRIT profile links and contact address
const SOCIALS: { label: string; note: string; href: string; icon: Icon }[] = [
  { label: "Instagram", note: "Stories", href: "#", icon: InstagramLogo },
  { label: "LinkedIn", note: "Announcements", href: "#", icon: LinkedinLogo },
  { label: "Discord", note: "Find a team", href: "#", icon: DiscordLogo },
  { label: "Email", note: "Say hello", href: "#", icon: EnvelopeSimple },
];

// TODO: confirm the venue with the organising team
const VENUE = {
  name: "Ramaiah Institute of Technology",
  address: "MSR Nagar, MSRIT Post, Bengaluru 560054",
  query: "Ramaiah Institute of Technology, Bengaluru",
};
const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(VENUE.query)}&output=embed`;
const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(VENUE.query)}`;

// Socials as a 2x2 board of link tiles, then the venue on a monochrome map styled to match the
// black panel. The map only loads when it scrolls near (loading="lazy").
export default function FindUs() {
  return (
    <div id="contact" className="scroll-mt-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Find us</p>
      <h3 className="display-wide mt-2 text-2xl leading-tight sm:text-3xl">
        Socials &amp; location<span className="text-accent">.</span>
      </h3>

      <ul className="mt-6 grid grid-cols-2 gap-3">
        {SOCIALS.map(({ label, note, href, icon: SocialIcon }) => (
          <li key={label}>
            <a
              href={href}
              className="group flex h-full items-center gap-3 border border-line bg-panel p-3.5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center border border-ink/20 text-ink transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-[#050505]">
                <SocialIcon size={20} weight="bold" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{label}</span>
                <span className="block truncate font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{note}</span>
              </span>
              <ArrowUpRight size={14} weight="bold" className="shrink-0 text-muted transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
            </a>
          </li>
        ))}
      </ul>

      <figure className="mt-3 border border-line bg-panel">
        <div className="relative h-56 overflow-hidden sm:h-64">
          <iframe
            title={`Map: ${VENUE.name}`}
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_invert(0.92)_contrast(0.9)_brightness(0.95)]"
          />
          {/* blueprint frame over the map */}
          <span aria-hidden className="pointer-events-none absolute inset-3 border border-[#fff9ec]/15" />
        </div>
        <figcaption className="flex flex-wrap items-center gap-3 border-t border-line p-3.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center bg-accent text-[#050505]">
            <MapPin size={18} weight="fill" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">{VENUE.name}</span>
            <span className="block text-xs text-muted">{VENUE.address}</span>
          </span>
          <a
            href={directions}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 border border-ink/30 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-colors hover:border-accent hover:text-accent"
          >
            Directions
            <ArrowUpRight size={12} weight="bold" />
          </a>
        </figcaption>
      </figure>
    </div>
  );
}
