"use client";

import { useId, useRef, useState } from "react";
import { participation } from "@/content/participation";
import ProcedureArtwork from "./ProcedureArtwork";
import { useProcedureJourney } from "./procedureStory";
import "./Procedure.css";
import TicketUnfold from "./TicketUnfold";
import RegistrationModal from "./RegistrationModal";
import SectionHeader from "../SectionHeader";

function RegistrationGuide() {
  const [open, setOpen] = useState(false);
  const guideId = useId();
  const instructions = [
    { title: "Open the Event Page", content: <p>Open the wHACKiest 2026 event page on Devnovate and log in, or sign up if you’re new. <a className="registration-guide-pending" href={participation.registrationHref} target="_blank" rel="noopener noreferrer">Register on Devnovate ↗</a></p> },
    { title: "Update Your Profile", content: <p>Devnovate fills in each member’s details from their profile: full name, email address, college or organization, technical skills, GitHub profile, portfolio or projects, resume and past achievements. Every member should update their Devnovate profile before registering.</p> },
    { title: "Create or Join Your Team", content: <p>The team leader creates a team with a unique team name and shares the team code or invite link; the other members use it to join. Teams must have 2–4 undergraduate students from the same college; members may be from different branches or years, and each student can join only one team.</p> },
    { title: "Answer the Registration Questions", content: <><p>Event details are collected through custom registration questions:</p><ul><li>Verification details: college ID upload and LinkedIn or GitHub profile URLs, if asked for.</li><li>Track and problem statement: your hackathon track and the problem statement you chose (released 19 November).</li><li>Idea PPT: attach your team’s idea PPT in the upload field, or share it through the PPT link field.</li></ul><p>The idea PPT is submitted with registration; there is no separate PPT submission later.</p></> },
    { title: "Review and Submit", content: <p>Once every member has joined, the team leader reviews the team details and answers, checks the PPT is attached, and submits before <strong>24 November, 11:59 PM IST</strong>. Registered teams move on to the online presentation round on 26–27 November.</p> },
  ];

  return <div className="registration-guide" data-open={open}>
    <button type="button" className="registration-guide-toggle" aria-expanded={open} aria-controls={guideId} onClick={() => setOpen(value => !value)}>
      HOW TO REGISTER <span aria-hidden="true">{open ? "−" : "+"}</span>
    </button>
    <div id={guideId} className="registration-guide-disclosure" aria-hidden={!open} inert={!open}>
      <div className="registration-guide-clip">
        <div className="registration-guide-content">
          <p className="registration-guide-note">Registration on Devnovate is designed to minimize repetitive form filling. Your existing profile information is automatically fetched when you register for the event.</p>
          <ol className="registration-guide-steps">
            {instructions.map((step, index) => <li key={step.title}>
              <span className="registration-guide-number" aria-hidden="true">{index + 1}.</span>
              <div><h4>{step.title}</h4>{step.content}</div>
            </li>)}
          </ol>
        </div>
      </div>
    </div>
  </div>;
}

export default function Procedure() {
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const { ready, ctaVisible } = useProcedureJourney(root);
  return <section id="how-to-register" ref={root} className="procedure-section" aria-labelledby="participation-title" data-journey-ready={ready}>
    <div className="journey-background" aria-hidden="true"><div className="journey-grid" /><svg className="journey-clock" viewBox="0 0 240 240" fill="none"><circle cx="120" cy="120" r="110" /><circle cx="120" cy="120" r="102" /><path d="M120 42v78l46 29" />{Array.from({length:12},(_,i)=><path key={i} d="M120 18v12" transform={`rotate(${i*30} 120 120)`} />)}</svg></div>
    <div className="procedure-inner">
      <header className="procedure-heading" id="participation-title"><SectionHeader index="07" label="How to participate" title="Your next move." /><p className="procedure-subtitle">{participation.subtitle}</p></header>
      <div className="journey-route">
        <svg className="journey-circuit" aria-hidden="true" focusable="false" fill="none">
          <path className="journey-spine-base" data-spine-base /><path className="journey-spine-live" data-spine-live pathLength="1" />
          {participation.steps.map((_,i)=><g key={i}><path className="journey-branch-base" data-branch-base={i} /><path className="journey-branch-live" data-branch-live={i} pathLength="1" /></g>)}
          <path className="journey-exit" data-exit /><path className="journey-final-base" data-final-base /><path className="journey-final-live" data-final-live pathLength="1" /><circle className="journey-signal" data-signal r="5" />
        </svg>
        <ol className="journey-stages">
          {participation.steps.map((step,index)=><li key={step.title} className="journey-stage" data-stage={index}>
            <span className="journey-node" data-node aria-hidden="true">0{index+1}</span>
            <div className="journey-copy"><p className="journey-kicker">0{index+1} / {['CONNECT','PRESENT','SELECT','CONFIRM','BUILD'][index]}</p><h3 id={`procedure-step-${index+1}`}>{step.title}</h3><p className="journey-description">{step.description}</p>{index === 0 && <RegistrationGuide />}</div>
            <div className="journey-artwork"><ProcedureArtwork stage={index} />{index === 4 && <TicketUnfold visible={ctaVisible} onRegister={() => setRegistrationOpen(true)} />}</div>
          </li>)}
        </ol>
      </div>
    </div>
    <RegistrationModal open={registrationOpen} onClose={() => setRegistrationOpen(false)} />
  </section>;
}
