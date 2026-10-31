export type TimelineCheckpoint = {
  id: string;
  title: string;
  date: string;
  dateTime: string;
  time: string;
  description: string;
  tag: string;
};

/** Five replaceable checkpoints correspond to the five physical circuit terminals. */
export type TimelineCheckpoints = readonly [
  TimelineCheckpoint,
  TimelineCheckpoint,
  TimelineCheckpoint,
  TimelineCheckpoint,
  TimelineCheckpoint,
];

// Planning placeholders, not the official event schedule. All times are IST.
export const timelineCheckpoints: TimelineCheckpoints = [
  {
    id: "registration-opens",
    title: "Registration Opens",
    date: "01 November 2026",
    dateTime: "2026-11-01T10:00:00+05:30",
    time: "10:00 AM",
    description: "Assemble your crew. Every great heist begins with a team.",
    tag: "CONNECTION ESTABLISHED",
  },
  {
    id: "registration-closes",
    title: "Registration Closes",
    date: "15 November 2026",
    dateTime: "2026-11-15T23:59:00+05:30",
    time: "11:59 PM",
    description: "Final boarding call. Lock in your squad.",
    tag: "CREW LOCKED IN",
  },
  {
    id: "mission-briefing",
    title: "Mission Briefing",
    date: "01 December 2026",
    dateTime: "2026-12-01T09:00:00+05:30",
    time: "09:00 AM",
    description: "Receive your objectives and prepare for the challenge.",
    tag: "OBJECTIVES DECODED",
  },
  {
    id: "the-24h-heist",
    title: "The 24H Heist",
    date: "01 December 2026",
    dateTime: "2026-12-01T10:00:00+05:30",
    time: "10:00 AM",
    description: "Build, break, innovate. Every second counts.",
    tag: "24H / OFFLINE",
  },
  {
    id: "final-reveal",
    title: "Final Reveal",
    date: "02 December 2026",
    dateTime: "2026-12-02T17:00:00+05:30",
    time: "05:00 PM",
    description: "The clock stops. The next generation of innovators emerges.",
    tag: "MISSION COMPLETE",
  },
];
