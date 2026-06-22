"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ProjectCard } from "@/components/ProjectCard";
import { PostCard } from "@/components/PostCard";
import { AnimeHero } from "@/components/AnimeHero";
import { TypewriterText } from "@/components/TypewriterText";
import { projects } from "@/data/projects";
import { posts } from "@/data/posts";

const skills = [
  "Python",
  "Java",
  "FastAPI",
  "Spring Boot 3",
  "LangChain",
  "LangGraph",
  "Agent 开发",
  "RAG",
  "Milvus",
  "Docker",
  "MySQL",
  "Redis",
];

export default function Home() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const latestPosts = posts.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* 主页横幅 */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 overflow-hidden">
        {/* 背景大图 */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/images/hero-gaming.jpg)" }}
        />
        {/* 深色遮罩 - 保留赛博朋克氛围 */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        {/* 顶部紫蓝光晕 */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
          style={{
            background: "radial-gradient(ellipse, rgba(100, 81, 246, 0.15), transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* 底部主色调光晕 */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]"
          style={{
            background: "radial-gradient(ellipse, rgba(83, 216, 168, 0.12), transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <AnimeHero />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* 终端卡片 */}
            <div className="mb-8 inline-block">
              <div className="bg-card border border-primary/20 rounded-lg px-6 py-4 text-left font-mono text-sm">
                <div className="text-foreground-secondary/50 mb-2">
                  <span className="text-primary">root</span>
                  <span className="text-foreground-secondary">@</span>
                  <span className="text-accent">dev</span>
                  <span className="text-foreground-secondary">:</span>
                  <span className="text-primary">~</span>
                  <span className="text-foreground-secondary">$</span>
                  <span className="text-foreground ml-2">cat ./个人简介.txt</span>
                </div>
                <div className="text-foreground">
                  <span className="text-primary">{">"}</span> 姓名：王景皓
                </div>
                <div className="text-foreground">
                  <span className="text-primary">{">"}</span> 学历：首都师范大学 · 计算机技术（硕士）
                </div>
                <div className="text-foreground">
                  <span className="text-primary">{">"}</span> 方向：AI Agent · AIGC 全链路 · 多模型调度
                </div>
                <div className="text-foreground">
                  <span className="text-primary">{">"}</span> 状态：<span className="text-primary">在线</span>
                  <span className="animate-blink ml-1">█</span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 font-mono">
              王景皓
              <span className="text-primary ml-2">/</span>
              <span className="text-foreground-secondary text-3xl ml-2">技术博客</span>
            </h1>

            {/* 打字机副标题 */}
            <p className="text-lg text-foreground-secondary max-w-2xl mx-auto mb-8 font-mono leading-relaxed h-14">
              <span className="text-primary">/* </span>
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
              <span className="text-primary"> */</span>
            </p>

            {/* 按钮 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/projects"
                className="px-8 py-3 border border-primary/40 text-primary rounded font-mono hover:bg-primary/10 transition-colors"
              >
                查看项目
              </Link>
              <Link
                href="/blog"
                className="px-8 py-3 border border-primary/40 text-primary rounded font-mono hover:bg-primary/10 transition-colors"
              >
                阅读博客
              </Link>
            </div>
          </motion.div>

          {/* 技能标签 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 flex flex-wrap justify-center gap-2"
          >
            {skills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.06 }}
                className="px-3 py-1.5 rounded font-mono text-xs tag-hacker cursor-default"
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 数据统计 */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "实习经历", value: "2段", icon: "💼" },
            { label: "技术文章", value: `${posts.length}+`, icon: "📝" },
            { label: "并发任务", value: "100+", icon: "⚡" },
            { label: "发明专利", value: "1项", icon: "📜" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded border border-primary/10 p-5 font-mono text-center hover:border-primary/30 transition-colors"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-foreground-secondary mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 精选项目 */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
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
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-10"
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

      {/* 最新博客 */}
      <section className="py-20 px-4 bg-background-secondary">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold text-foreground mb-2 font-mono">
              📝 最新技术文章
            </h2>
            <p className="text-foreground-secondary text-sm">
              记录技术思考与学习笔记
            </p>
          </motion.div>

          <div className="flex flex-col gap-4">
            {latestPosts.map((post, index) => (
              <PostCard key={post.slug} post={post} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-10"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-mono text-sm transition-colors"
            >
              查看所有文章 →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 技术栈 */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold text-foreground mb-2 font-mono">
              🛠️ 技术栈
            </h2>
            <p className="text-foreground-secondary text-sm">
              我日常使用的技术和工具
            </p>
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
                items: ["Python", "FastAPI", "Java", "Spring Boot 3", "Django"],
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
                items: ["Transformer", "LoRA", "RLHF", "TensorRT", "知识蒸馏"],
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
                  <span className="text-primary font-bold">{stack.category}</span>
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
