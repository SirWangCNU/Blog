// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { DatabaseSync } from "node:sqlite";
import { createDatabase } from "@/lib/db/database";
import { listMedia, saveMedia } from "./media";
import { deleteNote, listNotes, saveNote } from "./notes";

describe("note and media repositories", () => {
  let db: DatabaseSync;

  beforeEach(() => {
    db = createDatabase(":memory:");
  });

  afterEach(() => db.close());

  it("creates, updates, and deletes notes", () => {
    const created = saveNote({ title: "Note", content: "Body" }, db);
    const updated = saveNote({ id: created.id, title: "Updated", content: "New body" }, db);

    expect(updated.createdAt).toBe(created.createdAt);
    expect(listNotes(db)).toEqual([expect.objectContaining({ title: "Updated" })]);
    expect(deleteNote(created.id, db)).toBe(true);
    expect(listNotes(db)).toEqual([]);
  });

  it("upserts media by relative path without duplicate rows", () => {
    saveMedia(
      {
        originalName: "image.png",
        savedName: "1-image.png",
        relativePath: "works/1-image.png",
        url: "/uploads/works/1-image.png",
        mimeType: "image/png",
        size: 10,
      },
      db,
    );
    saveMedia(
      {
        originalName: "renamed.png",
        savedName: "1-image.png",
        relativePath: "works/1-image.png",
        url: "/uploads/works/1-image.png",
        mimeType: "image/png",
        size: 12,
      },
      db,
    );

    expect(listMedia(db)).toEqual([
      expect.objectContaining({ originalName: "renamed.png", size: 12 }),
    ]);
  });
});
