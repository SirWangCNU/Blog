"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { WorkForm } from "../components/WorkForm";
import type { Work } from "@/lib/works/types";

export default function EditWorkPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/works?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setWork(data.work || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSaved = () => {
    router.refresh();
  };

  if (loading) {
    return (
      <div className="admin-card-v2 admin-card-v2-empty" aria-label="正在读取作品">正在读取作品…</div>
    );
  }

  if (!work) {
    return (
      <div className="admin-card-v2 admin-missing-v2">
        <h1>作品不存在</h1>
        <p>它可能已被删除，或链接中的编号不正确。</p>
        <Link href="/admin/works" className="admin-v2-button">返回作品列表</Link>
      </div>
    );
  }

  return (
    <div className="admin-editor-v2-page">
      <header className="admin-page-v2-header">
        <div>
          <h1>编辑作品</h1>
          <p>修改标题或正文，保存后同步到作品列表。</p>
        </div>
        <Link href="/admin/works" className="admin-v2-button">返回作品列表</Link>
      </header>
      <WorkForm initialWork={work} onSaved={handleSaved} />
    </div>
  );
}
