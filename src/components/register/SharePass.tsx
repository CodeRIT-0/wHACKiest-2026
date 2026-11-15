"use client";

import { useState } from "react";
import { renderPass, type PassCard } from "./share-pass";

/** Web Share with files exists on most phones; it's what puts Instagram and LinkedIn in the share sheet */
function supportsFileShare() {
  try {
    const probe = new File([new Blob()], "pass.png", { type: "image/png" });
    return typeof navigator.canShare === "function" && navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}

type Note = { tone: "ok" | "error"; text: string } | null;

const button =
  "inline-flex items-center justify-center gap-2 border-2 border-ink px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] transition-[background-color,color,translate,box-shadow] duration-150 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-trace active:translate-x-[2px] active:translate-y-[2px] disabled:cursor-wait disabled:opacity-60";

export default function SharePass({ card }: { card: PassCard }) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<Note>(null);
  // only mounted after a registration succeeds (never server-rendered), so the browser can be asked directly
  const [canShareFiles] = useState(supportsFileShare);

  const caption = `${card.teamName} is registered for wHACKiest 2026, a 24-hour national hackathon by CodeRIT at RIT Bengaluru. ${typeof window === "undefined" ? "" : window.location.origin}`;
  const fileName = `whackiest-2026-${card.teamName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "team"}.png`;

  const image = async () => new File([await renderPass(card)], fileName, { type: "image/png" });

  const download = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const run = async (task: () => Promise<void>) => {
    setBusy(true);
    setNote(null);
    try {
      await task();
    } catch (error) {
      if ((error as Error)?.name !== "AbortError") setNote({ tone: "error", text: "Couldn't make the image. Try Download instead." });
    } finally {
      setBusy(false);
    }
  };

  const share = () =>
    run(async () => {
      await navigator.share({ files: [await image()], title: "wHACKiest 2026", text: caption });
    });

  const save = () =>
    run(async () => {
      download(await image());
      setNote({ tone: "ok", text: "Pass saved. Post it on Instagram from your phone, or add it to a LinkedIn post." });
    });

  const linkedIn = () =>
    run(async () => {
      download(await image());
      await navigator.clipboard?.writeText(caption).catch(() => undefined);
      window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(caption)}`, "_blank", "noopener,noreferrer");
      setNote({ tone: "ok", text: "Pass downloaded and caption copied. Attach the image to your LinkedIn post." });
    });

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-trace">Show it off</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {canShareFiles && (
          <button type="button" onClick={share} disabled={busy} className={`${button} bg-ink text-bg shadow-[4px_4px_0_var(--accent)] hover:bg-accent hover:text-ink`}>
            Share to Instagram / LinkedIn
          </button>
        )}
        <button type="button" onClick={save} disabled={busy} className={`${button} bg-bg hover:bg-panel`}>
          Download pass
        </button>
        {!canShareFiles && (
          <button type="button" onClick={linkedIn} disabled={busy} className={`${button} bg-ink text-bg shadow-[4px_4px_0_var(--accent)] hover:bg-accent hover:text-ink`}>
            Post on LinkedIn
          </button>
        )}
      </div>
      <p aria-live="polite" className={`mt-3 min-h-[1.25rem] text-sm ${note?.tone === "error" ? "text-[#b42318]" : "text-muted"}`}>
        {busy ? "Printing your pass…" : note?.text}
      </p>
    </div>
  );
}
