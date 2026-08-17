import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { getDatabase } from "@/lib/db/database";
import type { Note, NoteInput } from "./types";

interface NoteRow {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

function mapNote(row: NoteRow): Note {
  return { id: row.id, title: row.title, content: row.content, createdAt: row.created_at, updatedAt: row.updated_at };
}

export function listNotes(db: DatabaseSync = getDatabase()): Note[] {
  return db.prepare("SELECT * FROM notes ORDER BY updated_at DESC").all()
    .map((row) => mapNote(row as unknown as NoteRow));
}

export function getNote(id: string, db: DatabaseSync = getDatabase()): Note | null {
  const row = db.prepare("SELECT * FROM notes WHERE id = ?").get(id);
  return row ? mapNote(row as unknown as NoteRow) : null;
}

export function saveNote(input: NoteInput, db: DatabaseSync = getDatabase()): Note {
  const existing = input.id ? getNote(input.id, db) : null;
  const id = input.id ?? randomUUID();
  const now = new Date().toISOString();
  const createdAt = existing?.createdAt ?? now;
  db.prepare(`
    INSERT INTO notes (id, title, content, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET title = excluded.title, content = excluded.content, updated_at = excluded.updated_at
  `).run(id, input.title.trim(), input.content, createdAt, now);
  return getNote(id, db)!;
}

export function deleteNote(id: string, db: DatabaseSync = getDatabase()): boolean {
  return db.prepare("DELETE FROM notes WHERE id = ?").run(id).changes > 0;
}
