import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { AdminDashboardData } from "@/lib/admin/dashboard";
import { AdminDashboard } from "./AdminDashboard";

const data: AdminDashboardData = {
  stats: {
    worksTotal: 2,
    worksPublished: 1,
    worksDrafts: 1,
    postsTotal: 7,
  },
  recentWorks: [
    {
      id: "archive-site",
      title: "个人档案站",
      summary: "正在整理中的网站作品",
      status: "draft",
      updatedAt: "2026-08-16T08:00:00.000Z",
      editHref: "/admin/works/archive-site",
    },
  ],
  recentPosts: [
    {
      slug: "design-notes",
      title: "设计札记",
      category: "前端",
      date: "2026-08-15",
      publicHref: "/blog/design-notes",
    },
  ],
};

describe("AdminDashboard", () => {
  it("renders real content totals and useful content routes", () => {
    render(<AdminDashboard data={data} />);

    expect(screen.getByRole("heading", { name: "控制台" })).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "新建作品" })).toHaveAttribute("href", "/admin/works/new");
    expect(screen.getByRole("link", { name: "编辑" })).toHaveAttribute("href", "/admin/works/archive-site");
    expect(screen.getByText("个人档案站")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /设计札记/ })).toHaveAttribute("href", "/blog/design-notes");
    expect(screen.getByRole("columnheader", { name: "作品名称" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "状态" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "更新时间" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "操作" })).toBeInTheDocument();
    expect(screen.getByText("后台登录尚未启用")).toBeInTheDocument();
    expect(screen.queryByText("接入次序")).not.toBeInTheDocument();
  });

  it("shows honest empty states instead of placeholder chart data", () => {
    render(
      <AdminDashboard
        data={{
          stats: { worksTotal: 0, worksPublished: 0, worksDrafts: 0, postsTotal: 0 },
          recentWorks: [],
          recentPosts: [],
        }}
      />
    );

    expect(screen.getByText("还没有作品记录")).toBeInTheDocument();
    expect(screen.getByText("还没有博客文章")).toBeInTheDocument();
  });
});
