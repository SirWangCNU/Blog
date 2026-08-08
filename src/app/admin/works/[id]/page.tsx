"use client";

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
      <div className="max-w-5xl mx-auto px-4 py-16 font-mono flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!work) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 font-mono text-center text-foreground-secondary">
        作品不存在
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 font-mono">
      <h1 className="text-3xl font-bold text-foreground mb-8">
        <span className="text-primary">#</span> 编辑作品
      </h1>
      <WorkForm initialWork={work} onSaved={handleSaved} />
    </div>
  );
}
