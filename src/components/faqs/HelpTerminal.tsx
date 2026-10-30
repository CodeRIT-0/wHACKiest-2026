"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export type TerminalGlyphType = "team" | "document" | "checklist" | "payment";

interface HelpTerminalProps {
  activeGlyph: TerminalGlyphType;
  activeQuestionNumber: number | null;
  activeQuestionTitle?: string;
}

export default function HelpTerminal({
  activeGlyph,
  activeQuestionNumber,
  activeQuestionTitle,
}: HelpTerminalProps) {
  const [displayText, setDisplayText] = useState("");
  const targetPrompt = activeQuestionTitle
    ? `> QUERY_${activeQuestionNumber ? (activeQuestionNumber < 10 ? `0${activeQuestionNumber}` : activeQuestionNumber) : "SYS"}: "${activeQuestionTitle}"`
    : "> READY. AWAITING QUERY INPUT // SELECT KNOWLEDGE NODE...";

  useEffect(() => {
    // retype the prompt from scratch, one character per tick
    let index = 0;
    const timer = setInterval(() => {
      index++;
      setDisplayText(targetPrompt.slice(0, index));
      if (index >= targetPrompt.length) clearInterval(timer);
    }, 18);
    return () => clearInterval(timer);
  }, [targetPrompt]);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      {/* Connected Network Badges Above Monitor */}
      <div className="w-full flex items-center justify-between px-3 mb-2 font-mono text-[9px] uppercase tracking-wider text-[#FFF9EC]/60">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FD9C36] animate-pulse" />
          <span>NET_NODE: ACTIVE</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-1.5 py-0.5 border ${activeGlyph === "team" ? "bg-[#0357D6] text-white border-[#FFF9EC]" : "border-[#333]"}`}>SQUAD</span>
          <span className={`px-1.5 py-0.5 border ${activeGlyph === "document" ? "bg-[#FD9C36] text-[#050505] border-[#050505]" : "border-[#333]"}`}>DOCS</span>
          <span className={`px-1.5 py-0.5 border ${activeGlyph === "checklist" ? "bg-[#0357D6] text-white border-[#FFF9EC]" : "border-[#333]"}`}>RULES</span>
          <span className={`px-1.5 py-0.5 border ${activeGlyph === "payment" ? "bg-[#FD9C36] text-[#050505] border-[#050505]" : "border-[#333]"}`}>FEES</span>
        </div>
      </div>

      {/* Retro CRT Monitor Chassis */}
      <div className="w-full bg-[#181818] border-2 border-[#333] rounded-lg p-4 sm:p-5 shadow-[6px_6px_0px_#FD9C36] relative">
        {/* CRT Bezel Inner */}
        <div className="w-full bg-[#0a0a0a] border-2 border-[#222] rounded p-4 relative overflow-hidden text-[#FFF9EC] font-mono">
          {/* Subtle CRT Scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,249,236,0.15) 0px, transparent 1px, transparent 2px)",
            }}
          />

          {/* CRT Screen Glare */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />

          {/* Terminal Header */}
          <div className="flex items-center justify-between border-b border-[#333] pb-2 mb-3 text-[10px]">
            <div className="flex items-center gap-2 text-[#FD9C36] font-bold">
              <span>●</span>
              <span>help_terminal.sh</span>
            </div>
            <span className="text-[#FFF9EC]/40">TTY_1 // 9600 BAUD</span>
          </div>

          {/* Central Animated Vector Icon / Glyph Display */}
          <div className="h-36 sm:h-40 flex flex-col items-center justify-center relative my-2 bg-[#121212] border border-[#262626] rounded">
            <AnimatePresence mode="wait">
              {activeGlyph === "team" && (
                <motion.div
                  key="team"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <svg className="w-16 h-16 text-[#0357D6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span className="text-[10px] font-bold text-[#FD9C36] mt-2 tracking-widest uppercase">
                    TEAM_BADGE // SQUAD TELEMETRY
                  </span>
                </motion.div>
              )}

              {activeGlyph === "document" && (
                <motion.div
                  key="doc"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <svg className="w-16 h-16 text-[#FD9C36]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <line x1="10" y1="9" x2="8" y2="9" />
                  </svg>
                  <span className="text-[10px] font-bold text-[#0357D6] mt-2 tracking-widest uppercase">
                    DOCUMENT_GLYPH // SUBMISSION ARCHIVE
                  </span>
                </motion.div>
              )}

              {activeGlyph === "checklist" && (
                <motion.div
                  key="check"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <svg className="w-16 h-16 text-[#0357D6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <line x1="8" y1="9" x2="16" y2="9" />
                    <line x1="8" y1="13" x2="16" y2="13" />
                    <line x1="8" y1="17" x2="12" y2="17" />
                    <circle cx="16" cy="17" r="1.5" fill="#FD9C36" />
                  </svg>
                  <span className="text-[10px] font-bold text-[#FD9C36] mt-2 tracking-widest uppercase">
                    CHECKLIST_GLYPH // PROTOCOL & PERKS
                  </span>
                </motion.div>
              )}

              {activeGlyph === "payment" && (
                <motion.div
                  key="pay"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <svg className="w-16 h-16 text-[#FD9C36]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                    <circle cx="7" cy="15" r="1.5" fill="#0357D6" />
                    <circle cx="17" cy="15" r="1.5" fill="#0357D6" />
                  </svg>
                  <span className="text-[10px] font-bold text-[#0357D6] mt-2 tracking-widest uppercase">
                    PAYMENT_GLYPH // ZERO HIDDEN TOLLS
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Typewriter Prompt Area */}
          <div className="min-h-12 text-[11px] text-[#FFF9EC]/90 border-t border-[#333] pt-2">
            <span>{displayText}</span>
            <span className="inline-block w-2 h-3.5 bg-[#FD9C36] ml-1 animate-pulse align-middle" />
          </div>
        </div>

        {/* CRT Front Panel Buttons & Logo */}
        <div className="flex items-center justify-between pt-3 px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FD9C36] border border-[#050505]" />
            <span className="font-mono text-[9px] text-[#FFF9EC]/50 font-bold">POWER ON</span>
          </div>
          <span className="font-mono text-[10px] font-black tracking-widest text-[#FFF9EC]/70 uppercase">
            HEIST-TRONIX 2026
          </span>
          <div className="flex gap-1">
            <span className="w-3 h-1 bg-[#444] rounded" />
            <span className="w-3 h-1 bg-[#444] rounded" />
          </div>
        </div>
      </div>

      {/* Monitor Stand Base */}
      <div className="w-28 h-4 bg-[#262626] border-2 border-t-0 border-[#333]" />
      <div className="w-48 h-3 bg-[#1e1e1e] border-2 border-[#333] rounded-b shadow-[3px_3px_0px_#FD9C36]" />

      {/* Keyboard & Mouse illustration */}
      <div className="w-full flex items-center justify-center gap-3 mt-3">
        {/* Keyboard */}
        <div className="w-56 h-8 bg-[#181818] border border-[#333] p-1 flex flex-col justify-between rounded shadow-[2px_2px_0px_#FD9C36]">
          <div className="flex gap-0.5 justify-between">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="w-2.5 h-2 bg-[#2a2a2a] rounded-[1px]" />
            ))}
          </div>
          <div className="flex gap-0.5 justify-between">
            <div className="w-6 h-2 bg-[#2a2a2a] rounded-[1px]" />
            <div className="w-16 h-2 bg-[#FD9C36]/80 rounded-[1px]" />
            <div className="w-8 h-2 bg-[#2a2a2a] rounded-[1px]" />
          </div>
        </div>

        {/* Mouse */}
        <div className="w-6 h-8 bg-[#181818] border border-[#333] rounded-t-full p-0.5 flex flex-col items-center justify-between shadow-[2px_2px_0px_#FD9C36]">
          <div className="w-1 h-2 bg-[#FD9C36] rounded-full mt-1" />
          <div className="w-3 h-2 bg-[#262626] rounded-b mb-1" />
        </div>
      </div>
    </div>
  );
}

