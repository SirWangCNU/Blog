"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Post } from "@/lib/content/types";
import { PostForm } from "../components/PostForm";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/posts?id=${id}`)
      .then(async (response) => {
        const data = await response.json() as { post?: Post; error?: string };
        if (!response.ok || !data.post) throw new Error(data.error || "读取文章失败");
        setPost(data.post);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "读取文章失败"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="admin-card-v2 admin-card-v2-empty">正在读取文章…</div>;
  if (!post) return <div className="admin-card-v2 admin-missing-v2"><h1>文章不存在</h1><p>{error}</p><Link href="/admin/blog" className="admin-v2-button">返回文章列表</Link></div>;

  return (
    <div className="admin-editor-v2-page">
      <header className="admin-page-v2-header">
        <div><h1>编辑文章</h1><p>修改内容后保存草稿或重新发布。</p></div>
        <Link href="/admin/blog" className="admin-v2-button">返回文章列表</Link>
      </header>
      <PostForm initialPost={post} onSaved={setPost} />
    </div>
  );
}
