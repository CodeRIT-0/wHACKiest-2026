import type { Metadata } from "next";

// admin pages stay out of search results
export const metadata: Metadata = { title: "Admin | wHACKiest 2026", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
