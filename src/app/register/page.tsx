import RoutePage from "@/components/RoutePage";
import DemoRegistration from "@/components/DemoRegistration";

export const metadata = { title: "Register | wHACKiest 2026" };

export default function Page() {
  return (
    <RoutePage
      title="YOUR CREW. YOUR NEXT CHAPTER."
      text="Bring a curious mind, a team that thinks differently, and an idea worth chasing. This is the preview registration experience."
    >
      <DemoRegistration />
    </RoutePage>
  );
}
