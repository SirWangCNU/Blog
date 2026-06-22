"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { posts, categories } from "@/data/posts";

export function Sidebar() {
  // 统计
  const totalPosts = posts.length;
  const totalCategories = categories.filter((c) => c !== "全部").length;
  const allTags = [...new Set(posts.flatMap((p) => p.tags))];
  const totalTags = allTags.length;
  const totalWords = posts.reduce((sum, p) => sum + p.content.length, 0);

  // 最新文章
  const latestPosts = posts.slice(0, 5);

  // 分类统计
  const categoryStats = categories
    .filter((c) => c !== "全部")
    .map((cat) => ({
      name: cat,
      count: posts.filter((p) => p.category === cat).length,
    }));

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 space-y-5">
      {/* 个人信息卡 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card border border-primary/15 rounded-xl p-5 text-center"
      >
        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-3xl border-2 border-primary/20">
          👨‍💻
        </div>
        <h3 className="text-foreground font-bold text-lg mb-1">王景皓</h3>
        <p className="text-foreground-secondary text-xs mb-4">
          AI Agent 全栈开发者 · AIGC 架构师
        </p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Link
            href="/blog"
            className="text-center hover:bg-primary/5 rounded-lg py-2 transition-colors"
          >
            <div className="text-primary font-bold text-lg">{totalPosts}</div>
            <div className="text-foreground-secondary text-xs">文章</div>
          </Link>
          <Link
            href="/blog"
            className="text-center hover:bg-primary/5 rounded-lg py-2 transition-colors"
          >
            <div className="text-primary font-bold text-lg">{totalTags}</div>
            <div className="text-foreground-secondary text-xs">标签</div>
          </Link>
          <Link
            href="/blog"
            className="text-center hover:bg-primary/5 rounded-lg py-2 transition-colors"
          >
            <div className="text-primary font-bold text-lg">
              {totalCategories}
            </div>
            <div className="text-foreground-secondary text-xs">分类</div>
          </Link>
        </div>
        <a
          href="https://github.com/SirWangCNU"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-xs rounded-lg hover:bg-primary/20 transition-colors border border-primary/20 w-full justify-center"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          关注我
        </a>
      </motion.div>

      {/* 公告 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-card border border-primary/15 rounded-xl p-5"
      >
        <h4 className="text-foreground font-bold text-sm mb-3 flex items-center gap-2">
          <span>📢</span> 公告
        </h4>
        <p className="text-foreground-secondary text-xs leading-relaxed">
          欢迎来到我的技术博客！专注于 AI Agent 开发与 AIGC 全链路架构设计。
        </p>
      </motion.div>

      {/* 最新文章 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-card border border-primary/15 rounded-xl p-5"
      >
        <h4 className="text-foreground font-bold text-sm mb-4 flex items-center gap-2">
          <span>🕐</span> 最新文章
        </h4>
        <div className="space-y-3">
          {latestPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex items-start gap-3 group hover:bg-primary/5 rounded-lg p-2 -mx-2 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center text-lg flex-shrink-0 border border-primary/10">
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
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-xs font-medium group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </p>
                <p className="text-foreground-secondary/60 text-xs mt-1">
                  {post.date}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* 分类 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-card border border-primary/15 rounded-xl p-5"
      >
        <h4 className="text-foreground font-bold text-sm mb-4 flex items-center gap-2">
          <span>📁</span> 分类
        </h4>
        <div className="space-y-2">
          {categoryStats.map((cat) => (
            <Link
              key={cat.name}
              href="/blog"
              className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-primary/5 transition-colors group"
            >
              <span className="text-foreground-secondary text-xs group-hover:text-primary transition-colors">
                {cat.name}
              </span>
              <span className="text-foreground-secondary/50 text-xs bg-background-secondary px-2 py-0.5 rounded-full">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* 标签云 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="bg-card border border-primary/15 rounded-xl p-5"
      >
        <h4 className="text-foreground font-bold text-sm mb-4 flex items-center gap-2">
          <span>🏷️</span> 标签
        </h4>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <span
              key={tag}
              className="tag-hacker px-2.5 py-1 rounded-full text-xs cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* 网站信息 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-card border border-primary/15 rounded-xl p-5"
      >
        <h4 className="text-foreground font-bold text-sm mb-4 flex items-center gap-2">
          <span>📊</span> 网站信息
        </h4>
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between">
            <span className="text-foreground-secondary">文章数目</span>
            <span className="text-foreground">{totalPosts}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-secondary">本站总字数</span>
            <span className="text-foreground">
              {(totalWords / 1000).toFixed(1)}k
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-secondary">运行时间</span>
            <span className="text-foreground">运行中</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-secondary">最后更新</span>
            <span className="text-foreground">{posts[0]?.date || "-"}</span>
          </div>
        </div>
      </motion.div>
    </aside>
  );
}
