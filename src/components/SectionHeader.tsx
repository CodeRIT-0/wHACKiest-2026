import Words from "./motion/Words";

// "05 / Prizes" label + wide headline; the closing punctuation (added if missing) is orange.
// The words rise out of their masks on scroll (ScrollMotion, [data-words]).
export default function SectionHeader({ index, label, title }: { index: string; label: string; title: string }) {
  const ends = /[.?!]$/.test(title);
  return (
    <div>
      <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em]">
        <span className="text-accent">{index}</span>
        <span className="text-muted">/</span>
        {label}
      </p>
      <h2 data-words className="display-wide mt-3 max-w-[16ch] text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
        <Words text={ends ? title.slice(0, -1) : title} tail={<span className="text-accent">{ends ? title.slice(-1) : "."}</span>} />
      </h2>
    </div>
  );
}
