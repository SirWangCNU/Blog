"use client";
/* eslint-disable @next/next/no-img-element -- project covers are administrator-managed runtime assets */

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, CalendarDays, FolderKanban } from "lucide-react";
import type { Work } from "@/lib/works/types";

interface ProjectListCardProps {
  project: Work;
  index: number;
}

function formatDate(value: string) {
  return value.slice(0, 10).replaceAll("-", ".");
}

export function ProjectListCard({ project, index }: ProjectListCardProps) {
  const projectNumber = String(index + 1).padStart(2, "0");
  const visibleTags = project.tags.slice(0, 4);
  const remainingTags = project.tags.length - visibleTags.length;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-[0_10px_34px_rgba(2,8,16,0.16)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_20px_52px_rgba(2,8,16,0.3)] focus-within:border-primary/60 motion-reduce:transform-none"
    >
      <span className="absolute inset-y-0 left-0 z-20 w-0.5 origin-bottom scale-y-0 bg-primary transition-transform duration-300 group-hover:scale-y-100" aria-hidden="true" />
      <Link
        href={`/projects/${encodeURIComponent(project.id)}`}
        aria-label={`查看作品：${project.title}`}
        className="grid min-h-64 text-foreground [text-shadow:none] focus-visible:outline-none sm:grid-cols-[minmax(230px,38%)_minmax(0,1fr)]"
      >
        <div className="relative aspect-[16/10] min-h-48 overflow-hidden border-b border-border bg-background-secondary sm:aspect-auto sm:min-h-64 sm:border-b-0 sm:border-r">
          {project.cover ? (
            <>
              <img
                src={project.cover}
                alt={`${project.title} 封面`}
                className="absolute inset-0 h-full w-full object-cover saturate-[0.88] transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.025] group-hover:saturate-100 motion-reduce:transform-none"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,13,22,0.04),rgba(7,13,22,0.18)_55%,rgba(7,13,22,0.72))]" />
            </>
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(rgba(83,216,168,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(83,216,168,0.05)_1px,transparent_1px)] bg-[size:28px_28px]">
              <FolderKanban
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 text-primary/25 transition-[color,transform] duration-300 group-hover:-translate-y-[55%] group-hover:text-primary/45"
                strokeWidth={1.25}
              />
            </div>
          )}

          <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3 font-mono text-[10px] tracking-[0.12em]">
            <span className="border border-white/15 bg-background/75 px-2.5 py-1.5 text-primary backdrop-blur-md">
              CASE / {projectNumber}
            </span>
            {project.featured && (
              <span className="inline-flex items-center gap-1.5 border border-primary/25 bg-background/80 px-2.5 py-1.5 text-primary backdrop-blur-md">
                <BadgeCheck aria-hidden="true" className="size-3.5" strokeWidth={1.7} />
                精选
              </span>
            )}
          </div>

          <div className="absolute inset-x-5 bottom-4 flex items-center justify-between gap-4 font-mono text-[9px] tracking-[0.12em] text-white/70">
            <span>PROJECT VISUAL</span>
            <span>{project.cover ? "LIVE CASE" : "NO PREVIEW"}</span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col p-5 sm:p-6 lg:p-7">
          <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="border-l-2 border-primary pl-2 font-mono text-[10px] tracking-[0.08em] text-primary">
              {project.category || "独立项目"}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-foreground-secondary/75">
              <CalendarDays aria-hidden="true" className="size-3.5" strokeWidth={1.7} />
              {formatDate(project.updatedAt)}
            </span>
          </div>

          <h2 className="mb-3 line-clamp-2 text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-[22px]">
            {project.title}
          </h2>
          <p className="mb-5 line-clamp-3 text-sm leading-7 text-foreground-secondary">
            {project.summary}
          </p>

          <div className="mb-5 flex min-h-6 flex-wrap gap-2">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-background-secondary/70 px-2.5 py-1 font-mono text-[10px] text-foreground-secondary transition-colors group-hover:border-primary/20"
              >
                {tag}
              </span>
            ))}
            {remainingTags > 0 && (
              <span className="inline-flex items-center px-1 font-mono text-[10px] text-primary/80">
                +{remainingTags}
              </span>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between gap-4 border-t border-border pt-4">
            <span className="font-mono text-[9px] tracking-[0.12em] text-foreground-secondary/55">
              OPEN CASE STUDY
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
              查看案例
              <span className="grid size-9 place-items-center rounded-md border border-primary/30 bg-primary/5 transition-[background-color,color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-primary group-hover:text-[#07120e]">
                <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.8} />
              </span>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
