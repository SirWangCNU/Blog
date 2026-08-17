import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth/login";
import { safeAdminReturnPath } from "@/lib/auth/guard";
import { ADMIN_SESSION_COOKIE, createSession, sessionCookieOptions } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  let body: { username?: unknown; password?: unknown; returnTo?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  if (typeof body.username !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ error: "请输入管理员账号和密码" }, { status: 400 });
  }

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwardedFor || request.headers.get("x-real-ip") || "unknown";
  const result = await authenticateAdmin({
    username: body.username,
    password: body.password,
    attemptKey: `${address}:${body.username}`,
  });

  if (result.status === "blocked") {
    return NextResponse.json(
      { error: "登录尝试过多，请稍后再试" },
      { status: 429, headers: { "Retry-After": String(result.retryAfterSeconds) } },
    );
  }
  if (result.status === "invalid") {
    return NextResponse.json({ error: "账号或密码错误" }, { status: 401 });
  }

  const session = createSession(result.admin.id);
  const redirectTo = safeAdminReturnPath(typeof body.returnTo === "string" ? body.returnTo : undefined);
  const response = NextResponse.json({ success: true, redirectTo });
  response.cookies.set(ADMIN_SESSION_COOKIE, session.token, sessionCookieOptions());
  return response;
}
