import { createHash, timingSafeEqual } from "node:crypto";

// compares hashes in constant time, so response timing can't reveal how close a guess was
const digest = (value: string) => createHash("sha256").update(value).digest();
const matches = (given: string | null | undefined, secret: string) => !!given && timingSafeEqual(digest(given), digest(secret));

export function isAuthorized(request: Request): boolean {
  const rawAdminSecret = process.env.ADMIN_SECRET_KEY;
  if (!rawAdminSecret) return false;

  const adminSecret = rawAdminSecret.replace(/^["']|["']$/g, "").trim();

  const headerKey = request.headers.get("x-admin-key")?.trim();
  const authHeader = request.headers.get("authorization")?.trim();
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7).trim()
    : null;

  return matches(headerKey, adminSecret) || matches(bearerToken, adminSecret);
}
