export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github?: string;
  demo?: string;
  featured: boolean;
  fullDescription?: string;
}

export const projects: Project[] = [
  {
    id: "6",
    title: "青禾映画 - 面向农业的短视频生成智能体",
    description:
      "获Trae AI创作力大赛优秀奖，支持对话式创作和无限画布创作ComfyUI工作流，可一键生成农业科普、产品宣传等各类短视频内容，内置丰富农业素材库和风格模板，大幅降低农业内容创作门槛。",
    image: "/projects/dashboard.svg",
    tags: ["FastAPI", "LangGraph", "ComfyUI", "农业短视频", "Trae AI大赛优秀奖"],
    github: "https://github.com/SirWangCNU/Qhyh_Agent",
    demo: "https://qhyh.cnuwang.cn",
    featured: true,
    fullDescription: `### 项目背景
针对农业内容创作门槛高、专业内容生产效率低的痛点，打造了这款面向农业领域的AI短视频生成智能体。

### 核心功能
1. **对话式创作**：通过自然语言描述即可生成符合要求的农业短视频，无需专业剪辑技能
2. **无限画布工作流**：基于ComfyUI搭建的可视化工作流，支持自定义调整视频风格、内容、时长
3. **农业素材库**：内置数万种农业相关素材，涵盖农作物、农机、乡村风光等多个类别
4. **多风格模板**：支持科普讲解、产品宣传、技术推广等多种视频模板一键套用

### 技术亮点
- 基于FastAPI + LangGraph构建多智能体协同系统
- 集成多种图像和视频生成模型，支持自动画质优化
- 支持批量生成和一键分发到各大短视频平台

### 获奖情况
🏆 2026 Trae AI创作力大赛 全国优秀奖

### 访问地址
在线体验：https://qhyh.cnuwang.cn
开源仓库：https://github.com/SirWangCNU/Qhyh_Agent`
  },
  {
    id: "7",
    title: "GlobalVideo Agent 基于LLM的多维视频解析系统",
    description:
      "使用FastAPI+yt-dlp+大模型应用，实现了主流平台下的视频下载、AI内容自动总结提炼、付费观看与支付功能，支持多格式导出，可批量处理视频内容，为内容创作者提供高效的视频处理工具。",
    image: "/projects/weather.svg",
    tags: ["FastAPI", "yt-dlp", "大模型", "视频解析", "支付系统"],
    github: "https://github.com/SirWangCNU",
    featured: true,
    fullDescription: `### 项目背景
针对视频内容学习效率低、信息提取困难的痛点，开发了这款基于大模型的视频解析系统，帮助用户快速获取视频核心内容。

### 核心功能
1. **多平台视频下载**：支持YouTube、B站、抖音等国内外主流视频平台内容下载
2. **AI智能总结**：自动提取视频核心观点、生成思维导图、重点内容高亮
3. **多格式导出**：支持导出Markdown、PDF、Word等多种格式的总结文档
4. **付费观看系统**：内置支付功能，支持优质内容付费解锁和创作者分成

### 技术亮点
- 基于yt-dlp实现多平台视频解析和下载
- 集成通义千问、DeepSeek等大模型进行内容理解和总结
- 支持批量处理，每小时可处理数百小时视频内容
- 分布式架构，支持高并发访问

### 开源地址
https://github.com/SirWangCNU`
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
    fullDescription: `### 项目背景
针对农业生产中信息获取难、专业技术门槛高的问题，打造了这款全链路智农协同平台，为农业从业者提供一站式智能服务。

### 核心功能
1. **农业智能问答**：覆盖种植、养殖、病虫害防治等全领域专业知识问答
2. **气象农事顾问**：基于气象数据提供农事建议、灾害预警、耕种指导
3. **病虫害智能诊断**：上传作物图片即可快速识别病虫害并提供解决方案
4. **AI广告视频生成**：一键生成农产品宣传、农技推广等各类短视频

### 技术亮点
- 基于FastAPI + LangGraph构建Skill-first多智能体系统
- SkillRouter实现6大应用场景自动路由
- Planner-Executor-Replan闭环机制保证任务执行准确性
- BM25 + 向量检索 + RRF融合 + Reranker混合检索方案，准确率提升48%
- 多工具并行执行效率提升4.88倍，延迟下降79.5%

### 开源地址
https://github.com/SirWangCNU/AgroAgentOS`
  },
  {
    id: "4",
    title: "SpringNexus AI-Agent 多功能助手",
    description:
      "针对现有AI应用难以处理复杂长链路任务、缺乏领域知识深度以及重启后对话状态丢失的痛点，基于Spring Boot 3和Spring AI构建的AI Agent智能体，支持多模型动态切换、MCP协议工具调用、对话状态持久化、RAG检索增强，服务重启后上下文零丢失。",
    image: "/projects/dashboard.svg",
    tags: ["Spring Boot 3", "Spring AI", "MCP", "RAG", "Java", "智能体"],
    github: "https://github.com/SirWangCNU/Wjh-Ai-Agent",
    featured: true,
    fullDescription: `### 项目背景
现有AI应用普遍存在难以处理复杂长链路任务、缺乏领域知识深度、服务重启后对话状态丢失等痛点，为此开发了这款企业级AI Agent智能体平台。

### 核心功能
1. **多模型动态切换**：基于Spring AI抽象接口，支持通义千问、Ollama、GPT等多模型无缝切换
2. **MCP协议工具调用**：支持数百种工具调用，涵盖网页搜索、文件处理、API调用等
3. **对话状态持久化**：采用Kryo高性能序列化，服务重启后上下文零丢失
4. **RAG检索增强**：内置知识库管理系统，支持私有知识接入和检索

### 技术亮点
- 基于Spring Boot 3生态，企业级稳定性和性能
- ReACT模式推理，复杂任务处理能力提升60%
- 插件化架构，支持快速扩展功能和集成第三方系统
- 可视化后台，支持对话监控、日志查看、系统配置

### 开源地址
https://github.com/SirWangCNU/Wjh-Ai-Agent`
  },
  {
    id: "8",
    title: "NoCode 智能零代码网页生成部署平台",
    description:
      "低代码/零代码网页生成与一键部署平台，支持可视化拖拽编辑、组件库复用、自动打包部署到云服务器，无需编程基础即可快速搭建上线各类网站、活动页、展示页。",
    image: "/projects/taskmanager.svg",
    tags: ["低代码", "React", "一键部署", "可视化编辑"],
    github: "https://github.com/SirWangCNU",
    featured: false,
    fullDescription: `### 项目背景
针对中小企业和个人建站成本高、周期长、技术门槛高的痛点，开发了这款零代码网页生成部署平台，让任何人都能快速搭建上线自己的网站。

### 核心功能
1. **可视化拖拽编辑**：无需编程，拖拽组件即可完成页面设计
2. **丰富组件库**：内置数百种常用组件，涵盖导航、轮播、表单、卡片等
3. **模板市场**：提供海量行业模板，一键套用快速生成网站
4. **一键部署**：自动打包部署到云服务器，自动配置域名和SSL证书

### 技术亮点
- 基于React + TypeScript构建的可视化编辑器
- 组件化架构，支持自定义组件开发和上传
- 自动化构建和部署流程，上线时间从几天缩短到几分钟
- 支持导出静态代码，可自行部署到任意服务器

### 开源地址
https://github.com/SirWangCNU`
  },
];
