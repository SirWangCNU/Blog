import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, findSession } from "./session";

export interface AdminIdentity {
  id: number;
  username: string;
}

export function safeAdminReturnPath(value?: string | null): string {
  if (!value || !value.startsWith("/admin") || value.startsWith("//")) return "/admin";
  return value;
}

export async function getCurrentAdmin(): Promise<AdminIdentity | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = findSession(token);
  return session ? { id: session.adminId, username: session.username } : null;
}

export async function requireAdmin(returnTo = "/admin"): Promise<AdminIdentity> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect(`/admin/login?returnTo=${encodeURIComponent(safeAdminReturnPath(returnTo))}`);
  }
  return admin;
}

export async function requireApiAdmin(
  request: NextRequest,
): Promise<AdminIdentity | NextResponse> {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? findSession(token) : null;
  if (!session) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  return { id: session.adminId, username: session.username };
}
