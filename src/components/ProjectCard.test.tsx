import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Work } from "@/lib/works/types";

vi.mock("framer-motion", async () => {
  const React = await import("react");
  const component = (tag: "article" | "div") => {
    const MockMotion = ({ children }: { children?: React.ReactNode }) =>
      React.createElement(tag, null, children);
    MockMotion.displayName = `MockMotion(${tag})`;
    return MockMotion;
  };

  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    motion: {
      article: component("article"),
      div: component("div"),
    },
  };
});

import { ProjectCard } from "./ProjectCard";

const project: Work = {
  id: "agent-workbench",
  title: "Agent 工作台",
  summary: "用于编排智能体任务的全栈工作台。",
  cover: "/projects/dashboard.svg",
  tags: ["Next.js", "AI Agent"],
  category: "AI 应用",
  github: "https://github.com/example/agent-workbench",
  demo: "https://example.com/demo",
  doc: "https://example.com/docs",
  content: "## 设计目标\n\n让复杂任务更容易管理。",
  gallery: ["/projects/dashboard.svg"],
  featured: true,
  status: "published",
  createdAt: "2026-08-01T00:00:00.000Z",
  updatedAt: "2026-08-20T00:00:00.000Z",
};

describe("ProjectCard", () => {
  it("opens the project through its dedicated detail-page link", () => {
    render(<ProjectCard project={project} index={0} />);

    const detailLink = screen.getByRole("link", { name: "查看 Agent 工作台 详情" });

    expect(detailLink).toHaveAttribute("href", "/projects/agent-workbench");
    expect(detailLink).toHaveTextContent("查看案例");
  });
});
