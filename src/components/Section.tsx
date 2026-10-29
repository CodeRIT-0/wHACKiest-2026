type SectionProps = {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  dark?: boolean;
  children?: React.ReactNode;
};

export default function Section({ id, eyebrow, title, dark, children }: SectionProps) {
  return (
    <section
      id={id}
      className={`min-h-[70vh] border-b border-line px-6 py-20 ${dark ? "bg-navy text-bg" : ""}`}
    >
      <div className="mx-auto max-w-[1100px]">
        <p className="text-xs uppercase tracking-[0.15em] text-muted">{eyebrow}</p>
        <h2 className="mb-6 mt-2 text-3xl font-bold uppercase leading-tight md:text-5xl">
          {title}
        </h2>
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => (
        <div key={i} className="min-h-36 border border-current/20 p-5">
          {item}
        </div>
      ))}
    </div>
  );
}
