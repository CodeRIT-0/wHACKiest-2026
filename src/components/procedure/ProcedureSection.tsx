"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import ClockDial from "./ClockDial";
import CurvedUpload from "./CurvedUpload";
import TerminalReviewCard from "./TerminalReviewCard";
import PhoneMockup from "./PhoneMockup";
import TicketUnfold from "./TicketUnfold";
import RegistrationModal from "./RegistrationModal";

// Easing for stage content animations
const TRANSITION_STYLE = {
  transition: "opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
  willChange: "opacity, transform",
  transform: "translateZ(0)",
};

export default function ProcedureSection() {
  const containerRef = useRef<HTMLElement>(null);
  const spineLineRef = useRef<HTMLDivElement>(null);
  const pulseNodeRef = useRef<HTMLDivElement>(null);

  const [activeStage, setActiveStage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mutable animation state references to decouple from React render cycles
  const progressTargetRef = useRef(0);
  const currentProgressRef = useRef(0);
  const activeStageRef = useRef(1);
  const animationFrameRef = useRef<number | null>(null);

  // Thresholds with hysteresis boundaries to eliminate stage flicker / oscillation
  // Stages: 1 = [0.00, 0.20], 2 = [0.20, 0.40], 3 = [0.40, 0.60], 4 = [0.60, 0.80], 5 = [0.80, 1.00]
  // With dead-zone hysteresis buffers (+/- 0.025):
  const calculateStageWithHysteresis = useCallback((p: number, current: number): number => {
    const HYSTERESIS = 0.025;

    if (current === 1) {
      if (p > 0.20 + HYSTERESIS) return p > 0.40 ? (p > 0.60 ? (p > 0.80 ? 5 : 4) : 3) : 2;
      return 1;
    }
    if (current === 2) {
      if (p < 0.20 - HYSTERESIS) return 1;
      if (p > 0.40 + HYSTERESIS) return p > 0.60 ? (p > 0.80 ? 5 : 4) : 3;
      return 2;
    }
    if (current === 3) {
      if (p < 0.40 - HYSTERESIS) return p < 0.20 ? 1 : 2;
      if (p > 0.60 + HYSTERESIS) return p > 0.80 ? 5 : 4;
      return 3;
    }
    if (current === 4) {
      if (p < 0.60 - HYSTERESIS) return p < 0.40 ? (p < 0.20 ? 1 : 2) : 3;
      if (p > 0.80 + HYSTERESIS) return 5;
      return 4;
    }
    if (current === 5) {
      if (p < 0.80 - HYSTERESIS) return p < 0.60 ? (p < 0.40 ? (p < 0.20 ? 1 : 2) : 3) : 4;
      return 5;
    }
    return 1;
  }, []);

  // Passive measurement on window scroll/resize: only update scalar, NO layout thrashing in handlers
  useEffect(() => {
    // Cache section bounds to avoid calling getBoundingClientRect on every scroll event
    let cachedTop = 0;
    let cachedHeight = 1;

    const updateBounds = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      cachedTop = rect.top + scrollTop;
      cachedHeight = Math.max(rect.height, 1);
    };

    updateBounds();

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;

      // Start tracking when section header enters middle of viewport, finish near end
      const startOffset = cachedTop - windowHeight * 0.25;
      const totalDistance = cachedHeight - windowHeight * 0.5;

      const rawProgress = (scrollY - startOffset) / (totalDistance > 0 ? totalDistance : 1);
      progressTargetRef.current = Math.min(Math.max(rawProgress, 0), 1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateBounds, { passive: true });

    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateBounds);
    };
  }, []);

  // Decoupled rAF + LERP Animation Loop (LERP factor 0.12)
  useEffect(() => {
    const LERP_FACTOR = 0.12;
    let isRunning = true;

    const tick = () => {
      if (!isRunning) return;

      const target = progressTargetRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      // Linear interpolation glide
      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * LERP_FACTOR;
      } else {
        currentProgressRef.current = target;
      }

      const p = currentProgressRef.current;

      // 1. Hardware accelerated GPU transform directly on DOM nodes (bypasses React reconciliation)
      if (spineLineRef.current) {
        spineLineRef.current.style.transform = `scaleY(${p}) translateZ(0)`;
      }

      if (pulseNodeRef.current) {
        // Spine height traversal: map p [0, 1] to vertical percentage
        pulseNodeRef.current.style.transform = `translate3d(-50%, ${p * 100}%, 0)`;
      }

      // 2. Discrete stage transition with hysteresis
      const nextStage = calculateStageWithHysteresis(p, activeStageRef.current);
      if (nextStage !== activeStageRef.current) {
        activeStageRef.current = nextStage;
        setActiveStage(nextStage);
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [calculateStageWithHysteresis]);

  return (
    <section
      ref={containerRef}
      id="procedure"
      className="relative w-full bg-[#FFF9EC] text-[#050505] overflow-x-hidden selection:bg-[#FD9C36] selection:text-[#050505] border-b-2 border-[#050505]"
    >
      {/* Floating Outer Clock Dial */}
      <ClockDial currentStage={activeStage} />

      {/* Hero Header */}
      <div className="pt-24 pb-12 px-6 max-w-6xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F7F2E5] border-2 border-[#050505] shadow-[2px_2px_0px_#050505] font-mono text-xs font-bold uppercase tracking-widest text-[#050505] mb-4">
          <span className="w-2 h-2 bg-[#FD9C36] border border-[#050505]" />
          TIMELINE PROTOCOL // EVOLUTION OF COMPUTING
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[#050505] leading-none mb-4">
          YOUR NEXT <span className="text-[#FD9C36] underline decoration-[#050505] decoration-4 underline-offset-4">MOVE.</span>
        </h2>
        <p className="max-w-2xl mx-auto font-mono text-sm sm:text-base text-[#050505]/70">
          From binary punches to quantum neural leaps. Follow the calibrated five-stage transmission pipeline to secure your syndicate spot in the hack.
        </p>
      </div>

      {/* Main 5-Stage Pipeline Container */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pb-28">
        {/* Central Circuit Spine with GPU-accelerated scaleY and translateZ(0) */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-[#050505]/20 z-0 pointer-events-none">
          {/* Active orange signal line gliding via rAF + LERP */}
          <div
            ref={spineLineRef}
            className="w-full h-full bg-[#FD9C36] shadow-[0_0_8px_#FD9C36]"
            style={{
              transformOrigin: "top",
              transform: "scaleY(0) translateZ(0)",
              willChange: "transform",
            }}
          />

          {/* Traveling Signal Pulse Node */}
          <div
            ref={pulseNodeRef}
            className="absolute left-1/2 top-0 w-5 h-5 rounded-full bg-[#FD9C36] border-2 border-[#050505] shadow-[2px_2px_0px_#050505] -mt-2.5 flex items-center justify-center pointer-events-none"
            style={{
              transform: "translate3d(-50%, 0%, 0)",
              willChange: "transform",
            }}
          >
            <div className="w-1.5 h-1.5 bg-[#050505] rounded-full" />
          </div>
        </div>

        {/* ── STAGE 01: REGISTER YOUR TEAM ── */}
        <div
          className={`relative z-10 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center ${
            activeStage === 1 ? "opacity-100 translate-y-0" : "opacity-85 translate-y-1"
          }`}
          style={TRANSITION_STYLE}
        >
          {/* Text Left */}
          <div className="pl-10 md:pl-0 md:text-right">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#FD9C36] bg-[#050505] px-2.5 py-1 mb-2 border border-[#050505] shadow-[2px_2px_0px_#FD9C36]">
              PHASE 01 // SYNAPSE GENESIS
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#050505] mb-2 font-mono">
              01. REGISTER YOUR TEAM
            </h3>
            <p className="font-mono text-xs sm:text-sm text-[#050505]/80 leading-relaxed max-w-md ml-auto">
              Assemble your squad of 2 to 4 coders, architects, or designers. Create your team identity, specify your computing era specialty, and initialize team tokens without paying any upfront charges.
            </p>
          </div>

          {/* Illustration Right: Team ID Card with continuous blue scanning laser */}
          <div className="pl-10 md:pl-0 flex justify-center">
            <div className="relative w-full max-w-sm bg-[#F7F2E5] border-2 border-[#050505] p-5 shadow-[5px_5px_0px_#050505] overflow-hidden">
              {/* Blue Laser Scanning Beam using GPU translateZ */}
              <div
                className="absolute left-0 right-0 h-1 bg-[#0357D6] shadow-[0_0_12px_#0357D6] z-20 pointer-events-none animate-[scanline_2.8s_ease-in-out_infinite]"
                style={{ willChange: "transform" }}
              />

              <div className="flex items-center justify-between border-b-2 border-[#050505] pb-3 mb-4">
                <span className="font-mono text-xs font-black uppercase tracking-wider text-[#050505]">
                  OPERATOR IDENTIFICATION
                </span>
                <span className="font-mono text-[10px] bg-[#FD9C36] px-1.5 py-0.5 border border-[#050505] font-bold">
                  SQUAD // 01
                </span>
              </div>

              <div className="flex gap-4 items-center mb-4">
                <div className="w-16 h-16 bg-[#FFF9EC] border-2 border-[#050505] p-1 flex items-center justify-center relative">
                  <svg
                    className="w-12 h-12 text-[#050505] pointer-events-none"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="12" rx="2" />
                    <line x1="12" y1="16" x2="12" y2="20" />
                    <line x1="8" y1="20" x2="16" y2="20" />
                    <circle cx="9" cy="10" r="1.5" fill="#0357D6" />
                    <circle cx="15" cy="10" r="1.5" fill="#FD9C36" />
                  </svg>
                </div>
                <div className="font-mono text-xs space-y-1">
                  <div className="font-bold text-[#050505]">CALLSIGN: CYBER_TITAN</div>
                  <div className="text-[10px] text-[#050505]/60">SQUAD SIZE: 4 HACKERS</div>
                  <div className="text-[10px] text-[#0357D6] font-bold">STATUS: RECRUITED</div>
                </div>
              </div>

              <div className="border border-dashed border-[#050505]/40 p-2 bg-[#FFF9EC] font-mono text-[10px] text-[#050505]/80 flex justify-between">
                <span>SECTOR: INTERNET ERA</span>
                <span className="text-[#FD9C36] font-bold">NODE: VERIFIED</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── STAGE 02: SUBMIT YOUR IDEA ── */}
        <div
          className={`relative z-10 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center ${
            activeStage === 2 ? "opacity-100 translate-y-0" : "opacity-85 translate-y-1"
          }`}
          style={TRANSITION_STYLE}
        >
          {/* Illustration Left: Curved Upload Marquee */}
          <div className="order-2 md:order-1 pl-10 md:pl-0 flex justify-center">
            <CurvedUpload isActive={activeStage >= 2} />
          </div>

          {/* Text Right */}
          <div className="order-1 md:order-2 pl-10 md:pl-0 md:text-left">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#0357D6] bg-[#050505] px-2.5 py-1 mb-2 border border-[#050505] shadow-[2px_2px_0px_#0357D6]">
              PHASE 02 // ARCHIVE UPLINK
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#050505] mb-2 font-mono">
              02. SUBMIT YOUR IDEA
            </h3>
            <p className="font-mono text-xs sm:text-sm text-[#050505]/80 leading-relaxed max-w-md">
              Download the official hackathon PPT template. Formulate your solution around one of our time tracks, and transmit your slide deck to the server cluster before the deadline ticker halts.
            </p>
          </div>
        </div>

        {/* ── STAGE 03: CHECK SHORTLIST ── */}
        <div
          className={`relative z-10 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center ${
            activeStage === 3 ? "opacity-100 translate-y-0" : "opacity-85 translate-y-1"
          }`}
          style={TRANSITION_STYLE}
        >
          {/* Text Left */}
          <div className="pl-10 md:pl-0 md:text-right">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#FD9C36] bg-[#050505] px-2.5 py-1 mb-2 border border-[#050505] shadow-[2px_2px_0px_#FD9C36]">
              PHASE 03 // TELEMETRY AUDIT
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#050505] mb-2 font-mono">
              03. CHECK SHORTLIST
            </h3>
            <p className="font-mono text-xs sm:text-sm text-[#050505]/80 leading-relaxed max-w-md ml-auto">
              Our technical jury evaluates architectural ambition, viability, and originality. Verified candidates earn the prestigious orange qualification stamp and an invitation dispatch.
            </p>
          </div>

          {/* Illustration Right: Terminal Review Card */}
          <div className="pl-10 md:pl-0 flex justify-center">
            <TerminalReviewCard isActive={activeStage >= 3} />
          </div>
        </div>

        {/* ── STAGE 04: CONFIRM YOUR SPOT ── */}
        <div
          className={`relative z-10 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center ${
            activeStage === 4 ? "opacity-100 translate-y-0" : "opacity-85 translate-y-1"
          }`}
          style={TRANSITION_STYLE}
        >
          {/* Illustration Left: 3D Tilt Phone Mockup */}
          <div className="order-2 md:order-1 pl-10 md:pl-0 flex justify-center">
            <PhoneMockup isActive={activeStage >= 4} />
          </div>

          {/* Text Right */}
          <div className="order-1 md:order-2 pl-10 md:pl-0 md:text-left">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#0357D6] bg-[#050505] px-2.5 py-1 mb-2 border border-[#050505] shadow-[2px_2px_0px_#0357D6]">
              PHASE 04 // SQUAD SYNCHRONIZATION
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#050505] mb-2 font-mono">
              04. CONFIRM YOUR SPOT
            </h3>
            <p className="font-mono text-xs sm:text-sm text-[#050505]/80 leading-relaxed max-w-md">
              Selected squads receive instant push confirmations to lock in their offline workspace benches, food passes, 24/7 Red Bull & meal privileges, and exclusive hardware hacker kits.
            </p>
          </div>
        </div>

        {/* ── STAGE 05: JOIN THE HACK ── */}
        <div
          className={`relative z-10 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center ${
            activeStage === 5 ? "opacity-100 translate-y-0" : "opacity-85 translate-y-1"
          }`}
          style={TRANSITION_STYLE}
        >
          {/* Text Left */}
          <div className="pl-10 md:pl-0 md:text-right">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#FD9C36] bg-[#050505] px-2.5 py-1 mb-2 border border-[#050505] shadow-[2px_2px_0px_#FD9C36]">
              PHASE 05 // TERMINAL LAUNCH
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#050505] mb-2 font-mono">
              05. JOIN THE HACK
            </h3>
            <p className="font-mono text-xs sm:text-sm text-[#050505]/80 leading-relaxed max-w-md ml-auto">
              Touch down at the arena for 36 non-stop hours of building, mentor clinics, and high-stakes pitching. Claim your boarding pass below to initiate team registration right now.
            </p>
          </div>

          {/* Illustration Right: Ticket-to-Button Transformation */}
          <div className="pl-10 md:pl-0 flex justify-center">
            <TicketUnfold
              isActive={activeStage >= 5}
              onOpenModal={() => setIsModalOpen(true)}
            />
          </div>
        </div>

        {/* ── BOUNDARY HANDOFF PIN ── */}
        <div className="absolute left-4 md:left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-[#050505] border-2 border-[#FD9C36] flex items-center justify-center shadow-[3px_3px_0px_#050505] animate-pulse">
            <div className="w-3 h-3 rounded-full bg-[#FD9C36]" />
          </div>
          <span className="font-mono text-[9px] font-black uppercase tracking-widest text-[#050505] mt-1 bg-[#FFF9EC] px-1 border border-[#050505]">
            DATA_BUS_OUT
          </span>
        </div>
      </div>

      {/* Registration Modal Dialog */}
      <RegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
