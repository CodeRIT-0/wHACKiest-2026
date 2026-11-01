import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ShortlistedTeam from "@/models/ShortlistedTeam";
import { isAuthorized } from "@/lib/auth";

const EDITABLE = ["teamName", "institution", "city", "track", "leader", "status", "published"] as const;

const unauthorized = () => NextResponse.json({ success: false, error: "Unauthorized. Invalid admin key." }, { status: 401 });
const notFound = () => NextResponse.json({ success: false, error: "Team not found." }, { status: 404 });

function fail(err: unknown, fallback: string) {
  const error = err instanceof Error ? err : new Error(String(err));
  console.error(fallback, error);
  return NextResponse.json({ success: false, error: error.message || fallback }, { status: 500 });
}

// PATCH /api/shortlisted/[id] - admin: update a team (only the known fields are applied)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isAuthorized(request)) return unauthorized();
    const { id } = await params;
    const body = await request.json();
    const update = Object.fromEntries(EDITABLE.filter((k) => k in body).map((k) => [k, body[k]]));

    await connectToDatabase();
    const updated = await ShortlistedTeam.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true });
    if (!updated) return notFound();
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return fail(err, "Failed to update team");
  }
}

// DELETE /api/shortlisted/[id] - admin: remove a team
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isAuthorized(request)) return unauthorized();
    const { id } = await params;
    await connectToDatabase();
    const deleted = await ShortlistedTeam.findByIdAndDelete(id);
    if (!deleted) return notFound();
    return NextResponse.json({ success: true, message: "Team removed." });
  } catch (err) {
    return fail(err, "Failed to delete team");
  }
}
