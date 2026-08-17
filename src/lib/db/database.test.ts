// @vitest-environment node

import { describe, expect, it } from "vitest";
import { createDatabase } from "./database";

describe("createDatabase", () => {
  it("creates all persistent tables and enables foreign keys", () => {
    const db = createDatabase(":memory:");

    const tableNames = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
      .all()
      .map((row) => (row as { name: string }).name);

    expect(tableNames).toEqual(
      expect.arrayContaining([
        "admins",
        "admin_sessions",
        "login_attempts",
        "posts",
        "works",
        "notes",
        "media",
      ]),
    );
    expect(db.prepare("PRAGMA foreign_keys").get()).toEqual({ foreign_keys: 1 });

    db.close();
  });
});
