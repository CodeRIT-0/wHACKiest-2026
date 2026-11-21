// The wHACKiest 2026 tracks, in one place: the Tracks gallery, the idea PPT form and the admin
// shortlist all read from here.
// Photos are from Unsplash (free to use under the Unsplash License, no attribution required);
// the credits below are kept anyway so they are easy to find.

export type Track = {
  id: string;
  title: string;
  /** the short line under the title */
  tagline: string;
  /** the challenge, in a few sentences */
  blurb: string;
  tags: string[];
  /** which icon to draw (mapped to a Phosphor icon in TrackGallery, a client component) */
  icon: "plug" | "browser" | "heartbeat" | "graduation" | "mystery";
  /** each track glows in its own colour, picked from the site's palette */
  hue: string;
  /** `lift` brightens a dark photo before it is printed in the track colour, so they all match */
  image?: { src: string; alt: string; credit: string; position?: string; lift?: number };
  /** still sealed: shown in the gallery, but not offered on the PPT form or the admin shortlist */
  mystery?: boolean;
};

export const TRACKS: Track[] = [
  {
    id: "make-mcp-matter",
    title: "Make MCP Matter",
    tagline: "Less magic, more utility.",
    blurb:
      "Build an MCP-powered solution a regular person would actually use every day: intelligent agents that work with the apps, services and tools people already rely on. Go beyond basic integrations, with useful, reliable and controlled interactions that make everyday tasks simpler.",
    tags: ["MCP", "AI agents", "Integrations", "Everyday tasks"],
    icon: "plug",
    hue: "#7aa7ff",
    image: {
      src: "/assets/tracks/ai.webp",
      alt: "A robot hand and a human hand reaching toward each other",
      credit: "Cash Macanaya / Unsplash",
      position: "42% 55%",
    },
  },
  {
    id: "beyond-the-browser",
    title: "Beyond the Browser",
    tagline: "Reimagine how we use the web.",
    blurb:
      "Navigating sites, finding what matters, comparing options and finishing complicated tasks online is still tedious. Build browser-based agents that go beyond browsing and search, and make the web smoother, more accessible and more intuitive for everyone.",
    tags: ["Browser agents", "Web automation", "Accessibility", "Search"],
    icon: "browser",
    hue: "#ffb35c",
    image: {
      src: "/assets/tracks/web.webp",
      alt: "Code in a dark-theme editor on a computer screen",
      credit: "Bernd Dittrich / Unsplash",
      position: "60% 50%",
      lift: 2.1,
    },
  },
  {
    id: "know-thyself",
    title: "Know Thyself",
    tagline: "Your data. Your intelligence.",
    blurb:
      "Phones, smartwatches and fitness trackers record a lot about us, but rarely turn it into insight. Build a personal intelligence system that brings this data together to help people understand their health, fitness and habits, with AI insights and timely nudges, and privacy and data ownership first.",
    tags: ["Personal data", "Health & fitness", "AI insights", "Privacy"],
    icon: "heartbeat",
    hue: "#5df2a8",
    image: {
      src: "/assets/tracks/open.webp",
      alt: "An Arduino board wired to sensors on a breadboard",
      credit: "Vishnu Mohanan / Unsplash",
      position: "38% 55%",
      lift: 1.15,
    },
  },
  // the mystery track, now revealed
  {
    id: "unlocked",
    title: "UnlockED",
    tagline: "Unlocking educational potential, empowering futures.",
    blurb:
      "Quality education, skills and jobs are still out of reach for many, especially in underserved communities. Bridge the gap between learning and employment: make education more accessible and opportunities easier to find, so people can learn, showcase their abilities and connect with meaningful opportunities.",
    tags: ["Mystery track", "EdTech", "Skills", "Employment"],
    icon: "graduation",
    hue: "#c08cff",
    image: {
      src: "/assets/tracks/learning.webp",
      alt: "People working through notes and sticky notes around a table",
      credit: "rawpixel (CC0)",
      position: "40% 50%",
    },
  },
];

/** the tracks teams can pick today (the sealed one joins once it's revealed) */
export const OPEN_TRACKS = TRACKS.filter((t) => !t.mystery);
