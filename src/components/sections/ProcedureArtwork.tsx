import CurvedUpload from "./CurvedUpload";
// Existing Time Heist objects, separated into scalable, decorative scene groups.
function Computer({ laptop = false }: { laptop?: boolean }) {
  return <g className="journey-computer" transform={laptop ? "translate(84 144)" : "translate(148 112)"}>
    <path d="M9 9h260v170H9z" fill="#050505" opacity=".12" transform="translate(7 7)" />
    <rect width="266" height="180" rx={laptop ? 5 : 10} fill="#ded8c9" stroke="#050505" strokeWidth="2" />
    <rect x="13" y="13" width="240" height="145" fill="#fff9ec" stroke="#050505" />
    <path d="M13 13h240v20H13z" fill="#0357d6" stroke="#050505" />
    <text x="23" y="26" fill="#fff9ec" fontSize="8">whackiest_2026</text><text x="215" y="26" fill="#fff9ec" fontSize="9">− □ ×</text>
    <text x="30" y="56" fill="#0357d6" fontSize="8">&gt; hello, builder_</text>
    <text x="30" y="85" fontSize="23" fontWeight="700">YOUR IDEA.</text><text x="30" y="111" fontSize="23" fontWeight="700">NEXT CHAPTER.</text>
    <path d="M31 128h94m-94 8h64m20 0h41" stroke="#0357d6" strokeWidth="3" opacity=".5" /><circle cx="246" cy="170" r="3" fill="#fd9c36" />
    {laptop ? <><path d="M0 181h266l31 25H-30z" fill="#e7e0d0" stroke="#050505" /><path d="M8 187h251m-243 6h251M93 200h81" stroke="#050505" opacity=".3" /></> : <><path d="M103 180h60l6 26H96z" fill="#bdb8aa" stroke="#050505" /><path d="M45 211h194l17 27H25z" fill="#e7e0d0" stroke="#050505" /><path d="M47 218h190m-193 7h198m-143 7h80" stroke="#050505" opacity=".4" /></>}
  </g>;
}
function IdCard() { return <g className="journey-id" transform="translate(35 65) rotate(-9 95 66)">
  <path d="M7 7h190v126H7z" fill="#050505" opacity=".12" /><rect width="190" height="126" fill="#f7f2e5" stroke="#050505" strokeWidth="1.5" />
  <path d="M0 0h190v25H0z" fill="#fd9c36" stroke="#050505" /><text x="13" y="17" fontSize="10">TEAM / ID</text><circle cx="164" cy="13" r="3" fill="#050505" />
  <rect x="13" y="40" width="45" height="47" fill="#e5ddcc" stroke="#050505" /><circle cx="35" cy="54" r="7" fill="#0357d6" /><path d="M22 78c0-19 26-19 26 0" fill="#0357d6" />
  <text x="70" y="54" fontSize="12" fontWeight="700">THE NEXT</text><text x="70" y="70" fontSize="12" fontWeight="700">BUILDERS</text><path d="M70 81h91m-91 7h64" stroke="#050505" opacity=".3" />
  <text x="13" y="111" fontSize="8">wHACKiest 2026</text><path d="M133 102v13m4-13v13m4-13v13m5-13v13m3-13v13m5-13v13m5-13v13m3-13v13" stroke="#050505" strokeWidth="2" />
  <path className="journey-scan" d="M8 35H182" stroke="#0357d6" strokeWidth="1.2" />
  </g>; }
function Presentation() { return <g className="journey-ppt" transform="translate(260 45) rotate(8 80 90)">
  <path d="M6 7h164v190H6z" fill="#050505" opacity=".1" /><path d="M0 0h140l24 24v166H0z" fill="#f7f2e5" stroke="#050505" strokeWidth="1.5" /><path d="M140 0v24h24" fill="#e2dac8" stroke="#050505" />
  <text x="14" y="27" fontSize="10">IDEA.PPT</text><path d="M14 37h135" stroke="#050505" /><path d="M24 102V80h22v22m15 0V64h22v38m15 0V49h22v53" fill="#0357d6" /><path d="M61 102V64h22v38" fill="#fd9c36" />
  <text x="14" y="130" fontWeight="700" fontSize="16">THINK BIG.</text><text x="14" y="147" fontSize="6.5">BUILD SOMETHING THAT MATTERS.</text><path d="M14 159h126m-126 8h86" stroke="#0357d6" opacity=".35" />
  </g>; }
function Cloud() { return <g transform="translate(47 23)">
  <path d="M17 46C-8 43-5 14 19 16C24-6 57-5 65 14C84 6 101 19 95 35C119 37 113 62 96 62H20" fill="#fff9ec" stroke="#0357d6" strokeWidth="1.5" />
  {[0,1,2].map(i=><g key={i} transform={`translate(28 ${35+i*19})`}><rect width="58" height="16" rx="2" fill="#f7f2e5" stroke="#050505" /><path d="M7 8h30" stroke="#0357d6" /><circle data-server-led={i} cx="49" cy="8" r="2" fill="#fd9c36" /></g>)}
  <path d="M57 90v16H12" stroke="#0357d6" fill="none" />
  </g>; }
