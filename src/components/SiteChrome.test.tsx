import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SiteChrome } from "./SiteChrome";

const usePathname = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => usePathname(),
}));

vi.mock("@/components/AnimeBackground", () => ({
  AnimeBackground: () => <div data-testid="public-background" />,
}));

vi.mock("@/components/Header", () => ({
  Header: () => <header>公开导航</header>,
}));

vi.mock("@/components/Footer", () => ({
  Footer: () => <footer>公开页脚</footer>,
}));

describe("SiteChrome", () => {
  beforeEach(() => usePathname.mockReset());

  it("removes public decoration from admin routes", () => {
    usePathname.mockReturnValue("/admin/works");
    render(<SiteChrome>后台内容</SiteChrome>);

    expect(screen.getByText("后台内容")).toBeInTheDocument();
    expect(screen.queryByText("公开导航")).not.toBeInTheDocument();
    expect(screen.queryByText("公开页脚")).not.toBeInTheDocument();
    expect(screen.queryByTestId("public-background")).not.toBeInTheDocument();
  });

  it("keeps the existing chrome on public routes", () => {
    usePathname.mockReturnValue("/blog");
    render(<SiteChrome>公开内容</SiteChrome>);

    expect(screen.getByText("公开导航")).toBeInTheDocument();
    expect(screen.getByText("公开页脚")).toBeInTheDocument();
    expect(screen.getByTestId("public-background")).toBeInTheDocument();
  });
});
