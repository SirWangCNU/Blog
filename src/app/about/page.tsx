"use client";

import { motion } from "framer-motion";
import type { Metadata } from "next";

const timeline = [
  {
    year: "2024 - 至今",
    title: "前端开发工程师",
    company: "XX 科技有限公司",
    description: "负责公司核心产品的前端架构设计和开发工作。",
  },
  {
    year: "2023 - 2024",
    title: "前端开发实习生",
    company: "YY 互联网公司",
    description: "参与多个项目的开发，积累了丰富的实战经验。",
  },
  {
    year: "2020 - 2024",
    title: "计算机科学与技术",
    company: "XX 大学",
    description: "本科学习期间打下了坚实的计算机基础。",
  },
];

const skills = [
  { name: "React / Next.js", level: 90 },
  { name: "TypeScript", level: 85 },
  { name: "Node.js", level: 75 },
  { name: "Python", level: 70 },
  { name: "CSS / Tailwind", level: 90 },
  { name: "Git / DevOps", level: 80 },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-5xl font-bold shadow-lg mb-6">
          👤
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          关于我
        </h1>
        <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
          一个热爱技术、热爱生活的开发者。喜欢探索新技术，分享学习心得，
          用代码创造有价值的东西。
        </p>
      </motion.div>

      {/* About Text */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">📖 自我介绍</h2>
        <div className="bg-card rounded-xl border border-border p-6 space-y-4 text-foreground-secondary">
          <p>
            我是一名全栈开发者，拥有多年的 Web 开发经验。专注于使用 React
            生态系统构建高质量的用户界面和交互体验。
          </p>
          <p>
            在技术之外，我热爱阅读、摄影和旅行。我相信好的产品不仅需要扎实的技术，
            更需要对用户需求的深刻理解。
          </p>
          <p>
            这个博客是我的数字花园，记录着我在技术道路上的思考和成长。
            希望我的分享能对你有所帮助。
          </p>
        </div>
      </motion.section>

      {/* Experience Timeline */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">
          💼 经历时间线
        </h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="relative pl-12"
              >
                {/* Dot */}
                <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-primary border-2 border-background shadow" />

                <div className="bg-card rounded-xl border border-border p-5">
                  <span className="text-sm text-primary font-medium">
                    {item.year}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground mt-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-foreground-secondary">
                    {item.company}
                  </p>
                  <p className="text-sm text-foreground-secondary mt-2">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Skills */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">
          🛠️ 技能清单
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="bg-card rounded-xl border border-border p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">
                  {skill.name}
                </span>
                <span className="text-sm text-foreground-secondary">
                  {skill.level}%
                </span>
              </div>
              <div className="w-full h-2 bg-background-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{
                    duration: 1,
                    delay: 0.6 + index * 0.1,
                    ease: "easeOut",
                  }}
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">
          📫 联系方式
        </h2>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="mailto:your@email.com"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-background-secondary transition-colors"
            >
              <span className="text-xl">📧</span>
              <div>
                <p className="font-medium text-foreground">Email</p>
                <p className="text-sm text-foreground-secondary">
                  your@email.com
                </p>
              </div>
            </a>
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-background-secondary transition-colors"
            >
              <span className="text-xl">🐙</span>
              <div>
                <p className="font-medium text-foreground">GitHub</p>
                <p className="text-sm text-foreground-secondary">
                  github.com/yourusername
                </p>
              </div>
            </a>
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-background-secondary transition-colors"
            >
              <span className="text-xl">🐦</span>
              <div>
                <p className="font-medium text-foreground">Twitter</p>
                <p className="text-sm text-foreground-secondary">
                  @yourusername
                </p>
              </div>
            </a>
            <div className="flex items-center gap-3 p-3 rounded-lg">
              <span className="text-xl">💬</span>
              <div>
                <p className="font-medium text-foreground">微信</p>
                <p className="text-sm text-foreground-secondary">
                  your_wechat_id
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
