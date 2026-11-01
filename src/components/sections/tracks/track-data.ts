// The four tracks, in one place.
// Photos are from Unsplash (free to use under the Unsplash License, no attribution required);
// the credits below are kept anyway so they are easy to find.

export type Track = {
  id: string;
  title: string;
  blurb: string;
  tags: string[];
  /** which icon to draw (mapped to a Phosphor icon in TrackGallery, a client component) */
  icon: "brain" | "window" | "globe" | "cpu";
  /** each track glows in its own colour, picked from the site's palette */
  hue: string;
  /** `lift` brightens a dark photo before it is printed in the track colour, so all four match */
  image: { src: string; alt: string; credit: string; position?: string; lift?: number };
};

// TODO: placeholder tracks; replace with the real ones once released
export const TRACKS: Track[] = [
  {
    id: "ai",
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
  },
  {
    id: "web",
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
  },
  {
    id: "social",
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
  },
  {
    id: "open",
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
  },
];

