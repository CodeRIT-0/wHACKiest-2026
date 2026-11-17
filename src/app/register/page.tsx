import { redirect } from "next/navigation";
import { participation } from "@/content/participation";

export const metadata = { title: "Register | wHACKiest 2026" };

// Team registration runs on Devnovate. /register stays as a stable short link (older posts,
// announcements and shares point at it) and forwards straight there.
export default function Page() {
  redirect(participation.registrationHref);
}
