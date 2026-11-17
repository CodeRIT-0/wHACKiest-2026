export type TimelineCheckpoint = {
  id: string;
  title: string;
  /** big day number on the card, e.g. "19" or "26–27" */
  day: string;
  /** month (and year) beside it */
  month: string;
  /** small line above the month: a time, or how the round runs */
  detail: string;
  /** machine-readable start of the checkpoint, IST */
  dateTime: string;
  description: string;
  tag: string;
};

/** Six checkpoints, one per physical circuit terminal (see timeline-layout). */
export type TimelineCheckpoints = readonly [
  TimelineCheckpoint,
  TimelineCheckpoint,
  TimelineCheckpoint,
  TimelineCheckpoint,
  TimelineCheckpoint,
  TimelineCheckpoint,
];

// The event schedule. All times are IST.
export const timelineCheckpoints: TimelineCheckpoints = [
  {
    id: "problem-statements",
    title: "Problem Statement Release",
    day: "19",
    month: "November 2026",
    detail: "Online",
    dateTime: "2026-11-19T00:00:00+05:30",
    description: "Problem statements go live online. Explore the challenges and pick the problem your crew will solve.",
    tag: "CONNECTION ESTABLISHED",
  },
  {
    id: "registration-closes",
    title: "Registration Closes",
    day: "24",
    month: "November 2026",
    detail: "11:59 PM IST",
    dateTime: "2026-11-24T23:59:00+05:30",
    description: "Last call: the registration form, with your idea PPT attached, closes at 11:59 PM IST.",
    tag: "CREW LOCKED IN",
  },
  {
    id: "ideation",
    title: "Ideation & Proposal",
    day: "26–27",
    month: "November 2026",
    detail: "Online presentation",
    dateTime: "2026-11-26T00:00:00+05:30",
    description: "An online presentation round: registered teams present their idea and proposed solution to the evaluation panel.",
    tag: "ONLINE PRESENTATION ROUND",
  },
  {
    id: "shortlisting",
    title: "Shortlisting",
    day: "28",
    month: "November 2026",
    detail: "Results announced",
    dateTime: "2026-11-28T00:00:00+05:30",
    description: "Presentations are evaluated and the selected teams advance to the offline hackathon.",
    tag: "OBJECTIVES DECODED",
  },
  {
    id: "the-24h-heist",
    title: "24-Hour Build Sprint",
    day: "01",
    month: "December 2026",
    detail: "Offline round",
    dateTime: "2026-12-01T00:00:00+05:30",
    description: "Teams build and test functional prototypes in 24 hours. Every second counts.",
    tag: "24 HOURS / OFFLINE",
  },
  {
    id: "final-reveal",
    title: "Demo & Evaluation",
    day: "02",
    month: "December 2026",
    detail: "Offline round",
    dateTime: "2026-12-02T00:00:00+05:30",
    description: "The clock stops. Teams present their solutions for judging and awards.",
    tag: "MISSION COMPLETE",
  },
];
