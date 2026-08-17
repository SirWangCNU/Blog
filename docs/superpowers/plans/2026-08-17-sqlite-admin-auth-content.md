# SQLite Admin Authentication and Content Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persistent single-administrator login, move structured blog content to SQLite, protect the management surface, and expose a small home-page button leading to the admin console.

**Architecture:** A server-only SQLite adapter owns connection setup and migrations, while focused repositories map database rows to existing view models. Authentication uses `scrypt` password hashes, opaque hashed sessions, server-side route guards, and protected mutation APIs. Public pages continue to use their existing components but receive published records from the repositories.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, `better-sqlite3`, Node `crypto`, Vitest, Testing Library, SQLite WAL.

## Global Constraints

- The production database defaults to `data/blog.sqlite`; `BLOG_DATABASE_PATH` may override it.
- Store structured content in SQLite and file bodies in `public/uploads/`.
- Support exactly one administrator and no registration, recovery, or role system.
- Never store plaintext passwords or plaintext session tokens.
- Session cookies are `HttpOnly`, `SameSite=Lax`, `Path=/`, and `Secure` in production.
- Sessions expire after seven days and are revocable on logout.
- Public queries return only `published` posts and works.
- Existing post slugs and public URLs must remain unchanged after migration.
- Migration is explicit, transactional, idempotent, and never deletes source files.
- Do not commit database files, SQLite WAL files, uploads, backups, or environment files.

## File Structure

- `src/lib/db/database.ts`: SQLite connection, pragmas, schema migrations, and test database factory.
- `src/lib/db/schema.ts`: ordered SQL migrations only.
- `src/lib/content/types.ts`: shared `Post`, `PostInput`, `Note`, and `Media` types.
- `src/lib/content/posts.ts`: post repository and public/admin query boundaries.
- `src/lib/content/notes.ts`: note repository.
- `src/lib/content/media.ts`: media metadata repository.
- `src/lib/works/store.ts`: replace JSON persistence with the work repository while retaining its public function signatures.
- `src/lib/auth/password.ts`: `scrypt` hashing and constant-time verification.
- `src/lib/auth/session.ts`: session issue, lookup, expiry, revocation, and Cookie helpers.
- `src/lib/auth/guard.ts`: page and API authentication guards.
- `src/lib/auth/rate-limit.ts`: SQLite-backed login-attempt throttling.
- `scripts/migrate-content.ts`: legacy content and upload metadata import.
- `scripts/init-admin.ts`: one-time environment-driven administrator creation.
- `src/app/admin/login/*`: standalone login route and client form.
- `src/app/admin/(protected)/*`: existing admin pages under a shared authenticated layout.
- `src/app/api/admin/auth/{login,logout}/route.ts`: authentication endpoints.
- `src/app/api/admin/posts/route.ts`: authenticated post CRUD endpoint.
- `src/app/admin/(protected)/blog/*`: post list and Markdown editor.
- `src/components/BlogIndex.tsx`: current interactive blog list extracted to accept server-provided data.
- `src/components/BlogPost.tsx`: current interactive article view extracted to accept server-provided data.
- `src/components/Sidebar.tsx`: accept posts through props instead of importing source data.
- `src/app/{page,blog/page,blog/[slug]/page}.tsx`: server-side repository reads.
- `.gitignore`, `.env.example`, `启动教程.md`, `deploy.sh`: persistence and deployment contract.

---

### Task 1: SQLite Foundation and Schema

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `src/lib/db/schema.ts`
- Create: `src/lib/db/database.ts`
- Create: `src/lib/db/database.test.ts`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `createDatabase(path: string): Database.Database`
- Produces: `getDatabase(): Database.Database`
- Produces: `closeDatabaseForTests(): void`

- [ ] **Step 1: Add dependencies**

Run: `pnpm add better-sqlite3 && pnpm add -D @types/better-sqlite3 tsx`

Add scripts to `package.json`:

```json
"db:migrate": "tsx scripts/migrate-content.ts",
"admin:init": "tsx scripts/init-admin.ts"
```

- [ ] **Step 2: Write the failing database test**

