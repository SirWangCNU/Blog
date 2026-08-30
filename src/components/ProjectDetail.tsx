"use client";
/* eslint-disable @next/next/no-img-element -- project media URLs are administrator-managed runtime assets */

import type { ReactNode } from "react";
import { isValidElement, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Braces,
  Code2,
  Database,
  Scale,
  Server,
  Workflow,
} from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { TagBadge } from "@/components/TagBadge";
import type { Work } from "@/lib/works/types";

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface ProjectDetailProps {
  work: Work;
  relatedWorks: Work[];
}

interface MarkdownAstNode {
  type: string;
  value?: string;
  tagName?: string;
  properties?: { src?: unknown };
  children?: MarkdownAstNode[];
}

function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, "-")
    .replace(/^-|-$/g, "");
}

function createHeadingSlugger() {
  const counts = new Map<string, number>();

  return (text: string) => {
    const base = headingId(text) || "section";
    const count = (counts.get(base) || 0) + 1;
    counts.set(base, count);
    return count === 1 ? base : `${base}-${count}`;
  };
}

function plainHeadingText(markdown: string) {
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_~]/g, "")
    .replace(/\s+#+\s*$/, "")
    .trim();
}

function extractToc(markdown: string): TocItem[] {
  const nextSlug = createHeadingSlugger();

  return markdown.split("\n").flatMap((line) => {
    const match = line.match(/^(#{2,3})\s+(.+)/);
    if (!match) return [];
    const text = plainHeadingText(match[2]);
    return [{ id: nextSlug(text), text, level: match[1].length as 2 | 3 }];
  });
}

function nodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return nodeText(node.props.children);
  return "";
}

function isShieldBadge(src?: string) {
  return Boolean(src && /^https?:\/\/img\.shields\.io\/badge\//i.test(src));
}

function shieldBadgeLabel(src: string, alt?: string) {
  const fallback = alt?.trim() || "Technology";

  try {
    const marker = "/badge/";
    const pathname = new URL(src).pathname;
    const badgePath = pathname.slice(pathname.indexOf(marker) + marker.length);
    const protectedHyphens = decodeURIComponent(badgePath).replaceAll("--", "\u0000");
    const parts = protectedHyphens
      .split("-")
      .map((part) => part.replaceAll("\u0000", "-").replaceAll("_", " ").trim());
    const detail = parts.slice(1, -1).join(" ").trim();

    if (!detail || fallback.toLowerCase().includes(detail.toLowerCase())) return fallback;
    return `${fallback} ${detail}`;
  } catch {
    return fallback;
  }
}

function isBadgeMarkdownNode(node: MarkdownAstNode): boolean {
  if (node.type === "text") return !node.value?.trim();
  if (node.type !== "element") return false;
  if (node.tagName === "img") return isShieldBadge(String(node.properties?.src || ""));
  return false;
}

function BadgeIcon({ label }: { label: string }) {
  const normalized = label.toLowerCase();
  const iconProps = { "aria-hidden": true as const, className: "size-4", strokeWidth: 1.7 };

  if (/license|许可/.test(normalized)) return <Scale {...iconProps} />;
  if (/database|redis|mysql|postgres|milvus|数据库/.test(normalized)) return <Database {...iconProps} />;
  if (/api|backend|server|fastapi|后端/.test(normalized)) return <Server {...iconProps} />;
  if (/agent|langgraph|workflow|智能体/.test(normalized)) return <Workflow {...iconProps} />;
  if (/react|next|frontend|前端/.test(normalized)) return <Braces {...iconProps} />;
  return <Code2 {...iconProps} />;
}

function TechBadge({ label }: { label: string }) {
  const [name, ...detailParts] = label.trim().split(/\s+/);
  const detail = detailParts.join(" ");

  return (
    <li className="group/tech inline-flex min-h-11 max-w-full items-stretch overflow-hidden rounded-md border border-border bg-background-secondary/75 text-left shadow-[0_8px_24px_rgba(2,8,16,0.18)] transition-[border-color,background-color,transform] hover:-translate-y-0.5 hover:border-primary/45 hover:bg-card motion-reduce:transform-none">
      <span className="grid w-11 shrink-0 place-items-center border-r border-border bg-primary/8 text-primary transition-colors group-hover/tech:bg-primary group-hover/tech:text-[#07120e]">
        <BadgeIcon label={label} />
      </span>
      <span className="flex min-w-0 items-center gap-2 px-3 py-2 font-mono">
        <span className="truncate text-xs font-semibold text-foreground">{name || "TECH"}</span>
        {detail && " "}
        {detail && <span className="truncate text-[10px] text-foreground-secondary">{detail}</span>}
      </span>
    </li>
  );
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed left-0 top-0 z-[100] h-[3px] w-full" aria-hidden="true">
      <div
        className="h-full bg-primary transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function ProjectToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => Boolean(heading));
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeading = entries.find((entry) => entry.isIntersecting);
        if (visibleHeading) setActiveId(visibleHeading.target.id);
      },
      { rootMargin: "-96px 0px -70% 0px" }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="作品目录">
      <p className="mb-3 font-mono text-[11px] text-foreground">CONTENTS / 目录</p>
      <div className="space-y-1">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block border-l-2 py-1.5 text-sm transition-colors ${
              item.level === 3 ? "pl-6" : "pl-3"
            } ${
              activeId === item.id
                ? "border-primary bg-primary/5 text-primary"
                : "border-transparent text-foreground-secondary hover:border-border hover:text-foreground"
            }`}
          >
            {item.text}
          </a>
        ))}
      </div>
    </nav>
  );
}

function ActionLink({ href, children, primary = false }: { href: string; children: ReactNode; primary?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex min-h-11 items-center justify-between border px-4 text-sm font-medium transition-colors ${
        primary
          ? "border-primary bg-primary text-[#07120e] hover:bg-primary-hover"
          : "border-border text-foreground hover:border-primary/45 hover:text-primary"
      }`}
    >
      <span>{children}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}

