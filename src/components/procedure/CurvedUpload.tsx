"use client";

import React, { useState, useEffect } from "react";

interface CurvedUploadProps {
  isActive: boolean;
}

export default function CurvedUpload({ isActive }: CurvedUploadProps) {
  const [ledStep, setLedStep] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setLedStep((prev) => (prev + 1) % 4);
    }, 450);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="relative w-full max-w-lg mx-auto bg-[#F7F2E5] border-2 border-[#050505] p-5 shadow-[4px_4px_0px_#050505]">
      {/* Top Console Bar */}
      <div className="flex items-center justify-between border-b-2 border-[#050505] pb-2 mb-4">
        <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#050505]">
          <span className="w-2.5 h-2.5 bg-[#FD9C36] border border-[#050505] inline-block" />
          <span>ORBITAL_UPLOAD_PROTOCOL // SVR_02</span>
        </div>
        <span
          className={`font-mono text-[9px] px-1.5 py-0.5 border border-[#050505] font-bold ${
            isActive ? "bg-[#0357D6] text-white" : "bg-[#050505]/10 text-[#050505]"
          }`}
        >
          {isActive ? "TRANSMITTING" : "IDLE"}
        </span>
      </div>

      <div className="relative h-56 flex items-center justify-between px-2">
        {/* Source: IDEA.PPT Document Card */}
        <div className="relative z-10 w-28 bg-[#FFF9EC] border-2 border-[#050505] p-2.5 shadow-[3px_3px_0px_#050505] flex flex-col items-center text-center">
          <div className="w-full flex justify-between items-center border-b border-[#050505]/20 pb-1 mb-2">
            <span className="text-[8px] font-mono font-bold text-[#FD9C36]">PPTX</span>
            <span className="text-[8px] font-mono text-[#050505]/60">12.4 MB</span>
          </div>
          {/* File Icon */}
          <div className="w-10 h-12 bg-[#F7F2E5] border-2 border-[#050505] relative mb-1.5 flex items-center justify-center pointer-events-none">
            <div
              className="absolute top-0 right-0 w-3 h-3 bg-[#050505]"
              style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
            />
            <span className="font-mono text-xs font-black text-[#0357D6]">PPT</span>
          </div>
          <span className="font-mono text-[11px] font-bold text-[#050505]">IDEA.PPT</span>
          <span className="text-[8px] font-mono text-[#050505]/50 uppercase mt-0.5">HEIST ARCHIVE</span>
        </div>

        {/* SVG Curved Flight Path */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 460 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Track Line */}
          <path
            d="M 120 110 C 200 20, 260 20, 340 110"
            stroke="#050505"
            strokeWidth="3"
            strokeDasharray="6 4"
            opacity="0.3"
          />

          {/* Active Highlight Line */}
          <path
            d="M 120 110 C 200 20, 260 20, 340 110"
            stroke={isActive ? "#FD9C36" : "#0357D6"}
            strokeWidth={isActive ? "3.5" : "2"}
            strokeDasharray="280"
            strokeDashoffset={isActive ? 0 : 280}
            style={{
              transition: "stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.4s ease",
            }}
          />
        </svg>

        {/* Traveling Miniature Document along curved path using CSS motion path */}
        {isActive && (
          <div
            className="absolute z-20 pointer-events-none animate-[curvedFlight_2.2s_easeInOut_infinite]"
            style={{
              offsetPath: "path('M 120 110 C 200 20, 260 20, 340 110')",
              willChange: "transform, offset-distance",
              transform: "translateZ(0)",
            }}
          >
            <div className="w-6 h-7 bg-[#FD9C36] border border-[#050505] shadow-[2px_2px_0px_#050505] flex items-center justify-center rotate-6">
              <span className="text-[7px] font-mono font-black text-[#050505]">PPT</span>
            </div>
          </div>
        )}

        {/* Destination: Server Cluster / Cloud Rack */}
        <div className="relative z-10 w-28 bg-[#FFF9EC] border-2 border-[#050505] p-2.5 shadow-[3px_3px_0px_#050505] flex flex-col items-center">
          <div className="w-full flex justify-between items-center border-b border-[#050505]/20 pb-1 mb-2">
            <span className="text-[8px] font-mono font-bold text-[#0357D6]">CLUSTER</span>
            <span className="text-[8px] font-mono text-[#050505]/60">ONLINE</span>
          </div>

          {/* Server Racks */}
          <div className="w-full space-y-1.5">
            {[0, 1, 2, 3].map((rack) => {
              const isLit = isActive && (ledStep === rack || ledStep === (rack + 1) % 4);
              return (
                <div
                  key={rack}
                  className="w-full bg-[#050505] border border-[#050505] p-1 flex items-center justify-between"
                >
                  <div className="flex gap-0.5 pointer-events-none">
                    <span className="w-1.5 h-1 bg-[#FFF9EC]/30" />
                    <span className="w-1.5 h-1 bg-[#FFF9EC]/30" />
                    <span className="w-1.5 h-1 bg-[#FFF9EC]/30" />
                  </div>
                  <div className="flex gap-1 pointer-events-none">
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors duration-150 ${
                        isLit ? "bg-[#FD9C36] shadow-[0_0_6px_#FD9C36]" : "bg-[#FD9C36]/30"
                      }`}
                    />
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors duration-150 ${
                        isLit ? "bg-[#0357D6] shadow-[0_0_6px_#0357D6]" : "bg-[#0357D6]/30"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <span className="font-mono text-[9px] font-bold text-[#050505] mt-2">SRV_TIME_01</span>
        </div>
      </div>

      {/* Footer Status Log */}
      <div className="mt-2 pt-2 border-t border-[#050505]/20 flex items-center justify-between text-[9px] font-mono text-[#050505]/70">
        <span>TRAJECTORY: PARABOLIC_UPLINK</span>
        <span className="text-[#0357D6] font-bold">RATE: 4.8 MB/S</span>
      </div>
    </div>
  );
}
