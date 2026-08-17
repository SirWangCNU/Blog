import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Post } from "@/lib/content/types";
import { BlogIndex } from "./BlogIndex";

vi.mock("framer-motion", async () => {
  const React = await import("react");
  const motion = new Proxy({}, {
    get: (_target, tag: string) => {
      const MockMotion = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
        ({ children, ...props }, ref) => React.createElement(tag, { ...props, ref }, children),
      );
      MockMotion.displayName = `MockMotion(${tag})`;
      return MockMotion;
    },
  });
  return { motion, AnimatePresence: ({ children }: { children: React.ReactNode }) => children };
});

const posts: Post[] = [
  {
    id: 1,
    slug: "sqlite",
    title: "SQLite persistence",
    excerpt: "Database article",
    content: "Body",
    category: "Backend",
    tags: ["SQLite"],
    readTime: "2 分钟",
    status: "published",
    publishedAt: "2026-08-17T00:00:00.000Z",
    createdAt: "2026-08-17T00:00:00.000Z",
    updatedAt: "2026-08-17T00:00:00.000Z",
    date: "2026-08-17",
  },
  {
    id: 2,
    slug: "react",
    title: "React components",
    excerpt: "Frontend article",
    content: "Body",
    category: "Frontend",
    tags: ["React"],
    readTime: "3 分钟",
    status: "published",
    publishedAt: "2026-08-16T00:00:00.000Z",
    createdAt: "2026-08-16T00:00:00.000Z",
    updatedAt: "2026-08-16T00:00:00.000Z",
    date: "2026-08-16",
  },
];

describe("BlogIndex", () => {
  it("filters only the posts supplied by the server", () => {
    const { container } = render(<BlogIndex posts={posts} />);
    expect(container.querySelectorAll("article")).toHaveLength(2);

    fireEvent.change(screen.getByPlaceholderText("搜索文章..."), { target: { value: "SQLite" } });
    expect(container.querySelectorAll("article")).toHaveLength(1);
    expect(container.querySelector("article")).toHaveTextContent("SQLite persistence");
  });
});
