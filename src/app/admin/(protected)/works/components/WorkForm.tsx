"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { deriveWorkSummary, insertMarkdownImage } from "@/lib/admin/work-editor";
import type { Work, WorkInput } from "@/lib/works/types";

interface WorkFormProps {
  initialWork?: Work | null;
  onSaved: (work: Work) => void;
}

const DEFAULT_WORK: WorkInput = {
  title: "",
  summary: "",
  cover: "",
  tags: [],
  category: "",
  github: "",
  demo: "",
  doc: "",
  content: "",
  gallery: [],
  featured: false,
  status: "draft",
};

export function WorkForm({ initialWork, onSaved }: WorkFormProps) {
  const [form, setForm] = useState<WorkInput>(() =>
    initialWork
      ? { ...DEFAULT_WORK, ...initialWork }
      : { ...DEFAULT_WORK, tags: [], gallery: [] }
  );
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [preview, setPreview] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const selectionRef = useRef({ start: 0, end: 0 });

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const updateField = <K extends keyof WorkInput>(key: K, value: WorkInput[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const openImagePicker = () => {
    const editor = editorRef.current;
    selectionRef.current = editor
      ? { start: editor.selectionStart, end: editor.selectionEnd }
      : { start: form.content.length, end: form.content.length };
    imageInputRef.current?.click();
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    setPreview(false);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", "works");
      const response = await fetch("/api/upload", { method: "POST", body: uploadData });
      const data = await response.json();

      if (!data.success) {
        setMessage({ type: "error", text: data.error || "图片上传失败" });
        return;
      }

      const alt = file.name.replace(/\.[^.]+$/, "");
      const insertion = insertMarkdownImage(
        form.content,
        selectionRef.current.start,
        selectionRef.current.end,
        alt,
        data.file.url
      );

      setForm((previous) => ({
        ...previous,
        content: insertion.content,
        cover: previous.cover || data.file.url,
      }));
      setMessage({ type: "success", text: "图片已插入正文" });

      window.setTimeout(() => {
        editorRef.current?.focus();
        editorRef.current?.setSelectionRange(insertion.cursor, insertion.cursor);
      }, 0);
    } catch {
      setMessage({ type: "error", text: "图片上传失败" });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (publish: boolean) => {
    const title = form.title.trim();
    if (!title) {
      setMessage({ type: "error", text: "请填写作品标题" });
      return;
    }

    setSaving(true);
    try {
      const payload: WorkInput = {
        ...form,
        id: initialWork?.id,
        title,
        summary: deriveWorkSummary(form.content, title),
        status: publish ? "published" : "draft",
      };
      const response = await fetch("/api/works", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!data.success) {
        setMessage({ type: "error", text: data.error || "保存失败" });
        return;
      }

      setForm((previous) => ({ ...previous, status: payload.status, summary: payload.summary }));
      setMessage({ type: "success", text: publish ? "作品已发布" : "草稿已保存" });
      onSaved(data.work);
    } catch {
      setMessage({ type: "error", text: "保存失败" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-minimal-editor-v2">
      {message && (
        <div className="admin-form-message-v2" data-type={message.type} role="status" aria-live="polite">
          {message.text}
        </div>
      )}

      <section className="admin-card-v2 admin-writing-card-v2" aria-label="作品编辑器">
        <div className="admin-writing-title-v2">
          <label htmlFor="work-title">作品标题</label>
          <input
            id="work-title"
            type="text"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="输入作品标题"
            autoComplete="off"
          />
        </div>

        <div className="admin-writing-editor-v2">
          <div className="admin-writing-toolbar-v2">
            <div>
              <label htmlFor="work-content">项目正文</label>
              <span>支持 Markdown</span>
            </div>
            <div className="admin-writing-tools-v2">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                aria-label="选择正文图片"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleImageUpload(file);
                  event.target.value = "";
                }}
              />
              <button type="button" onClick={openImagePicker} disabled={uploadingImage}>
                <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 5h16v14H4V5Zm0 11 4-4 3 3 2-2 7 6M15 9h.01" /></svg>
                {uploadingImage ? "上传中…" : "插入图片"}
              </button>
              <span className="admin-writing-divider-v2" aria-hidden="true" />
              <button
                type="button"
                data-active={!preview}
                aria-pressed={!preview}
                onClick={() => setPreview(false)}
              >
                编辑
              </button>
              <button
                type="button"
                data-active={preview}
                aria-pressed={preview}
                onClick={() => setPreview(true)}
              >
                预览
              </button>
            </div>
          </div>

          {preview ? (
            <div className="admin-writing-preview-v2">
              {form.content.trim() ? <ReactMarkdown>{form.content}</ReactMarkdown> : <p>还没有正文内容。</p>}
            </div>
          ) : (
            <textarea
              ref={editorRef}
              id="work-content"
              value={form.content}
              onChange={(event) => updateField("content", event.target.value)}
              placeholder="开始写作品介绍。可以使用标题、列表、代码块，也可以在任意位置插入图片……"
              spellCheck={false}
            />
          )}
        </div>
      </section>

      <div className="admin-form-actions-v2 admin-writing-actions-v2">
        <span>{initialWork ? `上次状态：${initialWork.status === "published" ? "已发布" : "草稿"}` : "新作品将先保存为草稿"}</span>
        <div>
          <button type="button" onClick={() => handleSubmit(false)} disabled={saving || uploadingImage}>
            {saving ? "保存中…" : "保存草稿"}
          </button>
          <button type="button" onClick={() => handleSubmit(true)} disabled={saving || uploadingImage}>
            {saving ? "发布中…" : "立即发布"}
          </button>
        </div>
      </div>
    </div>
  );
}
