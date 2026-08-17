import type { Post } from "@/data/posts";
import type { Work } from "@/lib/works/types";

export interface AdminDashboardData {
  stats: {
    worksTotal: number;
    worksPublished: number;
    worksDrafts: number;
    postsTotal: number;
  };
  recentWorks: Array<{
    id: string;
    title: string;
    summary: string;
    status: Work["status"];
    updatedAt: string;
    editHref: string;
  }>;
  recentPosts: Array<{
    slug: string;
    title: string;
    category: string;
    date: string;
    publicHref: string;
  }>;
}

export function buildAdminDashboard(works: Work[], posts: Post[]): AdminDashboardData {
  const recentWorks = [...works]
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, 4)
    .map((work) => ({
      id: work.id,
      title: work.title,
      summary: work.summary,
      status: work.status,
      updatedAt: work.updatedAt,
      editHref: `/admin/works/${work.id}`,
    }));

  const recentPosts = [...posts]
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, 4)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      category: post.category,
      date: post.date,
      publicHref: `/blog/${post.slug}`,
    }));

  return {
    stats: {
      worksTotal: works.length,
      worksPublished: works.filter((work) => work.status === "published").length,
      worksDrafts: works.filter((work) => work.status === "draft").length,
      postsTotal: posts.length,
    },
    recentWorks,
    recentPosts,
  };
}
