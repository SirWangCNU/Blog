"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Post } from "@/lib/content/types";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | Post["status"]>("all");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/posts")
      .then(async (response) => {
        const data = await response.json() as { posts?: Post[]; error?: string };
        if (!response.ok) throw new Error(data.error || "读取文章失败");
        return data.posts || [];
      })
      .then((items) => { if (!cancelled) setPosts(items); })
      .catch((error) => { if (!cancelled) setMessage(error instanceof Error ? error.message : "读取文章失败"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => posts.filter((post) => {
    const matchesStatus = status === "all" || post.status === status;
    const normalized = query.trim().toLowerCase();
    return matchesStatus && (!normalized || `${post.title} ${post.excerpt} ${post.category} ${post.tags.join(" ")}`.toLowerCase().includes(normalized));
  }), [posts, query, status]);

  const remove = async (post: Post) => {
    if (!window.confirm(`确定删除《${post.title}》？`)) return;
    const response = await fetch(`/api/admin/posts?id=${post.id}`, { method: "DELETE" });
    const data = await response.json() as { success?: boolean; error?: string };
    if (!response.ok || !data.success) {
      setMessage(data.error || "删除失败");
      return;
    }
    setPosts((current) => current.filter((item) => item.id !== post.id));
  };

  return (
    <div className="admin-works-v2-page">
      <header className="admin-page-v2-header">
        <div><h1>博客管理</h1><p>创建、编辑并发布 Markdown 文章。</p></div>
        <Link href="/admin/blog/new" className="admin-v2-button admin-v2-button-primary">新建文章</Link>
      </header>
      {message && <div className="admin-flash-v2" data-type="error" role="alert">{message}</div>}
      <section className="admin-card-v2" aria-label="文章列表">
        <div className="admin-list-toolbar-v2">
          <label className="admin-search-v2"><span className="sr-only">搜索文章</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索标题、摘要、分类或标签" /></label>
          <label className="admin-filter-v2"><span>状态</span><select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}><option value="all">全部</option><option value="published">已发布</option><option value="draft">草稿</option></select></label>
          <span className="admin-list-count-v2">{loading ? "正在读取" : `共 ${filtered.length} 篇`}</span>
        </div>
        <div className="admin-table-v2-wrap">
          <table className="admin-table-v2">
            <thead><tr><th>文章标题</th><th>分类</th><th>状态</th><th>更新时间</th><th>操作</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={5}><div className="admin-table-v2-empty">正在读取文章…</div></td></tr> : filtered.length ? filtered.map((post) => (
                <tr key={post.id}>
                  <td><strong>{post.title}</strong><small className="admin-post-slug-v2">/{post.slug}</small></td>
                  <td>{post.category || "未分类"}</td>
                  <td><span className="admin-status-v2" data-status={post.status}>{post.status === "published" ? "已发布" : "草稿"}</span></td>
                  <td><time dateTime={post.updatedAt}>{new Date(post.updatedAt).toLocaleDateString("zh-CN")}</time></td>
                  <td><div className="admin-row-actions-v2"><Link href={`/admin/blog/${post.id}`}>编辑</Link><button type="button" onClick={() => void remove(post)}>删除</button></div></td>
                </tr>
              )) : <tr><td colSpan={5}><div className="admin-table-v2-empty">暂无文章</div></td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
