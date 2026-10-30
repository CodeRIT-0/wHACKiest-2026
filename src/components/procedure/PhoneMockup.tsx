"use client";

import React, { memo } from "react";

function PhoneMockupComponent({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative w-full max-w-xs mx-auto py-4 flex items-center justify-center">
      {/* Phone Body with capped 3° perspective tilt on GPU */}
      <div
        className={`w-64 h-[440px] bg-[#050505] border-[3px] border-[#050505] rounded-[36px] p-3 shadow-[8px_8px_0px_#FD9C36] relative flex flex-col justify-between overflow-hidden transition-transform duration-500 ${
          isActive
            ? "[transform:perspective(1000px)_rotateX(3deg)_rotateY(-2deg)_translateY(-4px)_translateZ(0)]"
            : "[transform:perspective(1000px)_rotateX(0deg)_rotateY(0deg)_translateY(0px)_translateZ(0)]"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
        }}
      >
        {/* Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#050505] rounded-full z-30 flex items-center justify-center pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-[#222] mr-2" />
          <div className="w-8 h-1 bg-[#222] rounded-full" />
        </div>

        {/* Screen Bezel */}
        <div className="w-full h-full bg-[#F7F2E5] rounded-[26px] p-3 pt-8 flex flex-col justify-between relative border border-[#050505]/20 overflow-hidden text-[#050505]">
          {/* Top Status Bar */}
          <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#050505]/80 px-1 pointer-events-none">
            <span>09:41</span>
            <div className="flex items-center gap-1">
              <span>5G</span>
              <div className="w-4 h-2 border border-[#050505] rounded-[2px] p-[1px] flex">
                <div className="w-2.5 h-full bg-[#050505]" />
              </div>
            </div>
          </div>

          {/* Sliding Push Notification */}
          <div
            className={`w-full bg-[#FFF9EC] border-2 border-[#050505] p-2.5 shadow-[3px_3px_0px_#050505] my-2 transition-all duration-400 ${
              isActive
                ? "translate-y-0 opacity-100"
                : "-translate-y-8 opacity-0 pointer-events-none"
            }`}
            style={{
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              willChange: "transform, opacity",
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 bg-[#FD9C36] border border-[#050505] flex items-center justify-center text-[8px] font-black">
                  ⚡
                </div>
                <span className="font-mono text-[9px] font-black uppercase text-[#050505]">
                  WHACKIEST PORTAL
                </span>
              </div>
              <span className="font-mono text-[8px] text-[#050505]/50">NOW</span>
            </div>
            <p className="font-mono text-[10px] font-bold text-[#050505]">
              SPOT CONFIRMED: SECTOR B-04
            </p>
            <p className="font-mono text-[8px] text-[#050505]/70 mt-0.5">
              Team credentials issued. Swag kit & hacker badges reserved.
            </p>
          </div>

          {/* App Screen Content: Interactive confirmation preview */}
          <div className="space-y-2 mt-auto">
            <div className="bg-[#FFF9EC] border-2 border-[#050505] p-2 text-center pointer-events-none">
              <span className="text-[8px] font-mono uppercase text-[#050505]/60 block">
                SECURITY PASSPHRASE
              </span>
              <span className="font-mono text-xs font-black tracking-widest text-[#0357D6]">
                #TIME_HEIST_2026
              </span>
            </div>

            <div className="border border-[#050505] bg-[#050505] text-[#FFF9EC] py-2 text-center font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#FD9C36]">
              <span className="w-1.5 h-1.5 bg-[#FD9C36] rounded-full animate-ping" />
              RSVP SYNCHRONIZED
            </div>
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="w-20 h-1 bg-[#050505] rounded-full mx-auto mt-2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

export default memo(PhoneMockupComponent);
