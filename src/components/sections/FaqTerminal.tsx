import type { FaqSignalCategory } from "@/content/faqs";

const knowledgeNodes: { category: FaqSignalCategory; x: number; y: number; connection: string; symbol: string }[] = [
  { category: "registration", x: 22, y: 205, connection: "M22 205H85V190H210", symbol: "M-8-6H8V6H-8Z M-3-2h-2v3h2z M1-2H5 M1 2H5" },
  { category: "submission", x: 388, y: 86, connection: "M388 86V146H325L280 190H210", symbol: "M-6-8H3L7-4V8H-6Z M0 5V-3 M-3 0 0-3 3 0" },
  { category: "selection", x: 395, y: 250, connection: "M395 250H335V210H210", symbol: "m-7-4 2 2 3-4 M1-4H7 m-14 8 2 2 3-4 M1 4H7" },
  { category: "payment", x: 22, y: 310, connection: "M22 310H80V250L135 190H210", symbol: "M-8-5H8V-1a2 2 0 0 0 0 4V6H-8V3a2 2 0 0 0 0-4Z M3-4V5" },
];

// Local information sources feed the existing decorative help terminal.
export default function FaqTerminal({ category, requestKey }: { category: FaqSignalCategory | null; requestKey: string | null }) {
  return (
    <div className="faq-terminal" aria-hidden="true">
      <svg className="faq-terminal-artboard" viewBox="0 0 420 430" focusable="false"><foreignObject width="420" height="430"><div className="faq-terminal-scene">
      <svg className="faq-circuit" viewBox="0 0 420 410" preserveAspectRatio="none" fill="none" focusable="false">
        <g className="faq-circuit-base">
          {knowledgeNodes.map(node => <path key={node.category} d={node.connection} />)}
        </g>
        {category !== null && (
          <path key={requestKey} className="faq-circuit-pulse" d={knowledgeNodes.find(node => node.category === category)?.connection} pathLength="1" />
        )}
        {knowledgeNodes.map(node => (
          <g className="faq-network-node" key={node.category} data-category={node.category} data-active={category === node.category} transform={`translate(${node.x} ${node.y})`}>
            <circle r="15" />
            <path d={node.symbol} />
          </g>
        ))}
      </svg>
      <svg className="faq-browser-fragments" viewBox="0 0 420 410" fill="none" focusable="false">
        <g stroke="#0357d6" strokeWidth="1" opacity=".45"><path d="M57 180V119H92M357 209V176h32M60 315v42h88" /></g>
        <g transform="translate(2 124)"><rect width="76" height="48" fill="#202020" stroke="#63615a" /><path d="M0 10h76" stroke="#63615a" /><circle cx="7" cy="5" r="1.5" fill="#fd9c36" /><path d="M10 22h45m-45 8h58m-58 8h31" stroke="#0357d6" opacity=".5" /></g>
        <g transform="translate(347 295)"><rect width="63" height="45" fill="#202020" stroke="#63615a" /><path d="M0 10h63" stroke="#63615a" /><path d="m11 26 6 6 9-14m10 6h17m-17 7h12" stroke="#0357d6" /><circle cx="55" cy="5" r="2" fill="#fd9c36" /></g>
        {[{x:62,y:81},{x:350,y:34}].map((profile,i)=><g key={i} transform={`translate(${profile.x} ${profile.y})`}><circle r="19" fill="#202020" stroke="#0357d6" /><circle cy="-5" r="5" fill="#0357d6" /><path d="M-10 10a10 10 0 0 1 20 0" fill="#0357d6" /><circle cx="15" cy="13" r="4" fill="#fd9c36" stroke="#63615a" /></g>)}
      </svg>
      <p className="faq-era-label">CONNECTED KNOWLEDGE / INFORMATION INTO ANSWERS</p>
      <div className="faq-reference faq-reference-back">
        <span>EVENT UPDATES</span><b>THE NEXT STEP.</b><i /><i /><i />
      </div>
      <div className="faq-reference faq-reference-front">
        <span>SUBMISSION GUIDE</span><b>A GOOD QUESTION<br />STARTS SOMETHING.</b><i /><i />
      </div>
      <div className="faq-computer">
        <div className="faq-monitor">
          <div className="faq-screen-title"><span>help_terminal</span><span>− □ ×</span></div>
          <div className="faq-screen">
            <span key={requestKey} className="faq-screen-prompt">&gt; how_can_we_help?</span>
            <div className="faq-symbols">
              <svg viewBox="0 0 100 90" data-active={category === null} fill="none">
                <path d="M32 27c0-23 39-23 39 0 0 14-21 15-21 30" />
                <circle cx="50" cy="72" r="3" fill="currentColor" stroke="none" />
              </svg>
              <svg viewBox="0 0 100 90" data-active={category === "registration"} fill="none">
                <rect x="13" y="17" width="74" height="56" rx="3" />
                <path d="M13 29h74M55 43h21M55 54h15M55 64h21" />
                <circle cx="33" cy="44" r="7" /><path d="M21 65v-3a12 12 0 0 1 24 0v3z" />
              </svg>
              <svg viewBox="0 0 100 90" data-active={category === "submission"} fill="none">
                <path d="M60 13H25v64h50V28L60 13v15h15M50 63V39m-11 11 11-11 11 11" />
              </svg>
              <svg viewBox="0 0 100 90" data-active={category === "selection"} fill="none">
                <rect x="19" y="14" width="62" height="63" rx="3" />
                <path d="m29 33 5 5 9-11m-14 25 5 5 9-11m-14 25 5 5 9-11M52 33h18M52 52h18M52 70h18" />
              </svg>
              <svg viewBox="0 0 100 90" data-active={category === "payment"} fill="none">
                <path d="M13 25h74v15a8 8 0 0 0 0 16v13H13V56a8 8 0 0 0 0-16V25zM64 26v6m0 7v6m0 7v6m0 6v4m-38-21 8 8 16-17" />
              </svg>
            </div>
            <span className="faq-screen-footer">ANSWERS, ONE QUESTION AT A TIME.</span>
          </div>
          <div className="faq-monitor-footer"><span className="faq-status-light" data-active={category !== null} /><span>wH / HELP DESK</span></div>
        </div>
        <div className="faq-monitor-stand" />
        <div className="faq-monitor-base" />
      </div>
      <div className="faq-keyboard"><i /><i /><i /><span /></div>
      <div className="faq-mouse"><i /></div>
      </div></foreignObject></svg>
    </div>
  );
}
