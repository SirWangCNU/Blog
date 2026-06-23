"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PostCardBlog } from "@/components/PostCardBlog";
import { Sidebar } from "@/components/Sidebar";
import { TypewriterText } from "@/components/TypewriterText";
import { posts, categories } from "@/data/posts";

const POSTS_PER_PAGE = 3;

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "全部" || post.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // 分页计算
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  // 筛选变化时重置到第1页
  const handleCategoryChange = (cat: string) => { setSelectedCategory(cat); setCurrentPage(1); };
  const handleSearchChange = (q: string) => { setSearchQuery(q); setCurrentPage(1); };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-72 flex items-center justify-center overflow-hidden">
        {/* 背景视频 */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/images/hero-coding.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* 深色遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        {/* 光晕装饰 */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(83, 216, 168, 0.2), transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(100, 181, 246, 0.2), transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        </div>

        <div className="relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-foreground mb-4 font-mono"
          >
            📝 博客
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-foreground-secondary text-lg font-mono"
          >
            <span className="text-primary">{">"}</span>{" "}
            <TypewriterText
              texts={[
                "记录技术思考与学习笔记",
                "AI Agent 开发实践",
                "AIGC 全链路架构设计",
                "从代码到架构的进阶之路",
              ]}
            />
          </motion.p>
        </div>
      </section>

      {/* 主内容区：左右分栏 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧：文章列表 */}
          <div className="flex-1 min-w-0">
            {/* 搜索和分类筛选 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 space-y-4"
            >
              {/* 搜索框 */}
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="搜索文章..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono text-sm"
                />
              </div>

              {/* 分类标签 */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                      selectedCategory === category
                        ? "bg-primary text-background shadow-lg shadow-primary/25"
                        : "bg-card text-foreground-secondary border border-border hover:border-primary/30 hover:text-primary"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* 文章列表 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedCategory}-${searchQuery}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {paginatedPosts.map((post, index) => (
                  <PostCardBlog key={post.slug} post={post} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* 分页控件 */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 mt-8"
              >
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg text-sm font-mono border border-border text-foreground-secondary hover:border-primary/30 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  ← 上一页
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-mono transition-all ${
                      currentPage === page
                        ? "bg-primary text-background shadow-lg shadow-primary/25"
                        : "border border-border text-foreground-secondary hover:border-primary/30 hover:text-primary"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg text-sm font-mono border border-border text-foreground-secondary hover:border-primary/30 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  下一页 →
                </button>
              </motion.div>
            )}

            {/* 空状态 */}
            {filteredPosts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-foreground-secondary text-lg font-mono">
                  没有找到匹配的文章
                </p>
                <p className="text-foreground-secondary text-sm mt-2 font-mono">
                  试试其他关键词或分类
                </p>
              </motion.div>
            )}
          </div>

          {/* 右侧：信息栏 */}
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
