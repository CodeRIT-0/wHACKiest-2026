import { HACK_END, HACK_START } from "@/lib/event";
import { timelineCheckpoints } from "../sections/circuit-timeline/timeline-data";

// Where we are in the event, worked out from the clock, so the hero never says something stale.
// Registration dates come from the timeline (the same dates the timeline section shows); the
// kick-off is HACK_START, the same moment the About section's Nixie clock counts down to.

const at = (id: string) => {
  const checkpoint = timelineCheckpoints.find((c) => c.id === id);
  if (!checkpoint) throw new Error(`timeline checkpoint "${id}" is missing`);
  return Math.floor(new Date(checkpoint.dateTime).getTime() / 1000);
};

const REG_OPEN = at("registration-opens");
const REG_CLOSE = at("registration-closes");
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
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
