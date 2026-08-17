// @vitest-environment node

import { describe, expect, it } from "vitest";
import { safeAdminReturnPath } from "./guard";

describe("safeAdminReturnPath", () => {
  it("allows only local admin paths", () => {
    expect(safeAdminReturnPath("/admin/blog/1")).toBe("/admin/blog/1");
    expect(safeAdminReturnPath("https://evil.example/steal")).toBe("/admin");
    expect(safeAdminReturnPath("//evil.example/steal")).toBe("/admin");
    expect(safeAdminReturnPath("/blog")).toBe("/admin");
    expect(safeAdminReturnPath(undefined)).toBe("/admin");
  });
});
