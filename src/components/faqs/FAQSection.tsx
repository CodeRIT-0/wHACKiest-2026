"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HelpTerminal, { TerminalGlyphType } from "./HelpTerminal";

interface FAQItem {
  id: number;
  numStr: string;
  q: string;
  a: string;
  glyph: TerminalGlyphType;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    numStr: "01",
    q: "WHAT IS DSU DEVHACK 3.0?",
    a: "DSU DEVHACK 3.0 is a flagship 36-hour national-level hackathon organized around the narrative theme 'TIME HEIST — Evolution of Computing'. Hackers journey across four pivotal computing eras—from vintage punchcard algorithms to modern quantum/neural breakthroughs—building innovative, high-impact prototypes.",
    glyph: "document",
  },
  {
    id: 2,
    numStr: "02",
    q: "AT WHICH LEVEL IS THIS HACKATHON CONDUCTED?",
    a: "DevHack 3.0 is a prestigious National-Level collegiate and developer competition attracting the top engineering minds, innovators, and designers from premier universities and tech institutions across India.",
    glyph: "document",
  },
  {
    id: 3,
    numStr: "03",
    q: "HOW MANY MEMBERS CAN PARTICIPATE IN A TEAM?",
    a: "Teams can consist of 2 to 4 members. Interdisciplinary squads combining software engineering, UI/UX design, and domain problem modeling are strongly encouraged.",
    glyph: "team",
  },
  {
    id: 4,
    numStr: "04",
    q: "WHAT IS THE QUALIFICATION TO PARTICIPATE?",
    a: "Any active undergraduate, postgraduate, or diploma student with a passion for building software or hardware solutions is eligible. All you need is a valid institutional student ID.",
    glyph: "checklist",
  },
  {
    id: 5,
    numStr: "05",
    q: "WHAT IS THE PARTICIPATION FEE?",
    a: "Stage 01 initial registration and idea deck submission are 100% FREE! There are no preliminary fees. Only shortlisted teams attending the 36-hour offline sprint complete final confirmation perks.",
    glyph: "payment",
  },
  {
    id: 6,
    numStr: "06",
    q: "IS THE HACKATHON OFFLINE AND HOW LONG DOES IT LAST?",
    a: "Yes! Following the online shortlisting round, the grand finale is a thrilling 36-hour in-person hackathon held on-campus with high-speed internet, rest zones, and non-stop operational support.",
    glyph: "checklist",
  },
  {
    id: 7,
    numStr: "07",
    q: "WHAT ARE THE RESTRICTIONS ON TEAM FORMATION FOR THE EVENT?",
    a: "Team members can be from different departments, academic years, or even different colleges. However, an individual participant can only be registered under one syndicate team.",
    glyph: "team",
  },
  {
    id: 8,
    numStr: "08",
    q: "WHAT ARE THE PERKS AND BENEFITS OF PARTICIPATING IN THE HACKATHON?",
    a: "Participants receive huge cash bounties, era trophy plaques, official sponsor API credits, custom hacker swag kits, networking opportunities with venture partners & industry leaders, and complimentary meals/energy drinks for all 36 hours.",
    glyph: "checklist",
  },
  {
    id: 9,
    numStr: "09",
    q: "I HAVE A QUESTION RELATED TO THE HACKATHON WHICH IS NOT LISTED ABOVE. WHAT SHOULD I DO?",
    a: "Reach out to our round-the-clock support dispatch via the #ask-queries channel on our official Discord server, or transmit an email directly to devhack@dsu.edu.in. Our ops team responds within hours.",
    glyph: "document",
  },
  {
    id: 10,
    numStr: "10",
    q: "HOW DO I RECIEVE THE IDEA SUBMISSION MAIL?",
    a: "Upon completing Step 01 registration, an automated telemetry email containing your team token and the official IDEA.PPT submission deck link will be dispatched immediately to the registered lead operator's inbox.",
    glyph: "team",
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
      className="relative w-full bg-[#000000] text-[#FFF9EC] overflow-x-hidden selection:bg-[#FD9C36] selection:text-[#050505] pt-0 pb-28 border-t-0"
    >
      {/* ── MARQUEE ANIMATION 3: BOUNDARY HANDOFF TOP CURVE & CIRCUIT INGRESS ── */}
      <div className="relative w-full -mt-1 pointer-events-none">
        {/* Shallow top transition curve smoothing into black */}
        <svg
          className="w-full h-16 sm:h-24 text-[#000000] fill-current block"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C480,40 960,40 1440,0 L1440,80 L0,80 Z" />
        </svg>

        {/* Central orange circuit trace crossing into black FAQ */}
        <div className="absolute left-4 md:left-1/2 -top-6 -translate-x-1/2 flex flex-col items-center">
          <div className="w-1 h-16 bg-gradient-to-b from-[#FD9C36] via-[#FD9C36] to-[#0357D6] shadow-[0_0_10px_#FD9C36]" />
          {/* Lit receiver node */}
          <div className="w-4 h-4 rounded-full bg-[#0357D6] border-2 border-[#FFF9EC] shadow-[0_0_10px_#0357D6] -mt-1 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-[#FFF9EC] rounded-full" />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 pt-8 sm:pt-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#222] pb-8 mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#FD9C36] uppercase tracking-widest mb-3">
              <span className="w-2 h-2 bg-[#FD9C36] inline-block" />
              INTELLIGENCE BASE // FAQ ARCHIVE
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[#FFF9EC] leading-none">
              GOT <span className="text-[#FD9C36]">QUESTIONS?</span>
            </h2>
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
              // 10 PARSED ENTRIES
            </span>
          </div>
        </div>

        {/* 2-Column Layout: Left Retro CRT Terminal, Right 10-Question Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Retro Help Terminal (Sticky on desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <HelpTerminal
              activeGlyph={activeGlyph}
              activeQuestionNumber={currentItem?.id ?? null}
              activeQuestionTitle={currentItem?.q}
            />
          </div>

          {/* Right Column: Single-Open 10-Question Accordion */}
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
                            <span>// TELEMETRY_VERIFIED</span>
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

