"use client";

import { motion } from "motion/react";
import { ArrowUpRight, DiscordLogo, EnvelopeSimple, Globe, InstagramLogo, LinkedinLogo, TelegramLogo } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

type Social = { label: string; note: string; href: string; icon: Icon; brand: string; bg: string };

// From the wHACKiest 2026 brochure (Connect with us)
const SOCIALS: Social[] = [
  {
    label: "Instagram",
    note: "@code_rit",
    href: "https://www.instagram.com/code_rit",
    icon: InstagramLogo,
    brand: "#e1306c",
    bg: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)",
  },
  {
    label: "LinkedIn",
    note: "CodeRIT Club",
    href: "https://www.linkedin.com/company/coderitclub/",
    icon: LinkedinLogo,
    brand: "#0a66c2",
    bg: "#0a66c2",
  },
  { label: "Discord", note: "bit.ly/CodeRIT_Discord", href: "https://bit.ly/CodeRIT_Discord", icon: DiscordLogo, brand: "#5865f2", bg: "#5865f2" },
  {
    label: "Telegram",
    note: "bit.ly/CodeRIT_Telegram",
    href: "https://bit.ly/CodeRIT_Telegram",
    icon: TelegramLogo,
    brand: "#229ed9",
    bg: "linear-gradient(135deg,#2aabee,#229ed9)",
  },
  {
    label: "Email",
    note: "coderit@msrit.edu",
    href: "mailto:coderit@msrit.edu",
    icon: EnvelopeSimple,
    brand: "#ea4335",
    bg: "linear-gradient(135deg,#ea4335,#fbbc05)",
  },
  {
    label: "Website",
    note: "coderit.netlify.app",
    href: "https://coderit.netlify.app",
    icon: Globe,
    brand: "#fd9c36",
    bg: "linear-gradient(135deg,#fd9c36,#e86a17)",
  },
];

// Socials as six brand-coloured tiles. They rise in one after another as the section arrives;
// on hover the tile lifts on a shadow in its own brand colour, the icon chip tilts and grows,
// and a wash of the brand colour floods up from the bottom.
export default function SocialTiles() {
  return (
    <ul className="grid grid-cols-1 gap-3 min-[440px]:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {SOCIALS.map(({ label, note, href, icon: SocialIcon, brand, bg }, i) => {
        const external = href.startsWith("http");
        return (
          <motion.li
            key={label}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              aria-label={`${label}: ${note}`}
              className="group/s relative flex h-full items-center gap-3 overflow-hidden rounded-[16px] border border-line bg-panel p-3.5 transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 sm:p-4"
              style={{ ["--brand" as string]: brand }}
            >
              {/* brand wash rising from the bottom */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-0 opacity-20 transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/s:h-full"
                style={{ background: bg }}
              />
              <span
                className="relative grid h-11 w-11 shrink-0 place-items-center rounded-[12px] text-white shadow-[0_6px_14px_-6px_var(--brand)] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/s:-rotate-6 group-hover/s:scale-110 sm:h-12 sm:w-12"
                style={{ background: bg }}
              >
                <SocialIcon size={24} weight="fill" />
              </span>
              <span className="relative min-w-0 flex-1">
                <span className="block text-sm font-semibold sm:text-base">{label}</span>
                <span className="block truncate font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{note}</span>
              </span>
              <ArrowUpRight
                size={15}
                weight="bold"
                className="relative shrink-0 text-muted transition-[translate,color] duration-300 group-hover/s:-translate-y-0.5 group-hover/s:translate-x-0.5 group-hover/s:text-[var(--brand)]"
              />
              {/* border and shadow pick up the brand colour */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[16px] border-2 border-[var(--brand)] opacity-0 shadow-[0_18px_36px_-18px_var(--brand)] transition-opacity duration-300 group-hover/s:opacity-100"
              />
            </a>
          </motion.li>
        );
      })}
    </ul>
  );
}
