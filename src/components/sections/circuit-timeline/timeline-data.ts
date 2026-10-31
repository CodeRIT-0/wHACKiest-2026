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

// The event schedule. All times are IST.
export const timelineCheckpoints: TimelineCheckpoints = [
  {
    id: "registration-opens",
    title: "Problem Statement Release",
    date: "01 November 2026",
    dateTime: "2026-11-01T10:00:00+05:30",
    time: "10:00 AM",
    description: "Problem statements go live online. Explore the challenges and pick the problem your crew will solve.",
    tag: "CONNECTION ESTABLISHED",
  },
  {
    id: "registration-closes",
    title: "Ideation & Proposal",
    date: "15 November 2026",
    dateTime: "2026-11-15T23:59:00+05:30",
    time: "11:59 PM",
    description: "Develop your idea and submit your proposal for evaluation. Final boarding call.",
    tag: "CREW LOCKED IN",
  },
  {
    id: "mission-briefing",
    title: "Shortlisting",
    date: "22 November 2026",
    dateTime: "2026-11-22T09:00:00+05:30",
    time: "09:00 AM",
    description: "Proposals are evaluated and the selected teams advance to the offline hackathon.",
    tag: "OBJECTIVES DECODED",
  },
  {
    id: "the-24h-heist",
    title: "24-Hour Build Sprint",
    date: "01 December 2026",
    dateTime: "2026-12-01T10:00:00+05:30",
    time: "10:00 AM",
    description: "Teams build and test functional prototypes in 24 hours. Every second counts.",
    tag: "24 HOURS / OFFLINE",
  },
  {
    id: "final-reveal",
    title: "Demo & Evaluation",
    date: "02 December 2026",
    dateTime: "2026-12-02T17:00:00+05:30",
    time: "05:00 PM",
    description: "The clock stops. Teams present their solutions for judging and awards.",
    tag: "MISSION COMPLETE",
  },
];
