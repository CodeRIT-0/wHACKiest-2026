"use client";

import { useMemo, useRef, useState } from "react";
import { OPEN_TRACKS as TRACKS } from "@/components/sections/tracks/track-data";
import { MAX_PPT_MB, PPT_EXTENSIONS, normaliseTeamId, validateSubmission, type FieldErrors, type SubmissionDraft } from "@/content/registration";
import { Field, fieldId, inputClass } from "./form-ui";

// Idea PPT upload for registered teams: team ID + the leader's email unlock it.

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "done"; teamName: string; replaced: boolean } | { kind: "error"; message: string };

function readAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const formatSize = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

export default function SubmissionForm({ endpoint }: { endpoint: string }) {
  const [draft, setDraft] = useState<SubmissionDraft>({ teamId: "", leaderEmail: "", track: "", file: null });
  const [touched, setTouched] = useState<Set<string>>(() => new Set());
  const [showAll, setShowAll] = useState(false);
  const [serverErrors, setServerErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [dragging, setDragging] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);

  const errors = useMemo(() => validateSubmission(draft), [draft]);
  const errorFor = (key: string) => serverErrors[key] ?? (showAll || touched.has(key) ? errors[key] : undefined);
  const touch = (key: string) => setTouched(prev => (prev.has(key) ? prev : new Set(prev).add(key)));
  const update = <K extends keyof SubmissionDraft>(key: K, value: SubmissionDraft[K]) => {
    setDraft(prev => ({ ...prev, [key]: value }));
    setServerErrors({});
  };
  const inputProps = (key: string) => {
    const error = errorFor(key);
    return {
      id: fieldId(key),
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `${fieldId(key)}-error` : undefined,
      onBlur: () => touch(key),
    };
  };
  const pickFile = (file: File | undefined) => {
    if (!file) return;
    update("file", file);
    touch("file");
  };

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (status.kind === "sending") return;
    setShowAll(true);
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      document.getElementById(fieldId(firstError))?.focus();
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const file = draft.file!;
      const payload = {
        action: "submit",
        teamId: normaliseTeamId(draft.teamId),
        leaderEmail: draft.leaderEmail.trim().toLowerCase(),
        track: draft.track,
        file: { name: file.name, type: file.type, data: await readAsBase64(file) },
        website: honeypot.current?.value ?? "",
      };
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
      const result = (await response.json()) as { ok: boolean; teamName?: string; replaced?: boolean; error?: string; field?: string };
      if (result.ok) setStatus({ kind: "done", teamName: result.teamName ?? "", replaced: Boolean(result.replaced) });
      else {
        const message = result.error ?? "Upload failed. Please try again.";
        setStatus({ kind: "error", message });
        if (result.field) {
          setServerErrors({ [result.field]: message });
          document.getElementById(fieldId(result.field))?.focus();
        }
      }
    } catch {
      setStatus({ kind: "error", message: "We couldn't reach the submission server. Check your connection and try again." });
    }
  }

  if (status.kind === "done") {
    return (
      <div role="status" className="border-2 border-ink bg-panel p-6 shadow-[8px_8px_0_var(--accent)] md:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-trace">Uplink complete</p>
        <h2 className="display-wide mt-3 text-4xl uppercase leading-[0.95] md:text-5xl">
          {status.replaced ? "PPT replaced" : "PPT received"}
          <span className="text-accent">.</span>
        </h2>
        <p className="mt-6 max-w-[48ch] text-lg">
          {status.teamName ? <strong>{status.teamName}</strong> : "Your team"}&apos;s idea deck is in.{" "}
          {status.replaced ? "Only this latest version will be reviewed." : "You can re-upload here until the deadline; the latest version counts."}
        </p>
        <button
          type="button"
          onClick={() => {
            setDraft(prev => ({ ...prev, file: null }));
            setStatus({ kind: "idle" });
            setShowAll(false);
          }}
          className="mt-8 border-2 border-ink bg-bg px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] hover:bg-accent focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-trace"
        >
          Upload a newer version
        </button>
      </div>
    );
  }

  const sending = status.kind === "sending";
  const fileError = errorFor("file");

  return (
    <form noValidate onSubmit={submit} className="relative grid gap-8" aria-busy={sending}>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={fieldId("teamId")} label="Team ID" hint="From your registration" error={errorFor("teamId")}>
          <input
            {...inputProps("teamId")}
            value={draft.teamId}
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            placeholder="WH26-K7M3QX"
            className={`${inputClass} font-mono uppercase`}
            onChange={e => update("teamId", e.target.value.toUpperCase())}
          />
        </Field>
        <Field id={fieldId("leaderEmail")} label="Leader's email" hint="The one you registered with" error={errorFor("leaderEmail")}>
          <input {...inputProps("leaderEmail")} type="email" inputMode="email" value={draft.leaderEmail} autoComplete="email" spellCheck={false} placeholder="you@college.edu" className={inputClass} onChange={e => update("leaderEmail", e.target.value)} />
        </Field>
      </div>

      <div>
        <p id="reg-track-label" className="font-mono text-[11px] uppercase tracking-[0.14em]">
          Track
        </p>
        <div role="radiogroup" aria-labelledby="reg-track-label" aria-describedby={errorFor("track") ? `${fieldId("track")}-error` : undefined} className="mt-2 grid gap-3 sm:grid-cols-2">
          {TRACKS.map((track, i) => (
            <label key={track.id} className="group relative cursor-pointer">
              <input
                id={i === 0 ? fieldId("track") : undefined}
                type="radio"
                name="track"
                value={track.title}
                checked={draft.track === track.title}
                onChange={() => {
                  update("track", track.title);
                  touch("track");
                }}
                className="peer sr-only"
              />
              <span
                style={{ "--hue": track.hue } as React.CSSProperties}
                className="flex h-full flex-col gap-2 border-2 border-ink bg-bg p-4 transition-[box-shadow,translate,background-color] duration-150 group-hover:bg-panel peer-checked:translate-x-[-3px] peer-checked:translate-y-[-3px] peer-checked:shadow-[5px_5px_0_var(--hue)] peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-trace"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-bold uppercase tracking-[-0.01em]">{track.title}</span>
                  <span aria-hidden="true" className="size-3 shrink-0 rounded-full border-2 border-ink" style={{ background: draft.track === track.title ? track.hue : "transparent" }} />
                </span>
                <span className="text-sm text-muted">{track.blurb}</span>
              </span>
            </label>
          ))}
        </div>
        {errorFor("track") && (
          <p id={`${fieldId("track")}-error`} className="mt-2 text-sm text-[#b42318]">
            {errorFor("track")}
          </p>
        )}
      </div>

      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em]">Idea PPT</p>
        <label
          htmlFor={fieldId("file")}
          onDragOver={e => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault();
            setDragging(false);
            pickFile(e.dataTransfer.files[0]);
          }}
          className={`mt-2 flex cursor-pointer flex-col items-center gap-3 border-2 border-dashed px-6 py-12 text-center transition-colors duration-150 has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-trace ${
            fileError ? "border-[#b42318]" : "border-ink"
          } ${dragging ? "bg-accent/25" : "bg-panel hover:bg-accent/10"}`}
        >
          <svg viewBox="0 0 24 24" className="size-10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M6 2h9l5 5v15H6z" fill="var(--bg)" />
            <path d="M15 2v5h5" />
            <path d="M13 18v-7m-3 3 3-3 3 3" stroke="var(--trace)" />
          </svg>
          {draft.file ? (
            <span>
              <span className="block font-semibold">{draft.file.name}</span>
              <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{formatSize(draft.file.size)} · click to replace</span>
            </span>
          ) : (
            <span>
              <span className="block font-semibold">Drop your idea PPT here, or click to browse</span>
              <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                {PPT_EXTENSIONS.join(" / ")} · up to {MAX_PPT_MB} MB
              </span>
            </span>
          )}
          <input
            id={fieldId("file")}
            type="file"
            accept={`${PPT_EXTENSIONS.join(",")},application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf`}
            className="sr-only"
            aria-invalid={fileError ? true : undefined}
            aria-describedby={fileError ? `${fieldId("file")}-error` : undefined}
            onChange={e => pickFile(e.target.files?.[0])}
          />
        </label>
        {fileError && (
          <p id={`${fieldId("file")}-error`} className="mt-2 text-sm text-[#b42318]">
            {fileError}
          </p>
        )}
      </div>

      <div>
        {status.kind === "error" && (
          <p role="alert" className="mb-6 border-2 border-[#b42318] bg-[#b42318]/10 px-4 py-3 text-sm">
            {status.message}
          </p>
        )}
        <button
          type="submit"
          disabled={sending}
          className="group flex w-full items-center justify-between gap-6 border-2 border-ink bg-ink px-6 py-5 text-left text-bg shadow-[6px_6px_0_var(--accent)] transition-[background-color,color,translate,box-shadow] duration-150 hover:bg-accent hover:text-ink focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-trace active:translate-x-[4px] active:translate-y-[4px] active:shadow-[2px_2px_0_var(--accent)] disabled:cursor-wait disabled:bg-accent disabled:text-ink"
        >
          <span className="font-mono text-sm font-bold uppercase tracking-[0.12em]">{sending ? "Uploading your deck…" : "Submit PPT"}</span>
          <span aria-hidden="true" className={`text-2xl leading-none ${sending ? "motion-safe:animate-pulse" : "transition-transform group-hover:translate-x-1"}`}>
            ↑
          </span>
        </button>
        <p className="mt-4 text-xs text-muted">Uploading can take a few seconds on slow connections. Keep this tab open until it confirms.</p>
      </div>
    </form>
  );
}
