// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { DatabaseSync } from "node:sqlite";
import { createDatabase } from "@/lib/db/database";
import { deletePost, getPostBySlug, listPosts, savePost } from "./posts";

describe("post repository", () => {
  let db: DatabaseSync;

  beforeEach(() => {
    db = createDatabase(":memory:");
  });

  afterEach(() => db.close());

  it("keeps drafts out of public queries and round-trips JSON tags", () => {
    savePost(
      {
        slug: "published-post",
        title: "Published post",
        excerpt: "Public",
        content: "Published content",
        category: "Engineering",
        tags: ["SQLite", "Next.js"],
        readTime: "3 分钟",
        status: "published",
      },
      db,
    );
    savePost(
      {
        slug: "draft-post",
        title: "Draft post",
        excerpt: "Private",
        content: "Draft content",
        category: "Notes",
        tags: ["Draft"],
        readTime: "1 分钟",
        status: "draft",
      },
      db,
    );

    expect(listPosts({ db })).toEqual([
      expect.objectContaining({ slug: "published-post", tags: ["SQLite", "Next.js"] }),
    ]);
    expect(listPosts({ db, includeDrafts: true })).toHaveLength(2);
    expect(getPostBySlug("draft-post", { db })).toBeNull();
    expect(getPostBySlug("draft-post", { db, includeDrafts: true })?.status).toBe("draft");
  });

  it("updates by id, preserves publication time, and deletes by id", () => {
    const created = savePost(
      {
        title: "First title",
        excerpt: "Excerpt",
        content: "Body",
        category: "General",
        tags: [],
        readTime: "2 分钟",
        status: "published",
      },
      db,
    );
    const updated = savePost({ ...created, title: "Updated title" }, db);

    expect(updated.id).toBe(created.id);
    expect(updated.publishedAt).toBe(created.publishedAt);
    expect(deletePost(created.id, db)).toBe(true);
    expect(deletePost(created.id, db)).toBe(false);
  });
});
