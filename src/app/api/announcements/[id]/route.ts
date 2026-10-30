import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Announcement from "@/models/Announcement";
import { isAuthorized } from "@/lib/auth";

// PATCH /api/announcements/[id] - Update an existing announcement
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Invalid admin key." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    await connectToDatabase();

    const updated = await Announcement.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Announcement not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("Failed to update announcement:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update announcement" },
      { status: 500 }
    );
  }
}

// DELETE /api/announcements/[id] - Delete an announcement
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Invalid admin key." },
        { status: 401 }
      );
    }

    const { id } = await params;

    await connectToDatabase();

    const deleted = await Announcement.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Announcement not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Announcement deleted successfully.",
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("Failed to delete announcement:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete announcement" },
      { status: 500 }
    );
  }
}
