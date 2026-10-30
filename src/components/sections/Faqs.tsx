"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { FAQ_CATEGORIES, faqContent, faqItems, type FaqCategory } from "@/content/faqs";
import FaqTerminal from "./FaqTerminal";
import "./Faqs.css";
import ComputingBackdrop from "./ComputingBackdrop";
import SectionHeader from "../SectionHeader";

const subscribeToClient = () => () => {};

export default function Faqs() {
  const hydrated = useSyncExternalStore(subscribeToClient, () => true, () => false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FaqCategory | "all">("all");
  // search matches the question and the answer text
  const needle = query.trim().toLowerCase();
  const matches = (index: number) => {
    const item = faqItems[index];
    if (filter !== "all" && item.category !== filter) return false;
    if (!needle) return true;
    return (item.question + " " + item.answer.map((p) => p.text).join("")).toLowerCase().includes(needle);
  };
  const shown = faqItems.filter((_, i) => matches(i)).length;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      section.dataset.visible = String(entry.isIntersecting);
      if (entry.isIntersecting) section.dataset.revealed = "true";
    }, { threshold: 0 });
    observer.observe(section);
    let frame = 0;
    const update = () => {
      frame = 0;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      section.style.setProperty("--faq-curve", String(reduced ? 0 : Math.max(0, Math.min(1, (section.getBoundingClientRect().top - window.innerHeight * .25) / (window.innerHeight * .65)))));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule); update();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);

  return (
    <section id="faqs" data-panel className="faq-section theme-dark dark-panel" ref={sectionRef} aria-labelledby="faq-title">
      <ComputingBackdrop variant="faq" />
      <div className="faq-layout">
        <div className="faq-intro faq-reveal">
          <header>
            <div id="faq-title"><SectionHeader index="08" label="FAQs" title="Got questions?" /></div>
            <p className="faq-subtitle">{faqContent.subtitle}</p>
          </header>
          <FaqTerminal requestKey={open} category={open === null ? null : faqItems[open].category} />
        </div>
        <div className="faq-right faq-reveal">
          <div className="faq-window">
            <div className="faq-titlebar">
              <span>help_center</span>
              <button className="faq-menu-button" type="button" aria-expanded={menuOpen} aria-controls="faq-index" onClick={() => setMenuOpen(value => !value)}>MENU <span aria-hidden="true">{menuOpen ? "−" : "+"}</span></button>
            </div>
            {/* search + category filter */}
            <div className="faq-tools">
              <label className="faq-search">
                <span aria-hidden>&gt;</span>
                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="search_questions" aria-label="Search FAQs" />
                <span className="faq-count" aria-live="polite">{String(shown).padStart(2, "0")}/{String(faqItems.length).padStart(2, "0")}</span>
              </label>
              <div className="faq-chips" role="group" aria-label="Filter by topic">
                {(["all", ...FAQ_CATEGORIES] as const).map((c) => (
                  <button key={c} type="button" aria-pressed={filter === c} onClick={() => setFilter(c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div id="faq-index" className="faq-index" hidden={!menuOpen} onKeyDown={event => { if (event.key === "Escape") { setMenuOpen(false); sectionRef.current?.querySelector<HTMLButtonElement>(".faq-menu-button")?.focus(); } }}>
              {faqItems.map((item, index) => <button type="button" key={item.question} onClick={() => { setOpen(index); setMenuOpen(false); document.getElementById(`faq-question-${index + 1}`)?.focus(); }}>{String(index + 1).padStart(2, "0")} / {item.question}</button>)}
            </div>
            {faqItems.map((item, index) => {
              const expanded = !hydrated || open === index;
              const answerId = `faq-answer-${index + 1}`;
              const questionId = `faq-question-${index + 1}`;
              return (
                <div className="faq-item" key={item.question} data-open={expanded} hidden={!matches(index)}>
                  <h3>
                    <button type="button" id={questionId} aria-expanded={expanded} aria-controls={answerId} onClick={() => setOpen(current => current === index ? null : index)}>
                      <span className="faq-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                      <span>{item.question}</span>
                      <span className="faq-toggle" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" focusable="false">
                          <path d="m7 10 5 5 5-5" />
                        </svg>
                      </span>
                    </button>
                  </h3>
                  <div id={answerId} className="faq-answer" role="region" aria-labelledby={questionId} aria-hidden={!expanded} inert={!expanded}>
                    <div className="faq-answer-inner">
                      <p>{item.answer.map((part, partIndex) => part.href ? <Link key={partIndex} href={part.href}>{part.text}</Link> : <span key={partIndex}>{part.text}</span>)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {shown === 0 && <p className="faq-empty">No questions match. Try another word, or ask the organisers below.</p>}
          </div>
          <div className="faq-contact">
            <p>Still have a question?</p>
            {faqContent.contactHref ? (
              <Link className="faq-contact-link" href={faqContent.contactHref}>CONTACT THE ORGANIZERS <span aria-hidden="true">↗</span></Link>
            ) : (
              <>
                <button className="faq-contact-link" type="button" disabled>CONTACT THE ORGANIZERS <span aria-hidden="true">↗</span></button>
                <p className="faq-contact-note">Contact details will be announced.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
