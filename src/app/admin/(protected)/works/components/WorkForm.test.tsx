import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WorkForm } from "./WorkForm";

const savedWork = {
  id: "minimal-editor",
  title: "极简编辑器",
  summary: "开头 结尾",
  cover: "/uploads/works/architecture.png",
  tags: [],
  content: "开头\n\n![架构图](/uploads/works/architecture.png)\n\n结尾",
  gallery: [],
  featured: false,
  status: "draft" as const,
  createdAt: "2026-08-16T08:00:00.000Z",
  updatedAt: "2026-08-16T08:00:00.000Z",
};

describe("WorkForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows only the title and Markdown writing surface", () => {
    render(<WorkForm onSaved={vi.fn()} />);

    expect(screen.getByRole("textbox", { name: /作品标题/ })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "项目正文" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "插入图片" })).toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: /一句话简介/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: "分类" })).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: "技术栈标签" })).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: "GitHub" })).not.toBeInTheDocument();
    expect(screen.queryByText("作品封面")).not.toBeInTheDocument();
    expect(screen.queryByText("作品截图")).not.toBeInTheDocument();
  });

  it("uploads an image at the cursor and derives hidden save fields", async () => {
    const onSaved = vi.fn();
    const fetchMock = vi.fn(async (input: string | URL | Request, _init?: RequestInit) => {
      void _init;
      if (String(input) === "/api/upload") {
        return {
          json: async () => ({
            success: true,
            file: {
              name: "架构图.png",
              savedName: "architecture.png",
              size: 128,
              type: "image/png",
              url: "/uploads/works/architecture.png",
              uploadedAt: "2026-08-16T08:00:00.000Z",
            },
          }),
        };
      }

      return { json: async () => ({ success: true, work: savedWork }) };
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<WorkForm onSaved={onSaved} />);

    fireEvent.change(screen.getByRole("textbox", { name: /作品标题/ }), {
      target: { value: "极简编辑器" },
    });
    const editor = screen.getByRole("textbox", { name: "项目正文" }) as HTMLTextAreaElement;
    fireEvent.change(editor, { target: { value: "开头结尾" } });
    editor.setSelectionRange(2, 2);

    fireEvent.click(screen.getByRole("button", { name: "插入图片" }));
    fireEvent.change(screen.getByLabelText("选择正文图片"), {
      target: { files: [new File(["image"], "架构图.png", { type: "image/png" })] },
    });

    await waitFor(() => {
      expect(editor).toHaveValue("开头\n\n![架构图](/uploads/works/architecture.png)\n\n结尾");
    });

    fireEvent.click(screen.getByRole("button", { name: "保存草稿" }));

    await waitFor(() => expect(onSaved).toHaveBeenCalledWith(savedWork));
    const saveCall = fetchMock.mock.calls.find(([input]) => String(input) === "/api/works");
    expect(saveCall).toBeDefined();
    const payload = JSON.parse(String(saveCall?.[1]?.body));
    expect(payload).toMatchObject({
      title: "极简编辑器",
      summary: "开头 结尾",
      cover: "/uploads/works/architecture.png",
      status: "draft",
    });
  });
});
