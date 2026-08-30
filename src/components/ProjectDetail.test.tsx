import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Work } from "@/lib/works/types";

vi.mock("framer-motion", async () => {
  const React = await import("react");
  const component = (tag: "article" | "aside" | "div" | "nav" | "section") => {
    const MockMotion = ({ children }: { children?: React.ReactNode }) =>
      React.createElement(tag, null, children);
    MockMotion.displayName = `MockMotion(${tag})`;
    return MockMotion;
  };

  return {
    motion: {
      article: component("article"),
      aside: component("aside"),
      div: component("div"),
      nav: component("nav"),
      section: component("section"),
    },
  };
});

const work: Work = {
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

describe("ProjectDetail", () => {
  it("renders a complete project case study with actions and gallery", async () => {
    const { ProjectDetail } = await import("./ProjectDetail");

    render(<ProjectDetail work={work} relatedWorks={[]} />);

    expect(screen.getByRole("heading", { level: 1, name: "Agent 工作台" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "设计目标" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "在线演示" })).toHaveAttribute("href", work.demo);
    expect(screen.getByRole("link", { name: "源代码" })).toHaveAttribute("href", work.github);
    expect(screen.getByRole("link", { name: "项目文档" })).toHaveAttribute("href", work.doc);
    expect(screen.getByRole("img", { name: "Agent 工作台 截图 1" })).toHaveAttribute(
      "src",
      work.gallery?.[0]
    );
  });

  it("keeps table-of-contents links aligned for formatted duplicate headings", async () => {
    const { ProjectDetail } = await import("./ProjectDetail");
    const formattedWork = {
      ...work,
      content: "## API `v2`\n\n第一部分。\n\n## API `v2`\n\n第二部分。",
    };

    render(<ProjectDetail work={formattedWork} relatedWorks={[]} />);

    const headings = screen.getAllByRole("heading", { level: 2, name: "API v2" });
    const tocLinks = screen.getAllByRole("link", { name: "API v2" });

    expect(headings.map((heading) => heading.id)).toEqual(["api-v2", "api-v2-2"]);
    expect(tocLinks.map((link) => link.getAttribute("href"))).toEqual(["#api-v2", "#api-v2-2"]);
  });

  it("renders shields badges as a compact tech stack while preserving content images", async () => {
    const { ProjectDetail } = await import("./ProjectDetail");
    const markdownWork = {
      ...work,
      content: [
        "## 技术栈",
        "",
        "![Python](https://img.shields.io/badge/Python-3.11%2B-3776AB?logo=python)",
        "![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi)",
        "",
        "![系统架构图](https://example.com/architecture.png)",
      ].join("\n"),
    };

    render(<ProjectDetail work={markdownWork} relatedWorks={[]} />);

    const techStack = screen.getByRole("list", { name: "技术栈" });
    expect(techStack).toHaveTextContent("Python 3.11+");
    expect(techStack).toHaveTextContent("FastAPI Backend");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("img", { name: "系统架构图" })).toHaveAttribute(
      "src",
      "https://example.com/architecture.png",
    );
    expect(screen.queryByRole("img", { name: "Python 3.11+" })).not.toBeInTheDocument();
  });
});
