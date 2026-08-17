// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { DatabaseSync } from "node:sqlite";
import { createHash } from "node:crypto";
import { createDatabase } from "@/lib/db/database";
import { createSession, findSession, revokeSession } from "./session";

describe("administrator sessions", () => {
  let db: DatabaseSync;
  const now = new Date("2026-08-17T00:00:00.000Z");

  beforeEach(() => {
    db = createDatabase(":memory:");
    db.prepare(`
      INSERT INTO admins (username, password_hash, password_salt, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run("admin", "hash", "salt", now.toISOString(), now.toISOString());
  });

  afterEach(() => db.close());

  it("stores only a token hash and expires after seven days", () => {
    const issued = createSession(1, db, now);
    const stored = db.prepare("SELECT token_hash FROM admin_sessions").get() as { token_hash: string };

    expect(stored.token_hash).toBe(createHash("sha256").update(issued.token).digest("hex"));
    expect(stored.token_hash).not.toBe(issued.token);
    expect(findSession(issued.token, db, new Date("2026-08-23T23:59:59.000Z"))).toEqual(
      expect.objectContaining({ adminId: 1, username: "admin" }),
    );
    expect(findSession(issued.token, db, new Date("2026-08-24T00:00:01.000Z"))).toBeNull();
    expect(db.prepare("SELECT COUNT(*) AS count FROM admin_sessions").get()).toEqual({ count: 0 });
  });

  it("revokes a session immediately", () => {
    const issued = createSession(1, db, now);
    revokeSession(issued.token, db);
    expect(findSession(issued.token, db, now)).toBeNull();
  });
});
