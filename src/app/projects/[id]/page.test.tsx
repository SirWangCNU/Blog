import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Work } from "@/lib/works/types";

vi.mock("@/lib/works/store", () => ({
  getWork: vi.fn(),
  listWorks: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

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

import { getWork, listWorks } from "@/lib/works/store";
import ProjectPage from "./page";

const work: Work = {
  id: "测试",
  title: "Agent 工作台",
  summary: "用于编排智能体任务的全栈工作台。",
  cover: "/projects/dashboard.svg",
  tags: ["Next.js", "AI Agent"],
  category: "AI 应用",
  github: "",
  demo: "",
  doc: "",
  content: "## 设计目标\n\n让复杂任务更容易管理。",
  gallery: [],
  featured: true,
  status: "published",
  createdAt: "2026-08-01T00:00:00.000Z",
  updatedAt: "2026-08-20T00:00:00.000Z",
};

const relatedWork: Work = {
  ...work,
  id: "agent-monitor",
  title: "Agent 监控台",
  featured: false,
};

describe("ProjectPage", () => {
  beforeEach(() => {
    vi.mocked(getWork).mockReset();
    vi.mocked(listWorks).mockReset();
  });

  it("renders a published project with related work from the same category", async () => {
    vi.mocked(getWork).mockImplementation(async (id) => id === work.id ? work : null);
    vi.mocked(listWorks).mockResolvedValue([work, relatedWork]);

    render(await ProjectPage({ params: Promise.resolve({ id: encodeURIComponent(work.id) }) }));

    expect(screen.getByRole("heading", { level: 1, name: work.title })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: relatedWork.title })).toBeInTheDocument();
  });

  it("does not expose a draft through the public project route", async () => {
    vi.mocked(getWork).mockResolvedValue({ ...work, status: "draft" });

    await expect(
      ProjectPage({ params: Promise.resolve({ id: work.id }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
