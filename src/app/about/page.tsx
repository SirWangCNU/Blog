"use client";

import { motion } from "framer-motion";

const timeline = [
  {
    year: "2025 - 至今",
    title: "Agent 全栈开发者",
    company: "独立项目 / 自由职业",
    desc: "独立设计并开发 ZCreativeFactory 漫剧工厂平台，集成多模型动态切换、并发任务调度、意图驱动工作流编排，成功支撑近百人 AI 漫剧培训课程。",
  },
  {
    year: "2024 - 2025",
    title: "AIGC 应用开发",
    company: "探索与实践",
    desc: "深入研究 LLM Agent 开发，掌握 LangChain/LangGraph 框架，实践 RAG、多 Agent 协作、意图识别等核心能力，完成多个 AIGC 应用的从零到一。",
  },
  {
    year: "2020 - 2024",
    title: "计算机科学与技术",
    company: "大学本科",
    desc: "系统学习计算机基础，打下扎实的编程功底，期间开始接触 Web 全栈开发和 AI 应用。",
  },
];

const skills = [
  { name: "Java / Python", level: 90 },
  { name: "Spring Boot 3 / FastAPI / Django", level: 85 },
  { name: "LangChain / LangGraph / Spring AI", level: 90 },
  { name: "MySQL / PostgreSQL / Milvus", level: 85 },
  { name: "React / Next.js / TypeScript", level: 80 },
  { name: "Transformer / LoRA / RLHF", level: 85 },
  { name: "Docker / WSL2 / Git", level: 80 },
  { name: "MCP / Agent Skills / RAG", level: 90 },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 font-mono">
      {/* 页头 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <h1 className="text-3xl font-bold text-foreground mb-4">
          <span className="text-primary">#</span> 关于我
        </h1>
        <div className="bg-card border border-primary/15 rounded-lg p-6 text-sm leading-relaxed text-foreground-secondary">
          <p className="mb-3">
            <span className="text-primary">{">"}</span> Agent 全栈开发者，专注于 AI Agent 应用开发与 AIGC 全链路架构设计。
          </p>
          <p className="mb-3">
            <span className="text-primary">{">"}</span> 擅长 Python + FastAPI + LangChain 构建智能化应用系统，
            能独立完成从模型集成、工作流编排到并发调度的全链路架构设计。
          </p>
          <p>
            <span className="text-primary">{">"}</span> 核心项目 ZCreativeFactory（漫剧工厂）集成多模型动态切换、
            并发任务调度、意图驱动工作流编排，成功支撑近百人 AI 培训课程。
          </p>
        </div>
      </motion.div>

      {/* 技能特长 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-16"
      >
        <h2 className="text-xl font-bold text-foreground mb-6">
          <span className="text-primary">#</span> 技能特长
        </h2>
        <div className="bg-card border border-primary/15 rounded-lg p-6 text-sm leading-relaxed text-foreground-secondary space-y-4">
          <div>
            <span className="text-primary font-bold">语言与工具：</span>
            熟练使用 Java、Python 进行后端开发，熟悉 Hutool、Lombok 等工具库，显著提升工程效率与代码质量
          </div>
          <div>
            <span className="text-primary font-bold">数据库：</span>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• 关系型数据库：熟练掌握 MySQL、PostgreSQL，具备数据库设计、性能调优与高并发场景优化能力</li>
              <li>• 向量数据库：深入理解 Milvus 向量数据库，支持 RAG 知识库、语义检索与向量召回场景</li>
            </ul>
          </div>
          <div>
            <span className="text-primary font-bold">后端框架：</span>
            深入掌握 Spring Boot 3 / Spring MVC / MyBatis / FastAPI / Django 等主流框架，具备优秀的 RESTful API 设计能力，擅长模块化开发与架构设计
          </div>
          <div>
            <span className="text-primary font-bold">深度学习：</span>
            理解 Transformer 架构，熟练运用 LoRA、RLHF 等大模型微调技术，掌握模型剪枝、量化与知识蒸馏等压缩技术，优化推理性能
          </div>
          <div>
            <span className="text-primary font-bold">AI 框架：</span>
            精通 LangChain、LangGraph、Spring AI、LangChain4j 等框架，构建企业级 AI 原生应用，深入理解 RAG 知识库架构，熟练实现 Tool Calling 工具调用
          </div>
          <div>
            <span className="text-primary font-bold">智能体与提示工程：</span>
            熟悉 MCP（Model Context Protocol）协议与 Agent Skills 规范，能设计基于 CoT、ReACT 模式的自主智能体，精通 CoT、Few-shot、多视角分析等 Prompt 工程策略
          </div>
          <div>
            <span className="text-primary font-bold">AI 辅助编程：</span>
            熟练掌握使用 Vibe Coding，精通 Cursor、Claude Code、Codex、Trae 等 AI 编程工具，开发效率巨大提升
          </div>
          <div>
            <span className="text-primary font-bold">工程化能力：</span>
            熟练使用 Git 进行版本控制与多人协作开发，熟练掌握 Docker 容器化部署与 WSL2 开发环境搭建，具备云服务器部署与 AI 自动化运维能力
          </div>
        </div>
      </motion.section>

      {/* 技能清单 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-16"
      >
        <h2 className="text-xl font-bold text-foreground mb-6">
          <span className="text-primary">#</span> 技能清单
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.08 }}
              className="bg-card border border-primary/10 rounded-lg p-3 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="text-foreground">{skill.name}</span>
                <span className="text-primary">{skill.level}%</span>
              </div>
              <div className="w-full h-1.5 bg-background-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.08, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #53d8a8, #64b5f6)",
                    boxShadow: "0 0 8px rgba(83, 216, 168, 0.3)",
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 核心能力 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-xl font-bold text-foreground mb-6">
          <span className="text-primary">#</span> 核心能力
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: "🤖",
              title: "AI Agent 应用开发",
              desc: "基于 LangChain/FastAPI 构建意图驱动的对话式工作流系统，支持多意图识别、状态机调度、断点续跑。",
            },
            {
              icon: "⚡",
              title: "高并发架构设计",
              desc: "任务队列 + 令牌桶限流 + 优先级调度，支撑上百任务并行执行，API 调用成功率 98%+。",
            },
            {
              icon: "🧠",
              title: "多模型动态集成",
              desc: "策略模式封装 DeepSeek/Seedream/Seedance 等模型，支持热切换与指数退避重试。",
            },
            {
              icon: "📡",
              title: "实时推送架构",
              desc: "轮询 + 增量提取伪流式方案，首内容可见时间提升 60%，支持冲突检测与 Token 自动刷新。",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="bg-card border border-primary/10 rounded-lg p-4 hover:border-primary/30 transition-colors"
            >
              <div className="text-xl mb-2">{item.icon}</div>
              <h3 className="text-foreground font-bold text-sm mb-2">{item.title}</h3>
              <p className="text-xs text-foreground-secondary leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 联系方式 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h2 className="text-xl font-bold text-foreground mb-6">
          <span className="text-primary">#</span> 联系方式
        </h2>
        <div className="bg-card border border-primary/10 rounded-lg p-5 font-mono text-sm">
          <div className="space-y-3 text-foreground-secondary">
            <div className="flex items-center gap-3">
              <span className="text-primary">GitHub：</span>
              <a href="https://github.com/SirWangCNU" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-primary">
                github.com/SirWangCNU
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-primary">博客：</span>
              <a href="https://cnuwang.cn" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-primary">
                cnuwang.cn
              </a>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
