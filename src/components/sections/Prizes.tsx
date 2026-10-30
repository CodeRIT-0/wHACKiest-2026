import Image from "next/image";
import Section, { Accent } from "../Section";
import { Gear } from "../ui/era-art";
import { RetroLink } from "../ui/retro-button";
import { TextShimmer } from "../ui/text-shimmer";
import { prizePlaces } from "@/lib/event-content";
import { retroDesktop } from "@/lib/illustrations";

export default function Prizes() {
  return (
    <Section
      id="prizes"
      chapter="05"
      eyebrow="THE REWARDS / BUILD SOMETHING WORTH REMEMBERING"
      era="1970s—1980s"
      title={
        <>
          BIG IDEAS.
          <br />
          <Accent>BIGGER REWARDS.</Accent>
        </>
      }
    >
      <div className="prize-stage">
        <Gear className="prize-gear" />
        <div className="prize-note prize-note-left">
          <span className="mono-label">01 / {prizePlaces[0].place}</span>
          <h3>₹{prizePlaces[0].amount}</h3>
          <strong>{prizePlaces[0].title}</strong>
          <p>{prizePlaces[0].description}</p>
          <span className="announcement-tag">
            THE TOP SPOT / YOUR NEXT CHAPTER
          </span>
        </div>
        <div className="prize-computer">
          <Image
            src={retroDesktop}
            alt="An early beige personal computer with a glowing green CRT display and keyboard"
            sizes="(max-width: 700px) 95vw, 48vw"
          />
          <div className="crt-overlay">
            <span>WHACKIEST OS / 2026</span>
            <b>&gt; REWARD.EXE</b>
            <TextShimmer>₹50,000</TextShimmer>
            <span>TOTAL PRIZE POOL</span>
            <span className="crt-cursor" aria-hidden="true">
              _
            </span>
          </div>
          <span className="artifact-label">FIG. 05 / PERSONAL COMPUTING</span>
        </div>
        <div className="prize-note-stack">
          {prizePlaces.slice(1).map((prize, i) => (
            <div className="prize-note" key={prize.place}>
              <span className="mono-label">
                0{i + 2} / {prize.place}
              </span>
              <h3>₹{prize.amount}</h3>
              <strong>{prize.title}</strong>
              <p>{prize.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="prize-bottom">
        <span>THE BEST PART? WHAT YOU LEARN ALONG THE WAY.</span>
        <RetroLink href="/register" variant="paper">
          Make your move
        </RetroLink>
      </div>
    </Section>
  );
}
