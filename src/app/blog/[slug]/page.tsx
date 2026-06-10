"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { posts } from "@/data/posts";
import { TagBadge } from "@/components/TagBadge";
import { PostCard } from "@/components/PostCard";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-4">😕</p>
        <h1 className="text-2xl font-bold text-foreground mb-4">
          文章未找到
        </h1>
        <p className="text-foreground-secondary mb-8">
          抱歉，您访问的文章不存在。
        </p>
        <Link
          href="/blog"
          className="text-primary hover:text-primary-hover font-medium"
        >
          ← 返回博客列表
        </Link>
      </div>
    );
  }

  // Find related posts (same category, excluding current)
  const relatedPosts = posts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Back Link */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-foreground-secondary hover:text-foreground transition-colors mb-8"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          返回博客列表
        </Link>
      </motion.div>

      {/* Article Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <time className="text-sm text-foreground-secondary">
          {new Date(post.date).toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-4">
          {post.title}
        </h1>
        <p className="text-lg text-foreground-secondary mb-6">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} variant="primary" />
            ))}
          </div>
          <span className="text-sm text-foreground-secondary">
            阅读时间 {post.readTime}
          </span>
        </div>
      </motion.header>

      {/* Divider */}
      <hr className="border-border mb-10" />

      {/* Article Content */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="prose prose-lg max-w-none"
      >
        <div
          className="text-foreground [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4
            [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3
            [&_p]:text-foreground-secondary [&_p]:leading-relaxed [&_p]:mb-4
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:text-foreground-secondary
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:text-foreground-secondary
            [&_li]:mb-2
            [&_a]:text-primary [&_a]:hover:text-primary-hover [&_a]:underline [&_a]:underline-offset-4
            [&_strong]:text-foreground [&_strong]:font-semibold
            [&_code]:bg-code-bg [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
            [&_pre]:bg-code-bg [&_pre]:border [&_pre]:border-border [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:mb-6
            [&_pre_code]:bg-transparent [&_pre_code]:p-0
            [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground-secondary"
          dangerouslySetInnerHTML={{
            __html: post.content
              .replace(
                /```(\w+)?\n([\s\S]*?)```/g,
                '<pre><code class="language-$1">$2</code></pre>'
              )
              .replace(/`([^`]+)`/g, "<code>$1</code>")
              .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
              .replace(/## (.+)/g, "<h2>$1</h2>")
              .replace(/### (.+)/g, "<h3>$1</h3>")
              .replace(/- (.+)/g, "<li>$1</li>")
              .replace(/\n\n/g, "</p><p>")
              .replace(/^(.+)$/gm, (match) => {
                if (
                  match.startsWith("<") ||
                  match.trim() === ""
                ) {
                  return match;
                }
                return match;
              }),
          }}
        />
      </motion.article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 pt-10 border-t border-border"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">
            📎 相关文章
          </h2>
          <div className="flex flex-col gap-4">
            {relatedPosts.map((relatedPost, index) => (
              <PostCard
                key={relatedPost.slug}
                post={relatedPost}
                index={index}
              />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
