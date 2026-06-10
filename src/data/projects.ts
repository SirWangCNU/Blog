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
      "AIGC 全流程自动化漫剧创作平台，集成 DeepSeek/Seedream/Seedance 等多模型动态切换，支持并发任务调度与意图驱动工作流编排，支撑近百人培训课程与上百任务并行。",
    image: "/projects/blog.svg",
    tags: ["FastAPI", "LangChain", "AIGC", "Python"],
    featured: true,
  },
  {
    id: "2",
    title: "ZCreativeAgent 漫剧助手",
    description:
      "移动端对话式漫剧创作助手，基于意图识别引擎与有限状态机调度器，支持 13 种意图自动路由、7 步引导式流程、断点续跑与轮询式增量流推送。",
    image: "/projects/taskmanager.svg",
    tags: ["FastAPI", "LangChain", "Agent", "移动端"],
    featured: true,
  },
  {
    id: "3",
    title: "个人博客系统",
    description:
      "基于 Next.js 构建的现代化个人博客，支持暗色模式、MDX 文章、项目展示等功能。采用 App Router 和 Tailwind CSS。",
    image: "/projects/blog.svg",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/SirWangCNU/Blog",
    demo: "https://cnuwang.cn",
    featured: true,
  },
  {
    id: "4",
    title: "任务管理应用",
    description:
      "一个简洁高效的任务管理工具，支持拖拽排序、标签分类、截止日期提醒等功能。使用 React + Zustand 状态管理。",
    image: "/projects/taskmanager.svg",
    tags: ["React", "Zustand", "Firebase"],
    featured: false,
  },
  {
    id: "5",
    title: "天气预报小工具",
    description:
      "精美的天气预报应用，支持多城市切换、7 天预报、天气动画效果。使用 OpenWeatherMap API。",
    image: "/projects/weather.svg",
    tags: ["Vue.js", "API", "CSS动画"],
    featured: false,
  },
  {
    id: "6",
    title: "数据可视化面板",
    description:
      "基于 ECharts 的数据可视化仪表盘，支持多种图表类型、实时数据更新、主题切换。",
    image: "/projects/dashboard.svg",
    tags: ["React", "ECharts", "Node.js"],
    featured: false,
  },
];
