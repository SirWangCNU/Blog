"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PostCardBlog } from "@/components/PostCardBlog";
import { Sidebar } from "@/components/Sidebar";
import { TypewriterText } from "@/components/TypewriterText";
import { posts, categories } from "@/data/posts";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-72 flex items-center justify-center overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background-secondary/50 to-background" />
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono text-sm"
                />
              </div>

              {/* 分类标签 */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
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
                {filteredPosts.map((post, index) => (
                  <PostCardBlog key={post.slug} post={post} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>

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
