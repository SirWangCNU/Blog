// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

const { requireApiAdmin } = vi.hoisted(() => ({ requireApiAdmin: vi.fn() }));
vi.mock("@/lib/auth/guard", () => ({ requireApiAdmin }));
vi.mock("@/lib/content/notes", () => ({
  listNotes: vi.fn(() => []),
  saveNote: vi.fn(),
  deleteNote: vi.fn(),
}));
vi.mock("@/lib/content/media", () => ({ listMedia: vi.fn(() => []), deleteMedia: vi.fn() }));

import { POST } from "./route";

describe("files API authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireApiAdmin.mockResolvedValue(NextResponse.json({ error: "请先登录" }, { status: 401 }));
  });

  it("rejects anonymous note writes before parsing content", async () => {
    const request = new NextRequest("http://localhost/api/files", {
      method: "POST",
      body: JSON.stringify({ title: "Note", content: "Body" }),
      headers: { "Content-Type": "application/json" },
    });
    expect((await POST(request)).status).toBe(401);
  });
});
