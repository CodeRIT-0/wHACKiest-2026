"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Section, { Accent } from "../Section";
import { TrackIcon } from "../ui/era-art";
import { TransitionPanel } from "../ui/transition-panel";
import { RetroLink } from "../ui/retro-button";

const tracks = [
  {
    title: "AI & Beyond",
    tag: "INTELLIGENCE, WITH INTENTION",
    text: "Explore how intelligent systems can help people learn, create, and solve problems. Start with a human need. Build beyond the buzzwords.",
    short: "Give intelligence a purpose.",
    code: "01 / INTELLIGENCE",
  },
  {
    title: "Web & Product",
    tag: "MAKE THE EVERYDAY BETTER",
    text: "Turn friction into a useful experience. Design and build products that are thoughtful, accessible, and a pleasure to use.",
    short: "Great ideas deserve great experiences.",
    code: "02 / EXPERIENCE",
  },
  {
    title: "Social Impact",
    tag: "SMALL BUILDS. REAL CHANGE.",
    text: "Put your skills to work for people and communities. Explore ideas around access, sustainability, inclusion, and the things that matter.",
    short: "Code with a reason to exist.",
    code: "03 / COMMUNITY",
  },
  {
    title: "Open Innovation",
    tag: "FOLLOW YOUR WHAT IF",
    text: "The best ideas don’t always fit a box. Bring a surprising problem, an unconventional approach, and the courage to try something new.",
    short: "The next possibility is yours.",
    code: "04 / POSSIBILITY",
  },
];

export default function Tracks() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tracks.length;
    else if (event.key === "ArrowLeft")
      next = (index + tracks.length - 1) % tracks.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tracks.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }
  return (
    <Section
      id="tracks"
      chapter="04"
      dark
      eyebrow="THE CHALLENGE / CHOOSE YOUR DIRECTION"
      era="1960s—1970s"
      title={
        <>
          REAL PROBLEMS.
          <br />
          <Accent>BIGGER POSSIBILITIES.</Accent>
        </>
      }
    >
      <div className="tracks-layout">
        <div className="track-console">
          <div className="console-bar">
            <span>
              <i /> WHACKIEST / IDEA TERMINAL
            </span>
            <span>4 CHANNELS</span>
          </div>
          <div className="track-processor">
            <svg viewBox="0 0 600 260" fill="none" aria-hidden="true">
              {[-3, -2, -1, 1, 2, 3].map((n) => (
                <path
                  key={n}
                  d={`M300 130h${n * 22}l${n * 20} ${Math.abs(n) * 14}h${n * 48}M300 130v${n * 16}l${n * 19} ${n * 12}V${n < 0 ? 10 : 250}`}
                />
              ))}
            </svg>
            <Image
              src="/images/circuit/retro-chip.webp"
              alt="A vintage processor at the centre of connected circuits"
              width={240}
              height={240}
              sizes="240px"
            />
            <span className="processor-light" aria-hidden="true" />
          </div>
          <span className="console-legend">
            <i /> SYSTEM ONLINE / SELECT A CHANNEL
          </span>
        </div>
        <div
          className="track-detail"
          role="tabpanel"
          id="track-panel"
          aria-labelledby={`track-tab-${active}`}
          tabIndex={0}
        >
          <TransitionPanel activeIndex={active}>
            {tracks.map((t) => (
              <div key={t.title}>
                <span className="mono-label">{t.code}</span>
                <h3>{t.title}</h3>
                <p className="track-tag">{t.tag}</p>
                <p>{t.text}</p>
                <RetroLink href="/announcements" variant="orange">
                  Problem statements & updates
                </RetroLink>
                <small>
                  Theme directions shown. Final statements will be announced.
                </small>
              </div>
            ))}
          </TransitionPanel>
        </div>
      </div>
      <div className="track-tabs" role="tablist" aria-label="Hackathon tracks">
        {tracks.map((t, i) => (
          <button
            type="button"
            key={t.title}
            ref={(e) => {
              tabs.current[i] = e;
            }}
            id={`track-tab-${i}`}
            role="tab"
            aria-selected={active === i}
            aria-controls="track-panel"
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <span className="track-index">0{i + 1}</span>
            <TrackIcon index={i} />
            <strong>{t.title}</strong>
            <span>{t.short}</span>
            <i aria-hidden="true">↗</i>
          </button>
        ))}
      </div>
    </Section>
  );
}
