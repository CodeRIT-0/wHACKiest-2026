import RoutePage from "@/components/RoutePage";

export const metadata = { title: "Fees | wHACKiest 2026" };

// Kept so older links to /payments still land somewhere useful: there is nothing to pay.
export default function Page() {
  return <RoutePage title="No fees" text="wHACKiest 2026 is free for everyone. There is no registration or participation fee, including after shortlisting. Keep an eye on Announcements for confirmation steps." />;
}
