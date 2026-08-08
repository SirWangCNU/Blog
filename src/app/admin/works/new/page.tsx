"use client";

import { useRouter } from "next/navigation";
import { WorkForm } from "../components/WorkForm";
import type { Work } from "@/lib/works/types";

export default function NewWorkPage() {
  const router = useRouter();

  const handleSaved = (work: Work) => {
    router.push(`/admin/works/${work.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 font-mono">
      <h1 className="text-3xl font-bold text-foreground mb-8">
        <span className="text-primary">#</span> 新建作品
      </h1>
      <WorkForm onSaved={handleSaved} />
    </div>
  );
}
