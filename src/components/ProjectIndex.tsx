"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Search,
  SearchX,
} from "lucide-react";
import { ProjectListCard } from "@/components/ProjectListCard";
import { ProjectSidebar } from "@/components/ProjectSidebar";
import { TypewriterText } from "@/components/TypewriterText";
import type { Work } from "@/lib/works/types";

const WORKS_PER_PAGE = 3;

export function ProjectIndex({ works }: { works: Work[] }) {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const categories = useMemo(
    () => ["全部", ...new Set(works.map((work) => work.category || "独立项目"))],
    [works],
  );

  const filteredWorks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return works.filter((work) => {
      const category = work.category || "独立项目";
      const matchesCategory = selectedCategory === "全部" || category === selectedCategory;
      const matchesSearch =
        normalizedQuery === "" ||
        work.title.toLowerCase().includes(normalizedQuery) ||
        work.summary.toLowerCase().includes(normalizedQuery) ||
        category.toLowerCase().includes(normalizedQuery) ||
        work.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, works]);

  const totalPages = Math.max(1, Math.ceil(filteredWorks.length / WORKS_PER_PAGE));
  const paginatedWorks = useMemo(() => {
    const start = (currentPage - 1) * WORKS_PER_PAGE;
    return filteredWorks.slice(start, start + WORKS_PER_PAGE);
  }, [currentPage, filteredWorks]);

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const updateSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen">
      <section className="relative flex h-72 items-center justify-center overflow-hidden border-b border-border">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/hero-coding.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,21,32,0.58),rgba(16,21,32,0.48)_48%,rgba(16,21,32,1))]" />

        <div className="relative z-10 px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center justify-center gap-3 font-mono text-4xl font-bold text-foreground"
          >
            <FolderKanban aria-hidden="true" className="size-9 text-primary" strokeWidth={1.7} />
            作品集
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="min-h-7 font-mono text-base text-foreground-secondary sm:text-lg"
          >
            <span className="text-primary">{">"}</span>{" "}
            <TypewriterText
              texts={[
                "把想法实现为可用的产品",
                "AI Agent 与全栈工程实践",
                "记录设计、开发与迭代过程",
                "从技术方案到真实交付",
              ]}
            />
          </motion.p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <main className="min-w-0 flex-1">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-8 space-y-4"
            >
              <div className="relative">
                <Search
                  aria-hidden="true"
                  className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-foreground-secondary"
                  strokeWidth={1.8}
                />
                <input
                  type="search"
                  aria-label="搜索作品"
                  placeholder="搜索作品..."
                  value={searchQuery}
                  onChange={(event) => updateSearch(event.target.value)}
                  className="h-14 w-full rounded-lg border border-border bg-card pl-12 pr-4 font-mono text-sm text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-foreground-secondary focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    aria-label={`筛选分类：${category}`}
                    aria-pressed={selectedCategory === category}
                    onClick={() => selectCategory(category)}
                    className={`rounded-full px-4 py-2 font-mono text-xs transition-[background-color,border-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                      selectedCategory === category
                        ? "border border-primary bg-primary text-[#07120e] shadow-[0_8px_24px_rgba(83,216,168,0.18)]"
                        : "border border-border bg-card text-foreground-secondary hover:border-primary/35 hover:text-primary"
                    }`}
                  >
                    {category}
                  </button>
                ))}
                <span className="ml-auto hidden font-mono text-[11px] text-foreground-secondary sm:block">
                  {filteredWorks.length} 个作品
                </span>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedCategory}-${searchQuery}-${currentPage}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                {paginatedWorks.map((project, index) => (
                  <ProjectListCard key={project.id} project={project} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredWorks.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex min-h-72 flex-col items-center justify-center border-y border-border text-center"
              >
                <SearchX aria-hidden="true" className="mb-4 size-10 text-primary/65" strokeWidth={1.4} />
                <p className="font-mono text-base text-foreground">没有找到匹配的作品</p>
                <p className="mt-2 text-sm text-foreground-secondary">试试其他关键词或分类</p>
              </motion.div>
            )}

            {totalPages > 1 && (
              <motion.nav
                aria-label="作品分页"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex items-center justify-center gap-2"
              >
                <button
                  type="button"
                  aria-label="上一页"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="grid size-10 place-items-center rounded-lg border border-border text-foreground-secondary transition-colors hover:border-primary/35 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft aria-hidden="true" className="size-4" />
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    aria-label={`第 ${page} 页`}
                    aria-current={currentPage === page ? "page" : undefined}
                    onClick={() => setCurrentPage(page)}
                    className={`size-10 rounded-lg font-mono text-sm transition-colors ${
                      currentPage === page
                        ? "bg-primary text-[#07120e]"
                        : "border border-border text-foreground-secondary hover:border-primary/35 hover:text-primary"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  aria-label="下一页"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="grid size-10 place-items-center rounded-lg border border-border text-foreground-secondary transition-colors hover:border-primary/35 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRight aria-hidden="true" className="size-4" />
                </button>
              </motion.nav>
            )}
          </main>

          <ProjectSidebar works={works} />
        </div>
      </div>
    </div>
  );
}
