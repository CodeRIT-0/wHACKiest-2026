import { ArrowUpRight, DiscordLogo, EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import Reveal from "../../motion/Reveal";
import SocialTiles from "./SocialTiles";
import { CopyAddress, VenueClock } from "./VenueTools";

// From the wHACKiest 2026 brochure (Coordinators / Connect with us)
const CONTACT = {
  email: "coderit@msrit.edu" as string,
  students: [
    { name: "Mishka Tiwari", phone: "+91 8218934580" },
    { name: "Kamal Karteek U", phone: "+91 9108055864" },
  ],
  faculty: [
    { name: "Dr. China Appala Naidu", role: "Convener, HOD, Dept of CSE" },
    { name: "Pradeep Kumar D", role: "Faculty Coordinator" },
  ],
};

const DISCORD = "https://bit.ly/CodeRIT_Discord";

const VENUE = {
  name: "Ramaiah Institute of Technology",
  lines: ["MSR Nagar, MSRIT Post", "Bengaluru, Karnataka — 560054"],
  query: "Ramaiah Institute of Technology, Bengaluru",
};
const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(VENUE.query)}&output=embed`;
const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(VENUE.query)}`;

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-accent">{children}</p>
);

// Socials as brand-coloured tiles, then one panel in three columns: who to contact, the venue on
// a blueprint-framed map, and the address with directions. The map loads lazily as it nears.
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
        <p className="inline-flex items-center gap-2 rounded-full border border-accent/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent motion-safe:animate-pulse" />
          01–02 Dec 2026 / On campus
        </p>
      </div>

      <div className="mt-8">
        <SocialTiles />
      </div>

      <Reveal delay={0.1}>
        <div className="relative mt-6 overflow-hidden rounded-[24px] border border-line bg-panel">
          {/* an orange rim across the top, like the reference footer */}
          <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-accent" />
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center lg:gap-10">
            {/* ---- contact ---- */}
            <div className="space-y-6">
              <div>
                <Label>Contact</Label>
                {CONTACT.email ? (
                <a href={`mailto:${CONTACT.email}`} className="group/m mt-2 inline-flex items-center gap-2 font-semibold">
                  <EnvelopeSimple size={16} weight="bold" className="text-accent" />
                  <span className="bg-[linear-gradient(var(--accent),var(--accent))] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover/m:bg-[length:100%_2px]">
                    {CONTACT.email}
                  </span>
                </a>
                ) : (
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Email TBA</p>
                )}
              </div>
              <div>
                <Label>Student coordinators</Label>
                <ul className="mt-2 space-y-1.5">
                  {CONTACT.students.map((s, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Phone size={14} weight="bold" className="text-accent" />
                      <span className="font-semibold">{s.name}</span>
                      {s.phone ? (
                        <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="text-muted underline decoration-accent/50 underline-offset-4 hover:text-accent">
                          {s.phone}
                        </a>
                      ) : (
                        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">TBA</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Label>Convener &amp; faculty</Label>
                {CONTACT.faculty.map((f) => (
                  <p key={f.name} className="mt-2 text-sm">
                    <span className="font-semibold">{f.name}</span> <span className="text-muted">— {f.role}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* ---- map ---- */}
            <figure className="group/map relative overflow-hidden rounded-[18px] border-2 border-accent shadow-[0_24px_48px_-28px_var(--accent)] transition-transform duration-500 hover:scale-[1.015]">
              <div className="relative h-64 sm:h-72">
                <iframe
                  title={`Map: ${VENUE.name}`}
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0 transition-[filter] duration-700 [filter:grayscale(1)_invert(0.92)_contrast(0.9)_brightness(0.95)] group-hover/map:[filter:grayscale(0.2)_invert(0.92)_contrast(0.95)_brightness(1)]"
                />
                <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/70 motion-safe:animate-ping [animation-duration:2.4s]" />
                  <span className="absolute left-1/2 top-1/2 h-24 w-px -translate-x-1/2 -translate-y-1/2 bg-accent/50" />
                  <span className="absolute left-1/2 top-1/2 h-px w-24 -translate-x-1/2 -translate-y-1/2 bg-accent/50" />
                  <span className="relative block h-3 w-3 rounded-full border-2 border-[#050505] bg-accent" />
                </div>
                <p className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-[#050505]/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#fff9ec]">
                  Venue time / <VenueClock />
                </p>
              </div>
            </figure>

            {/* ---- venue ---- */}
            <div className="lg:text-right">
              <Label>Hackathon venue</Label>
              <p className="mt-2 flex items-start gap-2 font-semibold lg:justify-end">
                <MapPin size={18} weight="fill" className="mt-0.5 shrink-0 text-accent lg:order-2" />
                {VENUE.name}
              </p>
              {VENUE.lines.map((l) => (
                <p key={l} className="text-sm text-muted">
                  {l}
                </p>
              ))}
              <div className="mt-5 flex flex-wrap gap-2 lg:justify-end">
                <CopyAddress text={`${VENUE.name}, ${VENUE.lines.join(", ")}`} />
                <a
                  href={directions}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-accent px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#050505] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  Directions
                  <ArrowUpRight size={12} weight="bold" />
                </a>
              </div>
              <div className="mt-6">
                <Label>Join us</Label>
                <a
                  href={DISCORD}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/d mt-3 inline-flex items-center gap-2.5 rounded-full bg-[#5865f2] px-5 py-3 text-sm font-bold uppercase tracking-[0.06em] text-white shadow-[0_10px_24px_-12px_#5865f2] transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-12px_#5865f2]"
                >
                  <DiscordLogo size={20} weight="fill" className="transition-transform duration-500 group-hover/d:-rotate-12 group-hover/d:scale-110" />
                  Discord
                </a>
              </div>
            </div>
          </div>

          <p className="border-t border-line px-6 py-5 text-center text-sm font-semibold sm:text-base">
            Organised by <span className="text-accent">CodeRIT</span>
            <span className="block text-muted">Department of Computer Science and Engineering, Ramaiah Institute of Technology</span>
          </p>
        </div>
      </Reveal>
    </div>
  );
}
