"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { WorkForm } from "../components/WorkForm";
import type { Work } from "@/lib/works/types";

export default function NewWorkPage() {
  const router = useRouter();

  const handleSaved = (work: Work) => {
    router.push(`/admin/works/${work.id}`);
  };

  return (
    <div className="admin-editor-v2-page">
      <header className="admin-page-v2-header">
        <div>
          <h1>新建作品</h1>
          <p>填写标题和正文，完成后保存草稿或直接发布。</p>
        </div>
        <Link href="/admin/works" className="admin-v2-button">返回作品列表</Link>
      </header>
      <WorkForm onSaved={handleSaved} />
    </div>
  );
}
