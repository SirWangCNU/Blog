"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Post } from "@/lib/content/types";
import { TagBadge } from "@/components/TagBadge";
import { PostCard } from "@/components/PostCard";
import { useState, useEffect } from "react";

/* ===== 目录提取 ===== */
interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = markdown.split("\n");
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff]+/g, "-")
        .replace(/^-|-$/g, "");
      items.push({ id, text, level });
    }
  }
  return items;
}

/* ===== 阅读进度条 ===== */
function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handler = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[100]">
      <div
        className="h-full transition-[width] duration-100"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #53d8a8, #64b5f6)",
        }}
      />
    </div>
  );
}

/* ===== 目录侧栏 ===== */
function TocSidebar({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const headings = toc
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav className="sticky top-24 space-y-1 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 scrollbar-thin">
      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <svg
          className="w-4 h-4 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
        目录
      </h4>
      {toc.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`block text-sm py-1.5 border-l-2 transition-all duration-200 ${
            item.level === 3 ? "pl-6" : "pl-3"
          } ${
            activeId === item.id
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-foreground-secondary hover:text-foreground hover:border-border"
          }`}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}

/* ===== 主页面 ===== */
export function BlogPost({ post, relatedPosts }: { post: Post; relatedPosts: Post[] }) {
  const toc = extractToc(post.content);

  // 处理 Markdown → HTML（增强版：给 h2/h3 加 id 用于锚点跳转）
  const htmlContent = post.content
    .replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      '<pre><code class="language-$1">$2</code></pre>'
    )
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/## (.+)/g, (_, text) => {
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff]+/g, "-")
        .replace(/^-|-$/g, "");
      return `<h2 id="${id}">${text}</h2>`;
    })
    .replace(/### (.+)/g, (_, text) => {
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff]+/g, "-")
        .replace(/^-|-$/g, "");
      return `<h3 id="${id}">${text}</h3>`;
    })
    .replace(/\n\n/g, "</p><p>");

  return (
    <>
      <ReadingProgress />

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* 面包屑导航 */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 text-sm text-foreground-secondary mb-6"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            首页
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary transition-colors">
            博客
          </Link>
          <span>/</span>
          <span className="text-foreground">{post.category}</span>
        </motion.nav>

        <div className="flex gap-8">
          {/* ===== 左侧文章主体 ===== */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 min-w-0 bg-card border border-border rounded-xl overflow-hidden"
          >
            {/* 文章头部信息 */}
            <header className="px-8 pt-8 pb-6 border-b border-border">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                  {post.category}
                </span>
                <time className="text-sm text-foreground-secondary">
                  {new Date(post.date).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span className="text-sm text-foreground-secondary flex items-center gap-1">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {post.readTime}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-4">
                {post.title}
              </h1>

              <p className="text-foreground-secondary text-base mb-5 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} variant="primary" />
                ))}
              </div>
            </header>

            {/* 文章正文 */}
            <div className="px-8 py-8">
              <div
                className="text-foreground text-base leading-[1.85]
                  [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-border [&_h2]:scroll-mt-20
                  [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:scroll-mt-20
                  [&_p]:text-foreground-secondary [&_p]:leading-[1.85] [&_p]:mb-4
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:text-foreground-secondary [&_ul]:space-y-1
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:text-foreground-secondary
                  [&_li]:leading-relaxed
                  [&_a]:text-primary [&_a]:hover:text-primary-hover [&_a]:underline [&_a]:underline-offset-4
                  [&_strong]:text-foreground [&_strong]:font-semibold
                  [&_code]:bg-code-bg [&_code]:text-primary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:before:content-none [&_code]:after:content-none
                  [&_pre]:bg-[#0d1117] [&_pre]:border [&_pre]:border-border [&_pre]:rounded-lg [&_pre]:p-5 [&_pre]:overflow-x-auto [&_pre]:mb-6 [&_pre]:text-sm [&_pre]:leading-relaxed
                  [&_pre_code]:bg-transparent [&_pre_code]:text-[#c9d1d9] [&_pre_code]:p-0 [&_pre_code]:text-sm
                  [&_table]:w-full [&_table]:border-collapse [&_table]:mb-6 [&_table]:text-sm
                  [&_th]:bg-background-secondary [&_th]:text-foreground [&_th]:font-semibold [&_th]:px-4 [&_th]:py-3 [&_th]:border [&_th]:border-border [&_th]:text-left
                  [&_td]:px-4 [&_td]:py-3 [&_td]:border [&_td]:border-border [&_td]:text-foreground-secondary
                  [&_tr:hover]:bg-background-secondary/50
                  [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-primary/5 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:rounded-r [&_blockquote]:mb-4 [&_blockquote]:text-foreground-secondary
                  [&_hr]:border-border [&_hr]:my-8"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>

            {/* 文章底部 */}
            <footer className="px-8 py-6 border-t border-border bg-background-secondary/30">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} variant="default" />
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-foreground-secondary">
                  <span className="flex items-center gap-1">
                    📅{" "}
                    {new Date(post.date).toLocaleDateString("zh-CN")}
                  </span>
                  <span className="flex items-center gap-1">
                    ⏱️ {post.readTime}
                  </span>
                </div>
              </div>
            </footer>
          </motion.article>

          {/* ===== 右侧目录 + 侧栏 ===== */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:block w-[260px] shrink-0 space-y-6"
          >
            {/* 文章目录 */}
            <div className="bg-card border border-border rounded-xl p-5">
              <TocSidebar toc={toc} />
            </div>

            {/* 文章信息卡片 */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                文章信息
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground-secondary">分类</span>
                  <span className="text-foreground">{post.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-secondary">发布时间</span>
                  <span className="text-foreground">
                    {new Date(post.date).toLocaleDateString("zh-CN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-secondary">阅读时间</span>
                  <span className="text-foreground">{post.readTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-secondary">标签数</span>
                  <span className="text-foreground">{post.tags.length}</span>
                </div>
              </div>
            </div>

            {/* 返回按钮 */}
            <Link
              href="/blog"
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl transition-colors text-sm font-medium"
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
          </motion.aside>
        </div>

        {/* ===== 相关文章 ===== */}
        {relatedPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10"
          >
            <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
              📎 相关文章
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </>
  );
}