```ts
// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createDatabase } from "./database";

describe("createDatabase", () => {
  it("creates every required table and enables foreign keys", () => {
    const db = createDatabase(":memory:");
    const names = db.prepare("SELECT name FROM sqlite_master WHERE type='table'")
      .all().map((row) => (row as { name: string }).name);
    expect(names).toEqual(expect.arrayContaining([
      "admins", "admin_sessions", "login_attempts", "posts", "works", "notes", "media",
    ]));
    expect(db.pragma("foreign_keys", { simple: true })).toBe(1);
    db.close();
  });
});
```

- [ ] **Step 3: Verify the test fails**

Run: `pnpm exec vitest run src/lib/db/database.test.ts`
Expected: FAIL because `./database` does not exist.

- [ ] **Step 4: Implement schema and connection**

Define migrations for all seven tables, unique indexes on administrator username, post slug, work id, and media relative path, plus status `CHECK` constraints. In `createDatabase`, create the parent directory for file-backed databases, set `foreign_keys = ON`, `journal_mode = WAL`, `busy_timeout = 5000`, run migrations in a transaction, and return the connection. `getDatabase` uses `BLOG_DATABASE_PATH ?? join(process.cwd(), "data", "blog.sqlite")` and caches one production connection.

- [ ] **Step 5: Ignore persistent runtime artifacts and verify**

Resolve the existing merge markers in `.gitignore`, retain its current useful rules, and add:

```gitignore
/data/*.sqlite
/data/*.sqlite-*
/backups/
/public/uploads/
```

Run: `pnpm exec vitest run src/lib/db/database.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml src/lib/db .gitignore
git commit -m "feat: add sqlite database foundation"
```

### Task 2: Content Types, Repositories, and Legacy Migration

**Files:**
- Create: `src/lib/content/types.ts`
- Create: `src/lib/content/posts.ts`
- Create: `src/lib/content/posts.test.ts`
- Create: `src/lib/content/notes.ts`
- Create: `src/lib/content/media.ts`
- Modify: `src/lib/works/store.ts`
- Create: `src/lib/works/store.test.ts`
- Create: `scripts/migrate-content.ts`
- Create: `scripts/migrate-content.test.ts`

**Interfaces:**
- Produces: `listPosts(options?: { includeDrafts?: boolean }): Post[]`
- Produces: `getPostBySlug(slug: string, options?: { includeDrafts?: boolean }): Post | null`
- Produces: `getPostById(id: number): Post | null`
- Produces: `savePost(input: PostInput): Post`
- Produces: `deletePost(id: number): boolean`
- Retains: `listWorks`, `getWork`, `saveWork`, and `deleteWork` signatures.
- Produces: `migrateLegacyContent(db, sources): MigrationReport`

- [ ] **Step 1: Write failing repository tests**

Use an in-memory database to assert draft filtering, slug uniqueness, JSON tag round-tripping, timestamps, work compatibility, note CRUD, and media path uniqueness. Include this public-boundary assertion:

```ts
expect(listPosts({ db })).toEqual([expect.objectContaining({ slug: "published" })]);
expect(listPosts({ db, includeDrafts: true })).toHaveLength(2);
```

- [ ] **Step 2: Verify repository tests fail**

Run: `pnpm exec vitest run src/lib/content src/lib/works/store.test.ts`
Expected: FAIL because SQLite repositories do not exist.

- [ ] **Step 3: Implement repository mappings**

Move the `Post` interface out of `src/data/posts.ts`. Implement parameterized statements, strict status validation, JSON array parsing with safe empty-array fallback, ISO timestamps, and transactions for multi-statement writes. Keep the work store API stable so current pages do not need database-specific changes.

- [ ] **Step 4: Write the failing idempotent migration test**

Create temporary legacy post/work/note/media fixtures, call the migration twice, and assert unchanged table counts plus a report whose second run contains only `updated` or `skipped` records.

- [ ] **Step 5: Implement explicit migration**

