import type { DatabaseSync } from "node:sqlite";
import { getDatabase } from "@/lib/db/database";
import type { Media, MediaInput } from "./types";

interface MediaRow {
  id: number;
  original_name: string;
  saved_name: string;
  relative_path: string;
  url: string;
  mime_type: string;
  size: number;
  uploaded_at: string;
}

function mapMedia(row: MediaRow): Media {
  return {
    id: row.id, originalName: row.original_name, savedName: row.saved_name,
    relativePath: row.relative_path, url: row.url, mimeType: row.mime_type,
    size: row.size, uploadedAt: row.uploaded_at,
  };
}

export function listMedia(db: DatabaseSync = getDatabase()): Media[] {
  return db.prepare("SELECT * FROM media ORDER BY uploaded_at DESC").all()
    .map((row) => mapMedia(row as unknown as MediaRow));
}

export function getMediaByPath(relativePath: string, db: DatabaseSync = getDatabase()): Media | null {
  const row = db.prepare("SELECT * FROM media WHERE relative_path = ?").get(relativePath);
  return row ? mapMedia(row as unknown as MediaRow) : null;
}

export function saveMedia(input: MediaInput, db: DatabaseSync = getDatabase()): Media {
  const uploadedAt = input.uploadedAt ?? new Date().toISOString();
  db.prepare(`
    INSERT INTO media (original_name, saved_name, relative_path, url, mime_type, size, uploaded_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(relative_path) DO UPDATE SET
      original_name = excluded.original_name, saved_name = excluded.saved_name,
      url = excluded.url, mime_type = excluded.mime_type, size = excluded.size
  `).run(input.originalName, input.savedName, input.relativePath, input.url, input.mimeType, input.size, uploadedAt);
  return getMediaByPath(input.relativePath, db)!;
}

export function deleteMedia(relativePath: string, db: DatabaseSync = getDatabase()): boolean {
  return db.prepare("DELETE FROM media WHERE relative_path = ?").run(relativePath).changes > 0;
}
