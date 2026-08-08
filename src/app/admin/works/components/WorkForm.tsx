"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
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
  const [form, setForm] = useState<WorkInput>(DEFAULT_WORK);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (initialWork) {
      setForm({
        ...DEFAULT_WORK,
        ...initialWork,
      });
    }
  }, [initialWork]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const updateField = <K extends keyof WorkInput>(key: K, value: WorkInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpload = useCallback(
    async (file: File, type: "cover" | "gallery") => {
      const setter = type === "cover" ? setUploadingCover : setUploadingGallery;
      setter(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "works");
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.success) {
          if (type === "cover") {
            updateField("cover", data.file.url);
          } else {
            updateField("gallery", [...(form.gallery || []), data.file.url]);
          }
          setMessage({ type: "success", text: "图片上传成功" });
        } else {
          setMessage({ type: "error", text: data.error || "上传失败" });
        }
      } catch {
        setMessage({ type: "error", text: "上传失败" });
      } finally {
        setter(false);
      }
    },
    [form.gallery]
  );

  const handleAddTag = () => {
    const value = tagInput.trim();
    if (!value) return;
    if (form.tags.includes(value)) {
      setTagInput("");
      return;
    }
    updateField("tags", [...form.tags, value]);
    setTagInput("");
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (tag: string) => {
    updateField("tags", form.tags.filter((t) => t !== tag));
  };

  const removeGalleryImage = (url: string) => {
    updateField("gallery", (form.gallery || []).filter((u) => u !== url));
  };

  const handleSubmit = async (publish = false) => {
    if (!form.title.trim() || !form.summary.trim()) {
      setMessage({ type: "error", text: "标题和简介不能为空" });
      return;
    }

    setSaving(true);
    try {
      const payload: WorkInput = {
        ...form,
        id: initialWork?.id,
        status: publish ? "published" : form.status,
      };
      const res = await fetch("/api/works", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: publish ? "已发布" : "已保存" });
        onSaved(data.work);
      } else {
        setMessage({ type: "error", text: data.error || "保存失败" });
      }
    } catch {
      setMessage({ type: "error", text: "保存失败" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-lg text-sm font-mono border ${
            message.type === "success"
              ? "bg-primary/10 text-primary border-primary/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          {message.type === "success" ? "✓ " : "✗ "}
          {message.text}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：基本信息 */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">作品标题 *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
              placeholder="例如：青禾映画 - 农业短视频生成智能体"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">一句话简介 *</label>
            <textarea
              value={form.summary}
              onChange={(e) => updateField("summary", e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary text-foreground resize-none"
              placeholder="列表页展示的简短描述"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">分类</label>
            <input
              type="text"
              value={form.category || ""}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
              placeholder="例如：AI Agent / 全栈开发"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">技术栈标签</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                >
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-foreground">×</button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
              placeholder="输入标签后按回车添加"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">GitHub</label>
              <input
                type="url"
                value={form.github || ""}
                onChange={(e) => updateField("github", e.target.value)}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Live Demo</label>
              <input
                type="url"
                value={form.demo || ""}
                onChange={(e) => updateField("demo", e.target.value)}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">文档</label>
              <input
                type="url"
                value={form.doc || ""}
                onChange={(e) => updateField("doc", e.target.value)}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField("featured", e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              精选作品
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <span>状态：</span>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value as "draft" | "published")}
                className="bg-card border border-border rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-primary"
              >
                <option value="draft">草稿</option>
                <option value="published">已发布</option>
              </select>
            </label>
          </div>
        </div>

        {/* 右侧：封面 + 图库 */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">作品封面</label>
            <div
              className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/60 transition-colors cursor-pointer"
              onClick={() => document.getElementById("cover-input")?.click()}
            >
              <input
                id="cover-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file, "cover");
                  e.target.value = "";
                }}
              />
              {form.cover ? (
                <img
                  src={form.cover}
                  alt="cover"
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : uploadingCover ? (
                <div className="flex items-center justify-center h-48">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-foreground-secondary">
                  <span className="text-3xl mb-2">🖼️</span>
                  <span className="text-sm">点击上传封面</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">作品截图</label>
            <div className="grid grid-cols-3 gap-3">
              {(form.gallery || []).map((url) => (
                <div key={url} className="relative group aspect-video">
                  <img src={url} alt="" className="w-full h-full object-cover rounded-lg" />
                  <button
                    onClick={() => removeGalleryImage(url)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
              <div
                className="aspect-video border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-foreground-secondary hover:border-primary/60 cursor-pointer transition-colors"
                onClick={() => document.getElementById("gallery-input")?.click()}
              >
                <input
                  id="gallery-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file, "gallery");
                    e.target.value = "";
                  }}
                />
                {uploadingGallery ? (
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="text-xl">+</span>
                    <span className="text-xs mt-1">上传</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Markdown 编辑器 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-foreground">项目详情（Markdown）</label>
          <button
            onClick={() => setPreview(!preview)}
            className="text-sm text-primary hover:text-primary-hover"
          >
            {preview ? "编辑" : "预览"}
          </button>
        </div>
        {preview ? (
          <div className="min-h-[300px] max-h-[500px] overflow-y-auto p-4 bg-card border border-border rounded-lg prose prose-invert max-w-none">
            <ReactMarkdown>{form.content || "暂无内容"}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={form.content}
            onChange={(e) => updateField("content", e.target.value)}
            rows={16}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:border-primary text-foreground font-mono text-sm resize-y"
            placeholder="用 Markdown 编写项目详情..."
          />
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
        <button
          onClick={() => handleSubmit(false)}
          disabled={saving}
          className="px-6 py-2 bg-card hover:bg-muted border border-border rounded-lg text-foreground transition-colors disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存草稿"}
        </button>
        <button
          onClick={() => handleSubmit(true)}
          disabled={saving}
          className="px-6 py-2 bg-primary hover:bg-primary/90 rounded-lg text-white transition-colors disabled:opacity-50"
        >
          {saving ? "发布中..." : "立即发布"}
        </button>
      </div>
    </div>
  );
}
