// The page is a trip through computing history. Each homepage section is one stop: it sets the
// year + tagline the era counter rolls to, and its paper colours (ColourJourney blends between
// stops as you scroll; today every stop shares the ivory palette, so the page stays one colour).

export type Palette = {
  bg: string;
  fg: string;
  muted: string;
  panel: string;
  line: string;
  /** illustration + circuit trace colour */
  trace: string;
  /** dark paper: text flips to light */
  dark?: boolean;
};

// one ivory page throughout; the eras are told by the year counter, dividers and illustrations
const IVORY: Palette = { bg: "#FFF9EC", fg: "#050505", muted: "#5E5A52", panel: "#F7F2E5", line: "#E4DCCB", trace: "#0357D6" };

export type Era = {
  id: string;
  year: number;
  tagline: string;
  palette: Palette;
  /** how far into the section (0-1) the stop sits when it crosses the middle of the viewport */
  at?: number;
};

export const ERAS: Era[] = [
  { id: "home", year: 1946, tagline: "Gears & clockwork", palette: IVORY, at: 0 },
  { id: "timeline", year: 1960, tagline: "The transistor age", palette: IVORY, at: 0.5 },
  { id: "tracks", year: 2010, tagline: "Pick your stack", palette: IVORY },
  { id: "prizes", year: 2024, tagline: "Personal computing", palette: IVORY, at: 0.08 },
  { id: "faqs", year: 2025, tagline: "Ask the network", palette: IVORY },
  { id: "team", year: 2026, tagline: "People behind the code", palette: IVORY },
  { id: "join", year: 2026, tagline: "The AI era", palette: IVORY, at: 0.5 },
];

export const PALETTE_KEYS = ["bg", "fg", "muted", "panel", "line", "trace"] as const;
