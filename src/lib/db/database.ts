import { mkdirSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { SCHEMA_SQL } from "./schema";

const DEFAULT_DATABASE_PATH = join(process.cwd(), "data", "blog.sqlite");

let database: DatabaseSync | null = null;

function resolveDatabasePath(path: string): string {
  if (path === ":memory:" || isAbsolute(path)) return path;
  return join(process.cwd(), path);
}

export function createDatabase(path: string): DatabaseSync {
  const resolvedPath = resolveDatabasePath(path);
  if (resolvedPath !== ":memory:") {
    mkdirSync(dirname(resolvedPath), { recursive: true });
  }

  const db = new DatabaseSync(resolvedPath);
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec("PRAGMA busy_timeout = 5000;");
  if (resolvedPath !== ":memory:") {
    db.exec("PRAGMA journal_mode = WAL;");
  }
  db.exec(SCHEMA_SQL);

  return db;
}

export function getDatabase(): DatabaseSync {
  if (!database) {
    database = createDatabase(process.env.BLOG_DATABASE_PATH ?? DEFAULT_DATABASE_PATH);
  }
  return database;
}

export function closeDatabaseForTests(): void {
  database?.close();
  database = null;
}
