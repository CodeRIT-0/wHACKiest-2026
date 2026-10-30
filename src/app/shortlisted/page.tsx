import RoutePage from "@/components/RoutePage";

export const metadata = { title: "Shortlisted Teams | wHACKiest 2026" };

export default function Page() {
  return (
    <RoutePage
      title="THE NEXT WAVE OF BUILDERS."
      text="The official shortlist will be announced after applications are reviewed."
    >
      <span className="mono-label">SHORTLIST / TRANSMISSION STANDBY</span>
      <h2>
        THE CREW IS
        <br />
        COMING TOGETHER.
      </h2>
      <p>
        No official results have been published in this preview. Keep an eye on
        Announcements for the confirmed shortlist and next steps.
      </p>
    </RoutePage>
  );
}
