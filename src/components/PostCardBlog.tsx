"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Post } from "@/data/posts";

interface PostCardBlogProps {
  post: Post;
  index: number;
}

const categoryColors: Record<string, string> = {
  漫剧工厂: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  AIGC: "bg-primary/15 text-primary border-primary/30",
  前端: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  后端: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  工具: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
};

export function PostCardBlog({ post, index }: PostCardBlogProps) {
  const isLeft = index % 2 === 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-card border border-primary/10 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
    >
      <Link href={`/blog/${post.slug}`} className="flex flex-col md:flex-row">
        {/* 封面图 */}
        <div
          className={`relative w-full md:w-72 h-48 md:h-auto flex-shrink-0 overflow-hidden ${
            isLeft ? "" : "md:order-2"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity group-hover:scale-110 transition-transform duration-500">
              {post.category === "漫剧工厂"
                ? "🎬"
                : post.category === "AIGC"
                  ? "🧠"
                  : post.category === "前端"
                    ? "🎨"
                    : post.category === "后端"
                      ? "⚙️"
                      : "📝"}
            </div>
          </div>
          {/* 装饰线条 */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
        </div>

        {/* 内容区 */}
        <div className={`flex-1 p-5 ${isLeft ? "" : "md:order-1"}`}>
          {/* 分类标签 */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`px-2.5 py-0.5 text-xs rounded-full border ${
                categoryColors[post.category] ||
                "bg-primary/15 text-primary border-primary/30"
              }`}
            >
              {post.category}
            </span>
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-background-secondary text-foreground-secondary border border-border"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 标题 */}
          <h2 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>

          {/* 摘要 */}
          <p className="text-sm text-foreground-secondary leading-relaxed mb-4 line-clamp-2">
            {post.excerpt}
          </p>

          {/* 底部信息 */}
          <div className="flex items-center gap-4 text-xs text-foreground-secondary/70">
            <span className="flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {post.readTime}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
