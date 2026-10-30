import RoutePage from "@/components/RoutePage";

export const metadata = { title: "Announcements | wHACKiest 2026" };

export default function Page() {
  return (
    <RoutePage
      title="THE LATEST TRANSMISSIONS."
      text="Everything you need to know before the starting signal. Preview notices are marked below."
    >
      <div className="preview-banner">
        DESIGN PREVIEW / Sample updates and planning dates.
      </div>
      <article className="update-row">
        <span className="mono-label">01 / PRIZES</span>
        <h2>₹50,000 IN PRIZES.</h2>
        <p>
          First place ₹25,000. Second place ₹15,000. Third place ₹10,000. Bring
          an idea worth building.
        </p>
      </article>
      <article className="update-row">
        <span className="mono-label">02 / THE JOURNEY</span>
        <h2>THE CIRCUIT IS LIVE.</h2>
        <p>
          Explore the interactive timeline on the homepage. Dates are planning
          placeholders until confirmed.
        </p>
      </article>
      <article className="update-row">
        <span className="mono-label">03 / REGISTRATION PREVIEW</span>
        <h2>MEET YOUR NEXT CREW.</h2>
        <p>
          Try the demo registration experience. The official application form
          and participation rules will be added before launch.
        </p>
      </article>
    </RoutePage>
  );
}
