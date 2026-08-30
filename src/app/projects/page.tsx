import { ProjectIndex } from "@/components/ProjectIndex";
import { listWorks } from "@/lib/works/store";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const works = await listWorks();

  return <ProjectIndex works={works} />;
}
