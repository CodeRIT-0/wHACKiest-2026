import { ArrowUpRight, DiscordLogo, EnvelopeSimple, InstagramLogo, LinkedinLogo, MapPin } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { CopyAddress, VenueClock } from "./VenueTools";

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

// Socials on the left, the venue on the right: a monochrome map inside a blueprint frame
// (crosshair on the venue, compass, live local time), with copy-address and directions below.
// The map only loads when it scrolls near (loading="lazy").
export default function FindUs() {
  return (
    <div id="contact" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Find us</p>
          <h3 className="display-wide mt-2 text-3xl leading-tight sm:text-4xl">
            Socials &amp; location<span className="text-accent">.</span>
          </h3>
        </div>
        <p className="inline-flex items-center gap-2 border border-accent/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent motion-safe:animate-pulse" />
          01–02 Dec 2026 / On campus
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:content-start">
          {SOCIALS.map(({ label, note, href, icon: SocialIcon }) => (
            <li key={label}>
              <a
                href={href}
                className="group flex h-full items-center gap-3 border border-line bg-panel p-3.5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent lg:p-4"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center border border-ink/20 text-ink transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-[#050505] lg:h-11 lg:w-11">
                  <SocialIcon size={20} weight="bold" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold lg:text-base">{label}</span>
                  <span className="block truncate font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{note}</span>
                </span>
                <ArrowUpRight size={14} weight="bold" className="shrink-0 text-muted transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </a>
            </li>
          ))}
        </ul>

        <figure className="border border-line bg-panel">
          <div className="relative h-64 overflow-hidden sm:h-80 lg:h-[340px]">
            <iframe
              title={`Map: ${VENUE.name}`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_invert(0.92)_contrast(0.9)_brightness(0.95)]"
            />
            {/* blueprint frame: border, crosshair on the venue, compass and live time */}
            <div aria-hidden className="pointer-events-none absolute inset-3 border border-[#fff9ec]/15" />
            <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/70 motion-safe:animate-ping [animation-duration:2.4s]" />
              <span className="absolute left-1/2 top-1/2 h-24 w-px -translate-x-1/2 -translate-y-1/2 bg-accent/50" />
              <span className="absolute left-1/2 top-1/2 h-px w-24 -translate-x-1/2 -translate-y-1/2 bg-accent/50" />
              <span className="relative block h-3 w-3 rounded-full border-2 border-[#050505] bg-accent" />
            </div>
            <div aria-hidden className="pointer-events-none absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-[#fff9ec]/30 font-mono text-[10px] font-bold text-[#fff9ec]">
              N
              <span className="absolute -top-1.5 left-1/2 h-2 w-px -translate-x-1/2 bg-accent" />
            </div>
            <p className="pointer-events-none absolute bottom-5 left-5 bg-[#050505]/80 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#fff9ec]">
              Venue time / <VenueClock />
            </p>
          </div>
          <figcaption className="flex flex-wrap items-center gap-3 border-t border-line p-3.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center bg-accent text-[#050505]">
              <MapPin size={20} weight="fill" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{VENUE.name}</span>
              <span className="block text-xs text-muted">{VENUE.address}</span>
            </span>
            <span className="flex gap-2">
              <CopyAddress text={`${VENUE.name}, ${VENUE.address}`} />
              <a
                href={directions}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-accent px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#050505] transition-transform active:scale-[0.98]"
              >
                Directions
                <ArrowUpRight size={12} weight="bold" />
              </a>
            </span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
