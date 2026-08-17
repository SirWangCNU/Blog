# Minimal Work Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the multi-field works form with a title-and-Markdown editor that uploads and inserts images at the cursor while deriving hidden metadata automatically.

**Architecture:** Keep `WorkInput` and the JSON storage/API contract unchanged. Move Markdown-to-summary and image insertion behavior into small pure helpers, then let `WorkForm` coordinate the existing upload API, editor state, preview, and save/publish actions.

**Tech Stack:** Next.js 16, React 19, TypeScript, React Markdown, Vitest, Testing Library.

## Global Constraints

- Do not add a rich-text editor or a new runtime dependency.
- Do not delete legacy metadata from existing works.
- Keep save-draft and publish behavior.
- Do not create a Git commit.

---

### Task 1: Markdown editor helpers

**Files:**
- Create: `src/lib/admin/work-editor.ts`
- Test: `src/lib/admin/work-editor.test.ts`

**Interfaces:**
- Produces: `deriveWorkSummary(markdown: string, fallback: string): string`
- Produces: `insertMarkdownImage(markdown: string, start: number, end: number, alt: string, url: string): { content: string; cursor: number }`

- [ ] Write failing tests with literal expected summaries and cursor positions.
- [ ] Run `pnpm run test -- --run src/lib/admin/work-editor.test.ts` and confirm the exports are missing.
- [ ] Implement Markdown stripping, whitespace normalization, 120-character truncation, fallback title, and cursor-aware image syntax insertion.
- [ ] Re-run the focused test and confirm it passes.

### Task 2: Minimal works form

**Files:**
- Modify: `src/app/admin/works/components/WorkForm.tsx`
- Create: `src/app/admin/works/components/WorkForm.test.tsx`
- Modify: `src/app/admin/admin.css`

**Interfaces:**
- Consumes: `deriveWorkSummary` and `insertMarkdownImage` from Task 1.
- Preserves: `WorkFormProps { initialWork?: Work | null; onSaved(work: Work): void }`.

- [ ] Write a failing component test that requires only “作品标题” and “项目正文”, rejects legacy visible fields, uploads a complete image response, inserts `![架构图](/uploads/works/architecture.png)` at the selection, and verifies the submitted payload contains derived `summary` and first-image `cover`.
- [ ] Run `pnpm run test -- --run src/app/admin/works/components/WorkForm.test.tsx` and confirm it fails against the old form.
- [ ] Replace the form body with a single-column editor card, hidden file input, insert-image button, Markdown textarea/preview, and draft/publish footer.
- [ ] Preserve hidden legacy values through the existing `form` state; generate summary only in the submission payload and set cover only when it is empty.
- [ ] Add scoped plain-admin styles for the editor toolbar, writing surface, preview, upload progress, and responsive footer.
- [ ] Re-run the focused component test and confirm it passes.

### Task 3: Regression verification

**Files:**
- Verify all files changed above plus existing admin tests.

- [ ] Run `pnpm run test -- --run` and require zero failures.
- [ ] Run `pnpm exec eslint src/app/admin src/components/admin src/components/SiteChrome.tsx src/lib/admin vitest.config.mts vitest.setup.ts` and require exit code 0.
- [ ] Run `pnpm build` and require exit code 0.
- [ ] Start the production server on an unused local port and require HTTP 200 for `/admin/works/new` and `/admin/works/demo` (the dynamic missing-work response may render its valid empty state).
- [ ] Run `git diff --check`, inspect `git status --short`, and confirm the latest Git commit remains unchanged.