Export `migrateLegacyContent` from the script for tests. The executable path imports `posts` from `src/data/posts.ts`, reads `data/works/*.json` and `data/notes/*.json`, recursively scans `public/uploads/`, and upserts by stable keys inside per-content transactions. Print a JSON `MigrationReport` with `created`, `updated`, `skipped`, and `failed` totals; set `process.exitCode = 1` on failure without deleting inputs.

- [ ] **Step 6: Verify repositories and migration**

Run: `pnpm exec vitest run src/lib/content src/lib/works/store.test.ts scripts/migrate-content.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib/content src/lib/works scripts/migrate-content.ts scripts/migrate-content.test.ts
git commit -m "feat: persist blog content in sqlite"
```

### Task 3: Passwords, Sessions, Initialization, and Login Throttling

**Files:**
- Create: `src/lib/auth/password.ts`
- Create: `src/lib/auth/password.test.ts`
- Create: `src/lib/auth/session.ts`
- Create: `src/lib/auth/session.test.ts`
- Create: `src/lib/auth/rate-limit.ts`
- Create: `src/lib/auth/rate-limit.test.ts`
- Create: `scripts/init-admin.ts`
- Create: `scripts/init-admin.test.ts`

**Interfaces:**
- Produces: `hashPassword(password: string): Promise<{ hash: string; salt: string }>`
- Produces: `verifyPassword(password: string, hash: string, salt: string): Promise<boolean>`
- Produces: `createSession(adminId: number, db?): { token: string; expiresAt: Date }`
- Produces: `findSession(token: string, db?): AdminSession | null`
- Produces: `revokeSession(token: string, db?): void`
- Produces: `consumeLoginAttempt(key: string, now?: Date, db?): { allowed: boolean; retryAfterSeconds: number }`
- Produces: `initializeAdminFromEnv(env, db?): Promise<"created" | "exists">`

- [ ] **Step 1: Write failing password and session tests**

Assert different salts for identical passwords, correct and incorrect password checks, database storage of only a SHA-256 token hash, seven-day expiry, expired-session cleanup, and logout revocation.

- [ ] **Step 2: Verify authentication tests fail**

Run: `pnpm exec vitest run src/lib/auth`
Expected: FAIL because authentication modules do not exist.

- [ ] **Step 3: Implement password and session primitives**

Promisify `crypto.scrypt` with a 64-byte output, use a 16-byte random salt, compare buffers with `timingSafeEqual`, issue 32-byte base64url session tokens, and hash tokens with SHA-256 before database access. Export cookie name `blog_admin_session` and a Cookie options helper implementing the global constraints.

- [ ] **Step 4: Implement and test persistent throttling**

Hash the normalized `IP + username` key before storage. Permit five failures in a rolling 15-minute window; on the sixth return `allowed: false` and a positive retry time. Clear the key after successful login.

- [ ] **Step 5: Implement and test one-time administrator initialization**

Reject missing username, passwords shorter than 12 characters, and attempts to create a second administrator. Read `ADMIN_USERNAME` and `ADMIN_INITIAL_PASSWORD`, create the administrator only when the table is empty, and never print the password.

- [ ] **Step 6: Verify and commit**

Run: `pnpm exec vitest run src/lib/auth scripts/init-admin.test.ts`
Expected: PASS.

```bash
git add src/lib/auth scripts/init-admin.ts scripts/init-admin.test.ts
git commit -m "feat: add single-admin authentication core"
```

### Task 4: Login UI, Auth APIs, Route Guard, and Logout

