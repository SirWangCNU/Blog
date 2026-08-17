import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { listPosts } from "@/lib/content/posts";
import { buildAdminDashboard } from "@/lib/admin/dashboard";
import { listWorks } from "@/lib/works/store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const works = await listWorks(true);
  const posts = listPosts({ includeDrafts: true });
  const data = buildAdminDashboard(works, posts);

  return <AdminDashboard data={data} />;
}
