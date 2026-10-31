"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";

// Live local time at the venue (IST), shown on the map's blueprint frame. Dashes until mounted.
export function VenueClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  const time = now ? now.toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--";
  return (
    <span className="tabular-nums">
      {time} <span className="text-[#fff9ec]/60">IST</span>
    </span>
  );
}

export function CopyAddress({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        });
      }}
      className="inline-flex items-center gap-1.5 border border-ink/30 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-colors hover:border-accent hover:text-accent"
    >
      {copied ? <Check size={12} weight="bold" /> : <Copy size={12} weight="bold" />}
      {copied ? "Copied" : "Copy address"}
    </button>
  );
}
