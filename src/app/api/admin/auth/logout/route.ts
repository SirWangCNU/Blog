import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, revokeSession, sessionCookieOptions } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) revokeSession(token);

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}
