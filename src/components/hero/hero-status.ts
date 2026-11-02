import { HACK_END, HACK_START } from "@/lib/event";

// Where we are in the event, worked out from the clock, so the hero never says something stale.
// The kick-off is HACK_START, the same moment the About section's Nixie clock counts down to.

const at = (dateTime: string) => Math.floor(new Date(dateTime).getTime() / 1000);

// used only to work out the status below; the timeline section shows its dates as to be announced
const REG_OPEN = at("2026-11-01T10:00:00+05:30");
const REG_CLOSE = at("2026-11-15T23:59:00+05:30");
const START = Math.floor(HACK_START / 1000);
const END = Math.floor(HACK_END / 1000);

export type Phase = "soon" | "open" | "closed" | "live" | "over";

export function phaseAt(now: number): Phase {
  if (now < REG_OPEN) return "soon";
  if (now < REG_CLOSE) return "open";
  if (now < START) return "closed";
  if (now < END) return "live";
  return "over";
}

// IST date parts done by hand: Intl output differs between Node and browsers (spaces, padding),
// and these strings are rendered on the server too
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const pad = (n: number) => String(n).padStart(2, "0");
function ist(unixSeconds: number) {
  const d = new Date((unixSeconds + 5.5 * 3600) * 1000);
  return { day: pad(d.getUTCDate()), month: MONTHS[d.getUTCMonth()], time: `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}` };
}

const regOpen = ist(REG_OPEN);
const kickOff = ist(START);

/** the status chip in the hero's eyebrow; `pulse` marks the states worth drawing the eye to */
export const STATUS: Record<Phase, { label: string; pulse: boolean }> = {
  soon: { label: `Registration opens ${regOpen.day} ${regOpen.month}`, pulse: false },
  open: { label: "Registrations open", pulse: true },
  closed: { label: "Registrations closed", pulse: false },
  live: { label: "Hacking live", pulse: true },
  over: { label: "That's a wrap", pulse: false },
};

/** what the countdown board is counting to, and how many seconds are left */
export function boardAt(now: number) {
  const phase = phaseAt(now);
  if (phase === "live") return { phase, label: "Hacking live · time left", left: END - now };
  if (phase === "over") return { phase, label: "Time's up · that's a wrap", left: 0 };
  return { phase, label: "T-minus to kick-off", left: START - now };
}

export const KICK_OFF_LABEL = `Kick-off ${kickOff.day} ${kickOff.month} · ${kickOff.time} IST`;
