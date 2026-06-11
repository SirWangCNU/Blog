"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ProjectCard } from "@/components/ProjectCard";
import { PostCard } from "@/components/PostCard";
import { projects } from "@/data/projects";
import { posts } from "@/data/posts";

const skills = [
<<<<<<< HEAD
  "Python",
  "FastAPI",
  "LangChain",
  "Agent 开发",
  "AIGC",
  "Next.js",
  "TypeScript",
  "Docker",
  "MySQL",
  "Redis",
  "并发编程",
  "Linux",
=======
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Tailwind CSS",
  "Python",
  "Git",
  "Docker",
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
];

export default function Home() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const latestPosts = posts.slice(0, 3);

  return (
    <div className="flex flex-col">
<<<<<<< HEAD
      {/* 主页横幅 */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4">
=======
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
<<<<<<< HEAD
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
                  <span className="text-primary">{">"}</span> 职位：Agent 全栈开发者 · AIGC 架构师
                </div>
                <div className="text-foreground">
                  <span className="text-primary">{">"}</span> 方向：AI Agent · 多模型调度 · 并发架构
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
            <p className="text-lg text-foreground-secondary max-w-2xl mx-auto mb-8 font-mono leading-relaxed">
              <span className="text-primary">/* </span>
              专注于 AI Agent 应用开发与 AIGC 全链路架构设计。
              <br />
              擅长多模型动态调度、并发任务编排、意图驱动工作流系统。
              <span className="text-primary"> */</span>
            </p>

            {/* 按钮 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/projects"
                className="px-8 py-3 border border-primary/40 text-primary rounded font-mono hover:bg-primary/10 transition-colors"
=======
            {/* Avatar */}
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                👋
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
              Hi, 我是{" "}
              <span className="text-primary">王景皓</span>
            </h1>
            <p className="text-xl sm:text-2xl text-foreground-secondary mb-2">
              Agent 全栈开发者
            </p>
            <p className="text-lg text-foreground-secondary max-w-2xl mx-auto mb-8">
              热爱技术，专注于构建智能化的 Agent应用。在这里分享我的项目、思考和学习笔记。
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/projects"
                className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25"
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
              >
                查看项目
              </Link>
              <Link
                href="/blog"
<<<<<<< HEAD
                className="px-8 py-3 border border-primary/40 text-primary rounded font-mono hover:bg-primary/10 transition-colors"
=======
                className="px-8 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-background-secondary transition-colors"
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
              >
                阅读博客
              </Link>
            </div>
          </motion.div>

<<<<<<< HEAD
          {/* 技能标签 */}
=======
          {/* Skills */}
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
<<<<<<< HEAD
            className="mt-16 flex flex-wrap justify-center gap-2"
=======
            className="mt-16 flex flex-wrap justify-center gap-3"
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
          >
            {skills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
<<<<<<< HEAD
                transition={{ duration: 0.3, delay: 0.5 + index * 0.06 }}
                className="px-3 py-1.5 rounded font-mono text-xs tag-hacker cursor-default"
=======
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="px-4 py-2 bg-background-secondary rounded-full text-sm font-medium text-foreground-secondary border border-border hover:border-primary/30 hover:text-primary transition-all cursor-default"
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

<<<<<<< HEAD
      {/* 数据统计 */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "项目经验", value: "3+", icon: "🚀" },
            { label: "技术文章", value: `${posts.length}+`, icon: "📝" },
            { label: "并发任务", value: "100+", icon: "⚡" },
            { label: "服务用户", value: "100+", icon: "👥" },
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
=======
      {/* Featured Projects */}
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
<<<<<<< HEAD
            <h2 className="text-2xl font-bold text-foreground mb-2 font-mono">
              ✨ 精选项目
            </h2>
            <p className="text-foreground-secondary text-sm">
=======
            <h2 className="text-3xl font-bold text-foreground mb-4">
              ✨ 精选项目
            </h2>
            <p className="text-foreground-secondary">
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
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
<<<<<<< HEAD
              className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-mono text-sm transition-colors"
            >
              查看所有项目 →
=======
              className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-medium transition-colors"
            >
              查看所有项目
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
            </Link>
          </motion.div>
        </div>
      </section>

<<<<<<< HEAD
      {/* 最新博客 */}
=======
      {/* Latest Posts */}
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
      <section className="py-20 px-4 bg-background-secondary">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
<<<<<<< HEAD
            <h2 className="text-2xl font-bold text-foreground mb-2 font-mono">
              📝 最新技术文章
            </h2>
            <p className="text-foreground-secondary text-sm">
=======
            <h2 className="text-3xl font-bold text-foreground mb-4">
              📝 最新博客
            </h2>
            <p className="text-foreground-secondary">
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
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
<<<<<<< HEAD
              className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-mono text-sm transition-colors"
            >
              查看所有文章 →
=======
              className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-medium transition-colors"
            >
              查看所有文章
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
            </Link>
          </motion.div>
        </div>
      </section>
<<<<<<< HEAD

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
                items: ["LangChain", "LangGraph", "OpenAI SDK", "RAG", "向量数据库"],
                icon: "🤖",
              },
              {
                category: "后端开发",
                items: ["Python", "FastAPI", "Node.js", "MySQL", "Redis"],
                icon: "⚙️",
              },
              {
                category: "前端开发",
                items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
                icon: "🎨",
              },
              {
                category: "AIGC 模型",
                items: ["DeepSeek", "Seedream", "Seedance", "GPT-4", "Claude"],
                icon: "🧠",
              },
              {
                category: "运维部署",
                items: ["Docker", "Nginx", "PM2", "Linux", "Git"],
                icon: "🔧",
              },
              {
                category: "架构设计",
                items: ["并发调度", "状态机", "策略模式", "任务队列", "微服务"],
                icon: "📐",
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
=======
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
    </div>
  );
}
