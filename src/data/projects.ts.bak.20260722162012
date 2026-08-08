export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github?: string;
  demo?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "ZCreativeFactory 漫剧工厂",
    description:
      "AIGC 全流程自动化漫剧创作平台。封装统一 LLM 客户端，集成 DeepSeek/Qwen/GPT-5-mini 等多种大语言模型，以及 Seedance/Sora/Wan 等 6 种视频生成模型和 Seedream/Qwen-VL/GPT-image2 等多种图像生成模型。基于 Redis 实现步骤级并发锁、WebSocket Pub/Sub 实时推送和限流指标设计，Redis 不可用时自动降级为内存存储。实现从选题→剧本→角色/场景资产→分镜→生图→生 Clip→合成成片的完整自动化流水线，支撑近百人培训课程，高峰期上百任务并行。",
    image: "/projects/blog.svg",
    tags: ["FastAPI", "LangChain", "AIGC", "Python", "Redis", "WebSocket"],
    github: "https://github.com/SirWangCNU",
    featured: true,
  },
  {
    id: "2",
    title: "ZCreativeAgent 漫剧助手",
    description:
      "移动端对话式漫剧创作助手。基于 LangChain Core 实现多轮对话上下文记忆（滑动窗口 k=20），采用 Orchestrator 模式设计 7 步引导流程（选题→剧本→资产→分镜→镜头图→Clip→合成），通过 StepResult 状态机统一管理步骤流转，Orchestrator 仅负责调度不含业务逻辑，实现流程控制与业务逻辑解耦。",
    image: "/projects/taskmanager.svg",
    tags: ["FastAPI", "LangChain", "Agent", "状态机", "移动端"],
    github: "https://github.com/SirWangCNU",
    featured: true,
  },
  {
    id: "3",
    title: "AgroAgent 智农信息处理平台",
    description:
      "全链路智农协同平台，集成农业智能问答、气象农事顾问、病虫害诊断、AI 广告视频生成。基于 FastAPI + LangGraph 构建 Skill-first 多智能体系统，通过 SkillRouter 实现 6 大场景自动路由；设计 Planner-Executor-Replan 闭环机制；集成 Milvus 向量数据库与 RAG 检索增强；采用 BM25 + 向量检索 + RRF 融合 + Reranker 混合检索方案；多工具并行执行效率提升 4.88 倍，延迟下降 79.5%。",
    image: "/projects/dashboard.svg",
    tags: ["FastAPI", "LangGraph", "RAG", "Milvus", "多智能体", "农业"],
    github: "https://github.com/SirWangCNU/AgroAgentOS",
    featured: true,
  },
  {
    id: "4",
    title: "SpringNexus AI-Agent 多功能助手",
    description:
      "基于 Spring Boot 3 和 Spring AI 的 AI Agent 智能体。利用 Spring AI 抽象接口封装通义千问、Ollama 等多端大模型，设计动态切换适配器；基于 ReACT 模式通过 MCP 协议实现智能体工具箱；采用 Kryo 高性能序列化实现对话状态持久化，服务重启后上下文零丢失；搭建 RAG 检索流水线，通过 Rerank 算法提升知识库召回准确率。",
    image: "/projects/weather.svg",
    tags: ["Spring Boot 3", "Spring AI", "MCP", "RAG", "Java"],
    github: "https://github.com/SirWangCNU/Wjh-Ai-Agent",
    featured: true,
  },
  {
    id: "5",
    title: "自动驾驶农机地头感知与行为决策系统",
    description:
      "针对农田非结构化环境，在 DeepLabV3+ 基础上引入 Coordinate Attention 与 Strip Pooling 模块强化窄长形状特征提取；设计 B&D Loss 解决边界像素分类模糊问题。采用结构化剪枝 + 知识蒸馏实现模型压缩 48.43%，TensorRT 加速使单帧推理延迟降至 47ms。利用双目相机获取点云信息，设计多级距离阈值决策机制，动态触发四阶段行为模式。",
    image: "/projects/dashboard.svg",
    tags: ["DeepLabV3+", "TensorRT", "Jetson", "自动驾驶", "目标检测"],
    featured: true,
  },
];
