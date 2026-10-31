export function isAuthorized(request: Request): boolean {
  const rawAdminSecret = process.env.ADMIN_SECRET_KEY;
  if (!rawAdminSecret) return false;

  const adminSecret = rawAdminSecret.replace(/^["']|["']$/g, "").trim();

  const headerKey = request.headers.get("x-admin-key")?.trim();
  const authHeader = request.headers.get("authorization")?.trim();
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7).trim()
    : null;

  return headerKey === adminSecret || bearerToken === adminSecret;
}
