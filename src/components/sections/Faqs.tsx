"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { faqCategories, faqContent, faqItems, type FaqCategory } from "@/content/faqs";
import FaqTerminal from "./FaqTerminal";
import "./Faqs.css";
import ComputingBackdrop from "./ComputingBackdrop";

const subscribeToClient = () => () => {};

export default function Faqs() {
  const hydrated = useSyncExternalStore(subscribeToClient, () => true, () => false);
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<FaqCategory | "all">("all");
  const categories = faqCategories.filter(category => faqItems.some(item => item.category === category.id));
  const visibleItems = faqItems.filter(item => filter === "all" || item.category === filter);
  const activeQuestion = faqItems.find(item => item.id === open);
  const selectCategory = (category: FaqCategory | "all") => {
    setFilter(category);
    if (activeQuestion && category !== "all" && activeQuestion.category !== category) setOpen(null);
  };
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      section.dataset.visible = String(entry.isIntersecting);
      if (entry.isIntersecting) section.dataset.revealed = "true";
    }, { threshold: 0 });
    observer.observe(section);
    let frame = 0, disposed = false;
    const update = () => {
      frame = 0;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      section.style.setProperty("--faq-curve", String(reduced ? 0 : Math.max(0, Math.min(1, (section.getBoundingClientRect().top - window.innerHeight * .25) / (window.innerHeight * .65)))));
    };
    const schedule = () => { if (!disposed && !frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    resize.observe(section);
    document.fonts.ready.then(schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule); update();
    return () => { disposed = true; observer.disconnect(); resize.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);

  return (
    <section id="faq" className="faq-section" ref={sectionRef} aria-labelledby="faq-title">
      <div className="faq-boundary-curve" aria-hidden="true" /><ComputingBackdrop variant="faq" />
      {/* Preserve existing /#faqs links without publishing a second FAQ section. */}
      <span id="faqs" className="faq-legacy-anchor" aria-hidden="true" />
      <div className="faq-layout">
        <header className="faq-heading faq-reveal">
          <p className="faq-eyebrow"><span aria-hidden="true" />{faqContent.label}</p>
          <h2 id="faq-title">{faqContent.title}</h2>
          <p className="faq-subtitle">{faqContent.subtitle}</p>
        </header>
        <div className="faq-tools">
          <div className="faq-filters" role="group" aria-label="Filter questions by category">
            {[{ id: "all" as const, label: "All" }, ...categories].map(category => (
              <button key={category.id} type="button" aria-pressed={filter === category.id} onClick={() => selectCategory(category.id)}>
                {category.label}
              </button>
            ))}
          </div>
          <p className="faq-result-count" role="status" aria-live="polite" aria-atomic="true">{visibleItems.length} {visibleItems.length === 1 ? "question" : "questions"}{filter === "all" ? " across all categories" : ` in ${categories.find(category => category.id === filter)?.label}`}</p>
        </div>
        <div className="faq-intro faq-reveal">
          <FaqTerminal requestKey={open} category={activeQuestion?.signalCategory ?? null} />
        </div>
        <div className="faq-right faq-reveal">
          <div className="faq-window">
            <div className="faq-titlebar">HELP CENTER</div>
            <div className="faq-results" key={filter}>
              {visibleItems.map((item, index) => {
                const expanded = !hydrated || open === item.id;
                const answerId = `faq-answer-${item.id}`;
                const questionId = `faq-question-${item.id}`;
                return (
                  <div className="faq-item" key={item.id} data-open={expanded}>
                    <h3>
                      <button type="button" id={questionId} aria-expanded={expanded} aria-controls={answerId} onClick={() => setOpen(current => current === item.id ? null : item.id)}>
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
