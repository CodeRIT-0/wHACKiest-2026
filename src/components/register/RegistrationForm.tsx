"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  TEAM_SIZES,
  WHATSAPP_COMMUNITY_URL,
  activeMembers,
  normalisePhone,
  normaliseUsn,
  validateRegistration,
  type FieldErrors,
  type RegistrationDraft,
  type TeamSize,
} from "@/content/registration";
import SharePass from "./SharePass";
import TeamTicket from "./TeamTicket";
import { Field, fieldId, inputClass } from "./form-ui";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "done"; id: string } | { kind: "error"; message: string };

const EMPTY: RegistrationDraft = {
  teamName: "",
  leaderName: "",
  leaderUsn: "",
  leaderEmail: "",
  leaderContact: "",
  size: 2,
  members: [{ name: "", usn: "" }, { name: "", usn: "" }, { name: "", usn: "" }],
};

function Step({ index, title, done, children }: { index: number; title: string; done: boolean; children: ReactNode }) {
  return (
    <fieldset className="relative border-t-2 border-ink pt-6">
      <legend className="contents">
        <span className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={`grid size-8 place-items-center border-2 border-ink font-mono text-xs transition-colors duration-300 ${done ? "bg-accent shadow-[2px_2px_0_var(--fg)]" : "bg-panel"}`}
          >
            {String(index).padStart(2, "0")}
          </span>
          <span className="text-xl font-bold uppercase tracking-[-0.02em] md:text-2xl">{title}</span>
          {done && <span className="sr-only">(complete)</span>}
        </span>
      </legend>
      <div className="mt-6 grid gap-5">{children}</div>
    </fieldset>
  );
}

