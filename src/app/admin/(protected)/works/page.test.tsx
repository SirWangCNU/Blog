import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminWorksPage from "./page";

describe("AdminWorksPage", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => ({
          works: [
            {
              id: "demo",
              title: "个人博客后台",
              summary: "用于管理个人博客内容",
              cover: "",
              tags: ["Next.js", "TypeScript"],
              category: "网站",
              content: "",
              featured: true,
              status: "published",
              createdAt: "2026-08-01T08:00:00.000Z",
              updatedAt: "2026-08-16T08:00:00.000Z",
            },
          ],
        }),
      })
    );
  });

  it("presents works in a standard management table", async () => {
    render(<AdminWorksPage />);

    expect(await screen.findByRole("heading", { name: "作品管理" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "新建作品" })).toHaveAttribute("href", "/admin/works/new");
    expect(await screen.findByRole("columnheader", { name: "作品名称" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "分类" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "状态" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "更新时间" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "操作" })).toBeInTheDocument();
    const workRow = screen.getByRole("row", { name: /个人博客后台/ });
    expect(within(workRow).getByText("已发布")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "编辑" })).toHaveAttribute("href", "/admin/works/demo");
  });
});
