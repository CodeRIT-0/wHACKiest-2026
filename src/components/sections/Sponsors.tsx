import Section, { Accent } from "../Section";
import { RetroLink } from "../ui/retro-button";
import { previewPartners } from "@/lib/event-content";

export default function Sponsors() {
  return (
    <Section
      id="sponsors"
      chapter="06"
      eyebrow="THE SUPPORT SYSTEM / BETTER TOGETHER"
      era="1980s—1990s"
      title={
        <>
          GREAT BUILDS NEED
          <br />
          <Accent>GREAT BACKING.</Accent>
        </>
      }
    >
      <div className="sponsor-layout">
        <div className="sponsor-seal">
          <span>THE PEOPLE WHO MAKE IT HAPPEN</span>
          <strong>
            Code<span>RIT</span>
          </strong>
          <p>Curiosity. Community. Code.</p>
          <span>ORGANISING COLLECTIVE / WHACKIEST 2026</span>
        </div>
        <div className="partner-note">
          <span className="mono-label">AN OPEN INVITATION</span>
          <h3>
            HELP BUILD
            <br />
            THE NEXT CHAPTER.
          </h3>
          <p>
            Tools, mentorship, and opportunities can take a wild idea further.
            Help the next generation turn their what if into what’s next.
          </p>
          <RetroLink href="/announcements" variant="paper">
            Partnership updates
          </RetroLink>
        </div>
      </div>
      <div className="partner-wordmarks">
        {previewPartners.map((name) => (
          <span key={name}>{name}</span>
        ))}
      </div>
      <div className="sponsor-footnote">
        <span>ILLUSTRATIVE PARTNER LINEUP / MOCK CONTENT</span>
        <span>GOOD IDEAS TRAVEL FURTHER TOGETHER ↗</span>
      </div>
    </Section>
  );
}
