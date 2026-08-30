import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Work } from "@/lib/works/types";
import { ProjectIndex } from "./ProjectIndex";

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

const works: Work[] = [
  {
    id: "agent-console",
    title: "Agent Console",
    summary: "面向智能体开发的全栈控制台",
    cover: "",
    tags: ["Next.js", "AI"],
    category: "AI 应用",
    content: "Project body",
    featured: true,
    status: "published",
    createdAt: "2026-08-17T00:00:00.000Z",
    updatedAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: "design-system",
    title: "Design System",
    summary: "统一产品体验的组件与设计规范",
    cover: "",
    tags: ["React", "Storybook"],
    category: "前端",
    content: "Project body",
    featured: false,
    status: "published",
    createdAt: "2026-08-15T00:00:00.000Z",
    updatedAt: "2026-08-16T00:00:00.000Z",
  },
];

describe("ProjectIndex", () => {
  it("uses the blog-style index layout and filters supplied works", () => {
    const { container } = render(<ProjectIndex works={works} />);

    expect(screen.getByRole("searchbox", { name: "搜索作品" })).toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: "作品信息" })).toHaveTextContent("2");
    expect(container.querySelectorAll("article")).toHaveLength(2);

    fireEvent.change(screen.getByRole("searchbox", { name: "搜索作品" }), {
      target: { value: "Storybook" },
    });
    expect(container.querySelectorAll("article")).toHaveLength(1);
    expect(container.querySelector("article")).toHaveTextContent("Design System");

    fireEvent.change(screen.getByRole("searchbox", { name: "搜索作品" }), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: "筛选分类：AI 应用" }));
    expect(container.querySelectorAll("article")).toHaveLength(1);
    expect(container.querySelector("article")).toHaveTextContent("Agent Console");
  });
});
