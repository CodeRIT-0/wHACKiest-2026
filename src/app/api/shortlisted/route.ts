import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ShortlistedTeam, { SHORTLIST_STATUSES, type ShortlistStatus } from "@/models/ShortlistedTeam";
import { isAuthorized } from "@/lib/auth";

type TeamInput = {
  teamName?: string;
  institution?: string;
  city?: string;
  track?: string;
  leader?: string;
  status?: string;
  published?: boolean;
};

const unauthorized = () => NextResponse.json({ success: false, error: "Unauthorized. Invalid admin key." }, { status: 401 });

function fail(err: unknown, fallback: string) {
  const error = err instanceof Error ? err : new Error(String(err));
  console.error(fallback, error);
  return NextResponse.json({ success: false, error: error.message || fallback }, { status: 500 });
}

// keeps only known fields, trimmed; returns null when a required field is missing
function clean(input: TeamInput) {
  const teamName = input.teamName?.trim();
  const institution = input.institution?.trim();
  if (!teamName || !institution) return null;
  const status = SHORTLIST_STATUSES.includes(input.status as ShortlistStatus) ? (input.status as ShortlistStatus) : "Shortlisted";
  return {
    teamName,
    institution,
    city: input.city?.trim() || "",
    track: input.track?.trim() || "",
    leader: input.leader?.trim() || "",
    status,
    published: Boolean(input.published),
  };
}

// GET /api/shortlisted - public: published teams only. With a valid admin key: every team.
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const admin = isAuthorized(request);
    const teams = await ShortlistedTeam.find(admin ? {} : { published: true })
      .sort({ status: 1, teamName: 1 })
      .collation({ locale: "en", strength: 2 })
      .lean();
    return NextResponse.json({ success: true, data: teams });
  } catch (err) {
    return fail(err, "Failed to fetch shortlisted teams");
  }
}

// POST /api/shortlisted - admin: add one team ({...}) or many ({ teams: [...] })
export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) return unauthorized();
    const body = await request.json();
    const inputs: TeamInput[] = Array.isArray(body?.teams) ? body.teams : [body];
    const teams = inputs.map(clean);
    const bad = teams.findIndex((t) => t === null);
    if (bad !== -1) {
      return NextResponse.json(
        { success: false, error: `Team ${inputs.length > 1 ? `#${bad + 1} ` : ""}is missing a team name or institution.` },
        { status: 400 },
      );
    }
    await connectToDatabase();
    const created = await ShortlistedTeam.insertMany(teams);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err) {
    return fail(err, "Failed to add shortlisted teams");
  }
}

// PATCH /api/shortlisted - admin: publish or hide every team at once ({ published: boolean })
export async function PATCH(request: Request) {
  try {
    if (!isAuthorized(request)) return unauthorized();
    const body = await request.json();
    if (typeof body?.published !== "boolean") {
      return NextResponse.json({ success: false, error: "Send { published: true | false }." }, { status: 400 });
    }
    await connectToDatabase();
    const result = await ShortlistedTeam.updateMany({}, { $set: { published: body.published } });
    return NextResponse.json({ success: true, updated: result.modifiedCount });
  } catch (err) {
    return fail(err, "Failed to update shortlisted teams");
  }
}
