import type { DatabaseSync } from "node:sqlite";
import { getDatabase } from "@/lib/db/database";
import type { Work, WorkInput } from "./types";

interface WorkRow {
  id: string;
  title: string;
  summary: string;
  cover: string;
  tags_json: string;
  category: string;
  github: string;
  demo: string;
  doc: string;
  content: string;
  gallery_json: string;
  featured: number;
  status: Work["status"];
  created_at: string;
  updated_at: string;
}

function parseStringArray(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function mapWork(row: WorkRow): Work {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    cover: row.cover,
    tags: parseStringArray(row.tags_json),
    category: row.category,
    github: row.github,
    demo: row.demo,
    doc: row.doc,
    content: row.content,
    gallery: parseStringArray(row.gallery_json),
    featured: row.featured === 1,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

function generateId(title: string, db: DatabaseSync): string {
  const base = slugify(title) || `${Date.now()}`;
  let id = base;
  let counter = 1;
  while (db.prepare("SELECT 1 FROM works WHERE id = ?").get(id)) {
    id = `${base}-${counter}`;
    counter += 1;
  }
  return id;
}

export async function listWorks(includeDrafts = false, db: DatabaseSync = getDatabase()): Promise<Work[]> {
  const rows = includeDrafts
    ? db.prepare("SELECT * FROM works ORDER BY updated_at DESC").all()
    : db.prepare("SELECT * FROM works WHERE status = 'published' ORDER BY updated_at DESC").all();
  return rows.map((row) => mapWork(row as unknown as WorkRow));
}

export async function getWork(id: string, db: DatabaseSync = getDatabase()): Promise<Work | null> {
  const row = db.prepare("SELECT * FROM works WHERE id = ?").get(id);
  return row ? mapWork(row as unknown as WorkRow) : null;
}

export async function saveWork(input: WorkInput, db: DatabaseSync = getDatabase()): Promise<Work> {
  const id = input.id || generateId(input.title, db);
  const existing = input.id ? await getWork(input.id, db) : null;
  const now = new Date().toISOString();
  const createdAt = existing?.createdAt ?? now;

  db.prepare(`
    INSERT INTO works (
      id, title, summary, cover, tags_json, category, github, demo, doc,
      content, gallery_json, featured, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title, summary = excluded.summary, cover = excluded.cover,
      tags_json = excluded.tags_json, category = excluded.category, github = excluded.github,
      demo = excluded.demo, doc = excluded.doc, content = excluded.content,
      gallery_json = excluded.gallery_json, featured = excluded.featured,
      status = excluded.status, updated_at = excluded.updated_at
  `).run(
    id, input.title.trim(), input.summary.trim(), input.cover || "", JSON.stringify(input.tags || []),
    input.category || "", input.github || "", input.demo || "", input.doc || "", input.content || "",
    JSON.stringify(input.gallery || []), input.featured ? 1 : 0, input.status || "draft", createdAt, now,
  );
  return (await getWork(id, db))!;
}

export async function deleteWork(id: string, db: DatabaseSync = getDatabase()): Promise<void> {
  db.prepare("DELETE FROM works WHERE id = ?").run(id);
}
