import { BlogIndex } from "@/components/BlogIndex";
import { listPosts } from "@/lib/content/posts";

export const dynamic = "force-dynamic";

export default function BlogPage() {
  return <BlogIndex posts={listPosts()} />;
}
