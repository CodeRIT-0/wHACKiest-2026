import { RetroLink } from "../ui/retro-button";
import { TextShimmer } from "../ui/text-shimmer";
import { HeroExperience, HeroMachine } from "../hero/HeroExperience";

export default function Hero() {
  return (
    <HeroExperience>
      <div className="hero-edition">
        <span>CODERIT PRESENTS</span>
        <span>EST. IN CURIOSITY / BUILT FOR WHAT’S NEXT</span>
        <span>EDITION 2026</span>
      </div>
      <div className="hero-layout section-shell">
        <div className="hero-copy">
          <p className="section-eyebrow">
            <i className="status-dot" /> A HACKATHON THROUGH TIME
          </p>
          <p className="hero-wordmark">
            wHACKiest <span>2026</span>
          </p>
          <h1>
            EVERY
            <br />
            SECOND
            <br />
            <span>COUNTS.</span>
          </h1>
          <p className="hero-description">
            From the first spark to your next big idea.
            <br />
            Build something that moves the world forward.
          </p>
          <div className="hero-actions">
            <RetroLink href="/register">Join the heist</RetroLink>
            <RetroLink href="#timeline" variant="paper">
              Explore the timeline
            </RetroLink>
          </div>
          <div className="hero-signal">
            <span className="status-dot" />
            <TextShimmer>A NEW ERA OF BUILDERS.</TextShimmer>
            <span>₹50K / PRIZE POOL</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="instrument-orbit" aria-hidden="true">
            <span>MECHANICAL COMPUTING / THE FIRST SPARK</span>
          </div>
          <HeroMachine />
          <span className="artifact-label">
            FIG. 01 — AN IDEA SETS EVERYTHING IN MOTION
          </span>
          <div className="specimen-stamp" aria-hidden="true">
            W’26
            <br />
            <span>TIME TO BUILD</span>
          </div>
        </div>
      </div>
      <a href="#about" className="hero-scroll">
        <span>SCROLL TO TRAVEL THROUGH TIME</span>
        <i>↓</i>
        <span>THE FUTURE STARTS WITH YOU</span>
      </a>
    </HeroExperience>
  );
}
