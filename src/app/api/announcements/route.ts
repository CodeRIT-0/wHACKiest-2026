import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Announcement from "@/models/Announcement";
import { isAuthorized } from "@/lib/auth";

function formatCurrentDate(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return now.toLocaleString("en-GB", options).replace(",", " ·");
}

// GET /api/announcements - Public endpoint to retrieve all announcements
export async function GET() {
  try {
    await connectToDatabase();
    // Return newest announcements first, keeping featured items prioritized
    const announcements = await Announcement.find({})
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: announcements,
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("Failed to fetch announcements:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch announcements",
      },
      { status: 500 }
    );
  }
}

// POST /api/announcements - Admin protected endpoint to create an announcement
export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Invalid admin key." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { category, title, copy, action, href, featured, closed, date } = body;

    if (!category || !title || !copy) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: category, title, and copy are required.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newAnnouncement = await Announcement.create({
      category,
      title: title.trim(),
      copy: copy.trim(),
      date: date && date.trim().length > 0 ? date.trim() : formatCurrentDate(),
      action: action?.trim() || "",
      href: href?.trim() || "",
      featured: Boolean(featured),
      closed: Boolean(closed),
    });

    return NextResponse.json(
      {
        success: true,
        data: newAnnouncement,
      },
      { status: 201 }
    );
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("Failed to create announcement:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create announcement",
      },
      { status: 500 }
    );
  }
}
