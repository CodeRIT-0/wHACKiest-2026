// The About story's content, shared by the desktop version (told inside the pinned hero) and the
// phone/tablet version (its own section under the hero, MobileAbout), so the copy never drifts.

// photos from wHACKiest 2025, cropped square in public/assets/about
export const POLAROIDS = [
  { caption: "Kick-off, 2025", src: "/assets/about/kickoff.webp", alt: "The wHACKiest 2025 crew with the event banner", tilt: "-rotate-6", turn: -6 },
  { caption: "3am debugging", src: "/assets/about/debugging.webp", alt: "Teams heads-down at their laptops in the lab", tilt: "rotate-3", turn: 3 },
  { caption: "Final demos", src: "/assets/about/demos.webp", alt: "Teams presenting their projects to the judges", tilt: "-rotate-2", turn: -2 },
];

export const STATS = [
  ["3000+", "Participants"],
  ["1000+", "Projects built"],
  ["20+", "Industry partners"],
] as const;

export function AboutBlurb() {
  return (
    <>
      wHACKiest is the flagship hackathon of CodeRIT, the official coding club of Ramaiah Institute of Technology. In this{" "}
      <span className="whitespace-nowrap font-semibold text-ink">24-hour</span> sprint, undergraduate teams from across India ideate, build, test and pitch
      working prototypes for real-world problems.
    </>
  );
}