export function ProjectDetail({ work, relatedWorks }: ProjectDetailProps) {
  const toc = extractToc(work.content);
  const nextRenderedHeadingSlug = createHeadingSlugger();
  const updatedDate = new Date(work.updatedAt).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <ReadingProgress />
      <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:py-12">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          aria-label="面包屑导航"
          className="mb-6 flex items-center gap-2 text-sm text-foreground-secondary"
        >
          <Link href="/" className="transition-colors hover:text-primary">首页</Link>
          <span aria-hidden="true">/</span>
          <Link href="/projects" className="transition-colors hover:text-primary">作品集</Link>
          <span aria-hidden="true">/</span>
          <span className="truncate text-foreground">{work.category || "项目案例"}</span>
        </motion.nav>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-w-0 overflow-hidden rounded-xl border border-border bg-card"
          >
            <header className="border-b border-border px-6 pb-7 pt-8 sm:px-8">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
                  {work.category || "项目案例"}
                </span>
                <time className="text-sm text-foreground-secondary">更新于 {updatedDate}</time>
                {work.featured && <span className="font-mono text-[10px] text-primary">FEATURED WORK</span>}
              </div>
              <h1 className="mb-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl">{work.title}</h1>
              <p className="mb-5 max-w-3xl text-base leading-7 text-foreground-secondary sm:text-lg">{work.summary}</p>
              <div className="flex flex-wrap gap-2">
                {work.tags.map((tag) => <TagBadge key={tag} tag={tag} variant="primary" />)}
              </div>
            </header>

            <figure className="border-b border-border bg-background-secondary p-3 sm:p-5">
              <div className="relative aspect-[16/9] overflow-hidden bg-[linear-gradient(135deg,rgba(83,216,168,0.14),transparent_58%)]">
                {work.cover ? (
                  <img src={work.cover} alt={`${work.title} 封面`} className="h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="font-mono text-sm text-primary">PROJECT / {work.id}</span>
                  </div>
                )}
                <span className="absolute bottom-3 right-3 border border-white/20 bg-black/55 px-2 py-1 font-mono text-[9px] text-white/75 backdrop-blur">CASE STUDY</span>
              </div>
            </figure>

            <div
              className="px-6 py-8 text-base leading-[1.85] text-foreground sm:px-8 sm:py-10
                [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:scroll-mt-20 [&_h2]:border-b [&_h2]:border-border [&_h2]:pb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground
                [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:scroll-mt-20 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground
                [&_p]:mb-4 [&_p]:leading-[1.85] [&_p]:text-foreground-secondary
                [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_ul]:text-foreground-secondary
                [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-foreground-secondary
                [&_li]:leading-relaxed
                [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary-hover
                [&_strong]:font-semibold [&_strong]:text-foreground
                [&_code]:rounded [&_code]:bg-code-bg [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-primary
                [&_pre]:mb-6 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-[#0d1117] [&_pre]:p-5 [&_pre]:text-sm [&_pre]:leading-relaxed
                [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm [&_pre_code]:text-[#c9d1d9]
                [&_blockquote]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-primary/5 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:text-foreground-secondary"
            >
              <ReactMarkdown
                components={{
                  h2: ({ children }) => <h2 id={nextRenderedHeadingSlug(nodeText(children))}>{children}</h2>,
                  h3: ({ children }) => <h3 id={nextRenderedHeadingSlug(nodeText(children))}>{children}</h3>,
                  p: ({ node, children }) => {
                    const badgeOnly = node
                      ? node.children.length > 0 && node.children.every((child) =>
                          isBadgeMarkdownNode(child as MarkdownAstNode),
                        )
                      : false;

                    return badgeOnly ? (
                      <ul
                        aria-label="技术栈"
                        className="mb-7 flex list-none flex-wrap gap-2.5 border-y border-border/70 py-4 pl-0"
                      >
                        {children}
                      </ul>
                    ) : (
                      <p>{children}</p>
                    );
                  },
                  a: ({ children, href, title }) => (
                    <a href={href} title={title} target="_blank" rel="noopener noreferrer">{children}</a>
                  ),
                  img: ({ alt, src, title }) => {
                    const imageSrc = typeof src === "string" ? src : undefined;

                    return isShieldBadge(imageSrc) ? (
                      <TechBadge label={shieldBadgeLabel(imageSrc || "", alt)} />
                    ) : (
                      <img
                        src={imageSrc}
                        alt={alt || "作品图片"}
                        title={title}
                        loading="lazy"
                        className="my-7 block max-h-[680px] w-full rounded-lg border border-border bg-background-secondary object-contain shadow-[0_16px_40px_rgba(2,8,16,0.24)]"
                      />
                    );
                  },
                }}
              >
                {work.content || work.summary}
              </ReactMarkdown>
            </div>

            {work.gallery && work.gallery.length > 0 && (
              <section className="border-t border-border px-6 py-8 sm:px-8" aria-labelledby="project-gallery-title">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="mb-2 font-mono text-[10px] text-primary">GALLERY</p>
                    <h2 id="project-gallery-title" className="text-xl font-bold text-foreground">作品截图</h2>
                  </div>
                  <span className="font-mono text-xs text-foreground-secondary">{String(work.gallery.length).padStart(2, "0")}</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {work.gallery.map((url, index) => (
                    <a key={`${url}-${index}`} href={url} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden border border-border bg-background-secondary">
                      <img
                        src={url}
                        alt={`${work.title} 截图 ${index + 1}`}
                        loading="lazy"
                        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </a>
                  ))}
                </div>
              </section>
            )}

            <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-background-secondary/30 px-6 py-5 sm:px-8">
              <span className="font-mono text-xs text-foreground-secondary">PROJECT / {work.id}</span>
              <Link href="/projects" className="text-sm text-primary transition-colors hover:text-primary-hover">← 返回作品集</Link>
            </footer>
          </motion.article>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-5 lg:sticky lg:top-24"
          >
            {(work.demo || work.github || work.doc) && (
              <section className="space-y-2 border border-border bg-card p-5" aria-labelledby="project-actions-title">
                <h2 id="project-actions-title" className="mb-4 font-mono text-[11px] text-foreground">PROJECT LINKS</h2>
                {work.demo && <ActionLink href={work.demo} primary>在线演示</ActionLink>}
                {work.github && <ActionLink href={work.github}>源代码</ActionLink>}
                {work.doc && <ActionLink href={work.doc}>项目文档</ActionLink>}
              </section>
            )}

            <section className="border border-border bg-card p-5" aria-labelledby="project-profile-title">
              <h2 id="project-profile-title" className="mb-4 font-mono text-[11px] text-foreground">PROJECT PROFILE</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-border pb-3">
                  <dt className="text-foreground-secondary">分类</dt>
                  <dd className="text-right text-foreground">{work.category || "未分类"}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border pb-3">
                  <dt className="text-foreground-secondary">状态</dt>
                  <dd className="text-primary">已发布</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-border pb-3">
                  <dt className="text-foreground-secondary">技术标签</dt>
                  <dd className="text-foreground">{work.tags.length}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-foreground-secondary">最近更新</dt>
                  <dd className="text-right text-foreground">{new Date(work.updatedAt).toLocaleDateString("zh-CN")}</dd>
                </div>
              </dl>
            </section>

            {toc.length > 0 && (
              <section className="border border-border bg-card p-5">
                <ProjectToc items={toc} />
              </section>
            )}

            <Link href="/projects" className="flex min-h-11 items-center justify-center border border-primary/20 bg-primary/10 text-sm font-medium text-primary transition-colors hover:bg-primary/20">← 返回作品集</Link>
          </motion.aside>
        </div>

        {relatedWorks.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-12 border-t border-border pt-8"
            aria-labelledby="related-works-title"
          >
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 font-mono text-[10px] text-primary">KEEP EXPLORING</p>
                <h2 id="related-works-title" className="text-xl font-bold text-foreground">相关作品</h2>
              </div>
              <Link href="/projects" className="text-sm text-foreground-secondary transition-colors hover:text-primary">查看全部 →</Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedWorks.map((relatedWork, index) => <ProjectCard key={relatedWork.id} project={relatedWork} index={index} />)}
            </div>
          </motion.section>
        )}
      </main>
    </>
  );
}
