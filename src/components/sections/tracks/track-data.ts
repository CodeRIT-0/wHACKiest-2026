// The four tracks and their problem statements, in one place.
// Photos are from Unsplash (free to use under the Unsplash License, no attribution required);
// the credits below are kept anyway so they are easy to find.

export type Problem = {
  id: string;
  title: string;
  blurb: string;
  detail: string;
};

export type Track = {
  id: string;
  /** shown in the terminal-style readout above the problem statements */
  dir: string;
  title: string;
  blurb: string;
  tags: string[];
  /** which icon to draw (mapped to a Phosphor icon in TrackGallery, a client component) */
  icon: "brain" | "window" | "globe" | "cpu";
  /** each track glows in its own colour, picked from the site's palette */
  hue: string;
  /** `lift` brightens a dark photo before it is printed in the track colour, so all four match */
  image: { src: string; alt: string; credit: string; position?: string; lift?: number };
  problems: Problem[];
};

// TODO: placeholder tracks and sample statements; replace with the real ones once released
export const TRACKS: Track[] = [
  {
    id: "ai",
    dir: "ai_and_beyond",
    title: "AI & Beyond",
    blurb: "Models, agents and tools that actually help people.",
    tags: ["Agents", "LLMs", "Vision", "ML"],
    icon: "brain",
    hue: "#7aa7ff",
    image: {
      src: "/assets/tracks/ai.webp",
      alt: "A robot hand and a human hand reaching toward each other",
      credit: "Cash Macanaya / Unsplash",
      position: "42% 55%",
    },
    problems: [
      {
        id: "PS-01",
        title: "Campus copilot",
        blurb: "An assistant that answers the questions students actually ask.",
        detail: "Timetables, rules, deadlines, and where room 4B is. Build an assistant that knows the campus and gets the answer right the first time.",
      },
      {
        id: "PS-05",
        title: "Accessible classrooms",
        blurb: "Live captions, summaries and translations for every lecture.",
        detail: "Build tools that make lectures work for students who need captions, translations or a quick recap, without extra effort from the teacher.",
      },
    ],
  },
  {
    id: "web",
    dir: "web_and_product",
    title: "Web & Product",
    blurb: "Ship a product someone would open twice.",
    tags: ["Web apps", "Mobile", "UX", "SaaS"],
    icon: "window",
    hue: "#ffb35c",
    image: {
      src: "/assets/tracks/web.webp",
      alt: "Code in a dark-theme editor on a computer screen",
      credit: "Bernd Dittrich / Unsplash",
      position: "60% 50%",
      lift: 2.1,
    },
    problems: [
      {
        id: "PS-02",
        title: "Lost & found, rebuilt",
        blurb: "Reunite people with their stuff faster than the noticeboard does.",
        detail: "Things go missing every day and the noticeboard is where they stay lost. Design a product people would actually open the moment they lose something.",
      },
      {
        id: "PS-06",
        title: "Small shop, big web",
        blurb: "Get a neighbourhood store taking orders online in an afternoon.",
        detail: "Local shops lose customers to apps they can't afford to build. Make going online simple enough to set up in an afternoon.",
      },
    ],
  },
  {
    id: "social",
    dir: "social_impact",
    title: "Social Impact",
    blurb: "Small builds that move big numbers for real communities.",
    tags: ["Health", "Civic", "Climate", "Access"],
    icon: "globe",
    hue: "#5df2a8",
    image: {
      src: "/assets/tracks/social.webp",
      alt: "People walking down a busy, sunlit street in Lucknow",
      credit: "yash rai / Unsplash",
      position: "58% 45%",
    },
    problems: [
      {
        id: "PS-03",
        title: "Clean water map",
        blurb: "Verified water quality data for neighbourhoods that have none.",
        detail: "Many neighbourhoods have no reliable picture of their water quality. Collect, verify and show it in a way residents can trust and act on.",
      },
      {
        id: "PS-07",
        title: "Blood bank radar",
        blurb: "Match willing donors to nearby shortages in real time.",
        detail: "Shortages are local and urgent; donors are willing but unaware. Connect the two before it's too late.",
      },
    ],
  },
  {
    id: "open",
    dir: "open_innovation",
    title: "Open Innovation",
    blurb: "None of the above fits? Bring your own problem and make the case.",
    tags: ["Hardware", "IoT", "Wildcard", "Moonshots"],
    icon: "cpu",
    hue: "#fd9c36",
    image: {
      src: "/assets/tracks/open.webp",
      alt: "An Arduino board wired to sensors on a breadboard",
      credit: "Vishnu Mohanan / Unsplash",
      position: "38% 55%",
      lift: 1.15,
    },
    problems: [
      {
        id: "PS-04",
        title: "Your problem here",
        blurb: "Bring a problem you've lived and make the case for it.",
        detail: "None of the statements fit? Bring a problem you've lived through, convince the judges it matters, then solve it.",
      },
      {
        id: "PS-08",
        title: "Hardware hack",
        blurb: "If it blinks, beeps or moves, it fits here.",
        detail: "Sensors, boards and prototypes. Build something physical that solves a real problem, and bring it to the demo table.",
      },
    ],
  },
];

export const PROBLEM_COUNT = TRACKS.reduce((n, t) => n + t.problems.length, 0);

// TODO: the "what we look for" list is a placeholder until the judging criteria are final
export const LOOK_FOR = ["A working prototype over slides", "A real user with a real problem", "Something you can show live at final judging"];
