import { notFound } from "next/navigation";
import { BlogPost } from "@/components/BlogPost";
import { getPostBySlug, listPosts } from "@/lib/content/posts";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const relatedPosts = listPosts()
    .filter((candidate) => candidate.slug !== slug && candidate.category === post.category)
    .slice(0, 3);
  return <BlogPost post={post} relatedPosts={relatedPosts} />;
}
