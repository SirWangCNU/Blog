import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PostForm } from "./PostForm";

describe("PostForm", () => {
  it("saves a Markdown article as a draft", async () => {
    const onSaved = vi.fn();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      success: true,
      post: { id: 1, slug: "new-post", status: "draft" },
    }), { status: 200, headers: { "Content-Type": "application/json" } }));
    render(<PostForm onSaved={onSaved} />);

    fireEvent.change(screen.getByLabelText("文章标题"), { target: { value: "New post" } });
    fireEvent.change(screen.getByLabelText("Markdown 正文"), { target: { value: "## Body" } });
    fireEvent.click(screen.getByRole("button", { name: "保存草稿" }));

    await waitFor(() => expect(onSaved).toHaveBeenCalled());
    expect(fetch).toHaveBeenCalledWith("/api/admin/posts", expect.objectContaining({
      method: "POST",
      body: expect.stringContaining('"status":"draft"'),
    }));
  });

  it("publishes an article explicitly", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      success: true,
      post: { id: 1, slug: "post", status: "published" },
    }), { status: 200, headers: { "Content-Type": "application/json" } }));
    render(<PostForm onSaved={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("文章标题"), { target: { value: "Post" } });
    fireEvent.change(screen.getByLabelText("Markdown 正文"), { target: { value: "Body" } });
    fireEvent.click(screen.getByRole("button", { name: "发布文章" }));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith("/api/admin/posts", expect.objectContaining({
      body: expect.stringContaining('"status":"published"'),
    })));
  });
});
