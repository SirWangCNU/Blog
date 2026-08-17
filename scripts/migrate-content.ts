import { readdir, readFile, stat } from "node:fs/promises";
import { basename, extname, join, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import type { DatabaseSync } from "node:sqlite";
import { getDatabase } from "@/lib/db/database";
import { getMediaByPath, saveMedia } from "@/lib/content/media";
import { getNote, saveNote } from "@/lib/content/notes";
import { getPostBySlug, savePost } from "@/lib/content/posts";
import type { MediaInput } from "@/lib/content/types";
import { getWork, saveWork } from "@/lib/works/store";
import type { Work } from "@/lib/works/types";

interface LegacyPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  readTime: string;
  date: string;
}

interface LegacyNote {
  id: string;
  title: string;
  content: string;
  updatedAt?: string;
}

export interface MigrationSources {
  posts: LegacyPost[];
  works: Work[];
  notes: LegacyNote[];
  media: MediaInput[];
}

export interface MigrationReport {
  created: number;
  updated: number;
  failed: number;
}

function asPublishedAt(date: string): string {
  return date.includes("T") ? date : `${date}T00:00:00.000Z`;
}

export async function migrateLegacyContent(
  db: DatabaseSync,
  sources: MigrationSources,
): Promise<MigrationReport> {
  const report: MigrationReport = { created: 0, updated: 0, failed: 0 };
  db.exec("BEGIN IMMEDIATE");
  try {
    for (const post of sources.posts) {
      const existing = getPostBySlug(post.slug, { db, includeDrafts: true });
      savePost(
        {
          id: existing?.id,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          tags: post.tags,
          readTime: post.readTime,
          status: "published",
          publishedAt: asPublishedAt(post.date),
        },
        db,
      );
      report[existing ? "updated" : "created"] += 1;
    }

    for (const work of sources.works) {
      const existing = await getWork(work.id, db);
      await saveWork(work, db);
      report[existing ? "updated" : "created"] += 1;
    }

    for (const note of sources.notes) {
      const existing = getNote(note.id, db);
      saveNote(note, db);
      report[existing ? "updated" : "created"] += 1;
    }

    for (const media of sources.media) {
      const existing = getMediaByPath(media.relativePath, db);
      saveMedia(media, db);
      report[existing ? "updated" : "created"] += 1;
    }

    db.exec("COMMIT");
    return report;
  } catch (error) {
    db.exec("ROLLBACK");
    report.failed += 1;
    throw Object.assign(new Error("Legacy content migration failed", { cause: error }), { report });
  }
}

async function readJsonDirectory<T>(directory: string): Promise<T[]> {
  try {
    const names = await readdir(directory);
    return await Promise.all(
      names.filter((name) => name.endsWith(".json")).map(async (name) => {
        const value = JSON.parse(await readFile(join(directory, name), "utf8")) as T;
        return value;
      }),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function walkFiles(directory: string): Promise<string[]> {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(entries.map(async (entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? walkFiles(path) : [path];
    }));
    return nested.flat();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

function mimeTypeFor(path: string): string {
  const mimeTypes: Record<string, string> = {
    ".gif": "image/gif",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
  };
  return mimeTypes[extname(path).toLowerCase()] ?? "application/octet-stream";
}

export async function loadLegacySources(root = process.cwd()): Promise<MigrationSources> {
  const { posts } = await import("../src/data/posts");
  const works = await readJsonDirectory<Work>(join(root, "data", "works"));
  const notes = await readJsonDirectory<Omit<LegacyNote, "id"> & { id?: string }>(join(root, "data", "notes"));
  const uploadRoot = join(root, "public", "uploads");
  const files = await walkFiles(uploadRoot);
  const media = await Promise.all(files.map(async (path): Promise<MediaInput> => {
    const fileStat = await stat(path);
    const relativePath = relative(uploadRoot, path).split(sep).join("/");
    const savedName = basename(path);
    return {
      originalName: savedName.replace(/^\d+-/, ""),
      savedName,
      relativePath,
      url: `/uploads/${relativePath}`,
      mimeType: mimeTypeFor(path),
      size: fileStat.size,
      uploadedAt: fileStat.mtime.toISOString(),
    };
  }));

  return {
    posts: posts as LegacyPost[],
    works,
    notes: notes.map((note, index) => ({
      id: note.id ?? `note-${index + 1}`,
      title: note.title,
      content: note.content,
      updatedAt: note.updatedAt,
    })),
    media,
  };
}

async function main(): Promise<void> {
  const report = await migrateLegacyContent(getDatabase(), await loadLegacySources());
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

const entry = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (entry === import.meta.url) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
