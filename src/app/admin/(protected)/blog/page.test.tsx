import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminBlogPage from "./page";

describe("AdminBlogPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ posts: [{
      id: 1,
      slug: "sqlite",
      title: "SQLite article",
      excerpt: "Excerpt",
      category: "Backend",
      tags: [],
      status: "published",
      updatedAt: "2026-08-17T00:00:00.000Z",
    }] }), { status: 200, headers: { "Content-Type": "application/json" } }));
  });

  it("loads articles and exposes the new-post action", async () => {
    render(<AdminBlogPage />);
    expect(await screen.findByText("SQLite article")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "新建文章" })).toHaveAttribute("href", "/admin/blog/new");
  });
});
