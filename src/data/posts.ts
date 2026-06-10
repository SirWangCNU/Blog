export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  category: string;
  content: string;
}

export const posts: Post[] = [
  {
    slug: "zcreativefactory-ai-comic-engine",
    title: "ZCreativeFactory 漫剧工厂 — AIGC 全流程自动化漫剧创作平台",
    excerpt:
      "从零到一打造 AIGC 漫剧创作平台，集成多模型动态切换、并发任务调度、意图驱动工作流编排、轮询式增量流推送等核心技术。",
    date: "2026-06-10",
    readTime: "15 分钟",
    tags: ["AIGC", "Agent", "FastAPI", "LangChain", "架构设计"],
    category: "AIGC",
    content: `
## 项目背景

ZCreativeFactory（漫剧工厂）是一款面向 AIGC 创作者的漫剧创作平台，目标是让零基础用户也能轻松完成漫剧创作。

## 核心架构设计

### 1. 多模型动态切换架构

集成 DeepSeek（文本）、Seedream（图像）、Seedance 2.0（视频）等模型，基于策略模式实现热切换与指数退避重试。

### 2. 并发任务调度

任务队列 + 令牌桶限流 + 优先级调度，支撑上百任务并行。

### 3. 意图驱动工作流编排

基于 FastAPI + LangChain 构建，LLM 优先 + 规则兜底双策略意图识别，支持 13 种意图自动路由。

### 4. 轮询式增量流推送

轮询 + 增量提取伪流式架构，首内容可见时间提升 60%。

## 项目成果

支撑近百人培训课程，效率提升 5 倍以上。
    `,
  },
  {
    slug: "python-async-concurrency-guide",
    title: "Python 并发编程完全指南：多线程、多进程与异步协程",
    excerpt:
      "深入解析 Python 三种并发模型的原理、适用场景和常见陷阱，帮你选对并发方案。",
    date: "2026-06-08",
    readTime: "12 分钟",
    tags: ["Python", "并发", "asyncio", "多线程"],
    category: "后端",
    content: `
## 三种并发模型

### 多线程 threading
一个进程内多个线程，共享内存，受 GIL 限制。适合 I/O 密集型。

### 多进程 multiprocessing
独立进程，不受 GIL 限制，能利用多核。适合 CPU 密集型。

### 异步协程 asyncio
单线程事件循环，协程主动让出控制权。适合高并发 I/O。

## GIL 是什么
全局解释器锁，同一时刻只有一个线程执行 Python 字节码。

## 怎么选
- I/O 等待用线程或异步
- CPU 计算用多进程
- 高并发连接用异步
    `,
  },
  {
    slug: "agent-development-guide-2026",
    title: "Agent 开发实战指南：架构设计、调试技巧与并发方案",
    excerpt:
      "从 ReAct 模式到 Multi-Agent 系统，全面讲解 Agent 开发的核心概念、常见问题和解决方案。",
    date: "2026-06-05",
    readTime: "18 分钟",
    tags: ["Agent", "LangChain", "LLM", "架构设计"],
    category: "AIGC",
    content: `
## Agent 核心组件
LLM（大脑）+ Tools（工具）+ Memory（记忆）+ Planning（规划）

## ReAct 模式
Reasoning + Acting，思考 - 行动 - 观察循环。

## 常见问题
- 死循环：限制最大迭代次数
- Token 超限：文本分割 + 摘要压缩
- 工具调用失败：错误处理 + 指数退避
- 并发问题：Semaphore + Lock

## 框架选择
- LangChain：生态完善
- LangGraph：复杂工作流
- AutoGen：多 Agent 对话
- CrewAI：角色扮演
    `,
  },
  {
    slug: "fastapi-high-performance-api",
    title: "FastAPI 高性能 API 开发实践",
    excerpt:
      "FastAPI 的异步特性、依赖注入、中间件设计和性能优化技巧。",
    date: "2026-05-28",
    readTime: "10 分钟",
    tags: ["FastAPI", "Python", "异步", "API"],
    category: "后端",
    content: `
## 为什么选 FastAPI
- 原生异步支持
- 自动生成 OpenAPI 文档
- 类型提示驱动的参数验证
- 性能媲美 Node.js 和 Go

## 依赖注入
FastAPI 的依赖注入系统让代码更模块化、可测试。

## 中间件设计
CORS、日志、认证、限流都可以通过中间件实现。

## 性能优化
- 异步数据库驱动
- 连接池管理
- 响应缓存
- 并发控制
    `,
  },
  {
    slug: "rag-knowledge-base-practice",
    title: "RAG 知识库实战：从文档加载到向量检索",
    excerpt:
      "手把手搭建 RAG 知识库系统，涵盖文档解析、文本分割、Embedding、向量存储和检索优化。",
    date: "2026-05-20",
    readTime: "14 分钟",
    tags: ["RAG", "向量数据库", "LangChain", "Embedding"],
    category: "AIGC",
    content: `
## RAG 是什么
Retrieval-Augmented Generation，检索增强生成。

## 核心流程
1. 文档加载与解析
2. 文本分割（Chunking）
3. Embedding 向量化
4. 存入向量数据库
5. 查询时检索相关文档
6. 拼入 Prompt 生成答案

## 优化技巧
- 分块大小：1000-2000 token
- 重叠区域：100-200 token
- 混合检索：向量 + 关键词
- 重排序：Reranker 提升精度
    `,
  },
  {
    slug: "building-modern-blog-with-nextjs",
    title: "如何用 Next.js 构建现代博客",
    excerpt:
      "从零开始搭建一个功能完整的个人博客，涵盖技术选型、页面设计、内容管理等核心环节。",
    date: "2026-05-15",
    readTime: "8 分钟",
    tags: ["Next.js", "教程", "前端"],
    category: "前端",
    content: `
## 为什么选择 Next.js
SSR、SSG、App Router、图片优化，开箱即用。

## 页面设计
首页、博客列表、博客详情、项目展示、关于页。

## 总结
Next.js 既能满足静态博客的性能需求，又具备动态渲染的灵活性。
    `,
  },
  {
    slug: "docker-deploy-guide",
    title: "Docker 部署实战：从镜像构建到容器编排",
    excerpt:
      "Docker 基础概念、Dockerfile 编写、docker-compose 编排和生产环境部署最佳实践。",
    date: "2026-05-10",
    readTime: "11 分钟",
    tags: ["Docker", "DevOps", "部署", "容器"],
    category: "后端",
    content: `
## Docker 核心概念
镜像（Image）、容器（Container）、仓库（Registry）

## Dockerfile 最佳实践
- 多阶段构建减小镜像体积
- 合理利用构建缓存
- 非 root 用户运行

## docker-compose 编排
多服务一键启动：Web + DB + Redis + Nginx

## 生产环境
- 健康检查
- 日志管理
- 资源限制
- 自动重启
    `,
  },
  {
    slug: "typescript-advanced-types",
    title: "TypeScript 高级类型体操",
    excerpt:
      "深入探讨条件类型、映射类型、模板字面量类型等高级特性。",
    date: "2026-05-05",
    readTime: "12 分钟",
    tags: ["TypeScript", "技巧", "前端"],
    category: "前端",
    content: `
## 条件类型
T extends string ? true : false

## 映射类型
批量修改类型的属性，如 Readonly、Optional。

## 模板字面量类型
on Capitalize T

## 总结
掌握高级类型，写出更安全的代码。
    `,
  },
  {
    slug: "nginx-reverse-proxy-ssl",
    title: "Nginx 反向代理与 SSL 证书配置",
    excerpt:
      "Nginx 配置反向代理、HTTPS、Gzip 压缩、静态资源缓存和常见问题排查。",
    date: "2026-04-28",
    readTime: "9 分钟",
    tags: ["Nginx", "SSL", "运维", "HTTPS"],
    category: "后端",
    content: `
## 反向代理
proxy_pass 将请求转发到后端服务。

## SSL 证书
Let's Encrypt 免费证书 + certbot 自动续期。

## 性能优化
Gzip 压缩、静态资源缓存、连接复用。

## 常见问题
502 Bad Gateway：后端服务挂了
504 Gateway Timeout：后端响应太慢
    `,
  },
  {
    slug: "langchain-agent-memory-design",
    title: "Agent 记忆系统设计：短期、长期与工作记忆",
    excerpt:
      "如何为 Agent 设计记忆系统，包括对话上下文管理、向量记忆存储和摘要压缩策略。",
    date: "2026-04-20",
    readTime: "10 分钟",
    tags: ["Agent", "LangChain", "Memory", "设计模式"],
    category: "AIGC",
    content: `
## 三种记忆
- 短期记忆：当前对话上下文
- 长期记忆：持久化向量存储
- 工作记忆：当前任务临时状态

## 上下文溢出处理
- 滑动窗口：只保留最近 N 轮
- 摘要压缩：旧消息生成摘要
- 向量检索：只加载相关历史

## 实现方案
LangChain Memory 模块 + 向量数据库
    `,
  },
];

export const categories = ["全部", "前端", "后端", "AIGC", "工具"];
