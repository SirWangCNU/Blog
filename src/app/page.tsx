"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ProjectCard } from "@/components/ProjectCard";
import { TypewriterText } from "@/components/TypewriterText";
import { Sidebar } from "@/components/Sidebar";
import { projects } from "@/data/projects";
import { posts } from "@/data/posts";
import { categories } from "@/data/posts";

export default function Home() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const latestPosts = posts.slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* ===== 全屏 Hero 头图 ===== */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* 背景视频 - 仅在 Hero 区域 */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="/images/hero-beach.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* 深色遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#101520]/60 via-[#101520]/40 to-[#101520] z-[1]" />

        {/* 内容 */}
        <div className="relative z-[2] text-center max-w-3xl mx-auto">
          {/* 头像 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/20">
              <Image
                src="/images/883f9f9c8dfd4f8b99cc8abe8c997333.jpg"
                alt="王景皓头像"
                width={112}
                height={112}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </motion.div>

          {/* 博客标题 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-3 font-mono"
          >
            欢迎来到王景皓的技术博客
          </motion.h1>

          {/* 打字机副标题 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-white/80 mb-6 font-mono h-14"
          >
            <TypewriterText
              texts={[
                "专注于 AI Agent 应用开发与 AIGC 全链路架构设计",
                "擅长多模型动态调度、并发任务编排、意图驱动工作流系统",
                "自动驾驶农机感知与决策研究",
                "漫剧工厂 — AIGC 全流程自动化创作平台",
              ]}
              typingSpeed={60}
              deletingSpeed={30}
              pauseTime={2500}
            />
          </motion.div>

          {/* 社交图标 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <a
              href="https://github.com/SirWangCNU"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-primary/30 hover:text-primary transition-all border border-white/20"
              title="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <Link
              href="/about"
              className="px-5 py-2 bg-white/10 backdrop-blur text-white rounded-full text-sm font-mono hover:bg-primary/30 hover:text-primary transition-all border border-white/20"
            >
              关于我
            </Link>
            <Link
              href="/blog"
              className="px-5 py-2 bg-primary/80 backdrop-blur text-white rounded-full text-sm font-mono hover:bg-primary transition-all border border-primary/40"
            >
              阅读博客
            </Link>
          </motion.div>
        </div>

        {/* 向下滚动箭头 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-white/40 text-2xl cursor-pointer"
            onClick={() =>
              document
                .getElementById("content-area")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            ▼
          </motion.div>
        </motion.div>
      </section>

      {/* ===== 主内容区 ===== */}
      <div
        id="content-area"
        className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* 彩色浮动光斑装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-[10%] w-64 h-64 rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle, #53d8a8, transparent 70%)", filter: "blur(40px)" }}
          />
          <motion.div
            animate={{ x: [0, -25, 35, 0], y: [0, 30, -25, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 right-[15%] w-48 h-48 rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(circle, #64b5f6, transparent 70%)", filter: "blur(40px)" }}
          />
          <motion.div
            animate={{ x: [0, 20, -30, 0], y: [0, -20, 40, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-40 left-[30%] w-56 h-56 rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, #a78bfa, transparent 70%)", filter: "blur(40px)" }}
          />
          <motion.div
            animate={{ x: [0, -15, 25, 0], y: [0, 35, -15, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-[25%] w-40 h-40 rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(circle, #f472b6, transparent 70%)", filter: "blur(40px)" }}
          />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row gap-8">
          {/* 左侧：文章列表 */}
          <div className="flex-1 min-w-0">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl font-bold text-foreground mb-6 font-mono flex items-center gap-2"
            >
              📝 最新文章
            </motion.h2>

            <div className="space-y-5">
              {latestPosts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group bg-card border border-primary/10 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex flex-col md:flex-row"
                  >
                    {/* 封面图 */}
                    <div
                      className={`relative w-full md:w-56 h-40 md:h-auto flex-shrink-0 overflow-hidden ${
                        index % 2 === 0 ? "" : "md:order-2"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-5xl opacity-20 group-hover:opacity-30 transition-opacity group-hover:scale-110 transition-transform duration-500">
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
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                    </div>

                    {/* 内容区 */}
                    <div className="flex-1 p-5">
                      {/* 分类 + 标签 */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="px-2 py-0.5 text-xs rounded-full bg-primary/15 text-primary border border-primary/30">
                          {post.category}
                        </span>
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs rounded-full bg-background-secondary text-foreground-secondary border border-border"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* 标题 */}
                      <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      {/* 摘要 */}
                      <p className="text-sm text-foreground-secondary leading-relaxed mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* 日期 + 阅读时长 */}
                      <div className="flex items-center gap-4 text-xs text-foreground-secondary/70">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-3.5 h-3.5"
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
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {/* 查看全部 */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-primary/30 text-primary rounded-lg font-mono text-sm hover:bg-primary/10 transition-colors"
              >
                查看全部文章 →
              </Link>
            </motion.div>
          </div>

          {/* 右侧：信息栏 */}
          <Sidebar />
        </div>
      </div>

      {/* ===== 精选项目 ===== */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold text-foreground mb-2 font-mono">
              ✨ 精选项目
            </h2>
            <p className="text-foreground-secondary text-sm">
              这些是我最引以为傲的作品
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-mono text-sm transition-colors"
            >
              查看所有项目 →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== 技术栈 ===== */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold text-foreground mb-2 font-mono">
              🛠️ 技术栈
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                category: "AI / Agent",
                items: ["LangChain", "LangGraph", "Spring AI", "RAG", "MCP"],
                icon: "🤖",
              },
              {
                category: "后端开发",
                items: [
                  "Python",
                  "FastAPI",
                  "Java",
                  "Spring Boot 3",
                  "Django",
                ],
                icon: "⚙️",
              },
              {
                category: "数据库",
                items: ["MySQL", "PostgreSQL", "Milvus", "Redis"],
                icon: "🗄️",
              },
              {
                category: "AIGC 模型",
                items: ["DeepSeek", "Seedream", "Seedance", "Qwen", "GPT-5"],
                icon: "🧠",
              },
              {
                category: "深度学习",
                items: [
                  "Transformer",
                  "LoRA",
                  "RLHF",
                  "TensorRT",
                  "知识蒸馏",
                ],
                icon: "📊",
              },
              {
                category: "工程化",
                items: ["Docker", "Nginx", "PM2", "Git", "WSL2"],
                icon: "🔧",
              },
            ].map((stack, index) => (
              <motion.div
                key={stack.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded border border-primary/10 p-5 font-mono hover:border-primary/30 transition-colors"
              >
                <div className="text-sm mb-3">
                  <span className="text-xl mr-2">{stack.icon}</span>
                  <span className="text-primary font-bold">
                    {stack.category}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stack.items.map((item) => (
                    <span
                      key={item}
                      className="px-2 py-1 bg-background-secondary rounded text-xs text-foreground-secondary border border-border"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
