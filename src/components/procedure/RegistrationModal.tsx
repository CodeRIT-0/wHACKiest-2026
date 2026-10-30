"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    teamName: "",
    leaderName: "",
    email: "",
    college: "",
    teamSize: "4",
    track: "web3-ai",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // simulated success
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop with scanline pattern */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050505]/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-[#FFF9EC] border-2 border-[#050505] p-6 sm:p-8 shadow-[8px_8px_0px_#050505] z-10 my-8 text-[#050505]"
          >
            {/* Window Title Bar */}
            <div className="flex items-center justify-between border-b-2 border-[#050505] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#FD9C36] border border-[#050505] inline-block" />
                <span className="w-3 h-3 bg-[#0357D6] border border-[#050505] inline-block" />
                <span className="w-3 h-3 bg-[#050505] inline-block" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider ml-2 text-[#050505]">
                  TIME_HEIST_REGISTRATION // TERMINAL v3.0
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center border-2 border-[#050505] bg-[#F7F2E5] text-xs font-bold font-mono hover:bg-[#FD9C36] transition-colors shadow-[2px_2px_0px_#050505] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 mx-auto bg-[#0357D6] text-white flex items-center justify-center border-2 border-[#050505] shadow-[4px_4px_0px_#050505] text-2xl font-black">
                  ✓
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight font-mono">
                  TEAM LOGGED TO THE TIMELINE!
                </h3>
                <p className="text-sm font-mono text-[#050505]/80 max-w-md mx-auto">
                  A verification transmission has been queued. Watch your inbox for the
                  <span className="text-[#0357D6] font-bold"> IDEA.PPT</span> submission template and access token.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      onClose();
                    }}
                    className="border-2 border-[#050505] bg-[#FD9C36] px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#050505] shadow-[4px_4px_0px_#050505] hover:bg-[#f28e24] active:shadow-[1px_1px_0px_#050505] active:translate-x-[2px] active:translate-y-[2px]"
                  >
                    RETURN TO MISSION
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase mb-1 tracking-wider">
                      TEAM CODENAME *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. ChronoHackers"
                      value={formData.teamName}
                      onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                      className="w-full bg-[#F7F2E5] border-2 border-[#050505] px-3 py-2 text-sm font-mono placeholder:text-[#050505]/40 focus:outline-none focus:ring-2 focus:ring-[#0357D6] shadow-[2px_2px_0px_#050505]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase mb-1 tracking-wider">
                      LEAD OPERATOR *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Full Name"
                      value={formData.leaderName}
                      onChange={(e) => setFormData({ ...formData, leaderName: e.target.value })}
                      className="w-full bg-[#F7F2E5] border-2 border-[#050505] px-3 py-2 text-sm font-mono placeholder:text-[#050505]/40 focus:outline-none focus:ring-2 focus:ring-[#0357D6] shadow-[2px_2px_0px_#050505]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase mb-1 tracking-wider">
                      TRANSMISSION EMAIL *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="operator@college.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#F7F2E5] border-2 border-[#050505] px-3 py-2 text-sm font-mono placeholder:text-[#050505]/40 focus:outline-none focus:ring-2 focus:ring-[#0357D6] shadow-[2px_2px_0px_#050505]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase mb-1 tracking-wider">
                      INSTITUTION / COLLEGE *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="University name"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full bg-[#F7F2E5] border-2 border-[#050505] px-3 py-2 text-sm font-mono placeholder:text-[#050505]/40 focus:outline-none focus:ring-2 focus:ring-[#0357D6] shadow-[2px_2px_0px_#050505]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase mb-1 tracking-wider">
                      TEAM SQUAD SIZE
                    </label>
                    <select
                      value={formData.teamSize}
                      onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                      className="w-full bg-[#F7F2E5] border-2 border-[#050505] px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0357D6] shadow-[2px_2px_0px_#050505]"
                    >
                      <option value="2">2 Operators</option>
                      <option value="3">3 Operators</option>
                      <option value="4">4 Operators (Recommended)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase mb-1 tracking-wider">
                      COMPUTING ERA / TRACK
                    </label>
                    <select
                      value={formData.track}
                      onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                      className="w-full bg-[#F7F2E5] border-2 border-[#050505] px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0357D6] shadow-[2px_2px_0px_#050505]"
                    >
                      <option value="web3-ai">Era IV: Quantum & Neural AI</option>
                      <option value="open-innovation">Era III: Internet & Distributed Systems</option>
                      <option value="hardware">Era II: Microprocessors & Silicon</option>
                      <option value="retro-algos">Era I: Mechanical & Mainframe Algos</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-[#F7F2E5] border border-[#050505]/30 text-[11px] font-mono text-[#050505]/70 flex items-start gap-2">
                  <span className="text-[#FD9C36] font-bold text-sm">ℹ</span>
                  <span>
                    Zero upfront entry fee required. Shortlisted squads finalize attendance perks & team credentials in Stage 04.
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="border-2 border-[#050505] bg-[#F7F2E5] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#050505] hover:bg-[#eae3d2] shadow-[2px_2px_0px_#050505] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="border-2 border-[#050505] bg-[#050505] text-[#FFF9EC] px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0px_#FD9C36] hover:bg-[#1a1a1a] active:shadow-[1px_1px_0px_#FD9C36] active:translate-x-[2px] active:translate-y-[2px] transition-all"
                  >
                    TRANSMIT REGISTRATION ↵
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

