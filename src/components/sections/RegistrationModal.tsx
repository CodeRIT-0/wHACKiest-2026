"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

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
      <div className="registration-modal-body"><p className="journey-kicker">YOUR NEXT MOVE / 01</p><h2 id="registration-dialog-title">ASSEMBLE YOUR TEAM.</h2><p id="registration-dialog-description">The registration form is not available on this website yet. The participation guide calls for Google sign-in, team details, and an idea PPT once registration is available.</p><p>Payment is required only after shortlisting for external-college participants.</p><Link href="/register" className="procedure-cta" onClick={onClose}>VIEW REGISTRATION PAGE <span aria-hidden="true">↗</span></Link></div>
    </motion.div>}
  </dialog>;
}
