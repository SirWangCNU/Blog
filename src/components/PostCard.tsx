"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TagBadge } from "./TagBadge";
import type { Post } from "@/data/posts";

interface PostCardProps {
  post: Post;
  index: number;
}

export function PostCard({ post, index }: PostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group block bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Date */}
            <time className="text-sm text-foreground-secondary">
              {new Date(post.date).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>

            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground mt-2 mb-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-foreground-secondary mb-4 line-clamp-2">
              {post.excerpt}
            </p>

            {/* Tags and Read Time */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
              <span className="text-xs text-foreground-secondary">
                阅读 {post.readTime}
              </span>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0 mt-1">
            <svg
              className="w-5 h-5 text-foreground-secondary group-hover:text-primary group-hover:translate-x-1 transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
