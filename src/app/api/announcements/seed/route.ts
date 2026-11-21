import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import Announcement from "@/models/Announcement";
import { isAuthorized } from "@/lib/auth";

const initialAnnouncements = [
  {
    category: "Deadline",
    date: "24 Nov",
    title: "Registration closes 24 November, 11:59 PM IST",
    copy: "Register on Devnovate and attach your idea PPT before the deadline to be considered for the online presentation round.",
    action: "Register on Devnovate",
    href: "https://devnovate.co/event/whackiest",
    featured: false,
    closed: false,
  },
  {
    category: "Results",
    date: "28 Nov",
    title: "Shortlisted teams will be announced here on 28 November",
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

    revalidatePath("/announcements");
    revalidatePath("/api/announcements");

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
