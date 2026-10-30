import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import CornerClock from "@/components/CornerClock";
import EraRail from "@/components/EraRail";
import BackgroundMotion from "@/components/system/BackgroundMotion";
import Marquee from "@/components/Marquee";
import Navbar from "@/components/Navbar";
import ColourJourney from "@/components/system/ColourJourney";
import MotionProvider from "@/components/system/MotionProvider";
import SmoothScroll from "@/components/system/SmoothScroll";
import "lenis/dist/lenis.css";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

// variable width axis lets the display face run extra-wide (font-stretch: 125%)
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "wHACKiest 2026 | CodeRIT",
  description: "wHACKiest 2026, the hackathon by CodeRIT",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${archivo.variable} ${jetbrainsMono.variable} antialiased`}>
      <body className="min-h-screen font-sans">
        <SmoothScroll />
        <ColourJourney />
        <Marquee />
        <Navbar />
        <BackgroundMotion />
        <EraRail />
        <CornerClock />
        <main className="relative pt-8">
          <MotionProvider>{children}</MotionProvider>
        </main>
        <footer className="relative z-10 py-6 text-center text-sm text-muted">
          © 2026 CodeRIT · wHACKiest
        </footer>
      </body>
    </html>
  );
}