**Files:**
- Create: `src/lib/auth/guard.ts`
- Create: `src/lib/auth/guard.test.ts`
- Create: `src/app/api/admin/auth/login/route.ts`
- Create: `src/app/api/admin/auth/login/route.test.ts`
- Create: `src/app/api/admin/auth/logout/route.ts`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/login/LoginForm.tsx`
- Create: `src/app/admin/login/login.css`
- Create: `src/app/admin/(protected)/layout.tsx`
- Move: protected pages currently under `src/app/admin/` into `src/app/admin/(protected)/`
- Modify: `src/app/admin/layout.tsx`
- Modify: `src/components/admin/AdminShell.tsx`
- Modify: `src/components/admin/AdminShell.test.tsx`

**Interfaces:**
- Produces: `getCurrentAdmin(): Promise<AdminIdentity | null>`
- Produces: `requireAdmin(returnTo?: string): Promise<AdminIdentity>`
- Produces: `requireApiAdmin(request: NextRequest): Promise<AdminIdentity | NextResponse>`

- [ ] **Step 1: Write failing guard and login route tests**

Mock cookies and an in-memory database. Assert invalid credentials return the same `401` message, throttling returns `429`, success sets an HttpOnly cookie, external `returnTo` values are replaced with `/admin`, and authenticated resolution returns only `{ id, username }`.

- [ ] **Step 2: Verify tests fail**

Run: `pnpm exec vitest run src/lib/auth/guard.test.ts src/app/api/admin/auth/login/route.test.ts`
Expected: FAIL because guards and routes do not exist.

- [ ] **Step 3: Implement guards and auth endpoints**

The login route validates strings, consumes failed-attempt quota, verifies the single admin, clears attempts on success, creates the session, and returns `{ success: true, redirectTo }`. The logout route requires a session when present, revokes it, clears the cookie, and returns `{ success: true }`.

- [ ] **Step 4: Split public login and protected admin layouts**

Keep `src/app/admin/layout.tsx` limited to importing `admin.css` and rendering children. Move the dashboard, blog, works, media, and settings routes under `(protected)` without changing URLs. The protected layout calls `requireAdmin()` before rendering `AdminShell`; the login page redirects authenticated users to `/admin`.

- [ ] **Step 5: Build and test login/logout UI**

Create labeled username/password inputs, disabled submit state, generic inline error, and safe return-path handling. Add an actual logout button to `AdminShell` that POSTs to the logout route and navigates to `/admin/login`. Preserve keyboard focus styles and mobile layout.

- [ ] **Step 6: Verify and commit**

Run: `pnpm exec vitest run src/lib/auth src/app/api/admin/auth src/components/admin/AdminShell.test.tsx`
Expected: PASS.

```bash
git add src/lib/auth src/app/api/admin/auth src/app/admin src/components/admin/AdminShell.tsx src/components/admin/AdminShell.test.tsx
git commit -m "feat: protect admin with persistent login"
```

### Task 5: Protect Existing Work, File, and Upload APIs

**Files:**
- Modify: `src/app/api/works/route.ts`
- Create: `src/app/api/works/route.test.ts`
- Modify: `src/app/api/files/route.ts`
- Create: `src/app/api/files/route.test.ts`
- Modify: `src/app/api/upload/route.ts`
- Create: `src/app/api/upload/route.test.ts`

**Interfaces:**
- Consumes: `requireApiAdmin(request)` and the SQLite repositories.
- Produces: authenticated draft reads and mutations; unauthenticated published work reads.

- [ ] **Step 1: Write failing authorization tests**

Assert anonymous work GET excludes drafts, anonymous `includeDrafts=true` returns `401`, all anonymous POST/DELETE/upload/note mutations return `401`, and authenticated calls retain their existing response shapes.

- [ ] **Step 2: Verify tests fail**

Run: `pnpm exec vitest run src/app/api/works/route.test.ts src/app/api/files/route.test.ts src/app/api/upload/route.test.ts`
Expected: FAIL because current mutation routes are public.

- [ ] **Step 3: Add server-side guards and repository writes**

Guard before parsing mutation bodies. Keep published work list and individual published-work reads public. Route notes and media metadata through SQLite repositories, and reject paths that resolve outside `public/uploads/` or `data/notes/` during the transition.

- [ ] **Step 4: Verify and commit**

Run: `pnpm exec vitest run src/app/api/works/route.test.ts src/app/api/files/route.test.ts src/app/api/upload/route.test.ts`
Expected: PASS.

```bash
git add src/app/api/works src/app/api/files src/app/api/upload
git commit -m "feat: secure content mutation APIs"
```

### Task 6: Public Pages Read Published SQLite Content

**Files:**
- Create: `src/components/BlogIndex.tsx`
- Create: `src/components/BlogIndex.test.tsx`
- Create: `src/components/BlogPost.tsx`
- Modify: `src/components/Sidebar.tsx`
- Modify: `src/components/PostCard.tsx`
- Modify: `src/components/PostCardBlog.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/projects/page.tsx`
- Modify: `src/app/admin/(protected)/page.tsx`
- Modify: `src/lib/admin/dashboard.ts`
- Modify: `src/lib/admin/dashboard.test.ts`

**Interfaces:**
- Consumes: `listPosts`, `getPostBySlug`, and SQLite-backed `listWorks`.
- Produces: `BlogIndex({ posts }: { posts: Post[] })` and `BlogPost({ post, relatedPosts })`.

- [ ] **Step 1: Write failing component boundary tests**

Render `BlogIndex` with two supplied posts and assert search/category filtering never imports global data. Render `Sidebar` with supplied posts and assert its counts. Test repository-backed page loaders with a draft fixture and assert draft content is absent.

- [ ] **Step 2: Verify tests fail**

Run: `pnpm exec vitest run src/components/BlogIndex.test.tsx src/components/Sidebar.test.tsx`
Expected: FAIL because components still import `src/data/posts.ts`.

- [ ] **Step 3: Extract client views and add server data loaders**

Move current interactive blog-list code into `BlogIndex`, deriving categories from the passed posts. Move the current article hooks/rendering into `BlogPost`. Convert App Router pages to async server components, call repositories, use `notFound()` for absent or draft slugs, and pass related published posts explicitly.

- [ ] **Step 4: Update homepage, projects, and dashboard**

Read posts and works once per server page, pass posts to every `Sidebar`, and feed the admin dashboard with `listPosts({ includeDrafts: true })`. Update type imports from `@/data/posts` to `@/lib/content/types`.

- [ ] **Step 5: Verify and commit**

Run: `pnpm exec vitest run src/components src/lib/admin`
Expected: PASS.

```bash
git add src/components src/app/page.tsx src/app/blog src/app/projects src/app/admin src/lib/admin
git commit -m "feat: read public content from sqlite"
```

### Task 7: Admin Blog List and Markdown Editor

**Files:**
- Create: `src/app/api/admin/posts/route.ts`
- Create: `src/app/api/admin/posts/route.test.ts`
- Replace: `src/app/admin/(protected)/blog/page.tsx`
- Create: `src/app/admin/(protected)/blog/page.test.tsx`
- Create: `src/app/admin/(protected)/blog/new/page.tsx`
- Create: `src/app/admin/(protected)/blog/[id]/page.tsx`
- Create: `src/app/admin/(protected)/blog/components/PostForm.tsx`
- Create: `src/app/admin/(protected)/blog/components/PostForm.test.tsx`
- Modify: `src/app/admin/admin.css`
- Modify: `src/lib/admin/navigation.ts`
- Modify: `src/lib/admin/navigation.test.ts`

**Interfaces:**
- Consumes: authenticated post repository functions and existing upload API.
- Produces: `GET/POST/DELETE /api/admin/posts` and reusable `PostForm`.

- [ ] **Step 1: Write failing post API tests**

Assert authentication is required, title/content validation returns `400`, duplicate slugs return `409`, saving a draft preserves `publishedAt = null`, publishing sets it once, editing preserves the original public slug unless explicitly changed, and delete returns `404` for an unknown id.

- [ ] **Step 2: Verify API tests fail**

Run: `pnpm exec vitest run src/app/api/admin/posts/route.test.ts`
Expected: FAIL because the route does not exist.

- [ ] **Step 3: Implement the authenticated post API**

Support `GET ?id=`, `GET` list, `POST` create/update, and `DELETE ?id=`. Parse tags from an array, normalize a supplied slug, derive a slug from title when absent, validate status, and return stable `{ success, post }` or `{ error }` JSON.

- [ ] **Step 4: Write failing admin UI tests**

Assert list filtering, draft/published labels, delete confirmation, editor field labels, Markdown preview, save-draft payload, publish payload, upload insertion, and redirect to the created edit URL.

- [ ] **Step 5: Implement list and editor**

Reuse the established admin cards, tables, flash messages, buttons, and minimal Markdown editing behavior from `WorkForm`. Mark the Blog navigation item `ready`; retain the existing URLs `/admin/blog`, `/admin/blog/new`, and `/admin/blog/[id]`.

- [ ] **Step 6: Verify and commit**

Run: `pnpm exec vitest run src/app/api/admin/posts src/app/admin/'(protected)'/blog src/lib/admin/navigation.test.ts`
Expected: PASS.

```bash
git add src/app/api/admin/posts src/app/admin src/lib/admin/navigation.ts src/lib/admin/navigation.test.ts
git commit -m "feat: add admin blog publishing workflow"
```

### Task 8: Home Admin Button and Deployment Contract

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/page.test.tsx`
- Create: `.env.example`
- Modify: `启动教程.md`
- Modify: `deploy.sh`

