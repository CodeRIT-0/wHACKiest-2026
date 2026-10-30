import Section, { Accent } from "../Section";
import { TrackIcon } from "../ui/era-art";
import { RetroLink } from "../ui/retro-button";
import { previewTeam } from "@/lib/event-content";
import { SchematicCard } from "../ui/schematic-card";

export default function Team() {
  return (
    <Section
      id="team"
      chapter="09"
      eyebrow="THE COLLECTIVE / PEOPLE MAKE POSSIBILITIES"
      era="2010s—NOW"
      title={
        <>
          MEET THE MINDS
          <br />
          <Accent>BEHIND THE HEIST.</Accent>
        </>
      }
    >
      <div className="team-poster">
        <div className="team-wordmark">
          <span>NOT JUST AN EVENT. A SHARED OBSESSION.</span>
          <strong>
            CodeRIT<span>©</span>
          </strong>
          <p>
            By builders.
            <br />
            For the beautifully curious.
          </p>
        </div>
        <div className="team-network" aria-hidden="true">
          <svg viewBox="0 0 400 240">
            <path
              d="M50 40L180 80 310 30 350 190 180 80 70 210 350 190M50 40L70 210M310 30L70 210"
              fill="none"
              stroke="currentColor"
            />
            {[
              [50, 40],
              [180, 80],
              [310, 30],
              [350, 190],
              [70, 210],
            ].map(([x, y], i) => (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r={i === 1 ? 22 : 12}
                  fill={i === 1 ? "#fd9c36" : "#fff9ec"}
                  stroke="currentColor"
                />
                <circle cx={x} cy={y} r="4" fill="currentColor" />
              </g>
            ))}
          </svg>
          <span>CONNECTED BY CURIOSITY</span>
        </div>
      </div>
      <div className="team-disciplines">
        {["THE CODE", "THE CRAFT", "THE COMMUNITY"].map((name, i) => (
          <div key={name}>
            <TrackIcon index={i} />
            <span>{name}</span>
            <span>0{i + 1}</span>
          </div>
        ))}
      </div>
      <div className="team-profiles">
        {previewTeam.map((person, i) => (
          <SchematicCard className="team-profile" key={person.name}>
            <div className="portrait-illustration" data-portrait={i}>
              <svg
                viewBox="0 0 180 180"
                role="img"
                aria-label={`Illustrated placeholder portrait for ${person.name}`}
              >
                <defs>
                  <pattern
                    id={`portrait-grid-${i}`}
                    width="8"
                    height="8"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle
                      cx="1"
                      cy="1"
                      r=".5"
                      fill="currentColor"
                      opacity=".25"
                    />
                  </pattern>
                </defs>
                <rect
                  width="180"
                  height="180"
                  fill={`url(#portrait-grid-${i})`}
                />
                <circle
                  cx="90"
                  cy="68"
                  r={27 + (i % 3) * 2}
                  fill="currentColor"
                  opacity=".8"
                />
                <path
                  d={`M${29 + (i % 3) * 4} 180v-28c0-51 122-51 122 0v28`}
                  fill="currentColor"
                  opacity=".8"
                />
                <path
                  d="M70 67h14m12 0h14M84 67h12"
                  stroke="#fff9ec"
                  strokeWidth={i % 2 ? 2 : 5}
                />
                <path
                  d="M83 83q7 5 14 0"
                  stroke="#fff9ec"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <span>
                {person.initials} / 0{i + 1}
              </span>
            </div>
            <div>
              <h3>{person.name}</h3>
              <p>{person.role}</p>
            </div>
          </SchematicCard>
        ))}
      </div>
      <div className="team-footer">
        <p>Illustrative team profiles / mock names and portraits.</p>
        <RetroLink href="/announcements" variant="paper">
          Team updates
        </RetroLink>
      </div>
    </Section>
  );
}
