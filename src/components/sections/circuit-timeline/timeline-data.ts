export type TimelineCheckpoint = {
  id: string;
  title: string;
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

// The event schedule. Dates and times stay to be announced, so none are kept here.
export const timelineCheckpoints: TimelineCheckpoints = [
  {
    id: "registration-opens",
    title: "Problem Statement Release",
    description: "Problem statements go live online. Explore the challenges and pick the problem your crew will solve.",
    tag: "CONNECTION ESTABLISHED",
  },
  {
    id: "registration-closes",
    title: "Ideation & Proposal",
    description: "Develop your idea and submit your proposal for evaluation. Final boarding call.",
    tag: "CREW LOCKED IN",
  },
  {
    id: "mission-briefing",
    title: "Shortlisting",
    description: "Proposals are evaluated and the selected teams advance to the offline hackathon.",
    tag: "OBJECTIVES DECODED",
  },
  {
    id: "the-24h-heist",
    title: "24-Hour Build Sprint",
    description: "Teams build and test functional prototypes in 24 hours. Every second counts.",
    tag: "24 HOURS / OFFLINE",
  },
  {
    id: "final-reveal",
    title: "Demo & Evaluation",
    description: "The clock stops. Teams present their solutions for judging and awards.",
    tag: "MISSION COMPLETE",
  },
];
