import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { DatabaseSync } from "node:sqlite";
import { getDatabase } from "@/lib/db/database";
import { hashPassword } from "@/lib/auth/password";

type AdminEnvironment = Record<string, string | undefined>;

export async function initializeAdminFromEnv(
  env: AdminEnvironment = process.env,
  db: DatabaseSync = getDatabase(),
): Promise<"created" | "exists"> {
  const existing = db.prepare("SELECT id FROM admins LIMIT 1").get();
  if (existing) return "exists";

  const username = env.ADMIN_USERNAME?.trim();
  const password = env.ADMIN_INITIAL_PASSWORD;
  if (!username) throw new Error("ADMIN_USERNAME is required");
  if (!password || password.length < 12) {
    throw new Error("ADMIN_INITIAL_PASSWORD must be at least 12 characters");
  }

  const { hash, salt } = await hashPassword(password);
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO admins (username, password_hash, password_salt, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(username, hash, salt, now, now);
  return "created";
}

async function main(): Promise<void> {
  const result = await initializeAdminFromEnv();
  process.stdout.write(result === "created" ? "Administrator created.\n" : "Administrator already exists.\n");
}

const entry = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (entry === import.meta.url) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
