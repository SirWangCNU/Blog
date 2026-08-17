import type { DatabaseSync } from "node:sqlite";
import { getDatabase } from "@/lib/db/database";
import type { Post, PostInput } from "./types";

interface PostRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags_json: string;
  read_time: string;
  status: Post["status"];
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface PostQueryOptions {
  includeDrafts?: boolean;
  db?: DatabaseSync;
}

function parseStringArray(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function mapPost(row: PostRow): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    tags: parseStringArray(row.tags_json),
    readTime: row.read_time,
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    date: (row.published_at ?? row.created_at).slice(0, 10),
  };
}

export function slugifyPostTitle(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100) || `post-${Date.now()}`;
}

export function listPosts(options: PostQueryOptions = {}): Post[] {
  const db = options.db ?? getDatabase();
  const rows = options.includeDrafts
    ? db.prepare("SELECT * FROM posts ORDER BY updated_at DESC").all()
    : db.prepare("SELECT * FROM posts WHERE status = 'published' ORDER BY published_at DESC, updated_at DESC").all();
  return rows.map((row) => mapPost(row as unknown as PostRow));
}

export function getPostBySlug(slug: string, options: PostQueryOptions = {}): Post | null {
  const db = options.db ?? getDatabase();
  const row = options.includeDrafts
    ? db.prepare("SELECT * FROM posts WHERE slug = ?").get(slug)
    : db.prepare("SELECT * FROM posts WHERE slug = ? AND status = 'published'").get(slug);
  return row ? mapPost(row as unknown as PostRow) : null;
}

export function getPostById(id: number, db: DatabaseSync = getDatabase()): Post | null {
  const row = db.prepare("SELECT * FROM posts WHERE id = ?").get(id);
  return row ? mapPost(row as unknown as PostRow) : null;
}

export function savePost(input: PostInput, db: DatabaseSync = getDatabase()): Post {
  const now = new Date().toISOString();
  const existing = input.id ? getPostById(input.id, db) : null;
  if (input.id && !existing) throw new Error("Post not found");

  const slug = slugifyPostTitle(input.slug?.trim() || input.title);
  const publishedAt = input.status === "published"
    ? existing?.publishedAt ?? input.publishedAt ?? now
    : null;

  if (existing) {
    db.prepare(`
      UPDATE posts
      SET slug = ?, title = ?, excerpt = ?, content = ?, category = ?, tags_json = ?,
          read_time = ?, status = ?, published_at = ?, updated_at = ?
      WHERE id = ?
    `).run(
      slug, input.title.trim(), input.excerpt.trim(), input.content, input.category.trim(),
      JSON.stringify(input.tags), input.readTime.trim(), input.status, publishedAt, now, existing.id,
    );
    return getPostById(existing.id, db)!;
  }

  const result = db.prepare(`
    INSERT INTO posts (
      slug, title, excerpt, content, category, tags_json, read_time,
      status, published_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    slug, input.title.trim(), input.excerpt.trim(), input.content, input.category.trim(),
    JSON.stringify(input.tags), input.readTime.trim(), input.status, publishedAt, now, now,
  );
  return getPostById(Number(result.lastInsertRowid), db)!;
}

export function deletePost(id: number, db: DatabaseSync = getDatabase()): boolean {
  return db.prepare("DELETE FROM posts WHERE id = ?").run(id).changes > 0;
}
