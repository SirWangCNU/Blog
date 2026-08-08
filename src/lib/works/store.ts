import { readdir, readFile, writeFile, unlink, mkdir, stat } from "fs/promises";
import { join } from "path";
import type { Work, WorkInput } from "./types";

const WORKS_DIR = join(process.cwd(), "data", "works");

async function ensureDir() {
  try {
    await mkdir(WORKS_DIR, { recursive: true });
  } catch {}
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function generateId(title: string, existingIds: string[]): string {
  const base = slugify(title) || `${Date.now()}`;
  let id = base;
  let counter = 1;
  while (existingIds.includes(id)) {
    id = `${base}-${counter}`;
    counter++;
  }
  return id;
}

export async function listWorks(includeDrafts = false): Promise<Work[]> {
  await ensureDir();
  try {
    const entries = await readdir(WORKS_DIR);
    const works = await Promise.all(
      entries
        .filter((name) => name.endsWith(".json"))
        .map(async (name) => {
          const content = await readFile(join(WORKS_DIR, name), "utf-8");
          return JSON.parse(content) as Work;
        })
    );
    return works
      .filter((w) => includeDrafts || w.status === "published")
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch {
    return [];
  }
}

export async function getWork(id: string): Promise<Work | null> {
  await ensureDir();
  try {
    const content = await readFile(join(WORKS_DIR, `${id}.json`), "utf-8");
    return JSON.parse(content) as Work;
  } catch {
    return null;
  }
}

export async function saveWork(input: WorkInput): Promise<Work> {
  await ensureDir();
  const existingIds = (await listWorks(true)).map((w) => w.id);
  const id = input.id || generateId(input.title, existingIds);
  const now = new Date().toISOString();

  const existing = input.id ? await getWork(input.id) : null;

  const work: Work = {
    ...input,
    id,
    tags: input.tags || [],
    gallery: input.gallery || [],
    featured: input.featured ?? false,
    status: input.status || "draft",
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  await writeFile(join(WORKS_DIR, `${id}.json`), JSON.stringify(work, null, 2), "utf-8");
  return work;
}

export async function deleteWork(id: string): Promise<void> {
  await ensureDir();
  try {
    await unlink(join(WORKS_DIR, `${id}.json`));
  } catch {}
}
