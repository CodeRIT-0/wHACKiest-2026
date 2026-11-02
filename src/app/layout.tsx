import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import EraRail from "@/components/EraRail";
import BackgroundMotion from "@/components/system/BackgroundMotion";
import Marquee from "@/components/Marquee";
import Navbar from "@/components/Navbar";
import ColourJourney from "@/components/system/ColourJourney";
import MotionProvider from "@/components/system/MotionProvider";
import SmoothScroll from "@/components/system/SmoothScroll";
import TouchActivate from "@/components/system/TouchActivate";
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

const DESCRIPTION = "wHACKiest 2026: CodeRIT's national 24-hour offline hackathon at Ramaiah Institute of Technology, Bengaluru. 01-02 December 2026, with a ₹50,000 prize pool.";
const HOST = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const metadata: Metadata = {
  metadataBase: HOST ? new URL(`https://${HOST}`) : undefined,
  title: "wHACKiest 2026 | CodeRIT",
  description: DESCRIPTION,
  openGraph: { title: "wHACKiest 2026 | CodeRIT", description: DESCRIPTION, siteName: "wHACKiest 2026", type: "website" },
};

export const viewport: Viewport = { themeColor: "#fff9ec", colorScheme: "only light" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${archivo.variable} ${jetbrainsMono.variable} antialiased`}>
      <body className="min-h-screen font-sans">
        <a href="#main" className="sr-only z-[70] bg-ink px-4 py-3 text-sm font-semibold text-bg focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
          Skip to content
        </a>
        <SmoothScroll />
        <TouchActivate />
        <ColourJourney />
        <Marquee />
        <Navbar />
        <BackgroundMotion />
        <EraRail />
        <main id="main" className="relative pt-8">
          <MotionProvider>{children}</MotionProvider>
        </main>
        <footer className="relative z-10 py-6 text-center text-sm text-muted">
          © 2026 CodeRIT · wHACKiest
        </footer>
      </body>
    </html>
  );
}
