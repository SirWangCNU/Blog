// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { DatabaseSync } from "node:sqlite";
import { createDatabase } from "@/lib/db/database";
import { initializeAdminFromEnv } from "./init-admin";

describe("initializeAdminFromEnv", () => {
  let db: DatabaseSync;

  beforeEach(() => {
    db = createDatabase(":memory:");
  });

  afterEach(() => db.close());

  it("creates one administrator and never overwrites it", async () => {
    const first = await initializeAdminFromEnv(
      { ADMIN_USERNAME: "owner", ADMIN_INITIAL_PASSWORD: "a-secure-password-123" },
      db,
    );
    const original = db.prepare("SELECT * FROM admins").get();
    const second = await initializeAdminFromEnv(
      { ADMIN_USERNAME: "someone-else", ADMIN_INITIAL_PASSWORD: "another-password-456" },
      db,
    );

    expect(first).toBe("created");
    expect(second).toBe("exists");
    expect(db.prepare("SELECT * FROM admins").get()).toEqual(original);
  });

  it("requires a twelve-character initial password when empty", async () => {
    await expect(initializeAdminFromEnv(
      { ADMIN_USERNAME: "owner", ADMIN_INITIAL_PASSWORD: "short" },
      db,
    )).rejects.toThrow("at least 12 characters");
  });
});
