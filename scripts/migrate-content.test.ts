// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { DatabaseSync } from "node:sqlite";
import { createDatabase } from "@/lib/db/database";
import { listMedia } from "@/lib/content/media";
import { listNotes } from "@/lib/content/notes";
import { listPosts } from "@/lib/content/posts";
import { listWorks } from "@/lib/works/store";
import { migrateLegacyContent } from "./migrate-content";

describe("migrateLegacyContent", () => {
  let db: DatabaseSync;

  beforeEach(() => {
    db = createDatabase(":memory:");
  });

  afterEach(() => db.close());

  it("is idempotent across posts, works, notes, and media", async () => {
    const sources = {
      posts: [
        {
          slug: "existing-url",
          title: "Legacy post",
          excerpt: "Excerpt",
          content: "Body",
          category: "Migration",
          tags: ["SQLite"],
          readTime: "2 分钟",
          date: "2026-08-01",
        },
      ],
      works: [
        {
          id: "legacy-work",
          title: "Legacy work",
          summary: "Summary",
          cover: "",
          tags: [],
          content: "Body",
          featured: false,
          status: "published" as const,
          createdAt: "2026-08-01T00:00:00.000Z",
          updatedAt: "2026-08-02T00:00:00.000Z",
        },
      ],
      notes: [{ id: "legacy-note", title: "Note", content: "Text", updatedAt: "2026-08-03T00:00:00.000Z" }],
      media: [
        {
          originalName: "photo.png",
          savedName: "1-photo.png",
          relativePath: "1-photo.png",
          url: "/uploads/1-photo.png",
          mimeType: "image/png",
          size: 20,
          uploadedAt: "2026-08-04T00:00:00.000Z",
        },
      ],
    };

    const first = await migrateLegacyContent(db, sources);
    const second = await migrateLegacyContent(db, sources);

    expect(first.created).toBe(4);
    expect(second.created).toBe(0);
    expect(second.updated).toBe(4);
    expect(listPosts({ db, includeDrafts: true })).toHaveLength(1);
    expect(await listWorks(true, db)).toHaveLength(1);
    expect(listNotes(db)).toHaveLength(1);
    expect(listMedia(db)).toHaveLength(1);
    expect(listPosts({ db })[0].slug).toBe("existing-url");
  });
});
