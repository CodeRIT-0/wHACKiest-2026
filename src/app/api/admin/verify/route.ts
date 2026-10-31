import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const rawAdminSecret = process.env.ADMIN_SECRET_KEY;
    if (!rawAdminSecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error: ADMIN_SECRET_KEY is not defined in .env.local",
        },
        { status: 500 }
      );
    }

    if (isAuthorized(request)) {
      return NextResponse.json({ success: true, message: "Authorized" });
    }

    return NextResponse.json(
      { success: false, error: "Incorrect admin passcode. Access denied." },
      { status: 401 }
    );
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return NextResponse.json(
      { success: false, error: error.message || "Authentication error" },
      { status: 500 }
    );
  }
}
