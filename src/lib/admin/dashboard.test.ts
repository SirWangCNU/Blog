import { describe, expect, it } from "vitest";
import type { Post } from "@/lib/content/types";
import type { Work } from "@/lib/works/types";
import { buildAdminDashboard } from "./dashboard";

const works: Work[] = [
  {
    id: "new-draft",
    title: "新版作品",
    summary: "尚未发布",
    cover: "",
    tags: ["Next.js"],
    content: "",
    featured: false,
    status: "draft",
    createdAt: "2026-08-15T08:00:00.000Z",
    updatedAt: "2026-08-16T08:00:00.000Z",
  },
  {
    id: "published-work",
    title: "已发布作品",
    summary: "线上可见",
    cover: "",
    tags: [],
    content: "",
    featured: true,
    status: "published",
    createdAt: "2026-08-14T08:00:00.000Z",
    updatedAt: "2026-08-15T08:00:00.000Z",
  },
];

const posts: Post[] = [
  {
    id: 1,
    slug: "latest-post",
    title: "最新文章",
    excerpt: "摘要",
    date: "2026-08-16",
    readTime: "5 分钟",
    tags: ["设计"],
    category: "前端",
    content: "正文",
    status: "published",
    publishedAt: "2026-08-16T00:00:00.000Z",
    createdAt: "2026-08-16T00:00:00.000Z",
    updatedAt: "2026-08-16T00:00:00.000Z",
  },
  {
    id: 2,
    slug: "older-post",
    title: "较早文章",
    excerpt: "摘要",
    date: "2026-08-14",
    readTime: "3 分钟",
    tags: [],
    category: "后端",
    content: "正文",
    status: "published",
    publishedAt: "2026-08-14T00:00:00.000Z",
    createdAt: "2026-08-14T00:00:00.000Z",
    updatedAt: "2026-08-14T00:00:00.000Z",
  },
];

describe("buildAdminDashboard", () => {
  it("summarizes published and draft content without inventing data", () => {
    const result = buildAdminDashboard(works, posts);

    expect(result.stats).toEqual({
      worksTotal: 2,
      worksPublished: 1,
      worksDrafts: 1,
      postsTotal: 2,
    });
  });

  it("returns newest content first with stable admin and public links", () => {
    const result = buildAdminDashboard(works, posts);

    expect(result.recentWorks[0]).toMatchObject({
      title: "新版作品",
      editHref: "/admin/works/new-draft",
    });
    expect(result.recentPosts[0]).toMatchObject({
      title: "最新文章",
      publicHref: "/blog/latest-post",
    });
  });
});
