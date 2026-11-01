const items = [
  "Registrations open now",
  "wHACKiest 2026",
  "Organised by CodeRIT",
  "Check announcements for updates",
];

export default function Marquee() {
  // items are rendered twice so the -50% translate loops seamlessly
  const loop = [...items, ...items];

  return (
    <div data-pause-offscreen className="absolute inset-x-0 top-0 z-[60] flex h-8 items-center overflow-hidden bg-ink text-xs uppercase tracking-widest text-bg">
      <div className="flex shrink-0 animate-[marquee_25s_linear_infinite] whitespace-nowrap">
        {loop.map((text, i) => (
          <span key={i} className="px-6">
            <span className="mr-6 text-accent">◆</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
