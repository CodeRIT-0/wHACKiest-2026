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
    { title: "Open Devfolio", text: <>Open the wHACKiest 2026 event application when the official link is published. <span className="registration-guide-pending" role="link" aria-disabled="true">Devfolio link coming soon</span></> },
    { title: "Sign In or Create an Account", text: <>Sign in to your Devfolio account, or create an account if this is your first application.</> },
    { title: "Complete Your Profile", text: <>Fill in the required profile, personal and contact details.</> },
    { title: "Choose Team Participation", text: <>Select team participation in the event application.</> },
    { title: "Create Your Team", text: <>The team leader creates the team and shares the generated team code with teammates.</> },
    { title: "Join Your Team", text: <>Other members join the existing team using the code shared by the team leader.</> },
    { title: "Check Your Team", text: <>Verify that every member has joined. Teams must contain 2–4 undergraduate students from the same college. Different branches and years are allowed; each student can join only one team.</> },
    { title: "Review and Submit", text: <>Check your application, team and contact details carefully, then submit your application through Devfolio.</> },
  ];

  return <div className="registration-guide" data-open={open}>
    <button type="button" className="registration-guide-toggle" aria-expanded={open} aria-controls={guideId} onClick={() => setOpen(value => !value)}>
      HOW TO REGISTER <span aria-hidden="true">{open ? "−" : "+"}</span>
    </button>
    <div id={guideId} className="registration-guide-disclosure" aria-hidden={!open} inert={!open}>
      <div className="registration-guide-clip">
        <div className="registration-guide-content">
          <p className="registration-guide-note">The official Devfolio link is coming soon. Follow these steps once applications are available: the team leader creates the team, and other members join with the shared team code.</p>
          <ol className="registration-guide-steps">
            {instructions.map((step, index) => <li key={step.title}>
              <span className="registration-guide-number" aria-hidden="true">{index + 1}.</span>
              <div><h4>{step.title}</h4><p>{step.text}</p></div>
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
      <header className="procedure-heading" id="participation-title"><SectionHeader index="06" label="How to participate" title="Your next move." /><p className="procedure-subtitle">{participation.subtitle}</p></header>
      <div className="journey-route">
        <svg className="journey-circuit" aria-hidden="true" focusable="false" fill="none">
          <path className="journey-spine-base" data-spine-base /><path className="journey-spine-live" data-spine-live pathLength="1" />
          {participation.steps.map((_,i)=><g key={i}><path className="journey-branch-base" data-branch-base={i} /><path className="journey-branch-live" data-branch-live={i} pathLength="1" /></g>)}
          <path className="journey-exit" data-exit /><path className="journey-final-base" data-final-base /><path className="journey-final-live" data-final-live pathLength="1" /><circle className="journey-signal" data-signal r="5" />
        </svg>
        <ol className="journey-stages">
          {participation.steps.map((step,index)=><li key={step.title} className="journey-stage" data-stage={index}>
            <span className="journey-node" data-node aria-hidden="true">0{index+1}</span>
            <div className="journey-copy"><p className="journey-kicker">0{index+1} / {['CONNECT','UPLOAD','SELECT','CONFIRM','BUILD'][index]}</p><h3 id={`procedure-step-${index+1}`}>{step.title}</h3><p className="journey-description">{step.description}</p>{index === 0 && <RegistrationGuide />}</div>
            <div className="journey-artwork"><ProcedureArtwork stage={index} />{index === 4 && <TicketUnfold visible={ctaVisible} onRegister={() => setRegistrationOpen(true)} />}</div>
          </li>)}
        </ol>
      </div>
    </div>
    <RegistrationModal open={registrationOpen} onClose={() => setRegistrationOpen(false)} />
  </section>;
}
