// Splits a line into masked words for the [data-words] reveal (ScrollMotion). Server-rendered and
// fully visible on its own, so nothing depends on the script running.
// `tail` (e.g. the orange full stop) rides inside the last word so it can never wrap on its own.
export default function Words({ text, tail }: { text: string; tail?: React.ReactNode }) {
  return (
    <>
      {text.split(" ").map((w, i, all) => (
        <span key={i}>
          {/* a real space between words, so lines still wrap and the closing stop sits flush */}
          {i > 0 && " "}
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span className="word-inner inline-block origin-bottom-left">
              {w}
              {i === all.length - 1 && tail}
            </span>
          </span>
        </span>
      ))}
    </>
  );
}
