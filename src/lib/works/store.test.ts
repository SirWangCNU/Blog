// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { DatabaseSync } from "node:sqlite";
import { createDatabase } from "@/lib/db/database";
import { deleteWork, getWork, listWorks, saveWork } from "./store";

describe("work repository", () => {
  let db: DatabaseSync;

  beforeEach(() => {
    db = createDatabase(":memory:");
  });

  afterEach(() => db.close());

  it("retains the existing work API while filtering drafts", async () => {
    const published = await saveWork(
      {
        title: "SQLite portfolio",
        summary: "Summary",
        cover: "/cover.png",
        tags: ["SQLite"],
        category: "Web",
        content: "Details",
        gallery: ["/one.png"],
        featured: true,
        status: "published",
      },
      db,
    );
    await saveWork(
      {
        title: "Private work",
        summary: "Draft",
        cover: "",
        tags: [],
        content: "",
        featured: false,
        status: "draft",
      },
      db,
    );

    expect(await listWorks(false, db)).toEqual([published]);
    expect(await listWorks(true, db)).toHaveLength(2);
    expect((await getWork(published.id, db))?.gallery).toEqual(["/one.png"]);
    await deleteWork(published.id, db);
    expect(await getWork(published.id, db)).toBeNull();
  });
});
