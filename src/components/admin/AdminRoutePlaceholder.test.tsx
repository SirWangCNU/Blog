import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdminRoutePlaceholder } from "./AdminRoutePlaceholder";

describe("AdminRoutePlaceholder", () => {
  it("states the module status and next step without fake controls", () => {
    render(
      <AdminRoutePlaceholder
        title="博客管理"
        description="统一管理文章。"
        nextStep="接入 SQLite 后开放编辑。"
      />
    );

    expect(screen.getByRole("heading", { name: "博客管理" })).toBeInTheDocument();
    expect(screen.getByText("即将开放")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "功能规划" })).toBeInTheDocument();
    expect(screen.getByText("接入 SQLite 后开放编辑。" )).toBeInTheDocument();
    expect(screen.queryByText("IMPLEMENTATION NOTE")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
