// The journey controller measures this open curve and places the copy on it.
export default function CurvedUpload() {
  return <g className="journey-curved-upload">
    <path d="M340 114C488 -2 192 -48 124 66" stroke="#0357d6" strokeWidth="1.5" fill="none" />
    <path data-upload-path d="M340 114C488 -2 192 -48 124 66" pathLength="1" className="journey-upload-trace" stroke="#fd9c36" strokeWidth="2" fill="none" />
    <g data-upload-copy className="journey-upload-copy"><path d="M-8-11H3L8-6V11H-8Z M3-11V-6H8" stroke="#0357d6" fill="#fff9ec" /><path d="M-4 0h8m-8 4h6" stroke="#0357d6" /></g>
  </g>;
}
