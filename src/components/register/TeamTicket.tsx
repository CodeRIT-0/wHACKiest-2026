"use client";

import { motion, useReducedMotion } from "motion/react";
import { activeMembers, normaliseUsn, type RegistrationDraft } from "@/content/registration";

// The team's boarding pass: fills in live as the form is typed, and gets stamped once registered.

function barcode(seed: string) {
  let h = 2166136261;
  for (const ch of seed || "wHACKiest") h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const bars: { x: number; w: number }[] = [];
  for (let i = 0, x = 0; i < 44; i++) {
    h = Math.imul(h ^ (h >>> 13), 1274126177) + i;
    const w = (1 + (Math.abs(h) % 3)) * 0.9;
    if (x + w > 120) break;
    bars.push({ x, w });
    x += w + 0.95;
  }
  return bars;
}

function Blank({ width = "w-24" }: { width?: string }) {
  return <span aria-hidden="true" className={`inline-block h-[0.7em] ${width} bg-current opacity-15`} />;
}

export default function TeamTicket({ draft, teamId }: { draft: RegistrationDraft; teamId?: string }) {
  const reduced = useReducedMotion();
  const crew = [
    { name: draft.leaderName, usn: draft.leaderUsn, role: "Lead" },
    ...activeMembers(draft).map(member => ({ ...member, role: "Crew" })),
  ];
  const bars = barcode(draft.teamName + draft.leaderUsn);

  return (
    <div className="theme-dark relative border-2 border-ink shadow-[8px_8px_0_var(--accent)]" aria-label="Your team pass preview">
      <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em]">
        <span>Team pass / wHACKiest 2026</span>
        <span className="text-accent">{teamId ? "Confirmed" : "Draft"}</span>
      </div>

      <div className="px-5 pb-5 pt-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Team</p>
        <p className="display-wide mt-1 min-h-[1.1em] break-words text-[clamp(28px,3vw,40px)] uppercase leading-[1.05]">
          {draft.teamName.trim() || <span className="text-muted/50">Your team</span>}
        </p>

        <dl className="mt-6 grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em]">
          <dt className="text-muted">Format</dt>
          <dt className="text-muted">Size</dt>
          <dd className="truncate text-sm normal-case tracking-normal">24 hours, offline</dd>
          <dd className="text-sm">{String(draft.size).padStart(2, "0")}</dd>
        </dl>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Crew</p>
        <ol className="mt-2 divide-y divide-line border-y border-line">
          {crew.map((person, i) => (
            <li key={i} className="grid grid-cols-[2ch_1fr_auto] items-baseline gap-3 py-2 text-sm">
              <span className="font-mono text-[10px] text-trace">{String(i + 1).padStart(2, "0")}</span>
              <span className="truncate">{person.name.trim() || <Blank width="w-28" />}</span>
              <span className="font-mono text-[11px] text-muted">{normaliseUsn(person.usn) || <Blank width="w-16" />}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* perforation: notches cut from both edges, a dashed tear line between */}
      <div className="relative h-0 border-t-2 border-dashed border-line">
        <span className="absolute -left-[11px] -top-[10px] size-[18px] rounded-full border-2 border-ink bg-[#fff9ec]" />
        <span className="absolute -right-[11px] -top-[10px] size-[18px] rounded-full border-2 border-ink bg-[#fff9ec]" />
      </div>

      <div className="flex items-end justify-between gap-4 px-5 py-4">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">See you at</p>
          <p className="mt-1 truncate text-sm">RIT, Bengaluru</p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Team ID</p>
          <p className="mt-1 font-mono text-sm text-accent">{teamId ?? "WH26-······"}</p>
        </div>
        <svg viewBox="0 0 120 44" className="h-11 w-[120px] shrink-0 text-ink" aria-hidden="true">
          {bars.map(({ x, w }, i) => (
            <rect key={i} x={x} y={0} width={w} height={44} fill="currentColor" opacity={i % 7 === 0 ? 0.5 : 1} />
          ))}
        </svg>
      </div>

      {teamId && (
        <motion.div
          initial={reduced ? false : { scale: 1.8, opacity: 0, rotate: -24 }}
          animate={{ scale: 1, opacity: 1, rotate: -12 }}
          transition={{ type: "spring", stiffness: 420, damping: 18 }}
          className="pointer-events-none absolute right-6 top-20 border-[3px] border-accent px-3 py-1.5 font-mono text-sm font-bold uppercase tracking-[0.2em] text-accent"
        >
          Registered
        </motion.div>
      )}
    </div>
  );
}