**Interfaces:**
- Produces: an accessible small `/admin` entry in the homepage Hero.
- Documents: `BLOG_DATABASE_PATH`, `ADMIN_USERNAME`, and `ADMIN_INITIAL_PASSWORD`.

- [ ] **Step 1: Write the failing home entry test**

```tsx
render(await Home());
expect(screen.getByRole("link", { name: "后台管理" })).toHaveAttribute("href", "/admin");
```

- [ ] **Step 2: Verify the test fails**

Run: `pnpm exec vitest run src/app/page.test.tsx`
Expected: FAIL because the button does not exist.

- [ ] **Step 3: Add the homepage button**

Place “后台管理” beside the existing Hero actions, with smaller padding and lower visual emphasis than “阅读博客”. Preserve mobile wrapping, hover state, and visible keyboard focus.

- [ ] **Step 4: Document and enforce persistence**

Add `.env.example` with non-secret names and comments. Update the deployment guide with migration, one-time admin initialization, password removal, backup, restore, and permissions commands. Update `deploy.sh` to create `data/` and `public/uploads/` without overwriting them and to warn when either persistent path is missing.

- [ ] **Step 5: Verify and commit**

Run: `pnpm exec vitest run src/app/page.test.tsx`
Expected: PASS.

```bash
git add src/app/page.tsx src/app/page.test.tsx .env.example 启动教程.md deploy.sh
git commit -m "feat: add home admin entry and persistence setup"
```

