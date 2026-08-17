import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdminShell } from "./AdminShell";

const usePathname = vi.fn();
const push = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => usePathname(),
  useRouter: () => ({ push, refresh: vi.fn() }),
}));

describe("AdminShell", () => {
  beforeEach(() => {
    usePathname.mockReturnValue("/admin");
    push.mockReset();
    vi.restoreAllMocks();
  });

  it("renders a standard admin shell without archive-style branding", () => {
    render(
      <AdminShell>
        <p>工作区内容</p>
      </AdminShell>
    );

    expect(screen.getByText("个人博客")).toBeInTheDocument();
    expect(screen.queryByText("内容档案室")).not.toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "后台主导航" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /总览/ }).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /查看公开站点/ })).toHaveAttribute("href", "/");
    expect(screen.getByText("工作区内容")).toBeInTheDocument();
  });

  it("allows the desktop sidebar to collapse", () => {
    render(<AdminShell>内容</AdminShell>);

    const sidebar = screen.getByRole("complementary", { name: "后台侧边栏" });
    fireEvent.click(screen.getByRole("button", { name: "折叠侧边栏" }));

    expect(sidebar).toHaveAttribute("data-collapsed", "true");
  });

  it("provides an accessible mobile navigation control", () => {
    render(<AdminShell>内容</AdminShell>);

    expect(screen.getByRole("button", { name: "打开后台导航" })).toBeInTheDocument();
  });
  it("logs the administrator out and returns to the login page", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: true })));
    render(<AdminShell>content</AdminShell>);

    fireEvent.click(screen.getByRole("button", { name: "退出登录" }));

    await vi.waitFor(() => expect(push).toHaveBeenCalledWith("/admin/login"));
  });
});
