// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  requireApiAdmin: vi.fn(),
  savePost: vi.fn(),
  listPosts: vi.fn(),
  getPostById: vi.fn(),
  deletePost: vi.fn(),
}));

vi.mock("@/lib/auth/guard", () => ({ requireApiAdmin: mocks.requireApiAdmin }));
vi.mock("@/lib/content/posts", () => ({
  savePost: mocks.savePost,
  listPosts: mocks.listPosts,
  getPostById: mocks.getPostById,
  deletePost: mocks.deletePost,
}));

import { POST } from "./route";

describe("admin posts API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireApiAdmin.mockResolvedValue({ id: 1, username: "owner" });
    mocks.savePost.mockReturnValue({ id: 1, slug: "post", status: "draft" });
  });

  it("validates title and content before saving", async () => {
    const response = await POST(new NextRequest("http://localhost/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "", content: "", status: "draft" }),
    }));
    expect(response.status).toBe(400);
    expect(mocks.savePost).not.toHaveBeenCalled();
  });

  it("normalizes a valid draft payload", async () => {
    const response = await POST(new NextRequest("http://localhost/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: " New post ", content: "Body", excerpt: "Excerpt", category: "Notes",
        tags: ["Next.js", 1], readTime: "2 分钟", status: "draft",
      }),
    }));
    expect(response.status).toBe(200);
    expect(mocks.savePost).toHaveBeenCalledWith(expect.objectContaining({
      title: "New post", tags: ["Next.js"], status: "draft",
    }));
  });
});
