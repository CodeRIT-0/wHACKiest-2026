import { DiscordLogo, InstagramLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";

// Official social destinations from the wHACKiest 2026 brochure.
const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/code_rit", icon: InstagramLogo, color: "url(#coderit-instagram-gradient)", weight: "regular" as const },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/coderitclub/", icon: LinkedinLogo, color: "#0A66C2", weight: "fill" as const },
  { label: "Discord", href: "https://bit.ly/CodeRIT_Discord", icon: DiscordLogo, color: "#5865F2", weight: "fill" as const },
];

// Utility destinations keep their original URLs without borrowing a platform's brand mark.
const CONTACT_LINKS = [
  { label: "Email", href: "mailto:coderit@msrit.edu" },
  { label: "Website", href: "https://coderit.netlify.app" },
];

export default function SocialTiles() {
  return (
    <ul aria-label="CodeRIT social and contact links" className="flex flex-wrap items-center gap-x-6 gap-y-4 sm:gap-x-8">
      {SOCIALS.map(({ label, href, icon: SocialIcon, color, weight }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="inline-flex min-h-11 min-w-11 items-center justify-center transition-[transform,translate,scale] duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-safe:hover:-translate-y-[3px] motion-safe:hover:scale-[1.06] motion-safe:focus-visible:-translate-y-[3px] motion-safe:focus-visible:scale-[1.06] motion-reduce:transition-none"
          >
            <SocialIcon size={36} viewBox={label === "Discord" ? "0 0 256 256" : "24 24 208 208"} weight={weight} color={color} aria-hidden="true" focusable="false">
              {label === "Instagram" && (
                <defs>
                  <radialGradient id="coderit-instagram-gradient" cx="25%" cy="100%" r="120%">
                    <stop offset="0%" stopColor="#FEDA75" />
                    <stop offset="30%" stopColor="#FA7E1E" />
                    <stop offset="58%" stopColor="#D62976" />
                    <stop offset="80%" stopColor="#962FBF" />
                    <stop offset="100%" stopColor="#4F5BD5" />
                  </radialGradient>
                </defs>
              )}
              {/* White shows through the brand glyph's cutouts, including its “in” detail. */}
              {label === "LinkedIn" && <rect x="32" y="32" width="192" height="192" fill="#FFFFFF" />}
            </SocialIcon>
          </a>
        </li>
      ))}
      {CONTACT_LINKS.map(({ label, href }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith("https:") ? "_blank" : undefined}
            rel={href.startsWith("https:") ? "noopener noreferrer" : undefined}
            aria-label={label}
            className="inline-flex min-h-11 items-center px-1 font-semibold text-ink underline decoration-current underline-offset-4 transition-colors duration-200 hover:text-accent focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-reduce:transition-none"
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
