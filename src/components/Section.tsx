import { ScrollReveal } from "./ui/scroll-reveal";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  dark?: boolean;
  chapter?: string;
  era?: string;
  description?: string;
  children?: React.ReactNode;
};

export default function Section({
  id,
  eyebrow,
  title,
  dark,
  chapter,
  era,
  description,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      data-theme={dark ? "dark" : "light"}
      className="editorial-section"
    >
      {chapter && (
        <div className="chapter-rule" aria-hidden="true">
          <span>{chapter}</span>
        </div>
      )}
      <div className="section-content section-shell">
        <header className="editorial-heading">
          <ScrollReveal>
            <p className="section-eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
            {description && <p className="section-intro">{description}</p>}
          </ScrollReveal>
          {era && (
            <div className="era-note">
              <span>COMPUTING ERAS</span>
              <strong>{era}</strong>
              <i />
            </div>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}

export function Accent({ children }: { children: React.ReactNode }) {
  return <span className="text-accent">{children}</span>;
}

export function PlaceholderGrid({ items }: { items: string[] }) {
  return (
    <div className="section-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => (
        <div key={i} className="min-h-36 border border-current/20 p-5">
          {item}
        </div>
      ))}
    </div>
  );
}
