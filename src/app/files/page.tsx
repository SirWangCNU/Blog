"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FileItem {
  type: "file" | "note";
  name?: string;
  savedName?: string;
  size: number;
  url?: string;
  uploadedAt?: string;
  id?: string;
  title?: string;
  content?: string;
  updatedAt?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 * 1024 * 1024)
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getFileIcon(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext))
    return "🖼️";
  if (["mp4", "avi", "mov", "mkv", "webm"].includes(ext)) return "🎬";
  if (["mp3", "wav", "flac", "aac", "ogg"].includes(ext)) return "🎵";
  if (["pdf"].includes(ext)) return "📕";
  if (["doc", "docx"].includes(ext)) return "📘";
  if (["xls", "xlsx"].includes(ext)) return "📊";
  if (["ppt", "pptx"].includes(ext)) return "📙";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "📦";
  if (["js", "ts", "py", "java", "go", "rs", "c", "cpp"].includes(ext))
    return "💻";
  if (["json", "xml", "yaml", "yml", "toml"].includes(ext)) return "📋";
  if (["md", "txt", "log"].includes(ext)) return "📝";
  return "📄";
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [tab, setTab] = useState<"files" | "notes">("files");

  // 笔记编辑状态
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [viewNote, setViewNote] = useState<FileItem | null>(null);

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch("/api/files");
      const data = await res.json();
      setFiles(data.files || []);
    } catch (e) {
      console.error("获取列表失败", e);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // 文件上传
  const handleUpload = async (file: File) => {
    setUploading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `上传成功：${file.name}` });
        fetchFiles();
      } else {
        setMessage({ type: "error", text: data.error || "上传失败" });
      }
    } catch {
      setMessage({ type: "error", text: "上传失败，请重试" });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  // 保存笔记
  const handleSaveNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      setMessage({ type: "error", text: "标题和内容不能为空" });
      return;
    }
    try {
      const res = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingNote || undefined,
          title: noteTitle,
          content: noteContent,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: editingNote ? "更新成功" : "保存成功" });
        setNoteTitle("");
        setNoteContent("");
        setEditingNote(null);
        fetchFiles();
      }
    } catch {
      setMessage({ type: "error", text: "保存失败" });
    }
  };

  // 删除
  const handleDelete = async (item: FileItem) => {
    if (!confirm(`确定删除「${item.type === "note" ? item.title : item.name}」？`))
      return;
    try {
      const params = new URLSearchParams({
        type: item.type,
        name: item.type === "note" ? item.id! : item.savedName!,
      });
      const res = await fetch(`/api/files?${params}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "已删除" });
        if (viewNote?.id === item.id) setViewNote(null);
        fetchFiles();
      }
    } catch {
      setMessage({ type: "error", text: "删除失败" });
    }
  };

  // 编辑笔记
  const startEdit = (item: FileItem) => {
    setEditingNote(item.id!);
    setNoteTitle(item.title!);
    setNoteContent(item.content!);
    setViewNote(null);
    setTab("notes");
  };

  const uploadFiles = files.filter((f) => f.type === "file");
  const notes = files.filter((f) => f.type === "note");

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 font-mono">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-4">
          <span className="text-primary">#</span> 文件管理
        </h1>
        <p className="text-foreground-secondary text-sm">
          上传文件、保存笔记，随时查看和下载
        </p>
      </motion.div>

      {/* Tab 切换 */}
      <div className="flex gap-2 mb-8">
        {[
          { key: "files" as const, label: "📁 文件", count: uploadFiles.length },
          { key: "notes" as const, label: "📝 笔记", count: notes.length },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              if (t.key === "notes") {
                setEditingNote(null);
                setNoteTitle("");
                setNoteContent("");
              }
            }}
            className={`px-4 py-2 rounded-lg text-sm font-mono transition-colors ${
              tab === t.key
                ? "bg-primary/15 text-primary border border-primary/30"
                : "bg-card text-foreground-secondary border border-primary/10 hover:border-primary/30"
            }`}
          >
            {t.label}
            <span className="ml-2 text-xs opacity-60">({t.count})</span>
          </button>
        ))}
      </div>

      {/* 提示消息 */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-6 px-4 py-3 rounded-lg text-sm font-mono ${
              message.type === "success"
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {message.type === "success" ? "✓ " : "✗ "}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 文件 Tab */}
      {tab === "files" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* 上传区域 */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer mb-8 ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-primary/30 hover:border-primary/60 bg-card"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
              id="file-input"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-foreground-secondary text-sm">上传中...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <span className="text-4xl">📁</span>
                <p className="text-foreground text-sm font-bold">
                  点击选择文件 或 拖拽文件到此处
                </p>
              </div>
            )}
          </div>

          {/* 文件列表 */}
          {uploadFiles.length === 0 ? (
            <div className="bg-card border border-primary/10 rounded-xl p-12 text-center">
              <span className="text-4xl block mb-3">📭</span>
              <p className="text-foreground-secondary text-sm">还没有上传过文件</p>
            </div>
          ) : (
            <div className="space-y-3">
              {uploadFiles.map((file, index) => (
                <motion.div
                  key={file.savedName}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-card border border-primary/10 rounded-lg p-4 hover:border-primary/30 transition-colors flex items-center gap-4"
                >
                  <span className="text-2xl flex-shrink-0">
                    {getFileIcon(file.name!)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm font-bold truncate">
                      {file.name}
                    </p>
                    <p className="text-foreground-secondary text-xs mt-1">
                      {formatSize(file.size)} · {formatDate(file.uploadedAt!)}
                    </p>
                  </div>
                  <a
                    href={file.url}
                    download={file.name}
                    className="flex-shrink-0 px-4 py-2 bg-primary/10 text-primary text-xs rounded-lg hover:bg-primary/20 transition-colors border border-primary/20"
                  >
                    下载
                  </a>
                  <button
                    onClick={() => handleDelete(file)}
                    className="flex-shrink-0 px-3 py-2 text-red-400 text-xs rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    删除
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* 笔记 Tab */}
      {tab === "notes" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* 编辑器 */}
          <div className="bg-card border border-primary/15 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-foreground font-bold text-sm">
                {editingNote ? "✏️ 编辑笔记" : "📝 新建笔记"}
              </h3>
              {editingNote && (
                <button
                  onClick={() => {
                    setEditingNote(null);
                    setNoteTitle("");
                    setNoteContent("");
                  }}
                  className="text-xs text-foreground-secondary hover:text-primary transition-colors"
                >
                  取消编辑
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="笔记标题..."
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="w-full bg-background-secondary border border-border rounded-lg px-4 py-2 text-sm text-foreground mb-3 focus:outline-none focus:border-primary/50"
            />
            <textarea
              placeholder="支持 Markdown 格式..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={8}
              className="w-full bg-background-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground font-mono leading-relaxed resize-y focus:outline-none focus:border-primary/50"
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-foreground-secondary">
                {noteContent.length} 字符 · 支持 Markdown
              </span>
              <button
                onClick={handleSaveNote}
                className="px-6 py-2 bg-primary text-background text-sm rounded-lg hover:bg-primary/90 transition-colors font-bold"
              >
                {editingNote ? "更新" : "保存"}
              </button>
            </div>
          </div>

          {/* 笔记查看弹窗 */}
          <AnimatePresence>
            {viewNote && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={() => setViewNote(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-card border border-primary/20 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-foreground font-bold text-lg">
                      {viewNote.title}
                    </h2>
                    <button
                      onClick={() => setViewNote(null)}
                      className="text-foreground-secondary hover:text-primary text-xl"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs text-foreground-secondary mb-4">
                    更新于 {formatDate(viewNote.updatedAt!)}
                  </p>
                  <div className="prose prose-invert max-w-none text-sm text-foreground-secondary leading-relaxed whitespace-pre-wrap">
                    {viewNote.content}
                  </div>
                  <div className="flex gap-3 mt-6 pt-4 border-t border-border">
                    <button
                      onClick={() => startEdit(viewNote)}
                      className="px-4 py-2 bg-primary/10 text-primary text-xs rounded-lg hover:bg-primary/20 transition-colors border border-primary/20"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => {
                        // 导出为 .md 文件下载
                        const blob = new Blob([viewNote.content!], {
                          type: "text/markdown",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${viewNote.title}.md`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="px-4 py-2 bg-primary/10 text-primary text-xs rounded-lg hover:bg-primary/20 transition-colors border border-primary/20"
                    >
                      导出 .md
                    </button>
                    <button
                      onClick={() => handleDelete(viewNote)}
                      className="px-4 py-2 text-red-400 text-xs rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 笔记列表 */}
          {notes.length === 0 ? (
            <div className="bg-card border border-primary/10 rounded-xl p-12 text-center">
              <span className="text-4xl block mb-3">📭</span>
              <p className="text-foreground-secondary text-sm">还没有保存过笔记</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-card border border-primary/10 rounded-lg p-4 hover:border-primary/30 transition-colors cursor-pointer"
                  onClick={() => setViewNote(note)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl flex-shrink-0">📝</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm font-bold truncate">
                        {note.title}
                      </p>
                      <p className="text-foreground-secondary text-xs mt-1 truncate">
                        {note.content?.slice(0, 80)}...
                      </p>
                      <p className="text-foreground-secondary/50 text-xs mt-1">
                        {formatSize(note.size)} · {formatDate(note.updatedAt!)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(note);
                      }}
                      className="flex-shrink-0 px-3 py-2 text-primary text-xs rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      编辑
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(note);
                      }}
                      className="flex-shrink-0 px-3 py-2 text-red-400 text-xs rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
