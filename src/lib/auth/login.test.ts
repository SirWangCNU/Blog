// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { DatabaseSync } from "node:sqlite";
import { createDatabase } from "@/lib/db/database";
import { hashPassword } from "./password";
import { authenticateAdmin } from "./login";

describe("authenticateAdmin", () => {
  let db: DatabaseSync;

  beforeEach(async () => {
    db = createDatabase(":memory:");
    const password = await hashPassword("a-secure-password-123");
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO admins (username, password_hash, password_salt, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run("owner", password.hash, password.salt, now, now);
  });

  afterEach(() => db.close());

  it("returns the same invalid result for unknown users and wrong passwords", async () => {
    await expect(authenticateAdmin({ username: "missing", password: "anything", attemptKey: "ip:missing" }, db))
      .resolves.toEqual({ status: "invalid" });
    await expect(authenticateAdmin({ username: "owner", password: "wrong", attemptKey: "ip:owner" }, db))
      .resolves.toEqual({ status: "invalid" });
  });

  it("returns a safe administrator identity for valid credentials", async () => {
    await expect(authenticateAdmin(
      { username: "owner", password: "a-secure-password-123", attemptKey: "ip:owner" },
      db,
    )).resolves.toEqual({ status: "authenticated", admin: { id: 1, username: "owner" } });
  });

  it("blocks attempts after five failures", async () => {
    for (let index = 0; index < 5; index += 1) {
      await authenticateAdmin({ username: "owner", password: "wrong", attemptKey: "blocked" }, db);
    }
    await expect(authenticateAdmin({ username: "owner", password: "a-secure-password-123", attemptKey: "blocked" }, db))
      .resolves.toEqual(expect.objectContaining({ status: "blocked" }));
  });
});
