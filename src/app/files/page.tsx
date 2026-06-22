"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FileInfo {
  name: string;
  savedName: string;
  size: number;
  url: string;
  uploadedAt: string;
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
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch("/api/files");
      const data = await res.json();
      setFiles(data.files || []);
    } catch (e) {
      console.error("获取文件列表失败", e);
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

  const handleUpload = async (file: File) => {
    setUploading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `上传成功：${file.name}` });
        fetchFiles();
      } else {
        setMessage({ type: "error", text: data.error || "上传失败" });
      }
    } catch (e) {
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 font-mono">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold text-foreground mb-4">
          <span className="text-primary">#</span> 文件管理
        </h1>
        <p className="text-foreground-secondary text-sm">
          上传文件，随时查看和下载
        </p>
      </motion.div>

      {/* 上传区域 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-12"
      >
        <div
          className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-primary/30 hover:border-primary/60 bg-card"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
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
              <p className="text-foreground-secondary text-xs">
                支持任意类型文件
              </p>
            </div>
          )}
        </div>

        {/* 提示消息 */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 px-4 py-3 rounded-lg text-sm font-mono ${
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
      </motion.section>

      {/* 文件列表 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-foreground mb-6">
          <span className="text-primary">#</span> 已保存文件
          <span className="text-foreground-secondary text-sm ml-3">
            ({files.length} 个)
          </span>
        </h2>

        {files.length === 0 ? (
          <div className="bg-card border border-primary/10 rounded-xl p-12 text-center">
            <span className="text-4xl block mb-3">📭</span>
            <p className="text-foreground-secondary text-sm">
              还没有上传过文件
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file, index) => (
              <motion.div
                key={file.savedName}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-card border border-primary/10 rounded-lg p-4 hover:border-primary/30 transition-colors flex items-center gap-4"
              >
                <span className="text-2xl flex-shrink-0">
                  {getFileIcon(file.name)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-bold truncate">
                    {file.name}
                  </p>
                  <p className="text-foreground-secondary text-xs mt-1">
                    {formatSize(file.size)} · {formatDate(file.uploadedAt)}
                  </p>
                </div>
                <a
                  href={file.url}
                  download={file.name}
                  className="flex-shrink-0 px-4 py-2 bg-primary/10 text-primary text-xs rounded-lg hover:bg-primary/20 transition-colors border border-primary/20"
                >
                  下载
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}
