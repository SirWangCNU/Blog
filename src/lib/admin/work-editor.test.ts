import { describe, expect, it } from "vitest";
import { deriveWorkSummary, insertMarkdownImage } from "./work-editor";

describe("deriveWorkSummary", () => {
  it("turns Markdown into a compact plain-text summary", () => {
    expect(
      deriveWorkSummary(
        "## 项目背景\n\n这是一个 **个人博客**，支持 [公开访问](/)。\n\n![界面](/demo.png)",
        "备用标题"
      )
    ).toBe("项目背景 这是一个 个人博客，支持 公开访问。");
  });

  it("falls back to the title when the body has no readable text", () => {
    expect(deriveWorkSummary("![界面](/demo.png)", "个人博客后台")).toBe("个人博客后台");
  });
});

describe("insertMarkdownImage", () => {
  it("inserts an image block at the cursor and returns the next cursor position", () => {
    expect(insertMarkdownImage("开头结尾", 2, 2, "架构图", "/uploads/works/architecture.png")).toEqual({
      content: "开头\n\n![架构图](/uploads/works/architecture.png)\n\n结尾",
      cursor: 43,
    });
  });
});
