"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import HelpTerminal, { TerminalGlyphType } from "./HelpTerminal";
import SectionHeader from "../SectionHeader";

interface FAQItem {
  id: number;
  numStr: string;
  q: string;
  a: string;
  glyph: TerminalGlyphType;
}

// TODO: confirm eligibility and fee details with the organising team
const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    numStr: "01",
    q: "HOW BIG CAN A TEAM BE?",
    a: "Two to four members. Solo entries aren't accepted, so find a crew early.",
    glyph: "team",
  },
  {
    id: 2,
    numStr: "02",
    q: "HOW LONG IS THE HACKATHON?",
    a: "24 hours, start to finish. Plan for one long, caffeinated stretch.",
    glyph: "checklist",
  },
  {
    id: 3,
    numStr: "03",
    q: "IS THERE A REGISTRATION FEE?",
    a: "Only shortlisted teams pay, through the Payments page, to confirm their spot.",
    glyph: "payment",
  },
  {
    id: 4,
    numStr: "04",
    q: "WHAT CAN WE BUILD?",
    a: "Anything that fits one of the four tracks. If nothing fits, pitch it under Open Innovation.",
    glyph: "document",
  },
  {
    id: 5,
    numStr: "05",
    q: "WHAT'S UP FOR GRABS?",
    a: "A ₹50,000 prize pool, split across the top three teams.",
    glyph: "checklist",
  },
  {
    id: 6,
    numStr: "06",
    q: "WHERE DO ANNOUNCEMENTS GO?",
    a: "On the Updates page. Shortlisted teams are listed on the Shortlisted page.",
    glyph: "document",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // first item open by default

  const currentItem = openIndex !== null ? FAQ_DATA[openIndex] : null;
  const activeGlyph: TerminalGlyphType = currentItem ? currentItem.glyph : "team";

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faqs"
      data-panel
      className="theme-dark dark-panel relative w-full overflow-x-hidden selection:bg-[#FD9C36] selection:text-[#050505] pt-0 pb-28 border-t-0"
    >
      {/* (the rounded black panel is the hand-off from the section above, so no curve or connector here) */}
      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 pt-24">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#222] pb-8 mb-12 gap-6">
          <div>
            <SectionHeader index="08" label="FAQs" title="Got questions?" />
          </div>

          <div className="flex items-center gap-3">
            {/* Top Neo-brutalist "MENU +" Button */}
            <button
              onClick={() => {
                const el = document.getElementById("procedure");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="border-2 border-[#FFF9EC] bg-[#050505] text-[#FFF9EC] px-4 py-2 font-mono text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_#FD9C36] hover:bg-[#181818] active:shadow-[1px_1px_0px_#FD9C36] active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              MENU +
            </button>
            <span className="font-mono text-xs text-[#FFF9EC]/50 uppercase hidden sm:inline-block">
              {"//"} {String(FAQ_DATA.length).padStart(2, "0")} PARSED ENTRIES
            </span>
          </div>
        </div>

        {/* 2-Column Layout: Left Retro CRT Terminal, Right Question Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Retro Help Terminal (Sticky on desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <HelpTerminal
              activeGlyph={activeGlyph}
              activeQuestionNumber={currentItem?.id ?? null}
              activeQuestionTitle={currentItem?.q}
            />
          </div>

          {/* Right Column: Single-Open Question Accordion */}
          <div className="lg:col-span-7 space-y-3">
            {FAQ_DATA.map((item, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={item.id}
                  className={`border-2 transition-colors duration-150 ${
                    isOpen
                      ? "border-[#FFF9EC] bg-[#0d0d0d] shadow-[4px_4px_0px_#FD9C36]"
                      : "border-[#222] bg-[#050505] hover:border-[#444] shadow-[2px_2px_0px_#111]"
                  }`}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4 sm:gap-5 pr-2">
                      {/* Number Badge */}
                      <span
                        className={`font-mono text-sm sm:text-base font-black px-2 py-0.5 border ${
                          isOpen
                            ? "bg-[#FD9C36] text-[#050505] border-[#050505]"
                            : "bg-[#181818] text-[#FFF9EC]/60 border-[#333]"
                        }`}
                      >
                        {item.numStr}
                      </span>

                      {/* Question Title */}
                      <span
                        className={`font-mono text-sm sm:text-base font-bold tracking-tight uppercase leading-snug transition-colors ${
                          isOpen ? "text-[#FFF9EC]" : "text-[#FFF9EC]/80 hover:text-[#FFF9EC]"
                        }`}
                      >
                        {item.q}
                      </span>
                    </div>

                    {/* Chevron Indicator */}
                    <div
                      className={`w-7 h-7 flex-shrink-0 border flex items-center justify-center font-mono font-bold transition-transform duration-200 ${
                        isOpen
                          ? "rotate-180 bg-[#0357D6] text-white border-[#FFF9EC]"
                          : "rotate-0 bg-[#141414] text-[#FFF9EC]/50 border-[#333]"
                      }`}
                    >
                      ▼
                    </div>
                  </button>

                  {/* Immediate Answer Reveal (Accessible, no sluggish lag) */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-[#222] font-mono text-xs sm:text-sm text-[#FFF9EC]/80 leading-relaxed">
                          <p>{item.a}</p>
                          <div className="mt-3 pt-2 border-t border-[#1a1a1a] flex items-center justify-between text-[10px] text-[#FD9C36]">
                            <span>{"//"} TELEMETRY_VERIFIED</span>
                            <span className="text-[#0357D6] font-bold">ERA: ALL_TRACKS</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

