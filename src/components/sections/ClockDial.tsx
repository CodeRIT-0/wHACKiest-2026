export default function ClockDial() {
  return <div className="journey-clock-rail" aria-hidden="true"><svg className="journey-clock-dial" viewBox="0 0 120 120" fill="none" focusable="false">
    <circle cx="60" cy="60" r="55" fill="#fff9ec" stroke="#050505" /><circle cx="60" cy="60" r="47" stroke="#0357d6" opacity=".3" />
    {[0,1,2,3,4].map(i => <g key={i} transform={`rotate(${-120+i*60} 60 60)`}><path d="M60 10v8" stroke="#050505" /><text x="60" y="27" textAnchor="middle" fill="#0357d6" fontSize="8" transform={`rotate(${120-i*60} 60 24)`}>0{i+1}</text></g>)}
    <g className="journey-clock-needle"><path d="M60 69V31" stroke="#fd9c36" strokeWidth="3" /><circle cx="60" cy="60" r="4" fill="#050505" /></g><text x="60" y="92" textAnchor="middle" fill="#050505" fontSize="6">TIME / NEXT MOVE</text>
  </svg></div>;
}
