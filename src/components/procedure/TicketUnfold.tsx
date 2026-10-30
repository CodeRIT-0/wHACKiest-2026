"use client";

import React, { useState, useEffect } from "react";

interface TicketUnfoldProps {
  isActive: boolean;
  onOpenModal: () => void;
}

export default function TicketUnfold({ isActive, onOpenModal }: TicketUnfoldProps) {
  const [stamped, setStamped] = useState(false);
  const [stubUnfolded, setStubUnfolded] = useState(false);

  // Trigger sequence with clean timeout management that handles reverse scrolling cleanly
  useEffect(() => {
    let stampTimer: NodeJS.Timeout | null = null;
    let stubTimer: NodeJS.Timeout | null = null;

    if (isActive) {
      stampTimer = setTimeout(() => setStamped(true), 350);
      stubTimer = setTimeout(() => setStubUnfolded(true), 750);
    } else {
      setStamped(false);
      setStubUnfolded(false);
    }

    return () => {
      if (stampTimer) clearTimeout(stampTimer);
      if (stubTimer) clearTimeout(stubTimer);
    };
  }, [isActive]);

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center">
      {/* Particle Burst on stamp (pure CSS keyframe, pointer-events none) */}
      {stamped && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <div
              key={deg}
              className="absolute w-2 h-2 bg-[#FD9C36] border border-[#050505] animate-[particlePop_0.6s_ease-out_forwards]"
              style={{
                transform: `rotate(${deg}deg) translateZ(0)`,
                willChange: "transform, opacity",
              }}
            />
          ))}
        </div>
      )}

      {/* Main Ticket Card */}
      <div
        className={`w-full bg-[#FFF9EC] border-2 border-[#050505] shadow-[6px_6px_0px_#050505] relative overflow-hidden transition-transform duration-300 ease-out ${
          isActive ? "-translate-y-1 scale-[1.01]" : "translate-y-0 scale-100"
        }`}
        style={{ willChange: "transform" }}
      >
        {/* Top Header */}
        <div className="bg-[#050505] text-[#FFF9EC] px-4 py-2 flex items-center justify-between border-b-2 border-[#050505]">
          <span className="font-mono text-[10px] font-bold tracking-widest uppercase">
            BOARDING PASS // DEVHACK 3.0
          </span>
          <span className="font-mono text-[9px] bg-[#FD9C36] text-[#050505] px-1.5 py-0.5 font-bold uppercase">
            VIP ACCESS
          </span>
        </div>

        {/* Ticket Body Content */}
        <div className="p-5 relative">
          {/* Angled "LET'S BUILD" Stamp with GPU-accelerated transition */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-300 ${
              stamped
                ? "opacity-100 scale-100 -rotate-12"
                : "opacity-0 scale-150 rotate-0"
            }`}
            style={{
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              willChange: "transform, opacity",
            }}
          >
            <div className="border-4 border-[#FD9C36] bg-[#FFF9EC]/95 px-4 py-1.5 font-mono text-xl sm:text-2xl font-black text-[#FD9C36] uppercase tracking-wider shadow-[3px_3px_0px_#050505]">
              LET'S BUILD
            </div>
          </div>

          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="block font-mono text-[9px] uppercase text-[#050505]/60 tracking-wider">
                CODENAME PROTOCOL
              </span>
              <h4 className="font-mono text-lg font-black text-[#050505]">
                TIME HEIST 2026
              </h4>
            </div>
            <div className="text-right">
              <span className="block font-mono text-[9px] uppercase text-[#050505]/60 tracking-wider">
                GATE & SECTOR
              </span>
              <span className="font-mono text-xs font-bold text-[#0357D6]">
                MAIN ARENA // 36H
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-b border-[#050505]/20 py-2.5 my-3 font-mono text-xs">
            <div>
              <span className="block text-[8px] text-[#050505]/50">START TIME</span>
              <span className="font-bold">09:00 AM</span>
            </div>
            <div>
              <span className="block text-[8px] text-[#050505]/50">DURATION</span>
              <span className="font-bold">36 HOURS</span>
            </div>
            <div>
              <span className="block text-[8px] text-[#050505]/50">FOOD & ENERGY</span>
              <span className="font-bold text-[#0357D6]">INCLUDED</span>
            </div>
          </div>

          {/* Barcode Graphic */}
          <div className="flex items-center justify-between pt-1 pointer-events-none">
            <div className="flex items-end gap-[3px] h-9">
              {[3, 1, 4, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 1, 2, 4, 1, 2].map((w, i) => (
                <div
                  key={i}
                  className="bg-[#050505] h-full"
                  style={{ width: `${w * 1.5}px` }}
                />
              ))}
            </div>
            <span className="font-mono text-[9px] font-bold text-[#050505]/60 tracking-widest">
              TX-2026-DH3
            </span>
          </div>
        </div>

        {/* Perforated Divider Line */}
        <div className="relative w-full border-t-2 border-dashed border-[#050505] my-0 pointer-events-none">
          <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-[#FFF9EC] border-2 border-[#050505]" />
          <div className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-[#FFF9EC] border-2 border-[#050505]" />
        </div>

        {/* Bottom Perforated Stub unfolding into Interactive Neo-brutalist Action Button */}
        <div className="p-4 bg-[#F7F2E5]">
          <div
            className={`transition-all duration-300 ${
              stubUnfolded ? "opacity-100 scale-100" : "opacity-90 scale-[0.98]"
            }`}
            style={{
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              willChange: "transform, opacity",
            }}
          >
            <button
              onClick={onOpenModal}
              className="w-full relative group cursor-pointer border-2 border-[#050505] bg-[#FD9C36] hover:bg-[#ffaa4e] text-[#050505] p-3 font-mono text-sm font-black uppercase tracking-wider shadow-[4px_4px_0px_#050505] active:shadow-[1px_1px_0px_#050505] active:translate-x-[3px] active:translate-y-[3px] transition-all flex items-center justify-center gap-2"
            >
              <span>REGISTER YOUR TEAM</span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </button>
            <p className="text-center font-mono text-[9px] text-[#050505]/60 uppercase tracking-widest mt-2 pointer-events-none">
              CLICK TO INITIALIZE TELEPORT SEQUENCE // LIMITED PASSES
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
