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
    title: "个人博客系统",
    description:
      "基于 Next.js 构建的现代化个人博客，支持暗色模式、MDX 文章、项目展示等功能。采用 App Router 和 Tailwind CSS。",
    image: "/projects/blog.svg",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/yourusername/blog",
    demo: "https://yourblog.com",
    featured: true,
  },
  {
    id: "2",
    title: "任务管理应用",
    description:
      "一个简洁高效的任务管理工具，支持拖拽排序、标签分类、截止日期提醒等功能。使用 React + Zustand 状态管理。",
    image: "/projects/taskmanager.svg",
    tags: ["React", "Zustand", "Firebase"],
    github: "https://github.com/yourusername/task-manager",
    demo: "https://taskapp.yourdomain.com",
    featured: true,
  },
  {
    id: "3",
    title: "天气预报小工具",
    description:
      "精美的天气预报应用，支持多城市切换、7 天预报、天气动画效果。使用 OpenWeatherMap API。",
    image: "/projects/weather.svg",
    tags: ["Vue.js", "API", "CSS动画"],
    github: "https://github.com/yourusername/weather-app",
    featured: false,
  },
  {
    id: "4",
    title: "Markdown 编辑器",
    description:
      "实时预览的 Markdown 编辑器，支持快捷键、代码高亮、导出 PDF 等功能。",
    image: "/projects/editor.svg",
    tags: ["TypeScript", "React", "Markdown"],
    github: "https://github.com/yourusername/md-editor",
    featured: false,
  },
  {
    id: "5",
    title: "电商平台前端",
    description:
      "完整的电商前端项目，包含商品列表、购物车、订单流程等核心功能。使用 Next.js + Stripe 支付。",
    image: "/projects/ecommerce.svg",
    tags: ["Next.js", "Stripe", "Prisma"],
    github: "https://github.com/yourusername/ecommerce",
    demo: "https://shop.yourdomain.com",
    featured: true,
  },
  {
    id: "6",
    title: "数据可视化面板",
    description:
      "基于 ECharts 的数据可视化仪表盘，支持多种图表类型、实时数据更新、主题切换。",
    image: "/projects/dashboard.svg",
    tags: ["React", "ECharts", "Node.js"],
    github: "https://github.com/yourusername/dashboard",
    featured: false,
  },
];
