import Section, { Accent } from "../Section";
import { RetroLink } from "../ui/retro-button";

export default function Contact() {
  return (
    <Section
      id="contact"
      chapter="10"
      eyebrow="END OF THE SCROLL / START OF SOMETHING"
      title={
        <>
          THE NEXT SECOND
          <br />
          COULD <Accent>CHANGE EVERYTHING.</Accent>
        </>
      }
    >
      <div className="contact-layout">
        <div>
          <p className="lead-copy">
            Bring your curiosity.
            <br />
            We’ll meet you at the starting line.
          </p>
          <div className="hero-actions">
            <RetroLink href="/register">Be part of wHACKiest</RetroLink>
            <RetroLink href="/announcements" variant="paper">
              Stay in the loop
            </RetroLink>
          </div>
          <span className="contact-note">
            OFFICIAL CONTACT CHANNELS & VENUE / ANNOUNCING SOON
          </span>
        </div>
        <div className="signal-radar" aria-hidden="true">
          <div />
          <div />
          <div />
          <span>W’26</span>
          <i />
        </div>
      </div>
      <div className="contact-bottom">
        <a href="#home">BACK TO THE BEGINNING ↑</a>
        <span>EVERY SECOND COUNTS.</span>
        <span>2026 / CODERIT</span>
      </div>
    </Section>
  );
}
