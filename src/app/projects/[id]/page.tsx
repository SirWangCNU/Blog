import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/ProjectDetail";
import { getWork, listWorks } from "@/lib/works/store";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const work = await getWork(decodeURIComponent(id));

  if (!work || work.status !== "published") notFound();

  const relatedWorks = (await listWorks())
    .filter((candidate) => candidate.id !== work.id && candidate.category === work.category)
    .slice(0, 3);

  return <ProjectDetail work={work} relatedWorks={relatedWorks} />;
}
