"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Work } from "@/lib/works/types";

export default function AdminWorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchWorks = useCallback(async () => {
    try {
      const res = await fetch("/api/works?includeDrafts=true");
      const data = await res.json();
      setWorks(data.works || []);
    } catch {
      setMessage({ type: "error", text: "获取作品列表失败" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDelete = async (work: Work) => {
    if (!confirm(`确定删除「${work.title}」？`)) return;
    try {
      const res = await fetch(`/api/works?id=${work.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "已删除" });
        fetchWorks();
      } else {
        setMessage({ type: "error", text: data.error || "删除失败" });
      }
    } catch {
      setMessage({ type: "error", text: "删除失败" });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 font-mono">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            <span className="text-primary">#</span> 作品管理
          </h1>
          <p className="text-foreground-secondary text-sm">管理你的项目作品，支持草稿和发布状态</p>
        </div>
        <Link
          href="/admin/works/new"
          className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors text-sm font-medium"
        >
          + 新建作品
        </Link>
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 px-4 py-3 rounded-lg text-sm border ${
            message.type === "success"
              ? "bg-primary/10 text-primary border-primary/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          {message.type === "success" ? "✓ " : "✗ "}
          {message.text}
        </motion.div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : works.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-16 text-center">
          <span className="text-4xl block mb-4">🚀</span>
          <p className="text-foreground-secondary mb-6">还没有作品，开始发布第一个吧</p>
          <Link
            href="/admin/works/new"
            className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors text-sm"
          >
            新建作品
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {works.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                  {work.cover ? (
                    <img src={work.cover} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">🚀</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-foreground truncate">{work.title}</h3>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        work.status === "published"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      }`}
                    >
                      {work.status === "published" ? "已发布" : "草稿"}
                    </span>
                    {work.featured && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                        精选
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground-secondary line-clamp-1 mb-2">{work.summary}</p>
                  <div className="flex items-center gap-2 text-xs text-foreground-secondary">
                    <span>更新于 {formatDate(work.updatedAt)}</span>
                    {work.category && <span>· {work.category}</span>}
                    {work.tags.length > 0 && <span>· {work.tags.join(", ")}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/admin/works/${work.id}`}
                    className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-lg text-foreground transition-colors"
                  >
                    编辑
                  </Link>
                  <button
                    onClick={() => handleDelete(work)}
                    className="px-3 py-1.5 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                  >
                    删除
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
