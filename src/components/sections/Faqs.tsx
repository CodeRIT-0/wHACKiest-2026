"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { faqCategories, faqContent, faqItems, type FaqCategory } from "@/content/faqs";
import FaqTerminal from "./FaqTerminal";
import "./Faqs.css";
import ComputingBackdrop from "./ComputingBackdrop";
import SectionHeader from "../SectionHeader";

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
  const listRef = useRef<HTMLDivElement>(null);
  const scrollShellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const shell = scrollShellRef.current;
    if (!list || !shell) return;
    // Only this region resets. Measure its content as accordion rows expand/collapse.
    list.scrollTop = 0;
    let frame = 0, disposed = false;
    const measure = () => {
      frame = 0;
      shell.dataset.overflowTop = String(list.scrollTop > 1);
      shell.dataset.overflowBottom = String(list.scrollHeight - list.clientHeight - list.scrollTop > 1);
    };
    const schedule = () => { if (!disposed && !frame) frame = requestAnimationFrame(measure); };
    const resize = new ResizeObserver(schedule);
    resize.observe(list);
    const content = list.querySelector(".faq-list-content");
    if (content) resize.observe(content);
    list.addEventListener("scroll", schedule, { passive: true });
    document.fonts.ready.then(schedule);
    measure();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      list.removeEventListener("scroll", schedule);
    };
  }, [filter]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    // the curve only changes while the section is on screen, so the scroll work (a layout read per
    // frame) only runs then, not all the way down the page
    let frame = 0, disposed = false, onScreen = false;
    const observer = new IntersectionObserver(([entry]) => {
      section.dataset.visible = String(entry.isIntersecting);
      if (entry.isIntersecting) section.dataset.revealed = "true";
      onScreen = entry.isIntersecting;
      schedule();
    }, { threshold: 0 });
    observer.observe(section);
    const update = () => {
      frame = 0;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      section.style.setProperty("--faq-curve", String(reduced ? 0 : Math.max(0, Math.min(1, (section.getBoundingClientRect().top - window.innerHeight * .25) / (window.innerHeight * .65)))));
    };
    function schedule() { if (onScreen && !disposed && !frame) frame = requestAnimationFrame(update); }
    const resize = new ResizeObserver(schedule);
    resize.observe(section);
    document.fonts.ready.then(schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule); update();
    return () => { disposed = true; observer.disconnect(); resize.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);

  return (
    <section id="faqs" className="faq-section" ref={sectionRef} aria-labelledby="faq-title">
      <ComputingBackdrop variant="faq" />
      <div className="faq-layout">
        <header className="faq-heading faq-reveal">
          <div id="faq-title"><SectionHeader index="07" label="FAQs" title="Got questions?" /></div>
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
            <div className="faq-terminal-header">
              <p className="faq-terminal-strip">wH / KNOWLEDGE BASE</p>
              <div className="faq-terminal-heading">
                <div id="faq-help-center-title" className="faq-titlebar"><span aria-hidden="true">&gt;</span> HELP CENTER</div>
                <span className="faq-active-category">{filter === "all" ? "All" : categories.find(category => category.id === filter)?.label}</span>
              </div>
            </div>
            <div className="faq-list-shell" ref={scrollShellRef}>
              <div
                className="faq-results"
                key={filter}
                ref={listRef}
                role="region"
                aria-labelledby="faq-help-center-title"
                tabIndex={0}
                data-lenis-prevent
              >
                <div className="faq-list-content">
                  {visibleItems.map((item, index) => {
                    const expanded = !hydrated || open === item.id;
                    const answerId = `faq-answer-${item.id}`;
                    const questionId = `faq-question-${item.id}`;
                    return (
                      <div className="faq-item" key={item.id} data-open={expanded}>
                        <h3>
                          <button type="button" id={questionId} aria-expanded={expanded} aria-controls={answerId} onClick={() => setOpen(current => current === item.id ? null : item.id)}>
                            <span className="faq-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                            <span className="faq-question-text">{item.question}</span>
                            <span className="faq-toggle" aria-hidden="true">
                              {expanded ? "−" : "+"}
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
