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
import ThemeTransition from "@/components/ThemeTransition";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <ThemeTransition label="ENTER THE CIRCUIT" />
      <Timeline />
      <Tracks />
      <ThemeTransition to="light" label="THE NEXT CHAPTER" />
      <Prizes />
      <Sponsors />
      <Procedure />
      <Faqs />
      <Team />
      <Contact />
    </>
  );
}
