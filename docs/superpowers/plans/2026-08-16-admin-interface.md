# Mainstream Personal Blog Admin Redesign Implementation Plan

> **For agentic workers:** Execute inline in the current workspace. Do not create commits because the user explicitly requested no automatic Git commits.

**Goal:** Replace the decorative archive-style admin interface with a restrained, mainstream light admin layout while preserving existing data and CRUD behavior.

**Architecture:** Keep the existing Next.js route structure and pure dashboard/navigation models. Refactor the shared admin shell first, then update dashboard, works pages, editor headings and placeholder pages. Put the new visual layer in a dedicated `src/app/admin/admin.css` imported by the admin layout so public styles remain isolated.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, plain scoped CSS, Vitest, Testing Library.

## Global Constraints

- Use a 220px light sidebar, 56px white header and `#f5f7fa` workspace.
- Use only system sans-serif fonts; page headings are at most 24px.
- Use one blue primary color, standard bordered cards, tables and form controls.
- Remove archive copy, serif display typography, textures, ornamental indices and poster layouts.
- Preserve existing works fetch, save, publish, upload and delete behavior.
- Do not implement authentication or SQLite in this visual refactor.
- Do not commit or alter Git history.

---

### Task 1: Standard admin shell

**Files:**
- Modify: `src/components/admin/AdminShell.test.tsx`
- Modify: `src/components/admin/AdminShell.tsx`
- Modify: `src/app/admin/layout.tsx`
- Create: `src/app/admin/admin.css`

**Interfaces:**
- Preserve `AdminShell({ children }: { children: React.ReactNode })`.
- Preserve `ADMIN_NAV_ITEMS` and `isAdminPathActive()`.

- [ ] Change the component test to require the “个人博客” brand, a standard breadcrumb/header, accessible desktop collapse control and mobile navigation control; assert the archive brand is absent.
- [ ] Run `pnpm run test -- --run src/components/admin/AdminShell.test.tsx` and confirm the new expectations fail against the current archive shell.
- [ ] Implement a 220px light sidebar, 56px white header, desktop collapse state, mobile drawer and gray content workspace.
- [ ] Run the focused test and confirm it passes.

### Task 2: Standard dashboard

**Files:**
- Modify: `src/components/admin/AdminDashboard.test.tsx`
- Modify: `src/components/admin/AdminDashboard.tsx`
- Modify: `src/app/admin/admin.css`

**Interfaces:**
- Preserve `AdminDashboard({ data }: { data: AdminDashboardData })`.
- Continue consuming only the existing `AdminDashboardData` view model.

- [ ] Update the dashboard test to require the “控制台” heading, four real statistic cards, a recent works table and a compact security warning; assert archive headings are absent.
- [ ] Run the focused test and confirm it fails on the current dashboard.
- [ ] Implement a standard page header, statistics grid, recent works table and recent articles list.
- [ ] Run the focused test and confirm it passes.

### Task 3: Standard works manager and editors

**Files:**
- Modify: `src/app/admin/works/page.test.tsx`
- Modify: `src/app/admin/works/page.tsx`
- Modify: `src/app/admin/works/new/page.tsx`
- Modify: `src/app/admin/works/[id]/page.tsx`
- Modify: `src/app/admin/works/components/WorkForm.tsx`
- Modify: `src/app/admin/admin.css`

**Interfaces:**
- Keep the current `/api/works` request payloads and responses unchanged.
- Keep `WorkForm` props and save callbacks unchanged.

- [ ] Update the works test with a complete work fixture and require the standard title, table columns, status label and edit action.
- [ ] Run the focused test and confirm it fails against the archive list.
- [ ] Implement a normal page header, toolbar, white table card, responsive table and simple empty state.
- [ ] Restyle new/edit headings and the existing form using scoped admin CSS without changing form behavior.
- [ ] Run the focused test and confirm it passes.

### Task 4: Standard pending-module pages

**Files:**
- Modify: `src/components/admin/AdminRoutePlaceholder.test.tsx`
- Modify: `src/components/admin/AdminRoutePlaceholder.tsx`
- Modify: `src/app/admin/blog/page.tsx`
- Modify: `src/app/admin/media/page.tsx`
- Modify: `src/app/admin/settings/page.tsx`
- Modify: `src/app/admin/admin.css`

**Interfaces:**
- Keep each route server-renderable and preserve its existing title and description.

- [ ] Update the placeholder test to require a plain white empty-state card and assert decorative implementation-note copy is absent.
- [ ] Run the focused test and confirm it fails on the current poster-style component.
- [ ] Implement a standard page header, compact “即将开放” status and simple feature list.
- [ ] Run the focused test and confirm it passes.

### Task 5: Verification

**Files:**
- Verify all admin and test files changed above.

- [ ] Run `pnpm run test -- --run` and require all tests to pass.
- [ ] Run targeted ESLint on admin code and require zero warnings or errors.
- [ ] Run `pnpm build` with no development server sharing `.next` and require exit code 0.
- [ ] Run HTTP smoke checks for `/admin`, `/admin/works`, `/admin/blog` and `/`.
- [ ] Confirm `git log -1` is unchanged and report that no commit was created.
