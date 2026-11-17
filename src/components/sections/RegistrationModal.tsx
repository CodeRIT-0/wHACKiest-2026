"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { participation } from "@/content/participation";

export default function RegistrationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const node = dialog.current;
    if (!node || !open) return;
    node.showModal();
    return () => node.close();
  }, [open]);
  return <dialog ref={dialog} className="registration-modal" aria-labelledby="registration-dialog-title" aria-describedby="registration-dialog-description" onClose={onClose} onKeyDown={event => {
    if (event.key !== "Tab") return;
    const controls = dialog.current?.querySelectorAll<HTMLElement>("button, a[href]");
    if (!controls?.length) return;
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    {open && <motion.div initial={reduced ? false : { opacity: 0, y: 16, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .2 }}>
      <div className="registration-modal-bar"><span>team_registration / wH 2026</span><button type="button" autoFocus aria-label="Close registration dialog" onClick={onClose}>×</button></div>
      <div className="registration-modal-body"><p className="journey-kicker">YOUR NEXT MOVE / 01</p><h2 id="registration-dialog-title">ASSEMBLE YOUR TEAM.</h2><p id="registration-dialog-description">Register through Devnovate, our official hackathon registration platform. Update your profile, create or join your team, complete the custom registration questions, and attach your idea PPT before 24 November, 11:59 PM IST.</p><p>{participation.paymentNote}</p><a href={participation.registrationHref} target="_blank" rel="noopener noreferrer" className="procedure-cta" onClick={onClose}>REGISTER ON DEVNOVATE <span aria-hidden="true">↗</span></a></div>
    </motion.div>}
  </dialog>;
}
