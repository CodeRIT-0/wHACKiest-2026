type Props = {
  id: string;
  /** the section's era illustration; laid out beside the content on desktop, under it on mobile */
  art?: React.ReactNode;
  /** which half the illustration takes on desktop */
  side?: "left" | "right";
  /** without art: let content use the full container instead of a centred column */
  wide?: boolean;
  className?: string;
  /** decorative layer behind everything (faint line-art props) */
  backdrop?: React.ReactNode;
  children: React.ReactNode;
};

// Sections have no background or borders of their own: the paper colour is shared by the whole
// page (ColourJourney) and the circuit spine is what joins one section to the next.
export default function SplitSection({ id, art, side = "right", wide, className = "", backdrop, children }: Props) {
  return (
    <section id={id} className={`relative ${className}`}>
      {backdrop && <div className="pointer-events-none absolute inset-0 overflow-hidden">{backdrop}</div>}
      {art ? (
        <div className="relative z-10 mx-auto grid min-h-[92vh] max-w-[1100px] items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:gap-16">
          <div className={`min-w-0 ${side === "left" ? "lg:order-2" : ""}`}>{children}</div>
          <div className={`min-w-0 ${side === "left" ? "lg:order-1" : ""}`}>{art}</div>
        </div>
      ) : (
        <div className={`relative z-10 mx-auto px-6 py-24 ${wide ? "max-w-[1100px]" : "max-w-[808px]"}`}>{children}</div>
      )}
    </section>
  );
}
