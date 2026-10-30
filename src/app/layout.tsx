import type { Metadata } from "next";
import { Barlow_Condensed, Space_Grotesk } from "next/font/google";
import Marquee from "@/components/Marquee";
import Navbar from "@/components/Navbar";
import SmoothScrolling from "@/components/SmoothScrolling";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./editorial.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});
const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "wHACKiest 2026 | CodeRIT",
  description: "wHACKiest 2026, the hackathon by CodeRIT",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${barlowCondensed.variable} antialiased`}
    >
      <body className="min-h-screen font-sans">
        <SmoothScrolling />
        <Marquee />
        <Navbar />
        <main className="pt-28">{children}</main>
        <footer className="site-footer">
          <span>© 2026 CODERIT / WHACKIEST. EVERY SECOND COUNTS.</span>
          <span>DESIGN PREVIEW / MOCK DATES, PEOPLE & PARTNERS</span>
          <a href="/#home">BACK TO TOP ↑</a>
        </footer>
      </body>
    </html>
  );
}