export default function RegistrationForm({ endpoint }: { endpoint: string }) {
  const reduced = useReducedMotion();
  const [draft, setDraft] = useState<RegistrationDraft>(EMPTY);
  const [touched, setTouched] = useState<Set<string>>(() => new Set());
  const [showAll, setShowAll] = useState(false);
  const [serverErrors, setServerErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [copied, setCopied] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const top = useRef<HTMLDivElement>(null);

  const errors = useMemo(() => validateRegistration(draft), [draft]);
  const errorFor = (key: string) => serverErrors[key] ?? (showAll || touched.has(key) ? errors[key] : undefined);
  const touch = (key: string) => setTouched(prev => (prev.has(key) ? prev : new Set(prev).add(key)));
  const clearServer = (key: string) => setServerErrors(prev => (key in prev ? Object.fromEntries(Object.entries(prev).filter(([k]) => k !== key)) : prev));

  const update = <K extends keyof RegistrationDraft>(key: K, value: RegistrationDraft[K]) => {
    setDraft(prev => ({ ...prev, [key]: value }));
    clearServer(key);
  };
  const updateMember = (index: number, key: "name" | "usn", value: string) => {
    setDraft(prev => ({ ...prev, members: prev.members.map((m, i) => (i === index ? { ...m, [key]: value } : m)) }));
    clearServer(`members.${index}.${key}`);
  };

  const has = (...keys: string[]) => keys.some(key => errors[key]);
  const crewKeys = activeMembers(draft).flatMap((_, i) => [`members.${i}.name`, `members.${i}.usn`]);
  const progress = {
    team: !has("teamName"),
    leader: !has("leaderName", "leaderUsn", "leaderEmail", "leaderContact"),
    crew: !has(...crewKeys),
  };

  const inputProps = (key: string) => {
    const error = errorFor(key);
    return {
      id: fieldId(key),
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `${fieldId(key)}-error` : undefined,
      onBlur: () => touch(key),
      className: inputClass,
    };
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
      const payload = {
        teamName: draft.teamName.trim(),
        leaderName: draft.leaderName.trim(),
        leaderUsn: normaliseUsn(draft.leaderUsn),
        leaderEmail: draft.leaderEmail.trim().toLowerCase(),
        leaderContact: normalisePhone(draft.leaderContact),
        size: draft.size,
        members: activeMembers(draft).map(m => ({ name: m.name.trim(), usn: normaliseUsn(m.usn) })),
        website: honeypot.current?.value ?? "",
      };
      // text/plain keeps this a "simple" request, so the browser skips the CORS preflight
      // that Apps Script web apps can't answer.
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
      const result = (await response.json()) as { ok: boolean; id?: string; error?: string; field?: string };
      if (result.ok && result.id) {
        setStatus({ kind: "done", id: result.id });
        top.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      } else {
        const message = result.error ?? "Registration failed. Please try again.";
        setStatus({ kind: "error", message });
        if (result.field) {
          setServerErrors({ [result.field]: message });
          document.getElementById(fieldId(result.field))?.focus();
        }
      }
    } catch {
      setStatus({ kind: "error", message: "We couldn't reach the registration server. Check your connection and try again." });
    }
  }

  if (status.kind === "done") {
    const copyId = async () => {
      try {
        await navigator.clipboard.writeText(status.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* clipboard blocked: the ID is still on screen to copy by hand */
      }
    };
    return (
      <div ref={top} className="grid scroll-mt-28 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="order-2 lg:order-1">
          <TeamTicket draft={draft} teamId={status.id} />
        </div>
        <div className="order-1 grid content-start gap-10 lg:order-2">
          <div role="status">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-trace">Transmission received</p>
            <h2 className="display-wide mt-3 text-4xl uppercase leading-[0.95] md:text-6xl">
              You&apos;re in<span className="text-accent">.</span>
            </h2>
            <p className="mt-6 max-w-[48ch] text-lg">
              <strong>{draft.teamName.trim()}</strong> is registered.
            </p>
          </div>

          <div className="border-2 border-ink bg-panel p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em]">Your team ID</p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <span className="display-wide text-3xl tracking-[0.02em] md:text-4xl">{status.id}</span>
              <button
                type="button"
                onClick={copyId}
                className="border-2 border-ink bg-bg px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] hover:bg-accent focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-trace"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="mt-3 text-sm text-muted">Save this. You&apos;ll need it with the leader&apos;s email to submit your idea PPT, and when you contact the organisers.</p>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-trace">Next step</p>
            {WHATSAPP_COMMUNITY_URL ? (
              <a
                href={WHATSAPP_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-between gap-6 border-2 border-ink bg-[#25d366] px-5 py-4 font-mono text-sm font-bold uppercase tracking-[0.1em] text-ink shadow-[5px_5px_0_var(--fg)] transition-[translate,box-shadow] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_var(--fg)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-trace"
              >
                Join the WhatsApp community <span aria-hidden="true" className="text-2xl leading-none">↗</span>
              </a>
            ) : (
              <div className="mt-3 flex items-center justify-between gap-6 border-2 border-dashed border-ink px-5 py-4 font-mono text-sm uppercase tracking-[0.1em] text-muted">
                WhatsApp community link coming soon <span aria-hidden="true">···</span>
              </div>
            )}
            <p className="mt-3 text-sm text-muted">Updates, PPT submission details and shortlist news go out there and on Announcements.</p>
          </div>

          <SharePass
            card={{
              teamName: draft.teamName.trim(),
              size: draft.size,
              names: [draft.leaderName, ...activeMembers(draft).map(m => m.name)].map(n => n.trim()),
            }}
          />
        </div>
      </div>
    );
  }

  const sending = status.kind === "sending";

  return (
    <div ref={top} className="grid scroll-mt-28 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      {/* the live pass rides alongside the form on wide screens */}
      <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
        <TeamTicket draft={draft} />
        <ol className="mt-10 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase tracking-[0.12em]">
          {(Object.entries(progress) as [string, boolean][]).map(([label, done], i) => (
            <li key={label} className="flex flex-col gap-2">
              <span className={`h-1.5 border border-ink transition-colors duration-300 ${done ? "bg-accent" : "bg-panel"}`} />
              <span className={done ? "text-ink" : "text-muted"}>
                {String(i + 1).padStart(2, "0")} {label}
              </span>
            </li>
          ))}
        </ol>
      </aside>

      <form noValidate onSubmit={submit} className="grid min-w-0 gap-12" aria-busy={sending}>
        {/* bots fill every field; people never see this one */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <Step index={1} title="The team" done={progress.team}>
          <Field id={fieldId("teamName")} label="Team name" hint="2–40 characters" error={errorFor("teamName")}>
            <input {...inputProps("teamName")} value={draft.teamName} maxLength={40} autoComplete="off" placeholder="Null Pointers" onChange={e => update("teamName", e.target.value)} />
          </Field>
          <div>
            <p id="reg-size-label" className="font-mono text-[11px] uppercase tracking-[0.14em]">
              Team size
            </p>
            <div role="radiogroup" aria-labelledby="reg-size-label" className="mt-2 grid grid-cols-3 border-2 border-ink">
              {TEAM_SIZES.map(n => (
                <label key={n} className="group relative cursor-pointer border-ink [&:not(:first-child)]:border-l-2">
                  <input type="radio" name="size" value={n} checked={draft.size === n} onChange={() => update("size", n as TeamSize)} className="peer sr-only" />
                  <span className="flex items-baseline justify-center gap-2 bg-bg py-3 transition-colors duration-150 group-hover:bg-panel peer-checked:bg-ink peer-checked:text-bg peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:-outline-offset-[6px] peer-focus-visible:outline-trace">
                    <span className="display-wide text-2xl">{n}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em]">members</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </Step>

        <Step index={2} title="Team leader" done={progress.leader}>
          <Field id={fieldId("leaderName")} label="Full name" error={errorFor("leaderName")}>
            <input {...inputProps("leaderName")} value={draft.leaderName} autoComplete="name" onChange={e => update("leaderName", e.target.value)} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id={fieldId("leaderUsn")} label="USN" error={errorFor("leaderUsn")}>
              <input {...inputProps("leaderUsn")} value={draft.leaderUsn} autoCapitalize="characters" autoComplete="off" spellCheck={false} placeholder="1MS24CS001" className={`${inputClass} font-mono uppercase`} onChange={e => update("leaderUsn", e.target.value.toUpperCase())} />
            </Field>
            <Field id={fieldId("leaderContact")} label="Contact number" error={errorFor("leaderContact")}>
              <input {...inputProps("leaderContact")} type="tel" inputMode="tel" value={draft.leaderContact} autoComplete="tel" placeholder="98765 43210" onChange={e => update("leaderContact", e.target.value)} />
            </Field>
          </div>
          <Field id={fieldId("leaderEmail")} label="Email" hint="We'll write to this address" error={errorFor("leaderEmail")}>
            <input {...inputProps("leaderEmail")} type="email" inputMode="email" value={draft.leaderEmail} autoComplete="email" spellCheck={false} placeholder="you@college.edu" onChange={e => update("leaderEmail", e.target.value)} />
          </Field>
        </Step>

        <Step index={3} title="The crew" done={progress.crew}>
          <AnimatePresence initial={false}>
            {activeMembers(draft).map((member, i) => (
              <motion.div
                key={i}
                initial={reduced ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="border-2 border-line bg-panel p-4 sm:p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-trace">Member {String(i + 2).padStart(2, "0")}</p>
                  <div className="mt-4 grid gap-5 sm:grid-cols-[3fr_2fr]">
                    <Field id={fieldId(`members.${i}.name`)} label="Full name" error={errorFor(`members.${i}.name`)}>
                      <input {...inputProps(`members.${i}.name`)} value={member.name} autoComplete="off" onChange={e => updateMember(i, "name", e.target.value)} />
                    </Field>
                    <Field id={fieldId(`members.${i}.usn`)} label="USN" error={errorFor(`members.${i}.usn`)}>
                      <input {...inputProps(`members.${i}.usn`)} value={member.usn} autoCapitalize="characters" autoComplete="off" spellCheck={false} className={`${inputClass} font-mono uppercase`} onChange={e => updateMember(i, "usn", e.target.value.toUpperCase())} />
                    </Field>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <p className="text-sm text-muted">Everyone must be an undergraduate at the same college. Different branches and years are fine; nobody can be in two teams.</p>
        </Step>

        <div className="border-t-2 border-ink pt-8">
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
            <span className="font-mono text-sm font-bold uppercase tracking-[0.12em]">{sending ? "Transmitting your team…" : "Register team"}</span>
            <span aria-hidden="true" className={`text-2xl leading-none ${sending ? "motion-safe:animate-pulse" : "transition-transform group-hover:translate-x-1"}`}>
              →
            </span>
          </button>
          <p className="mt-4 text-xs text-muted">Submit once per team. You&apos;ll upload your idea PPT later, using the team ID you get next.</p>
        </div>
      </form>
    </div>
  );
}
