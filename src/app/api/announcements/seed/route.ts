import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Announcement from "@/models/Announcement";
import { isAuthorized } from "@/lib/auth";

const initialAnnouncements = [
  {
    category: "Deadline",
    date: "TBA",
    title: "Registration deadline to be announced",
    copy: "Complete your registration before the deadline to be considered for shortlisting.",
    action: "Register now",
    href: "/register",
    featured: false,
    closed: false,
  },
  {
    category: "Results",
    date: "TBA",
    title: "Shortlisted teams will be announced here",
    copy: "Keep an eye on this page and our social channels for the final shortlist.",
    featured: false,
    closed: false,
  },
  {
    category: "Venue",
    date: "TBA",
    title: "wHACKiest 2026 takes over Ramaiah Institute of Technology, Bengaluru",
    copy: "Report to the Ramaiah Institute of Technology campus for check-in and the opening briefing.",
    action: "Event details",
    href: "/#contact",
    featured: false,
    closed: false,
  },
  {
    category: "Sponsors",
    date: "Coming soon",
    title: "More partners. More possibilities.",
    copy: "We are lining up a brilliant set of sponsors, mentors, and special prizes for this edition.",
    featured: false,
    closed: false,
  },
];

export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const count = await Announcement.countDocuments();
    if (count > 0) {
      return NextResponse.json({
        success: true,
        message: `Database already has ${count} announcements. Skipping seed.`,
      });
    }

    const inserted = await Announcement.insertMany(initialAnnouncements);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${inserted.length} initial announcements!`,
      data: inserted,
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return NextResponse.json(
      { success: false, error: error.message || "Failed to seed database" },
      { status: 500 }
    );
  }
}
