import RoutePage from "@/components/RoutePage";

export const metadata = { title: "Payments | wHACKiest 2026" };

export default function Page() {
  return (
    <RoutePage
      title="THE FINAL CHECKPOINT."
      text="Payment information for shortlisted teams will be shared by the organising team."
    >
      <span className="mono-label">PAYMENTS / NOT OPEN</span>
      <h2>
        WAIT FOR THE
        <br />
        OFFICIAL SIGNAL.
      </h2>
      <p>
        No payment is collected in this preview. Confirmed fees, instructions,
        and the official payment link will be published in Announcements.
      </p>
    </RoutePage>
  );
}
