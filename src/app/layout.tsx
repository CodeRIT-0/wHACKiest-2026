import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Marquee from "@/components/Marquee";
import Navbar from "@/components/Navbar";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "wHACKiest 2026 | CodeRIT",
  description: "wHACKiest 2026, the hackathon by CodeRIT",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} antialiased`}>
      <body className="min-h-screen font-sans">
        <Marquee />
        <Navbar />
        <main className="pt-32">{children}</main>
        <footer className="py-6 text-center text-sm text-muted">
          © 2026 CodeRIT · wHACKiest
        </footer>
      </body>
    </html>
  );
}
