import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "./LoginForm";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push, refresh: vi.fn() }) }));

describe("LoginForm", () => {
  beforeEach(() => {
    push.mockReset();
    vi.restoreAllMocks();
  });

  it("submits credentials and navigates to the safe destination", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      success: true,
      redirectTo: "/admin/blog",
    }), { status: 200, headers: { "Content-Type": "application/json" } }));
    render(<LoginForm returnTo="/admin/blog" />);

    fireEvent.change(screen.getByLabelText("管理员账号"), { target: { value: "owner" } });
    fireEvent.change(screen.getByLabelText("密码"), { target: { value: "a-secure-password-123" } });
    fireEvent.click(screen.getByRole("button", { name: "登录管理台" }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/admin/blog"));
  });

  it("shows the generic server error without exposing account state", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      error: "账号或密码错误",
    }), { status: 401, headers: { "Content-Type": "application/json" } }));
    render(<LoginForm returnTo="/admin" />);

    fireEvent.change(screen.getByLabelText("管理员账号"), { target: { value: "owner" } });
    fireEvent.change(screen.getByLabelText("密码"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: "登录管理台" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("账号或密码错误");
  });
});
