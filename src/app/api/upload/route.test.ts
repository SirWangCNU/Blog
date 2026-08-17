// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

const { requireApiAdmin } = vi.hoisted(() => ({ requireApiAdmin: vi.fn() }));
vi.mock("@/lib/auth/guard", () => ({ requireApiAdmin }));
vi.mock("@/lib/content/media", () => ({ saveMedia: vi.fn() }));

import { POST } from "./route";

describe("upload API authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireApiAdmin.mockResolvedValue(NextResponse.json({ error: "请先登录" }, { status: 401 }));
  });

  it("rejects anonymous uploads before reading multipart data", async () => {
    const request = new NextRequest("http://localhost/api/upload", { method: "POST" });
    expect((await POST(request)).status).toBe(401);
  });
});
