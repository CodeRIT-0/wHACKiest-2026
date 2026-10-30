"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";

export type Faq = { q: string; a: string };

// One answer open at a time; the open row expands into a panel, like the reference.
export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const id = useId();

  return (
    <ul data-stagger className="mt-8 space-y-3">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <li key={f.q} className={`border transition-colors duration-300 ${isOpen ? "border-ink bg-panel" : "border-line bg-panel hover:border-ink/40"}`}>
            <h3>
              <button
                type="button"
                id={`${id}-q${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-a${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left"
              >
                <span className={`font-mono text-[11px] ${isOpen ? "text-accent" : "text-muted"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 font-semibold">{f.q}</span>
                <CaretDown size={16} weight="bold" className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="a"
                  id={`${id}-a${i}`}
                  role="region"
                  aria-labelledby={`${id}-q${i}`}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 pl-[52px] text-sm leading-relaxed text-muted">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
