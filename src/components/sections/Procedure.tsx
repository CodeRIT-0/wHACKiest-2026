import Section, { Accent } from "../Section";
import { RetroLink } from "../ui/retro-button";
import { TrackIcon, Gear } from "../ui/era-art";

export default function Procedure() {
  return (
    <Section
      id="procedure"
      chapter="07"
      eyebrow="GET CONNECTED / YOUR NEXT MOVE"
      era="1990s—2010s"
      title={
        <>
          YOUR IDEA.
          <br />
          <Accent>NEXT STOP: REALITY.</Accent>
        </>
      }
    >
      <div className="procedure-scene">
        <Gear className="procedure-gear" />
        <div className="browser-window">
          <div className="browser-title">
            <span>
              <i />
              <i />
              <i />
            </span>
            <span>WHACKIEST // YOUR JOURNEY STARTS HERE</span>
            <span>↗</span>
          </div>
          <div className="browser-address">
            <span>↶ &nbsp; ↷</span>
            <span>whackiest / start-building</span>
            <span>☆</span>
          </div>
          <ol className="procedure-steps">
            {[
              {
                title: "Assemble your crew",
                text: "Find people who challenge your thinking. Bring different strengths and a shared sense of possibility.",
              },
              {
                title: "Bring your what if",
                text: "Explore the tracks. Pick a problem you care about. Sketch the simplest version that could make a difference.",
              },
              {
                title: "Make your next move",
                text: "Check the registration details and announcements for the official application process, rules, and schedule.",
              },
            ].map((s, i) => (
              <li key={s.title}>
                <span className="step-number">0{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
                <TrackIcon index={i + 1} />
              </li>
            ))}
          </ol>
          <div className="browser-footer">
            <RetroLink href="/register">Registration details</RetroLink>
            <span>
              THE NEXT BREAKTHROUGH
              <br />
              MIGHT START WITH YOU.
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}
