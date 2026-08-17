"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Post, PostInput } from "@/lib/content/types";

interface PostFormProps {
  initialPost?: Post | null;
  onSaved: (post: Post) => void;
}

const EMPTY_POST: PostInput = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  tags: [],
  readTime: "",
  status: "draft",
};

export function PostForm({ initialPost, onSaved }: PostFormProps) {
  const [form, setForm] = useState<PostInput>(() => initialPost ? { ...initialPost } : { ...EMPTY_POST, tags: [] });
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const editor = useRef<HTMLTextAreaElement>(null);

  const update = <K extends keyof PostInput>(key: K, value: PostInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("folder", "posts");
      const response = await fetch("/api/upload", { method: "POST", body: data });
      const result = await response.json() as { success?: boolean; error?: string; file?: { url: string } };
      if (!response.ok || !result.success || !result.file) throw new Error(result.error || "图片上传失败");
      const markdown = `![${file.name.replace(/\.[^.]+$/, "")}](${result.file.url})`;
      const start = editor.current?.selectionStart ?? form.content.length;
      const next = `${form.content.slice(0, start)}${markdown}${form.content.slice(start)}`;
      update("content", next);
      setMessage({ type: "success", text: "图片已插入正文" });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "图片上传失败" });
    } finally {
      setUploading(false);
    }
  };

  const save = async (status: Post["status"]) => {
    if (!form.title.trim() || !form.content.trim()) {
      setMessage({ type: "error", text: "请填写文章标题和正文" });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: initialPost?.id, status }),
      });
      const data = await response.json() as { success?: boolean; post?: Post; error?: string };
      if (!response.ok || !data.success || !data.post) throw new Error(data.error || "保存失败");
      setForm((current) => ({ ...current, status }));
      setMessage({ type: "success", text: status === "published" ? "文章已发布" : "草稿已保存" });
      onSaved(data.post);
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "保存失败" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-minimal-editor-v2">
      {message && <div className="admin-form-message-v2" data-type={message.type} role="status">{message.text}</div>}
      <section className="admin-card-v2 admin-post-meta-v2" aria-label="文章信息">
        <div className="admin-post-fields-v2">
          <label>
            <span>文章标题</span>
            <input value={form.title} onChange={(event) => update("title", event.target.value)} />
          </label>
          <label>
            <span>文章链接（slug）</span>
            <input value={form.slug || ""} onChange={(event) => update("slug", event.target.value)} placeholder="留空时根据标题生成" />
          </label>
          <label>
            <span>分类</span>
            <input value={form.category} onChange={(event) => update("category", event.target.value)} />
          </label>
          <label>
            <span>标签</span>
            <input value={form.tags.join(", ")} onChange={(event) => update("tags", event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean))} placeholder="多个标签用逗号分隔" />
          </label>
          <label>
            <span>阅读时长</span>
            <input value={form.readTime} onChange={(event) => update("readTime", event.target.value)} placeholder="例如：5 分钟" />
          </label>
          <label className="admin-post-excerpt-v2">
            <span>摘要</span>
            <textarea value={form.excerpt} onChange={(event) => update("excerpt", event.target.value)} rows={3} placeholder="留空时从正文自动生成" />
          </label>
        </div>
      </section>

      <section className="admin-card-v2 admin-writing-card-v2" aria-label="文章编辑器">
        <div className="admin-writing-toolbar-v2">
          <strong>Markdown 正文</strong>
          <div className="admin-writing-tools-v2">
            <button type="button" onClick={() => setPreview((value) => !value)}>{preview ? "继续编辑" : "预览"}</button>
            <button type="button" onClick={() => imageInput.current?.click()} disabled={uploading}>{uploading ? "上传中…" : "插入图片"}</button>
            <input ref={imageInput} type="file" accept="image/*" hidden onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void uploadImage(file);
              event.target.value = "";
            }} />
          </div>
        </div>
        {preview ? (
          <div className="admin-writing-preview-v2"><ReactMarkdown>{form.content || "暂无正文"}</ReactMarkdown></div>
        ) : (
          <textarea
            ref={editor}
            aria-label="Markdown 正文"
            value={form.content}
            onChange={(event) => update("content", event.target.value)}
            rows={24}
            className="admin-post-content-v2"
          />
        )}
      </section>

      <div className="admin-form-actions-v2 admin-writing-actions-v2">
        <button type="button" className="admin-v2-button" disabled={saving} onClick={() => void save("draft")}>保存草稿</button>
        <button type="button" className="admin-v2-button admin-v2-button-primary" disabled={saving} onClick={() => void save("published")}>发布文章</button>
      </div>
    </div>
  );
}
