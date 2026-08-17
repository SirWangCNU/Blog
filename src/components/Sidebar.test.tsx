import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Post } from "@/lib/content/types";
import { Sidebar } from "./Sidebar";

const post: Post = {
  id: 1,
  slug: "server-post",
  title: "Server supplied post",
  excerpt: "Excerpt",
  content: "Body",
  category: "Backend",
  tags: ["SQLite"],
  readTime: "1 分钟",
  status: "published",
  publishedAt: "2026-08-17T00:00:00.000Z",
  createdAt: "2026-08-17T00:00:00.000Z",
  updatedAt: "2026-08-17T00:00:00.000Z",
  date: "2026-08-17",
};

describe("Sidebar", () => {
  it("derives recent content and statistics from props", () => {
    render(<Sidebar posts={[post]} />);
    expect(screen.getByText("Server supplied post")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
  });
});
