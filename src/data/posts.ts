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
    slug: "multimodal-rag-architecture",
    title: "多模态 RAG 系统架构设计：从文本检索到图文联合理解",
    excerpt:
      "解析多模态 RAG 的向量索引策略、跨模态检索机制与上下文融合方案，构建生产级知识问答系统。",
    date: "2026-06-11",
    readTime: "14 分钟",
    tags: ["RAG", "AIGC", "向量数据库", "多模态", "架构设计"],
    category: "AIGC",
    content: `
## 多模态 RAG 的核心挑战

传统 RAG 只处理纯文本，但企业知识库大量包含图表、流程图、截图等视觉信息。多模态 RAG 需要统一处理文本、图像、表格等多种数据形态。

## 架构分层设计

### 1. 数据摄入层（Ingestion）

文档解析采用分层策略：PDF 用 PyMuPDF 提取文本层，OCR 回退处理扫描件。图片通过 CLIP 编码为 512 维向量，表格转为 Markdown 保留结构信息。每种模态维护独立的 embedding 模型，避免语义空间污染。

### 2. 索引存储层（Index）

使用 Milvus 或 Qdrant 作为向量数据库，支持混合索引：HNSW 用于高召回向量检索，倒排索引用于关键词过滤。关键设计是建立跨模态映射表，将图片 chunk 关联到其所在文档的文本上下文，保证检索时能返回完整的图文组合。

### 3. 检索融合层（Retrieval Fusion）

采用 Reciprocal Rank Fusion（RRF）合并多路召回结果。对用户 query 做意图分类：纯文本查询走文本检索通道，包含"如图所示"等视觉指示词的查询走多模态通道。融合后的 top-k 结果经过 Cross-Encoder 重排序，显著提升相关性。

### 4. 生成层（Generation）

将检索到的文本 chunk 和图片 URL 一起注入 LLM prompt。对 GPT-4o 等原生多模态模型直接传图；对纯文本模型则用 BLIP-2 生成图片描述后拼接。流式输出时采用 SSE 推送，前端渐进渲染。

## 生产环境踩坑

- 向量维度不统一：统一用 CLIP ViT-L/14 的 768 维
- 检索延迟过高：引入缓存层，对高频 query 缓存检索结果
- 图文关联丢失：chunk 切分时保留 20% 重叠区间
    `,
  },
  {
    slug: "python-pydantic-v2-deep-dive",
    title: "Python 类型系统与 Pydantic V2 深度实践：从验证到序列化的全链路优化",
    excerpt:
      "掌握 Pydantic V2 的 Rust 内核、自定义校验器、递归模型与高性能序列化技巧，构建类型安全的后端服务。",
    date: "2026-06-11",
    readTime: "11 分钟",
    tags: ["Python", "Pydantic", "类型系统", "FastAPI", "后端"],
    category: "后端",
    content: `
## Pydantic V2 的底层变革

V2 核心用 Rust 重写（pydantic-core），验证性能提升 5-50 倍。不再依赖 Python 描述符协议，而是编译 JSON Schema 到 Rust 验证链。

## 核心实践

### 1. 模型设计模式

\`\`\`python
from pydantic import BaseModel, Field, model_validator

class OrderItem(BaseModel):
    product_id: str = Field(pattern=r'^[A-Z]{3}-\d{4}$')
    quantity: int = Field(gt=0, le=999)
    price: float = Field(gt=0)

    @model_validator(mode='after')
    def check_bulk_discount(self) -> 'OrderItem':
        if self.quantity > 100 and self.price < 0.01:
            raise ValueError('批量订单单价不能低于 0.01')
        return self
\`\`\`

Field 约束在 Rust 层执行，零 Python 开销。model_validator 替代了 V1 的 root_validator，语义更清晰。

### 2. 递归模型处理

处理树形数据（如评论嵌套）时用 \`model_rebuild()\` 延迟重建：

\`\`\`python
class Comment(BaseModel):
    text: str
    replies: list['Comment'] = []

Comment.model_rebuild()  # 触发延迟类型解析
\`\`\`

### 3. 高性能序列化

V2 的 \`.model_dump()\` 比 V1 的 \`.dict()\` 快 3 倍。对大批量数据用 \`.model_dump_json()\` 直接序列化为 JSON 字符串，跳过 Python dict 中间态。

### 4. 与 FastAPI 集成

FastAPI 利用 Pydantic 的 JSON Schema 自动生成 OpenAPI 文档。注意：响应模型的 \`response_model\` 会触发二次序列化，高吞吐场景考虑用 \`.model_dump()\` 手动返回 dict 绕过。

## 常见陷阱

- V2 移除了 \`Optional[str]\` 的默认值推断，必须显式写 \`str | None = None\`
- \`ConfigDict\` 替代了 class Config 内嵌类
- \`validator\` 装饰器已废弃，统一用 \`field_validator\` / \`model_validator\`
    `,
  },
  {
    slug: "nextjs-15-server-components-streaming",
    title: "Next.js 15 Server Components 与流式渲染实战：首屏性能优化全攻略",
    excerpt:
      "深入理解 RSC 运行时机制、Suspense 边界编排、流式 SSR 原理及与客户端组件的协作模式。",
    date: "2026-06-11",
    readTime: "13 分钟",
    tags: ["Next.js", "React", "Server Components", "前端", "性能优化"],
    category: "前端",
    content: `
## Server Components 的本质

React Server Components（RSC）不是 SSR 的升级版，而是全新的组件执行模型。Server Components 只在服务端运行，输出序列化的组件树（RSC Payload），零 JS 发送到客户端。

## 核心机制

### 1. 渲染流水线

请求到达 → Server Component 执行（可直接查 DB）→ 生成 RSC Payload → 客户端 React 用 Payload 构建虚拟 DOM → 嵌入 Client Component 占位符 → 流式传输 → 客户端 hydrate Client Component

### 2. Suspense 流式边界

\`\`\`tsx
// page.tsx (Server Component)
export default async function Dashboard() {
  // 快速返回 shell
  return (
    <div className="dashboard">
      <Header />  {/* 立即流式输出 */}
      <Suspense fallback={<Skeleton />}>
        <AnalyticsChart />  {/* 数据就绪后追加 */}
      </Suspense>
      <Suspense fallback={<Spinner />}>
        <RecentOrders />  {/* 独立流式块 */}
      </Suspense>
    </div>
  );
}
\`\`\`

每个 Suspense 边界独立流式输出，先到先显示。TTFB 取决于最外层 Server Component 的执行时间，而非所有数据源的总和。

### 3. Server/Client 组件协作

Server Component 可以 import Client Component，但反过来不行。传递数据时 Server → Client 必须可序列化（不能传函数）。常见模式：Server Component 负责数据获取，通过 props 注入 Client Component。

### 4. 缓存策略

Next.js 15 默认 Request-level 缓存（不再默认静态化）。用 \`unstable_cache\` 包裹重复查询，配合 \`revalidateTag\` 实现精准缓存失效。

## 性能对比

- 传统 CSR：FCP 3.2s → 优化后 RSC 流式：FCP 0.8s
- Bundle 减少 40%：Server Component 的依赖不进入客户端包
- LCP 优化：首屏关键数据通过最近的 Suspense 边界优先传输
    `,
  },
  {
    slug: "agent-toolchain-function-calling",
    title: "Agent 工具链设计与 Function Calling 最佳实践：从单工具到复杂编排",
    excerpt:
      "详解 Function Calling 协议设计、工具注册机制、多工具并行调用与错误恢复策略。",
    date: "2026-06-11",
    readTime: "12 分钟",
    tags: ["Agent", "Function Calling", "LLM", "工具链", "AIGC"],
    category: "AIGC",
    content: `
## Function Calling 的本质

Function Calling 是 LLM 与外部世界交互的标准协议。模型不直接执行工具，而是输出结构化的调用指令（JSON），由运行时负责执行并将结果回传。

## 工具链设计模式

### 1. 工具注册与描述

\`\`\`python
tools = [{
    "type": "function",
    "function": {
        "name": "search_docs",
        "description": "搜索内部文档库，返回相关段落。当用户询问公司政策、产品文档时使用。",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "搜索关键词"},
                "top_k": {"type": "integer", "default": 5}
            },
            "required": ["query"]
        }
    }
}]
\`\`\`

description 是关键——它决定了模型何时选择这个工具。写得越具体，误触发率越低。

### 2. 多工具并行调用

GPT-4o 等模型支持单轮返回多个 tool_call。运行时应并行执行：

\`\`\`python
import asyncio

async def execute_tool_calls(tool_calls):
    tasks = [dispatch_tool(tc) for tc in tool_calls]
    return await asyncio.gather(*tasks, return_exceptions=True)
\`\`\`

注意处理单个工具失败的情况——用 return_exceptions=True 收集错误，将错误信息回传给模型做二次推理。

### 3. 工具链编排

复杂任务需要多步工具调用。采用 ReAct 循环：思考 → 调用工具 → 观察结果 → 继续思考。关键约束是设置最大迭代次数（通常 5-10 次），防止死循环。

### 4. 错误恢复策略

- 工具超时：设置 30s 硬超时，返回超时提示让模型换策略
- 参数校验失败：将 schema 约束反馈给模型重新生成
- 工具不存在：返回可用工具列表引导模型选择

## 安全边界

- 敏感工具（如删除操作）设置 confirm 标记，二次确认
- 工具权限分级：只读 / 读写 / 管理员
- 输入清洗：防止 prompt injection 通过工具参数注入
    `,
  },
  {
    slug: "go-rust-concurrency-service-comparison",
    title: "Go vs Rust 高性能并发服务选型：从 goroutine 到 async runtime 的深度对比",
    excerpt:
      "对比 Go 和 Rust 在并发模型、内存管理、编译效率和实际 QPS 表现上的差异，给出选型建议。",
    date: "2026-06-11",
    readTime: "10 分钟",
    tags: ["Go", "Rust", "并发", "系统架构", "性能优化"],
    category: "后端",
    content: `
## 并发模型对比

### Go：goroutine + channel

Go 的并发基于 CSP 模型。goroutine 是用户态协程，初始栈仅 2KB，可轻松创建百万级。channel 是唯一的通信方式，强调"不要通过共享内存通信，要通过通信共享内存"。

\`\`\`go
func processOrders(orders <-chan Order, results chan<- Result) {
    for order := range orders {
        result := heavyComputation(order)
        results <- result
    }
}
// 启动 1000 个 worker，调度器自动分配到 OS 线程
for i := 0; i < 1000; i++ {
    go processOrders(orderCh, resultCh)
}
\`\`\`

### Rust：async/await + tokio

Rust 的异步基于 Future trait，编译器将 async 函数转换为状态机。tokio 提供多线程 runtime，work-stealing 调度。

\`\`\`rust
async fn process_order(order: Order) -> Result {
    let data = fetch_remote(order.id).await?;  // 非阻塞 I/O
    let result = compute(data).await;
    Ok(result)
}
// tokio 自动调度到线程池
let tasks: Vec<_> = orders.into_iter()
    .map(|o| tokio::spawn(process_order(o)))
    .collect();
futures::future::join_all(tasks).await;
\`\`\`

## 关键差异

| 维度 | Go | Rust |
|------|-----|------|
| 内存管理 | GC（~1ms STW） | 零开销所有权 |
| 数据竞争 | 运行时 panic | 编译期阻止 |
| 学习曲线 | 低 | 高（生命周期、借用） |
| 编译速度 | 快 | 慢（宏展开 + LLVM） |
| 峰值 QPS | 高 | 更高（无 GC 抖动） |

## 选型建议

- **选 Go**：团队快速上手、微服务网关、DevOps 工具、API 服务
- **选 Rust**：极致性能要求、低延迟系统（交易引擎）、嵌入式/WebAssembly、安全关键场景
- **混合方案**：Go 写业务层 + Rust 写性能热点的 FFI 扩展
    `,
  },
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
