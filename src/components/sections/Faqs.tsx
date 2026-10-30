"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { faqContent, faqItems } from "@/content/faqs";
import FaqTerminal from "./FaqTerminal";
import "./Faqs.css";
import ComputingBackdrop from "./ComputingBackdrop";

const subscribeToClient = () => () => {};

export default function Faqs() {
  const hydrated = useSyncExternalStore(subscribeToClient, () => true, () => false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
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
    <section id="faq" className="faq-section" ref={sectionRef} aria-labelledby="faq-title">
      <div className="faq-boundary-curve" aria-hidden="true" /><ComputingBackdrop variant="faq" />
      {/* Preserve existing /#faqs links without publishing a second FAQ section. */}
      <span id="faqs" className="faq-legacy-anchor" aria-hidden="true" />
      <div className="faq-layout">
        <div className="faq-intro faq-reveal">
          <header>
            <p className="faq-eyebrow"><span aria-hidden="true" />{faqContent.label}</p>
            <h2 id="faq-title">{faqContent.title}</h2>
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
            <div id="faq-index" className="faq-index" hidden={!menuOpen} onKeyDown={event => { if (event.key === "Escape") { setMenuOpen(false); sectionRef.current?.querySelector<HTMLButtonElement>(".faq-menu-button")?.focus(); } }}>
              {faqItems.map((item, index) => <button type="button" key={item.question} onClick={() => { setOpen(index); setMenuOpen(false); document.getElementById(`faq-question-${index + 1}`)?.focus(); }}>{String(index + 1).padStart(2, "0")} / {item.question}</button>)}
            </div>
            {faqItems.map((item, index) => {
              const expanded = !hydrated || open === index;
              const answerId = `faq-answer-${index + 1}`;
              const questionId = `faq-question-${index + 1}`;
              return (
                <div className="faq-item" key={item.question} data-open={expanded}>
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
