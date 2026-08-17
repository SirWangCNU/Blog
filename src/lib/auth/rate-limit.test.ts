// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { DatabaseSync } from "node:sqlite";
import { createDatabase } from "@/lib/db/database";
import { checkLoginAllowed, clearLoginAttempts, recordFailedLogin } from "./rate-limit";

describe("login throttling", () => {
  let db: DatabaseSync;
  const now = new Date("2026-08-17T00:00:00.000Z");

  beforeEach(() => {
    db = createDatabase(":memory:");
  });

  afterEach(() => db.close());

  it("blocks the sixth attempt for fifteen minutes and can be cleared", () => {
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      expect(recordFailedLogin("127.0.0.1:admin", now, db).allowed).toBe(true);
    }
    expect(checkLoginAllowed("127.0.0.1:admin", now, db).allowed).toBe(false);
    expect(checkLoginAllowed("127.0.0.1:admin", new Date("2026-08-17T00:15:01.000Z"), db).allowed).toBe(true);

    recordFailedLogin("127.0.0.1:admin", now, db);
    clearLoginAttempts("127.0.0.1:admin", db);
    expect(checkLoginAllowed("127.0.0.1:admin", now, db).allowed).toBe(true);
  });
});
