import Section, { Accent } from "../Section";
import { NixieDisplay, Gear } from "../ui/era-art";
import { RetroLink } from "../ui/retro-button";

export default function About() {
  return (
    <Section
      id="about"
      chapter="02"
      eyebrow="THE STORY / FROM THEN TO WHAT’S NEXT"
      era="1940s—1950s"
      title={
        <>
          WHERE IT
          <br />
          ALL <Accent>BEGAN.</Accent>
        </>
      }
    >
      <div className="about-layout">
        <div className="about-copy">
          <p className="lead-copy">
            Every breakthrough starts with a wonderfully wild idea.
          </p>
          <p>
            From gears that counted to circuits that thought, progress has
            always belonged to people who asked, “What if?”
          </p>
          <p>
            wHACKiest brings that same restless curiosity to a new generation.
            Find your crew, take on a real problem, and turn a spark into
            something people can use.
          </p>
          <RetroLink href="#tracks" variant="paper">
            Find your next idea
          </RetroLink>
          <div className="archive-note">
            <span>THE CODERIT COLLECTIVE</span>
            <strong>
              Curiosity is our
              <br />
              common language.
            </strong>
          </div>
        </div>
        <div className="about-instrument">
          <Gear className="about-gear" />
          <div className="punch-card" aria-hidden="true">
            <span>WHACKIEST / INPUT CARD 026</span>
            <div>
              {Array.from({ length: 90 }, (_, i) => (
                <i
                  key={i}
                  data-punched={i % 7 === 0 || i % 11 === 0 || i % 13 === 0}
                />
              ))}
            </div>
            <small>DO NOT FOLD / IDEAS INSIDE</small>
          </div>
          <NixieDisplay />
          <div className="instrument-caption">
            <span>FIG. 02 / ELECTRONIC COMPUTING</span>
            <span>ONE SPARK. ENDLESS POSSIBILITIES.</span>
          </div>
        </div>
      </div>
      <div className="story-strip">
        <span>THINK A LITTLE DIFFERENT.</span>
        <span>BUILD A LITTLE BRAVER.</span>
        <span>MAKE EVERY SECOND COUNT.</span>
      </div>
    </Section>
  );
}
