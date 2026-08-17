"use client";
/* eslint-disable @next/next/no-img-element -- cover URLs are user-managed runtime assets */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Work } from "@/lib/works/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function AdminWorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<"all" | Work["status"]>("all");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchWorks = useCallback(async () => {
    try {
      const response = await fetch("/api/works?includeDrafts=true");
      const data = await response.json();
      setWorks(data.works || []);
    } catch {
      setMessage({ type: "error", text: "获取作品列表失败" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/works?includeDrafts=true")
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) setWorks(data.works || []);
      })
      .catch(() => {
        if (!cancelled) setMessage({ type: "error", text: "获取作品列表失败" });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const filteredWorks = useMemo(() => {
    const query = keyword.trim().toLocaleLowerCase("zh-CN");
    return works.filter((work) => {
      const matchesStatus = status === "all" || work.status === status;
      const searchable = [work.title, work.summary, work.category, ...work.tags]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("zh-CN");
      return matchesStatus && (!query || searchable.includes(query));
    });
  }, [keyword, status, works]);

  const handleDelete = async (work: Work) => {
    if (!confirm(`确定删除「${work.title}」？`)) return;

    try {
      const response = await fetch(`/api/works?id=${work.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!data.success) {
        setMessage({ type: "error", text: data.error || "删除失败" });
        return;
      }

      setMessage({ type: "success", text: "作品已删除" });
      fetchWorks();
    } catch {
      setMessage({ type: "error", text: "删除失败" });
    }
  };

  return (
    <div className="admin-works-v2-page">
      <header className="admin-page-v2-header">
        <div>
          <h1>作品管理</h1>
          <p>管理前台作品集中的项目信息、展示状态和详情内容。</p>
        </div>
        <Link href="/admin/works/new" className="admin-v2-button admin-v2-button-primary">
          <span aria-hidden="true">＋</span>
          新建作品
        </Link>
      </header>

      {message && (
        <div className="admin-flash-v2" data-type={message.type} role="status" aria-live="polite">
          {message.text}
        </div>
      )}

      <section className="admin-card-v2" aria-label="作品列表">
        <div className="admin-list-toolbar-v2">
          <label className="admin-search-v2">
            <span aria-hidden="true">⌕</span>
            <span className="sr-only">搜索作品</span>
            <input
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜索作品名称、分类或标签"
            />
          </label>
          <label className="admin-filter-v2">
            <span>状态</span>
            <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
              <option value="all">全部</option>
              <option value="published">已发布</option>
              <option value="draft">草稿</option>
            </select>
          </label>
          <span className="admin-list-count-v2">
            {loading ? "正在读取" : `共 ${filteredWorks.length} 项`}
          </span>
        </div>

        <div className="admin-table-v2-wrap">
          <table className="admin-table-v2 admin-works-table-v2">
            <thead>
              <tr>
                <th>作品名称</th>
                <th>分类</th>
                <th>状态</th>
                <th>更新时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5}><div className="admin-table-v2-empty">正在读取作品…</div></td></tr>
              ) : filteredWorks.length ? (
                filteredWorks.map((work) => (
                  <tr key={work.id}>
                    <td>
                      <div className="admin-work-title-v2">
                        <span className="admin-work-thumb-v2">
                          {work.cover ? <img src={work.cover} alt="" /> : work.title.slice(0, 1)}
                        </span>
                        <span>
                          <strong>{work.title}</strong>
                          <small>{work.summary}</small>
                        </span>
                      </div>
                    </td>
                    <td>{work.category || "未分类"}</td>
                    <td>
                      <span className="admin-status-v2" data-status={work.status}>
                        {work.status === "published" ? "已发布" : "草稿"}
                      </span>
                    </td>
                    <td><time dateTime={work.updatedAt}>{formatDate(work.updatedAt)}</time></td>
                    <td>
                      <div className="admin-row-actions-v2">
                        <Link href={`/admin/works/${work.id}`}>编辑</Link>
                        <button type="button" onClick={() => handleDelete(work)}>删除</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="admin-table-v2-empty">
                      <p>{works.length ? "没有符合筛选条件的作品" : "还没有作品"}</p>
                      {!works.length && <Link href="/admin/works/new">新建第一个作品</Link>}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
