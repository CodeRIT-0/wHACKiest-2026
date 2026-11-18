"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, EnvelopeSimple, X } from "@phosphor-icons/react";

// A mailto: link does nothing for visitors without a mail app set up, so every email link on the
// site (Contact the organizers, Become a sponsor, the footer, the FAQ answers) is caught here:
// the address is copied to the clipboard and a small popup shows it, with a way to open the
// mail app for those who have one.

type Mail = { address: string; href: string };

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // older browsers, or a page without clipboard permission
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

export default function EmailPopup() {
  const [mail, setMail] = useState<Mail | null>(null);
  const [copied, setCopied] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.('a[href^="mailto:"]') as HTMLAnchorElement | null;
      if (!link || link.hasAttribute("data-mail-direct")) return;
      e.preventDefault();
      e.stopPropagation();
      const href = link.getAttribute("href")!;
      const address = decodeURIComponent(href.slice(7).split("?")[0]);
      returnTo.current = link;
      setMail({ address, href });
      copy(address).then(setCopied);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (!mail) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMail(null);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      returnTo.current?.focus();
    };
  }, [mail]);

  if (!mail) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center" role="presentation">
      <button type="button" aria-label="Close" tabIndex={-1} onClick={() => setMail(null)} className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-[2px]" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-popup-title"
        className="relative w-full max-w-[420px] border border-[#fff9ec]/15 bg-[#0f0d0a] p-6 text-[#fff9ec] shadow-[6px_6px_0_0_var(--accent)] motion-safe:animate-[email-pop_0.22s_cubic-bezier(0.16,1,0.3,1)]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={() => setMail(null)}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center text-[#fff9ec]/60 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
        >
          <X size={16} weight="bold" />
        </button>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">Write to CodeRIT</p>
        <h2 id="email-popup-title" className="mt-2 text-xl font-bold tracking-[-0.02em]">
          {copied ? "Email copied to your clipboard" : "Our email address"}
        </h2>
        <div className="mt-5 flex items-center gap-3 border border-[#fff9ec]/15 bg-[#16130f] px-4 py-3">
          <EnvelopeSimple size={18} weight="bold" className="shrink-0 text-accent" />
          <span className="min-w-0 flex-1 select-all break-all font-mono text-sm">{mail.address}</span>
        </div>
        <p className="mt-3 text-sm text-[#fff9ec]/60">Paste it into Gmail, Outlook or any mail app and we&apos;ll get back to you.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => copy(mail.address).then(setCopied)}
            className="inline-flex items-center gap-2 bg-accent px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.06em] text-[#050505] transition-transform active:scale-[0.98]"
          >
            {copied ? <Check size={14} weight="bold" /> : <Copy size={14} weight="bold" />}
            {copied ? "Copied" : "Copy email"}
          </button>
          <a
            href={mail.href}
            data-mail-direct
            onClick={() => setMail(null)}
            className="inline-flex items-center gap-2 border border-[#fff9ec]/30 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.06em] transition-colors hover:border-accent hover:text-accent"
          >
            Open mail app
          </a>
        </div>
      </div>
    </div>
  );
}
