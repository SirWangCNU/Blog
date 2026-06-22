"use client";

import { motion } from "framer-motion";

const education = [
  {
    year: "2024 - 至今",
    title: "计算机技术（硕士）",
    company: "首都师范大学 · 专业前10%",
    desc: "研究方向：自动驾驶农机非结构化环境地头边界感知与行为决策。获学业奖学金一等奖、研究生电子设计大赛三等奖。",
  },
  {
    year: "2019 - 2023",
    title: "软件工程（本科）",
    company: "河南科技大学 · 专业前15%",
    desc: "系统学习计算机基础，打下扎实编程功底，接触 Web 全栈开发与 AI 应用。获挑战杯二等奖、数学竞赛三等奖。",
  },
];

const experience = [
  {
    year: "2026.03 - 2026.06",
    title: "AIGC Agent 全栈开发实习生",
    company: "乐盟互动",
    desc: "主导漫剧工厂（ZCreativeFactory）与漫剧助手（ZCreativeAgent）开发，集成多模型调度、并发控制、端到端流水线，支撑近百人培训课程。",
  },
  {
    year: "2025.07 - 2026.03",
    title: "精准农业部实习生",
    company: "北京市农林科学院智能装备技术研究中心",
    desc: "研究自动驾驶农机地头感知模型，实现 DeepLabV3+ 改进、模型轻量化部署（Jetson Orin Nano）、多源数据融合行为决策算法。",
  },
];

const skills = [
  { name: "Java / Python", level: 90 },
  { name: "Spring Boot 3 / FastAPI / Django", level: 85 },
  { name: "LangChain / LangGraph / Spring AI", level: 90 },
  { name: "MySQL / PostgreSQL / Milvus", level: 85 },
  { name: "Transformer / LoRA / RLHF / TensorRT", level: 85 },
  { name: "RAG / MCP / Tool Calling", level: 90 },
  { name: "Docker / Git / WSL2 / Linux", level: 80 },
  { name: "Cursor / Claude Code / Trae", level: 90 },
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
            <span className="text-primary">{">"}</span> 王景皓，2001年生，中共党员，首都师范大学计算机技术硕士在读（专业前10%）。
          </p>
          <p className="mb-3">
            <span className="text-primary">{">"}</span> AI Agent 全栈开发者 · AIGC 架构师，专注于多模型动态调度、并发任务编排、意图驱动工作流系统。
          </p>
          <p className="mb-3">
            <span className="text-primary">{">"}</span> 曾在乐盟互动任 AIGC Agent 全栈开发实习生，主导漫剧工厂平台开发；
            在北京市农林科学院研究自动驾驶农机地头感知与决策算法。
          </p>
          <p>
            <span className="text-primary">{">"}</span> 获首都师范大学学业奖学金一等奖、研究生电子设计大赛三等奖、挑战杯二等奖。
            持有一项发明专利，一篇 SCI 1区 TOP 论文在投。
          </p>
        </div>
      </motion.div>

      {/* 教育经历 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-16"
      >
        <h2 className="text-xl font-bold text-foreground mb-6">
          <span className="text-primary">#</span> 教育经历
        </h2>
        <div className="space-y-4">
          {education.map((item, index) => (
            <motion.div
              key={item.year + item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              className="bg-card border border-primary/10 rounded-lg p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h3 className="text-foreground font-bold text-sm">{item.title}</h3>
                <span className="text-primary text-xs">{item.year}</span>
              </div>
              <p className="text-xs text-accent mb-2">{item.company}</p>
              <p className="text-xs text-foreground-secondary leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 实习经历 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mb-16"
      >
        <h2 className="text-xl font-bold text-foreground mb-6">
          <span className="text-primary">#</span> 实习经历
        </h2>
        <div className="space-y-4">
          {experience.map((item, index) => (
            <motion.div
              key={item.year + item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              className="bg-card border border-primary/10 rounded-lg p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h3 className="text-foreground font-bold text-sm">{item.title}</h3>
                <span className="text-primary text-xs">{item.year}</span>
              </div>
              <p className="text-xs text-accent mb-2">{item.company}</p>
              <p className="text-xs text-foreground-secondary leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

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
              <li>• 向量数据库：熟练使用 Milvus，支持 RAG 知识库、语义检索与向量召回场景</li>
            </ul>
          </div>
          <div>
            <span className="text-primary font-bold">后端框架：</span>
            熟练使用 Spring Boot 3 / Spring MVC / MyBatis / FastAPI / Django 等主流框架，具备优秀的 RESTful API 设计能力
          </div>
          <div>
            <span className="text-primary font-bold">深度学习：</span>
            理解 Transformer 架构，熟练运用 LoRA、RLHF 等大模型微调技术，掌握模型剪枝、量化与知识蒸馏等压缩技术
          </div>
          <div>
            <span className="text-primary font-bold">AI 框架：</span>
            熟悉 LangChain、LangGraph、Spring AI、LangChain4j 等框架，深入理解 RAG 知识库架构，熟练实现 Tool Calling
          </div>
          <div>
            <span className="text-primary font-bold">智能体与提示工程：</span>
            熟悉 MCP（Model Context Protocol）协议与 Agent Skills 规范，能设计基于 CoT、ReACT 模式的自主智能体
          </div>
          <div>
            <span className="text-primary font-bold">AI 辅助编程：</span>
            熟练使用 Vibe Coding，精通 Cursor、Claude Code、Codex、Trae 等 AI 编程工具
          </div>
          <div>
            <span className="text-primary font-bold">工程化能力：</span>
            熟练使用 Git 版本控制，熟悉 Linux/macOS 开发环境，掌握 Docker 容器化部署与 WSL2 开发环境搭建
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

      {/* 获奖荣誉 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-xl font-bold text-foreground mb-6">
          <span className="text-primary">#</span> 获奖荣誉
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: "🏆", title: "首都师范大学学业奖学金一等奖", year: "2024" },
            { icon: "🥉", title: "第二十届「兆易创新杯」研究生电子设计大赛三等奖", year: "2025" },
            { icon: "🥈", title: "「智慧路灯」挑战杯二等奖", year: "2023" },
            { icon: "🥉", title: "第十四届数学竞赛三等奖", year: "2022" },
            { icon: "📜", title: "一项发明专利", year: "2025" },
            { icon: "📄", title: "SCI 1区 TOP 论文在投", year: "2026" },
            { icon: "🌐", title: "CET-4 / CET-6", year: "" },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.08 }}
              className="bg-card border border-primary/10 rounded-lg p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-foreground text-sm font-bold">{item.title}</p>
                  {item.year && <p className="text-foreground-secondary text-xs mt-1">{item.year}</p>}
                </div>
              </div>
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
              <span className="text-primary">手机：</span>
              <span>15238180161</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-primary">邮箱：</span>
              <a href="mailto:wangjh.66668@gmail.com" className="text-accent hover:text-primary">
                wangjh.66668@gmail.com
              </a>
            </div>
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
