"use client";

import React, { memo } from "react";

interface ClockDialProps {
  currentStage: number; // 1 to 5
}

const stageAngles: Record<number, number> = {
  1: -72,
  2: -36,
  3: 0,
  4: 36,
  5: 72,
};

function ClockDialComponent({ currentStage }: ClockDialProps) {
  const needleAngle = stageAngles[currentStage] ?? 0;

  return (
    <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-none hidden md:block">
      <div className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-full bg-[#FFF9EC] border-2 border-[#050505] shadow-[4px_4px_0px_#050505] p-2 flex items-center justify-center pointer-events-auto">
        {/* Subtle grid ticks inside dial */}
        <div className="absolute inset-1 rounded-full border border-dashed border-[#050505]/20 pointer-events-none" />

        {/* Outer era/stage calibrated ticks */}
        {[1, 2, 3, 4, 5].map((st) => {
          const angle = stageAngles[st];
          const rad = (angle - 90) * (Math.PI / 180);
          const r = 42;
          const x = 50 + r * Math.cos(rad);
          const y = 50 + r * Math.sin(rad);
          const isActive = currentStage === st;
          const isPassed = currentStage >= st;

          return (
            <div
              key={st}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] font-bold border transition-transform duration-200 ${
                  isActive
                    ? "bg-[#FD9C36] text-[#050505] border-[#050505] scale-110 shadow-[1px_1px_0px_#050505]"
                    : isPassed
                    ? "bg-[#0357D6] text-white border-[#050505]"
                    : "bg-[#F7F2E5] text-[#050505]/60 border-[#050505]/30"
                }`}
              >
                0{st}
              </div>
            </div>
          );
        })}

        {/* Center Pivot */}
        <div className="absolute w-4 h-4 rounded-full bg-[#050505] border-2 border-[#FD9C36] z-20 flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FD9C36]" />
        </div>

        {/* Rotating Needle using GPU transform */}
        <div
          className="absolute w-1 h-12 origin-bottom z-10 pointer-events-none"
          style={{
            bottom: "50%",
            left: "calc(50% - 2px)",
            transform: `rotate(${needleAngle}deg) translateZ(0)`,
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: "transform",
          }}
        >
          <div className="w-1 h-full bg-[#050505] relative">
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#FD9C36] border border-[#050505] rotate-45" />
          </div>
        </div>

        {/* Chrono Label */}
        <div className="absolute bottom-2 font-mono text-[8px] font-black uppercase tracking-widest text-[#050505]/60 pointer-events-none">
          STAGE 0{currentStage}
        </div>
      </div>
    </div>
  );
}

export default memo(ClockDialComponent);
