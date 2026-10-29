import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Timeline from "@/components/sections/Timeline";
import Tracks from "@/components/sections/Tracks";
import Prizes from "@/components/sections/Prizes";
import Sponsors from "@/components/sections/Sponsors";
import Procedure from "@/components/sections/Procedure";
import Faqs from "@/components/sections/Faqs";
import Team from "@/components/sections/Team";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Timeline />
      <Tracks />
      <Prizes />
      <Sponsors />
      <Procedure />
      <Faqs />
      <Team />
      <Contact />
    </>
  );
}
