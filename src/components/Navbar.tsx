"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { RetroLink } from "./ui/retro-button";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#timeline", label: "Timeline" },
  { href: "/#tracks", label: "Tracks" },
  { href: "/#prizes", label: "Prizes" },
  { href: "/#faqs", label: "FAQs" },
  { href: "/#team", label: "Team" },
  { href: "/announcements", label: "Updates" },
];

export default function Navbar() {
  const [openPath, setOpenPath] = useState<string | null>(null);
  const pathname = usePathname();
  const open = openPath === pathname;
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPath(null);
        document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <div className="nav-inner">
        <Link href="/" className="nav-brand" onClick={() => setOpenPath(null)}>
          wHACKiest<span>.</span>
          <small>2026</small>
        </Link>
        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <RetroLink href="/register">Register</RetroLink>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpenPath(open ? null : pathname)}
          >
            {open ? "CLOSE ×" : "MENU ☰"}
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-menu" id="mobile-navigation">
          {links.map((link, i) => (
            <Link
              href={link.href}
              key={link.href}
              onClick={() => setOpenPath(null)}
            >
              {link.label}
              <span>0{i + 1} ↗</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