function Shortlist() { return <g className="journey-shortlist" transform="translate(128 43) rotate(-4 124 130)">
  <path d="M8 8h250v260H8z" fill="#050505" opacity=".12" /><rect width="250" height="260" fill="#f7f2e5" stroke="#050505" strokeWidth="1.5" />
  <path d="M0 0h250v32H0z" fill="#e4dece" stroke="#050505" /><text x="16" y="21" fontSize="11">SHORTLIST / TEAM REVIEW</text><text x="15" y="64" fontSize="20" fontWeight="700">THE NEXT BUILDERS.</text>
  {[0,1,2].map(i=><g key={i} transform={`translate(20 ${84+i*49})`}><rect width="25" height="25" fill="#fff9ec" stroke="#050505" /><path d="M41 5h151m-151 11h105" stroke="#0357d6" opacity=".45" /></g>)}
  <rect className="journey-selection-box" x="13" y="77" width="223" height="40" fill="none" stroke="#fd9c36" strokeWidth="2" /><path className="journey-check" d="m24 95 8 9 18-22" fill="none" stroke="#fd9c36" strokeWidth="3" pathLength="1" />
  <text x="20" y="242" fontSize="8">CHECK THE OFFICIAL RESULTS.</text><circle cx="230" cy="16" r="3" fill="#fd9c36" />
  </g>; }
function Phone() { return <g className="journey-phone" transform="translate(164 25) rotate(7 85 155)">
  <rect x="8" y="8" width="172" height="302" rx="20" fill="#050505" opacity=".12" /><rect width="172" height="302" rx="20" fill="#e3ddce" stroke="#050505" strokeWidth="2" /><rect x="10" y="26" width="152" height="246" rx="4" fill="#fff9ec" stroke="#050505" />
  <path d="M66 13h40" stroke="#050505" strokeWidth="3" /><circle cx="86" cy="286" r="5" fill="none" stroke="#050505" />
  <text x="23" y="48" fontSize="7">YOUR NEXT MOVE</text><text x="24" y="213" fontSize="15" fontWeight="700">CONFIRM</text><text x="24" y="233" fontSize="15" fontWeight="700">YOUR SPOT</text><text x="24" y="252" fontSize="5.5">FOLLOW THE INSTRUCTIONS</text>
  <g className="journey-notification"><rect x="-38" y="81" width="234" height="94" fill="#f7f2e5" stroke="#050505" strokeWidth="1.5" /><path d="M-38 81h234v19H-38z" fill="#0357d6" /><text x="-27" y="94" fill="#fff9ec" fontSize="7">confirmation_instructions</text><circle cx="-6" cy="135" r="17" fill="#fd9c36" stroke="#050505" /><path d="m-14 135 6 6 11-13" stroke="#050505" strokeWidth="2" fill="none" /><text x="20" y="132" fontSize="10" fontWeight="700">YOUR NEXT STEP.</text><text x="20" y="148" fontSize="7">CHECK THE INSTRUCTIONS.</text></g>
  </g>; }
function Ticket() { return <g className="journey-ticket" transform="translate(143 167) rotate(-7 164 64)">
  <path d="M6 7h315v133H6z" fill="#050505" opacity=".14" /><path d="M0 0h315v43a18 18 0 0 0 0 36v54H0V79a18 18 0 0 0 0-36Z" fill="#f7f2e5" stroke="#050505" strokeWidth="1.5" /><path d="M250 5v123" stroke="#050505" strokeDasharray="3 4" /><text x="23" y="25" fontSize="9">ENTRY / wH 2026</text><path d="M23 36h208" stroke="#050505" />
  <g className="journey-stamp" transform="rotate(-4 127 68)"><rect x="20" y="47" width="214" height="43" fill="#fd9c36" stroke="#050505" /><text x="30" y="77" fontSize="27" fontWeight="700">LET’S BUILD ↗</text></g>
  <text x="23" y="115" fontSize="7">IDEAS COME ALIVE HERE</text><path d="M266 20v93m5-93v93m5-93v93m8-93v93m4-93v93m6-93v93" stroke="#050505" strokeWidth="2" />
  </g>; }
export default function ProcedureArtwork({ stage }: { stage: number }) {
  return <svg className={`journey-art journey-art-${stage}`} viewBox="0 0 520 370" fill="none" aria-hidden="true" focusable="false">
    <g stroke="#0357d6" opacity=".16"><ellipse cx="263" cy="316" rx="219" ry="27" /><path d="M22 286h41v-70h60M497 115h-36V60h-55M428 323h53v-61" /><circle cx="22" cy="286" r="4" /><circle cx="497" cy="115" r="4" /></g>
    <g stroke="#0357d6" strokeWidth="1.5"><path className="journey-object-connection" pathLength="1" d={['M108 151V219H188','M344 124H230V61H130','M107 141H59V240H128','M91 223H52V111H164','M245 273H77V226H150'][stage]} /></g>
    <g fill="#050505">{stage===0 && <><Computer /><IdCard /></>}{stage===1 && <><Computer laptop /><Cloud /><Presentation /><CurvedUpload /></>}{stage===2 && <><path d="M85 103h224v187H85z" fill="#e6dece" stroke="#050505" transform="rotate(-10 197 196)" /><Shortlist /></>}{stage===3 && <Phone />}{stage===4 && <><Computer laptop /><Ticket /><g className="journey-particles">{Array.from({length:8},(_,i)=><path key={i} d="M0 0h7" stroke={i%2 ? "#0357d6" : "#fd9c36"} strokeWidth="3" transform={`translate(${285+Math.cos(i*Math.PI/4)*158} ${205+Math.sin(i*Math.PI/4)*110}) rotate(${i*45})`} />)}</g></>}</g>
  </svg>;
}
