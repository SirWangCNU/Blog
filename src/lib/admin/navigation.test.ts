import { describe, expect, it } from "vitest";
import { isAdminPathActive } from "./navigation";

describe("isAdminPathActive", () => {
  it("only marks the overview active on the exact admin path", () => {
    expect(isAdminPathActive("/admin", "/admin")).toBe(true);
    expect(isAdminPathActive("/admin/works", "/admin")).toBe(false);
  });

  it("keeps a section active on nested editor paths", () => {
    expect(isAdminPathActive("/admin/works/new", "/admin/works")).toBe(true);
    expect(isAdminPathActive("/admin/blog/example", "/admin/blog")).toBe(true);
    expect(isAdminPathActive("/admin/settings", "/admin/media")).toBe(false);
  });
});
