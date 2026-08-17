import { createHash } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { getDatabase } from "@/lib/db/database";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

interface AttemptRow {
  failures: number;
  window_started_at: string;
  blocked_until: string | null;
}

export interface LoginAllowance {
  allowed: boolean;
  retryAfterSeconds: number;
}

function attemptHash(key: string): string {
  return createHash("sha256").update(key.trim().toLowerCase()).digest("hex");
}

function allowance(blockedUntil: Date | null, now: Date): LoginAllowance {
  if (!blockedUntil || blockedUntil.getTime() <= now.getTime()) {
    return { allowed: true, retryAfterSeconds: 0 };
  }
  return {
    allowed: false,
    retryAfterSeconds: Math.max(1, Math.ceil((blockedUntil.getTime() - now.getTime()) / 1000)),
  };
}

export function checkLoginAllowed(
  key: string,
  now = new Date(),
  db: DatabaseSync = getDatabase(),
): LoginAllowance {
  const hash = attemptHash(key);
  const row = db.prepare("SELECT * FROM login_attempts WHERE attempt_key = ?").get(hash) as unknown as AttemptRow | undefined;
  if (!row) return { allowed: true, retryAfterSeconds: 0 };
  if (new Date(row.window_started_at).getTime() + WINDOW_MS <= now.getTime()) {
    db.prepare("DELETE FROM login_attempts WHERE attempt_key = ?").run(hash);
    return { allowed: true, retryAfterSeconds: 0 };
  }
  return allowance(row.blocked_until ? new Date(row.blocked_until) : null, now);
}

export function recordFailedLogin(
  key: string,
  now = new Date(),
  db: DatabaseSync = getDatabase(),
): LoginAllowance {
  const hash = attemptHash(key);
  const row = db.prepare("SELECT * FROM login_attempts WHERE attempt_key = ?").get(hash) as unknown as AttemptRow | undefined;
  const windowExpired = !row || new Date(row.window_started_at).getTime() + WINDOW_MS <= now.getTime();
  const failures = windowExpired ? 1 : row.failures + 1;
  const windowStartedAt = windowExpired ? now : new Date(row.window_started_at);
  const blockedUntil = failures >= MAX_FAILURES
    ? new Date(windowStartedAt.getTime() + WINDOW_MS)
    : null;

  db.prepare(`
    INSERT INTO login_attempts (attempt_key, failures, window_started_at, blocked_until)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(attempt_key) DO UPDATE SET
      failures = excluded.failures,
      window_started_at = excluded.window_started_at,
      blocked_until = excluded.blocked_until
  `).run(hash, failures, windowStartedAt.toISOString(), blockedUntil?.toISOString() ?? null);
  return { allowed: failures <= MAX_FAILURES, retryAfterSeconds: 0 };
}

export function clearLoginAttempts(key: string, db: DatabaseSync = getDatabase()): void {
  db.prepare("DELETE FROM login_attempts WHERE attempt_key = ?").run(attemptHash(key));
}
