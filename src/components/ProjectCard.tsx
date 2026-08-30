"use client";
/* eslint-disable @next/next/no-img-element -- project media URLs are administrator-managed runtime assets */

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Code2, ExternalLink, PanelsTopLeft } from "lucide-react";
import { TagBadge } from "./TagBadge";
import type { Work } from "@/lib/works/types";

interface ProjectCardProps {
  project: Work;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const detailHref = `/projects/${encodeURIComponent(project.id)}`;
  const projectNumber = String(index + 1).padStart(2, "0");
  const visibleTags = project.tags.slice(0, 3);
  const remainingTags = project.tags.length - visibleTags.length;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group relative isolate flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_18px_50px_rgba(3,10,18,0.32)] focus-within:border-primary/60 focus-within:shadow-[0_0_0_1px_rgba(83,216,168,0.18)] motion-reduce:transform-none"
    >
      <Link
        href={detailHref}
        aria-label={`查看 ${project.title} 详情`}
        className="flex flex-1 flex-col text-foreground [text-shadow:none] focus-visible:outline-none"
      >
        <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-background-secondary">
          {project.cover ? (
            <>
              <img
                src={project.cover}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transform-none"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,18,0.04),rgba(5,10,18,0.54))]" />
              <span className="absolute bottom-4 left-5 font-mono text-[10px] tracking-[0.14em] text-white/75">
                CASE FILE / {projectNumber}
              </span>
            </>
          ) : (
            <div className="absolute inset-0 overflow-hidden bg-background-secondary">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(83,216,168,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(83,216,168,0.055)_1px,transparent_1px)] bg-[size:32px_32px]" />
              <div className="absolute inset-x-5 top-5 flex items-center justify-between border-b border-primary/15 pb-3">
                <span className="font-mono text-[10px] tracking-[0.16em] text-primary">CASE FILE / {projectNumber}</span>
                <PanelsTopLeft aria-hidden="true" className="size-4 text-primary/65" strokeWidth={1.5} />
              </div>
              <div className="absolute bottom-5 left-5 right-5">
                <p className="mb-2 text-sm font-medium text-foreground">{project.category || "独立项目"}</p>
                <p className="font-mono text-[10px] leading-5 text-foreground-secondary">
                  {visibleTags.length ? visibleTags.join("  /  ") : "PROJECT DOCUMENTATION"}
                </p>
              </div>
            </div>
          )}

          {project.featured && (
            <span className="absolute right-4 top-4 border border-primary/25 bg-background/85 px-2.5 py-1 font-mono text-[9px] tracking-[0.12em] text-primary backdrop-blur-md">
              FEATURED
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col px-6 pt-5">
          <div className="mb-3 flex items-center justify-between gap-4 font-mono text-[10px] tracking-[0.12em]">
            <span className="truncate text-primary">{project.category || "PROJECT"}</span>
            <span className="shrink-0 text-foreground-secondary">{projectNumber}</span>
          </div>

          <h3 className="mb-2 text-xl font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary">
            {project.title}
          </h3>
          <p className="line-clamp-2 min-h-11 text-sm leading-[1.65] text-foreground-secondary">
            {project.summary}
          </p>

          <div className="mt-5 flex min-h-6 flex-wrap gap-2">
            {visibleTags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
            {remainingTags > 0 && (
              <span className="inline-flex items-center font-mono text-[10px] text-foreground-secondary">
                +{remainingTags}
              </span>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-border py-4">
            <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
              查看案例
            </span>
            <span className="grid size-9 place-items-center border border-primary/25 text-primary transition-[background-color,color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-primary group-hover:text-[#07120e]">
              <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.8} />
            </span>
          </div>
        </div>
      </Link>

      {(project.github || project.demo) && (
        <div className="flex min-h-11 items-center gap-5 border-t border-border bg-background-secondary/35 px-6 font-mono text-[11px]">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`在 GitHub 查看 ${project.title}`}
              className="inline-flex items-center gap-1.5 text-foreground-secondary [text-shadow:none] transition-colors hover:text-foreground"
            >
              <Code2 aria-hidden="true" className="size-3.5" strokeWidth={1.7} />
              GitHub
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`在线体验 ${project.title}`}
              className="inline-flex items-center gap-1.5 text-primary [text-shadow:none] transition-colors hover:text-primary-hover"
            >
              <ExternalLink aria-hidden="true" className="size-3.5" strokeWidth={1.7} />
              在线体验
            </a>
          )}
        </div>
      )}
    </motion.article>
  );
}
