"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#timeline", label: "Timeline" },
  { href: "/#tracks", label: "Tracks" },
  { href: "/#prizes", label: "Prizes" },
  { href: "/#faqs", label: "FAQs" },
  { href: "/#team", label: "Team" },
  { href: "/announcements", label: "Announcements" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // condensed to the CodeRIT logo once scrolled; hovering expands it again
  const condensed = scrolled && !hovered;

  return (
    <nav
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`fixed left-1/2 top-11 z-50 flex -translate-x-1/2 items-center rounded-full border border-line bg-bg/85 backdrop-blur transition-all duration-300 ${
        condensed
          ? "h-16 w-16 justify-center"
          : "w-[min(1100px,calc(100%-24px))] justify-between gap-4 py-2.5 pl-5 pr-3"
      }`}
    >
      {condensed ? (
        // TODO: replace with the real CodeRIT logo
        <Link
          href="/"
          aria-label="CodeRIT home"
          className="grid h-11 w-11 place-items-center rounded-full bg-ink text-sm font-bold text-accent"
        >
          &lt;/&gt;
        </Link>
      ) : (
        <>
          <Link href="/" className="whitespace-nowrap text-lg font-bold">
            w<span className="text-accent">HACK</span>iest 2026
          </Link>
          <ul className="hidden gap-5 text-sm md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/register"
            className="whitespace-nowrap rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase text-bg"
          >
            Register
          </Link>
        </>
      )}
    </nav>
  );
}
