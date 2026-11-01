"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { scrollToStory, STORY_HASH } from "./hero/story-scroll";
import { scrollToPosition } from "./system/SmoothScroll";

// every homepage section in page order, then the announcements page
const links = [
  { href: `/${STORY_HASH}`, label: "About" },
  { href: "/#timeline", label: "Timeline" },
  { href: "/#tracks", label: "Tracks" },
  { href: "/#prizes", label: "Prizes" },
  { href: "/#how-to-register", label: "How to join" },
  { href: "/#faqs", label: "FAQs" },
  { href: "/#team", label: "Team" },
  { href: "/#contact", label: "Contact" },
  { href: "/announcements", label: "Announcements" },
];

const EASE = "ease-[cubic-bezier(0.16,1,0.3,1)]";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [away, setAway] = useState(false);
  // published on <html> so things that stick to the top of the screen (the phone timeline's HUD)
  // can sit below the nav while it's showing and move up when it tucks away
  useEffect(() => {
    document.documentElement.toggleAttribute("data-nav-away", away);
    return () => document.documentElement.removeAttribute("data-nav-away");
  }, [away]);
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  // About points into the pinned hero, which needs a measured scroll, not an anchor. Without the
  // pin (reduced motion) the story never plays, so it falls back to the timeline
  const onLink = (e: MouseEvent, href: string) => {
    setMenuOpen(false);
    if (pathname !== "/" || href !== `/${STORY_HASH}`) return;
    e.preventDefault();
    if (!scrollToStory()) document.getElementById("timeline")?.scrollIntoView();
  };

  // only re-render when crossing a threshold, not on every scroll frame. Scrolling down tucks
  // the nav out of the way so it never sits on a heading; any upward scroll brings it back.
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 80;
    if (next !== scrolled) {
      setScrolled(next);
      // back at the top the full link list returns, so a menu left open there is closed
      if (!next) setMenuOpen(false);
    }
    const delta = y - (scrollY.getPrevious() ?? y);
    if (y < 160) {
      if (away) setAway(false);
    } else if (delta > 2 && !away) setAway(true);
    else if (delta < -2 && away) setAway(false);
  });

  // an open menu keeps the nav on screen even when scrolling down would tuck it away
  const hidden = away && !hovered && !menuOpen;
  // the full inline link list (wide screens): at the top of the page, or once Menu is pressed
  const expanded = !scrolled || menuOpen;

  return (
    <nav
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={(e) => {
        // focus moving to something outside the nav closes the menu
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setHovered(false);
          setMenuOpen(false);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setMenuOpen(false);
      }}
      className={`fixed left-[max(1rem,calc((100vw-1100px)/2))] z-50 flex h-[62px] items-center rounded-full border border-line bg-bg/85 pl-[5px] pr-1.5 max-lg:bg-bg/95 lg:backdrop-blur top-3 transition-[translate,opacity] duration-500 ${EASE} ${
        hidden ? "pointer-events-none -translate-y-[140%] opacity-0" : scrolled ? "" : "translate-y-8"
      }`}
    >
      {/* the full CodeRIT logo, always */}
      {/* from another page it routes home; already on the landing page, it scrolls back to the top
          (a plain link to the current route wouldn't move) and clears any #section from the URL */}
      <Link
        href="/"
        aria-label="CodeRIT home"
        onClick={(e) => {
          setMenuOpen(false);
          if (pathname !== "/") return;
          e.preventDefault();
          if (window.location.hash) history.replaceState(null, "", "/");
          scrollToPosition(0, window.matchMedia("(prefers-reduced-motion: reduce)").matches);
        }}
        className="relative block h-[50px] w-[99px] shrink-0 overflow-hidden rounded-full bg-[#f5f0e6]">
        <Image
          src="/assets/coderit-logo.jpeg"
          alt=""
          width={498}
          height={252}
          priority
          className="absolute left-0 top-0 h-[50px] w-auto max-w-none brightness-[1.06] contrast-[1.08] mix-blend-multiply"
        />
      </Link>

      {/* At the top of the page (on screens wide enough) every section is listed inline. Once
          scrolled, the list folds away and the Menu button unfolds beside the logo; pressing it
          unfolds the same list again, right in the bar. Both fold by easing their grid column
          between 1fr and 0fr. Narrower screens can't fit the list, so their Menu opens a panel. */}
      <div
        inert={!expanded}
        className={`hidden transition-[grid-template-columns,opacity] duration-500 xl:grid ${EASE} ${
          expanded ? "grid-cols-[1fr] opacity-100" : "grid-cols-[0fr] opacity-0"
        }`}
      >
        <ul id="site-links" className="flex min-w-0 items-center gap-4 overflow-hidden whitespace-nowrap pl-5 pr-2 text-[13px]">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={(e) => onLink(e, l.href)} className="transition-colors hover:text-accent">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div
        className={`grid transition-[grid-template-columns,opacity,visibility] duration-500 ${EASE} ${
          scrolled ? "grid-cols-[1fr] opacity-100" : "grid-cols-[1fr] opacity-100 xl:invisible xl:grid-cols-[0fr] xl:opacity-0"
        }`}
      >
        <div className="flex min-w-0 overflow-hidden">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-links site-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="ml-3 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-ink/30 px-4 py-3 text-xs font-semibold uppercase transition-colors hover:border-ink"
          >
            Menu
            {/* plus that turns into a minus as the menu opens */}
            <span aria-hidden className="relative h-2.5 w-2.5">
              <span className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-current" />
              <span className={`absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 bg-current transition-transform duration-300 ${EASE} ${menuOpen ? "scale-y-0" : "scale-y-100"}`} />
            </span>
          </button>
        </div>
      </div>
      <Link
        href="/register"
        className="ml-2 whitespace-nowrap rounded-full bg-ink px-5 py-3 text-xs font-semibold uppercase text-bg transition-transform active:scale-[0.97]"
      >
        Register
      </Link>

      {/* collapsible menu: the grid row eases between 0fr and 1fr, so it unfolds to its real height */}
      <div
        id="site-menu"
        inert={!menuOpen}
        className={`absolute left-0 top-[calc(100%+8px)] grid w-[min(calc(100vw-2rem),420px)] xl:hidden transition-[grid-template-rows,opacity,translate] duration-500 ${EASE} ${
          menuOpen ? "grid-rows-[1fr] opacity-100" : "pointer-events-none -translate-y-2 grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden rounded-2xl border border-line bg-bg/95 shadow-[0_18px_40px_-20px_color-mix(in_srgb,var(--fg)_45%,transparent)] backdrop-blur">
          <ul className="grid grid-cols-2 gap-1 p-2">
            {links.map((l, i) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={(e) => onLink(e, l.href)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-ink hover:text-bg"
                >
                  <span className="font-mono text-[10px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
