"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, FolderKanban, Layers3, Sparkles, Tags } from "lucide-react";
import type { Work } from "@/lib/works/types";

export function ProjectSidebar({ works }: { works: Work[] }) {
  const categories = [...new Set(works.map((work) => work.category || "独立项目"))];
  const tags = [...new Set(works.flatMap((work) => work.tags))];
  const selectedWorks = works.filter((work) => work.featured).slice(0, 4);
  const highlightedWorks = selectedWorks.length > 0 ? selectedWorks : works.slice(0, 4);
  const categoryStats = categories.map((category) => ({
    name: category,
    count: works.filter((work) => (work.category || "独立项目") === category).length,
  }));

  return (
    <aside
      aria-label="作品信息"
      className="w-full shrink-0 space-y-5 self-start lg:sticky lg:top-24 lg:w-80"
    >
      <motion.section
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-lg border border-primary/15 bg-card p-5 text-center"
      >
        <div className="mx-auto mb-3 size-20 overflow-hidden rounded-full border-2 border-primary/25">
          <Image
            src="/images/883f9f9c8dfd4f8b99cc8abe8c997333.jpg"
            alt="王景皓头像"
            width={80}
            height={80}
            priority
            className="h-full w-full object-cover"
          />
        </div>
        <h2 className="mb-1 text-lg font-bold text-foreground">王景皓</h2>
        <p className="mb-4 text-xs text-foreground-secondary">AI Agent 全栈开发者</p>

        <div className="mb-4 grid grid-cols-3 border-y border-border py-3">
          <div>
            <div className="text-lg font-bold text-primary">{works.length}</div>
            <div className="text-xs text-foreground-secondary">作品</div>
          </div>
          <div className="border-x border-border">
            <div className="text-lg font-bold text-primary">{tags.length}</div>
            <div className="text-xs text-foreground-secondary">技术</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">{categories.length}</div>
            <div className="text-xs text-foreground-secondary">方向</div>
          </div>
        </div>

        <a
          href="https://github.com/SirWangCNU"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary/25 bg-primary/10 px-4 py-2.5 text-xs text-primary transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <Code2 aria-hidden="true" className="size-4" strokeWidth={1.8} />
          GitHub 项目主页
        </a>
      </motion.section>

      {highlightedWorks.length > 0 && (
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-lg border border-primary/15 bg-card p-5"
        >
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
            <Sparkles aria-hidden="true" className="size-4 text-primary" strokeWidth={1.7} />
            精选作品
          </h2>
          <div className="space-y-1">
            {highlightedWorks.map((work, index) => (
              <Link
                key={work.id}
                href={`/projects/${encodeURIComponent(work.id)}`}
                className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <span className="grid size-9 shrink-0 place-items-center border border-primary/15 bg-background-secondary font-mono text-[10px] text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-medium text-foreground transition-colors group-hover:text-primary">
                    {work.title}
                  </span>
                  <span className="mt-1 block truncate text-[10px] text-foreground-secondary">
                    {work.category || "独立项目"}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </motion.section>
      )}

      {categoryStats.length > 0 && (
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-lg border border-primary/15 bg-card p-5"
        >
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
            <Layers3 aria-hidden="true" className="size-4 text-primary" strokeWidth={1.7} />
            项目方向
          </h2>
          <div className="space-y-2">
            {categoryStats.map((category) => (
              <div key={category.name} className="flex items-center justify-between px-2 py-1.5 text-xs">
                <span className="text-foreground-secondary">{category.name}</span>
                <span className="min-w-7 border border-border bg-background-secondary px-2 py-0.5 text-center font-mono text-foreground-secondary">
                  {category.count}
                </span>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {tags.length > 0 && (
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-lg border border-primary/15 bg-card p-5"
        >
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
            <Tags aria-hidden="true" className="size-4 text-primary" strokeWidth={1.7} />
            技术标签
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 16).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-background-secondary px-2.5 py-1 font-mono text-[10px] text-foreground-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.section>
      )}

      <motion.section
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="rounded-lg border border-primary/15 bg-card p-5"
      >
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
          <FolderKanban aria-hidden="true" className="size-4 text-primary" strokeWidth={1.7} />
          作品说明
        </h2>
        <p className="text-xs leading-6 text-foreground-secondary">
          收录独立开发与协作完成的产品实践，点击条目可查看完整案例、实现过程与相关链接。
        </p>
      </motion.section>
    </aside>
  );
}
