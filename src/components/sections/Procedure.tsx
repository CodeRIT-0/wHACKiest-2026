"use client";

import { useRef, useState } from "react";
import { participation } from "@/content/participation";
import ProcedureArtwork from "./ProcedureArtwork";
import { useProcedureJourney } from "./procedureStory";
import "./Procedure.css";
import TicketUnfold from "./TicketUnfold";
import ClockDial from "./ClockDial";
import RegistrationModal from "./RegistrationModal";

export default function Procedure() {
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const { ready, ctaVisible } = useProcedureJourney(root);
  return <section id="how-to-register" ref={root} className="procedure-section" aria-labelledby="participation-title" data-journey-ready={ready}>
    <div className="journey-background" aria-hidden="true"><div className="journey-grid" /><svg className="journey-clock" viewBox="0 0 240 240" fill="none"><circle cx="120" cy="120" r="110" /><circle cx="120" cy="120" r="102" /><path d="M120 42v78l46 29" />{Array.from({length:12},(_,i)=><path key={i} d="M120 18v12" transform={`rotate(${i*30} 120 120)`} />)}</svg></div>
    <ClockDial />
    <div className="procedure-inner">
      <header className="procedure-heading"><p className="procedure-eyebrow"><span aria-hidden="true" />{participation.label}</p><h2 id="participation-title">{participation.title}</h2><p className="procedure-subtitle">{participation.subtitle}</p></header>
      <div className="journey-route">
        <svg className="journey-circuit" aria-hidden="true" focusable="false" fill="none">
          <path className="journey-spine-base" data-spine-base /><path className="journey-spine-live" data-spine-live pathLength="1" />
          {participation.steps.map((_,i)=><g key={i}><path className="journey-branch-base" data-branch-base={i} /><path className="journey-branch-live" data-branch-live={i} pathLength="1" /></g>)}
          <path className="journey-exit" data-exit /><path className="journey-final-base" data-final-base /><path className="journey-final-live" data-final-live pathLength="1" /><circle className="journey-signal" data-signal r="5" />
        </svg>
        <ol className="journey-stages">
          {participation.steps.map((step,index)=><li key={step.title} className="journey-stage" data-stage={index}>
            <span className="journey-node" data-node aria-hidden="true">0{index+1}</span>
            <div className="journey-copy"><p className="journey-kicker">0{index+1} / {['CONNECT','UPLOAD','SELECT','CONFIRM','BUILD'][index]}</p><h3 id={`procedure-step-${index+1}`}>{step.title}</h3><p>{step.description}</p></div>
            <div className="journey-artwork"><ProcedureArtwork stage={index} />{index === 4 && <TicketUnfold visible={ctaVisible} onRegister={() => setRegistrationOpen(true)} />}</div>
          </li>)}
        </ol>
      </div>
      <div className="journey-handoff" aria-hidden="true"><svg viewBox="0 0 100 80" preserveAspectRatio="none" fill="none"><path d="M0 0V22H100V80" /></svg><span>NEXT / CONNECTED KNOWLEDGE</span></div>
    </div>
    <RegistrationModal open={registrationOpen} onClose={() => setRegistrationOpen(false)} />
  </section>;
}
