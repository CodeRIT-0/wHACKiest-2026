"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check } from "@phosphor-icons/react";
import TypeLine from "../../retro/TypeLine";
import { useTrack } from "./TrackContext";
import { LOOK_FOR, type Track } from "./track-data";

// The selected track's problem statements. A terminal line reads the track's folder, then the
// statements deal in as spotlight cards: the border lights up in the track's colour wherever the
// cursor is. Switching track blurs the old cards out and the new ones in.

// the light lives in CSS variables set on pointer move, so moving the cursor never re-renders
function spot(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--sx", `${Math.round(e.clientX - r.left)}px`);
  e.currentTarget.style.setProperty("--sy", `${Math.round(e.clientY - r.top)}px`);
}

export default function ProblemDeck({ tracks }: { tracks: Track[] }) {
  const reduce = useReducedMotion();
  const { track: active } = useTrack();
  const t = tracks[active] ?? tracks[0];

  return (
    <div id="track-problems" role="tabpanel" aria-labelledby={`track-tab-${t.id}`} className="mt-10 lg:mt-12">
      {/* the prompt, retyped for each track */}
      <p className="flex flex-wrap items-center gap-x-1 font-mono text-[12px] text-[#fff9ec]/55 sm:text-[13px]">
        <span className="text-[#3ccf6e]">hacker@whackiest</span>
        <span>:</span>
        <span className="text-[#7aa7ff]">~</span>
        <span>$&nbsp;</span>
        <TypeLine key={t.id} text={`ls ./tracks/${t.dir}/problems`} speed={22} caret className="text-[#fff9ec]/85" />
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.82fr)] lg:gap-5">
        <AnimatePresence mode="popLayout" initial={false}>
          {t.problems.map((p, i) => (
            <motion.article
              key={p.id}
              layout
              onPointerMove={spot}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16, filter: "blur(8px)", transition: { duration: 0.22 } }}
              transition={{ duration: 0.55, delay: 0.08 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              className="group/card relative overflow-hidden rounded-[18px] p-px"
              style={{ background: "rgba(255,249,236,0.1)" }}
            >
              {/* the lit border: a glow behind the card that only shows through its 1px edge */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                style={{ background: `radial-gradient(320px circle at var(--sx, 50%) var(--sy, 50%), ${t.hue}, transparent 65%)` }}
              />
              <div className="relative flex h-full flex-col rounded-[17px] bg-[#0c0b09] p-5 sm:p-6">
                {/* and a fainter wash on the face */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[17px] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                  style={{ background: `radial-gradient(420px circle at var(--sx, 50%) var(--sy, 50%), ${t.hue}14, transparent 60%)` }}
                />

                <div className="relative flex items-center justify-between">
                  <span
                    className="rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#050505]"
                    style={{ backgroundColor: t.hue }}
                  >
                    {p.id}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#fff9ec]/40">{t.title}</span>
                </div>

                <h4 className="display-wide relative mt-5 text-2xl leading-tight text-[#fff9ec] sm:text-[28px]">{p.title}</h4>
                <p className="relative mt-2 font-medium text-[#fff9ec]/80">{p.blurb}</p>
                <p className="relative mt-3 text-sm leading-relaxed text-[#fff9ec]/50">{p.detail}</p>

                <Link
                  href="/register"
                  className="relative mt-auto inline-flex w-fit items-center gap-2 pt-6 font-mono text-[11px] font-bold uppercase tracking-[0.14em] transition-colors"
                  style={{ color: t.hue }}
                >
                  Take this on
                  <ArrowUpRight size={14} weight="bold" className="transition-transform duration-300 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>

        {/* what the judges want: the same for every track, so it holds still while the cards change */}
        <aside className="relative overflow-hidden rounded-[18px] border border-[#fff9ec]/12 bg-[#fff9ec] p-5 text-[#050505] sm:p-6">
          <span aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-60 [--fg:#050505]" />
          <p className="relative font-mono text-[10px] uppercase tracking-[0.16em] text-[#5e5a52]">What we look for</p>
          <ul className="relative mt-4 space-y-3">
            {LOOK_FOR.map((item) => (
              <li key={item} className="flex gap-2.5 text-[15px] font-medium leading-snug">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#050505] text-accent">
                  <Check size={11} weight="bold" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/register"
            className="group/reg relative mt-6 inline-flex items-center gap-2 border-2 border-[#050505] bg-accent px-4 py-3 text-[13px] font-bold uppercase tracking-[0.04em] text-[#050505] shadow-[4px_4px_0_#050505] transition-[translate,box-shadow] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#050505] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_#050505]"
          >
            Register your team
            <ArrowRight size={15} weight="bold" className="transition-transform duration-300 group-hover/reg:translate-x-1" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
