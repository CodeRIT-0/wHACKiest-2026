"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#timeline", label: "Timeline" },
  { href: "/#tracks", label: "Tracks" },
  { href: "/#prizes", label: "Prizes" },
  { href: "/#faqs", label: "FAQs" },
  { href: "/announcements", label: "Updates" },
];

const EASE = "ease-[cubic-bezier(0.16,1,0.3,1)]";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [away, setAway] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { scrollY } = useScroll();

  // only re-render when crossing a threshold, not on every scroll frame. Scrolling down tucks
  // the nav out of the way so it never sits on a heading; any upward scroll brings it back.
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 80;
    if (next !== scrolled) setScrolled(next);
    const delta = y - (scrollY.getPrevious() ?? y);
    if (y < 160) {
      if (away) setAway(false);
    } else if (delta > 2 && !away) setAway(true);
    else if (delta < -2 && away) setAway(false);
  });

  // full CodeRIT logo at the top; folds into the Pac-Man once scrolled, hover unfolds it
  const condensed = scrolled && !hovered;

  return (
    <nav
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={`fixed left-[max(1rem,calc((100vw-1100px)/2))] z-50 flex h-[62px] items-center rounded-full border border-line bg-bg/85 backdrop-blur transition-[padding,top,translate,opacity] duration-500 ${EASE} ${
        condensed ? "px-[5px]" : "pl-3 pr-1.5"
      } ${scrolled ? "top-3" : "top-11"} ${away && !hovered ? "pointer-events-none -translate-y-[140%] opacity-0" : ""}`}
    >
      {/* logo slot: width eases between the wordmark and the round Pac-Man */}
      <Link
        href="/"
        aria-label="CodeRIT home"
        className={`relative block h-[50px] shrink-0 overflow-hidden rounded-full bg-[#f5f0e6] transition-[width] duration-500 ${EASE} ${
          condensed ? "w-[50px]" : "w-[99px]"
        }`}
      >
        <Image
          src="/assets/coderit-logo.jpeg"
          alt=""
          width={498}
          height={252}
          priority
          className={`absolute left-0 top-0 h-[50px] w-auto max-w-none brightness-[1.06] contrast-[1.08] mix-blend-multiply transition duration-500 ${EASE} ${
            condensed ? "scale-90 opacity-0" : "opacity-100"
          }`}
        />
        <Image
          src="/assets/coderit-pacman.jpeg"
          alt=""
          width={100}
          height={100}
          priority
          className={`absolute left-0 top-0 h-[50px] w-[50px] rounded-full brightness-[1.06] contrast-[1.08] mix-blend-multiply transition duration-500 ${EASE} ${
            condensed ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
          }`}
        />
      </Link>

      {/* links fold away by animating the grid track from 1fr to 0fr */}
      <div
        inert={condensed}
        className={`grid transition-[grid-template-columns,opacity] duration-500 ${EASE} ${
          condensed ? "grid-cols-[0fr] opacity-0" : "grid-cols-[1fr] opacity-100"
        }`}
      >
        <div className="flex min-w-0 items-center overflow-hidden">
          <ul className="hidden items-center gap-6 whitespace-nowrap pl-6 pr-6 text-sm lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/register"
            className="ml-3 whitespace-nowrap rounded-full bg-ink px-5 py-3 text-xs font-semibold uppercase text-bg transition-transform active:scale-[0.97] lg:ml-0"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
