"use client";

import React, { useState, memo } from "react";

const candidates = [
  { id: "SVR-081", codename: "NEURAL_FORGE", score: "94.2%", status: "WAITLIST" },
  { id: "SVR-094", codename: "CHRONO_HACKERS", score: "98.7%", status: "SELECTED" },
  { id: "SVR-112", codename: "QUANTUM_KINETIC", score: "92.0%", status: "REVIEW" },
  { id: "SVR-145", codename: "SYNAPSE_PUNKS", score: "95.4%", status: "PENDING" },
];

function TerminalReviewCardComponent({ isActive }: { isActive: boolean }) {
  const [selectedIdx, setSelectedIdx] = useState(1);

  return (
    <div className="relative w-full max-w-lg mx-auto bg-[#050505] text-[#FFF9EC] border-2 border-[#050505] shadow-[6px_6px_0px_#FD9C36] p-4 font-mono text-xs overflow-hidden">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-[#FFF9EC]/20 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FD9C36]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#0357D6]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFF9EC]/40" />
          <span className="text-[10px] text-[#FFF9EC]/70 tracking-widest ml-1 font-bold">
            SHORTLIST_SCANNER.EXE // v2.4
          </span>
        </div>
        <span className="text-[9px] text-[#FD9C36] font-bold">LIVE TELEMETRY</span>
      </div>

      {/* Terminal Command Prompt */}
      <div className="text-[11px] text-[#FFF9EC]/60 mb-2">
        <span className="text-[#0357D6] font-bold">&gt;</span> query shortlist --status=APPROVED --order=EVAL_DESC
      </div>

      {/* Roster Table */}
      <div className="space-y-1.5 relative">
        <div className="grid grid-cols-4 text-[9px] uppercase tracking-wider text-[#FFF9EC]/40 border-b border-[#FFF9EC]/10 pb-1 pointer-events-none">
          <span>BATCH_ID</span>
          <span>SQUAD NAME</span>
          <span>SCORE</span>
          <span className="text-right">DECISION</span>
        </div>

        {candidates.map((c, i) => {
          const isSelected = i === selectedIdx;
          return (
            <div
              key={c.id}
              onClick={() => setSelectedIdx(i)}
              className={`grid grid-cols-4 items-center p-2 cursor-pointer transition-colors relative border ${
                isSelected
                  ? "bg-[#FFF9EC] text-[#050505] border-[#FD9C36] font-bold"
                  : "hover:bg-[#FFF9EC]/10 border-transparent text-[#FFF9EC]/80"
              }`}
            >
              <span className="text-[10px]">{c.id}</span>
              <span className="truncate">{c.codename}</span>
              <span>{c.score}</span>
              <div className="flex items-center justify-end gap-1.5">
                {isSelected ? (
                  <span className="inline-flex items-center gap-1 text-[9px] bg-[#FD9C36] text-[#050505] px-1.5 py-0.5 border border-[#050505]">
                    QUALIFIED
                  </span>
                ) : (
                  <span className="text-[9px] text-[#FFF9EC]/50">{c.status}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Animated Stamp Box */}
      <div className="mt-4 pt-3 border-t border-[#FFF9EC]/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 bg-[#FD9C36] text-[#050505] border border-[#FFF9EC] flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_#FFF9EC] transition-transform duration-300 ${
              isActive ? "scale-105 -rotate-6" : "scale-100 rotate-0"
            }`}
            style={{ willChange: "transform" }}
          >
            ✓
          </div>
          <div>
            <span className="text-[10px] text-[#FFF9EC] font-bold block">
              STATUS: SHORTLISTED
            </span>
            <span className="text-[9px] text-[#FFF9EC]/60">
              EMAIL TRANSMISSION DISPATCHED
            </span>
          </div>
        </div>
        <span className="text-[8px] bg-[#0357D6] text-white px-2 py-1 font-bold">
          OFFLINE STAGE PASS
        </span>
      </div>
    </div>
  );
}

export default memo(TerminalReviewCardComponent);
