import type { DatabaseSync } from "node:sqlite";
import { getDatabase } from "@/lib/db/database";
import { verifyPassword } from "./password";
import { checkLoginAllowed, clearLoginAttempts, recordFailedLogin } from "./rate-limit";

interface AdminRow {
  id: number;
  username: string;
  password_hash: string;
  password_salt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  attemptKey: string;
}

export type AuthenticationResult =
  | { status: "authenticated"; admin: { id: number; username: string } }
  | { status: "invalid" }
  | { status: "blocked"; retryAfterSeconds: number };

export async function authenticateAdmin(
  credentials: LoginCredentials,
  db: DatabaseSync = getDatabase(),
): Promise<AuthenticationResult> {
  const allowance = checkLoginAllowed(credentials.attemptKey, new Date(), db);
  if (!allowance.allowed) return { status: "blocked", retryAfterSeconds: allowance.retryAfterSeconds };

  const username = credentials.username.trim();
  const row = db.prepare(`
    SELECT id, username, password_hash, password_salt
    FROM admins
    WHERE username = ?
  `).get(username) as unknown as AdminRow | undefined;
  const valid = row
    ? await verifyPassword(credentials.password, row.password_hash, row.password_salt)
    : false;

  if (!row || !valid) {
    recordFailedLogin(credentials.attemptKey, new Date(), db);
    return { status: "invalid" };
  }

  clearLoginAttempts(credentials.attemptKey, db);
  return { status: "authenticated", admin: { id: row.id, username: row.username } };
}
