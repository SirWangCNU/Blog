// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

const { requireApiAdmin, saveWork, listWorks } = vi.hoisted(() => ({
  requireApiAdmin: vi.fn(),
  saveWork: vi.fn(),
  listWorks: vi.fn(),
}));

vi.mock("@/lib/auth/guard", () => ({ requireApiAdmin }));
vi.mock("@/lib/works/store", () => ({
  listWorks,
  getWork: vi.fn(),
  saveWork,
  deleteWork: vi.fn(),
}));

import { GET, POST } from "./route";

describe("works API authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireApiAdmin.mockResolvedValue(NextResponse.json({ error: "请先登录" }, { status: 401 }));
    saveWork.mockResolvedValue({ id: "work" });
    listWorks.mockResolvedValue([]);
  });

  it("rejects anonymous work mutations", async () => {
    const request = new NextRequest("http://localhost/api/works", {
      method: "POST",
      body: JSON.stringify({ title: "Work", summary: "Summary" }),
      headers: { "Content-Type": "application/json" },
    });
    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(saveWork).not.toHaveBeenCalled();
  });

  it("rejects anonymous draft list reads", async () => {
    const response = await GET(new NextRequest("http://localhost/api/works?includeDrafts=true"));
    expect(response.status).toBe(401);
    expect(listWorks).not.toHaveBeenCalled();
  });
});
