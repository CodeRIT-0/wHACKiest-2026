import Section, { Accent } from "../Section";

const faqs = [
  {
    q: "What is wHACKiest?",
    a: "A hackathon organised by CodeRIT, bringing curious builders together to turn ideas into working projects. Explore a problem, experiment with your team, and share what you build.",
  },
  {
    q: "When is the 2026 edition?",
    a: "The dates shown in the timeline are planning dates. The confirmed schedule, venue, and timings will be published in Announcements.",
  },
  {
    q: "How do I register my team?",
    a: "Visit Registration for the current application status. The official form, team requirements, and submission instructions will be shared when they are confirmed.",
  },
  {
    q: "Do I need a finished idea before joining?",
    a: "Start by exploring the tracks and discussing a problem with your crew. Check the official participation rules for any proposal or submission requirements.",
  },
  {
    q: "Where can I find the problem statements?",
    a: "The track cards introduce the theme directions. Final problem statements and challenge details will be linked from Announcements.",
  },
  {
    q: "Where will important updates appear?",
    a: "Announcements is the place to check for the confirmed schedule, registration information, team requirements, and prize reveals.",
  },
];

export default function Faqs() {
  return (
    <Section
      id="faqs"
      chapter="08"
      eyebrow="THE HELP DESK / A FEW USEFUL ANSWERS"
      title={
        <>
          CURIOUS MINDS
          <br />
          ASK <Accent>QUESTIONS.</Accent>
        </>
      }
    >
      <div className="faq-layout">
        <div className="faq-index">
          <span className="mono-label">WHACKIEST KNOWLEDGE BASE</span>
          <span className="faq-mark" aria-hidden="true">
            ?
          </span>
          <p>
            A little clarity
            <br />
            before the next big idea.
          </p>
          <a href="/announcements">Read the latest updates ↗</a>
        </div>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <details key={f.q} name="whackiest-faq" className="faq-item">
              <summary>
                <span>0{i + 1}</span>
                {f.q}
                <i aria-hidden="true">+</i>
              </summary>
              <div className="faq-answer">
                <p>{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
