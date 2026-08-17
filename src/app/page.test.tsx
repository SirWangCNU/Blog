import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/content/posts", () => ({ listPosts: vi.fn(() => []) }));
vi.mock("@/lib/works/store", () => ({ listWorks: vi.fn(async () => []) }));
vi.mock("@/components/MotionPrimitives", async () => {
  const React = await import("react");
  const component = (tag: string) => {
    const MockMotion = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) =>
      React.createElement(tag, props, children);
    MockMotion.displayName = `MockMotion(${tag})`;
    return MockMotion;
  };
  return {
    MotionArticle: component("article"),
    MotionDiv: component("div"),
    MotionH1: component("h1"),
    MotionH2: component("h2"),
    ScrollPrompt: () => null,
  };
});
vi.mock("@/components/Sidebar", () => ({ Sidebar: () => null }));

import Home from "./page";

describe("Home", () => {
  it("offers a small entry to the administration console", async () => {
    render(await Home());
    expect(screen.getByRole("link", { name: "后台管理" })).toHaveAttribute("href", "/admin");
  });
});