### Task 9: Migration Run and Full Verification

**Files:**
- Modify only files required by failures discovered in this task.

**Interfaces:**
- Consumes all prior tasks.
- Produces a migrated local database and a verified production build.

- [ ] **Step 1: Run the migration twice**

Run: `pnpm db:migrate`
Expected: first run imports legacy content and exits 0.

Run: `pnpm db:migrate`
Expected: second run reports no duplicate rows and exits 0.

- [ ] **Step 2: Initialize a local test administrator without committing secrets**

PowerShell:

```powershell
$env:ADMIN_USERNAME='admin'
$env:ADMIN_INITIAL_PASSWORD='local-verification-only-123'
pnpm admin:init
Remove-Item Env:ADMIN_INITIAL_PASSWORD
```

Expected: one administrator is created; rerunning reports `exists` without changing its password.

- [ ] **Step 3: Run focused and full automated verification**

Run: `pnpm test -- --run`
Expected: all tests PASS.

Run: `pnpm lint`
Expected: exit 0 with no errors.

Run: `pnpm build`
Expected: production build succeeds and all public/admin routes compile.

- [ ] **Step 4: Perform a local HTTP smoke test**

Start `pnpm dev`, then verify: `/` contains the admin button; anonymous `/admin` redirects to `/admin/login`; invalid login is rejected; valid login opens the dashboard; a draft post is absent publicly; publishing makes it visible; logout revokes access; `/api/works?includeDrafts=true` returns `401` after logout.

- [ ] **Step 5: Confirm persisted artifacts and source cleanliness**

Run: `git status --short --ignored`
Expected: source changes are tracked as intended; `data/blog.sqlite*`, `.env*`, backups, and uploads are ignored.
