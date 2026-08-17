"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PostForm } from "../components/PostForm";

export default function NewPostPage() {
  const router = useRouter();
  return (
    <div className="admin-editor-v2-page">
      <header className="admin-page-v2-header">
        <div><h1>新建文章</h1><p>使用 Markdown 编写正文，保存草稿或直接发布。</p></div>
        <Link href="/admin/blog" className="admin-v2-button">返回文章列表</Link>
      </header>
      <PostForm onSaved={(post) => router.push(`/admin/blog/${post.id}`)} />
    </div>
  );
}
