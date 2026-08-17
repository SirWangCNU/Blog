import { createHash, randomBytes } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { getDatabase } from "@/lib/db/database";

export const ADMIN_SESSION_COOKIE = "blog_admin_session";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export interface AdminSession {
  adminId: number;
  username: string;
  expiresAt: string;
}

interface SessionRow {
  admin_id: number;
  username: string;
  expires_at: string;
}

function tokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export function createSession(
  adminId: number,
  db: DatabaseSync = getDatabase(),
  now = new Date(),
): { token: string; expiresAt: Date } {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(now.getTime() + SESSION_MAX_AGE_SECONDS * 1000);
  db.prepare(`
    INSERT INTO admin_sessions (token_hash, admin_id, created_at, expires_at, last_used_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(tokenHash(token), adminId, now.toISOString(), expiresAt.toISOString(), now.toISOString());
  return { token, expiresAt };
}

export function findSession(
  token: string,
  db: DatabaseSync = getDatabase(),
  now = new Date(),
): AdminSession | null {
  if (!token) return null;
  const hash = tokenHash(token);
  const row = db.prepare(`
    SELECT s.admin_id, a.username, s.expires_at
    FROM admin_sessions s
    INNER JOIN admins a ON a.id = s.admin_id
    WHERE s.token_hash = ?
  `).get(hash) as unknown as SessionRow | undefined;
  if (!row) return null;
  if (new Date(row.expires_at).getTime() <= now.getTime()) {
    db.prepare("DELETE FROM admin_sessions WHERE token_hash = ?").run(hash);
    return null;
  }
  db.prepare("UPDATE admin_sessions SET last_used_at = ? WHERE token_hash = ?")
    .run(now.toISOString(), hash);
  return { adminId: row.admin_id, username: row.username, expiresAt: row.expires_at };
}

export function revokeSession(token: string, db: DatabaseSync = getDatabase()): void {
  if (!token) return;
  db.prepare("DELETE FROM admin_sessions WHERE token_hash = ?").run(tokenHash(token));
}
