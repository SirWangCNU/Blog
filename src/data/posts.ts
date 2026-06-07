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
    slug: "building-modern-blog-with-nextjs",
    title: "如何用 Next.js 构建现代博客",
    excerpt:
      "这篇文章将带你从零开始搭建一个功能完整的个人博客，涵盖技术选型、页面设计、内容管理等核心环节。",
    date: "2024-01-15",
    readTime: "8 分钟",
    tags: ["Next.js", "教程", "前端"],
    category: "前端",
    content: `
## 为什么选择 Next.js？

Next.js 是目前最流行的 React 框架之一，它提供了许多开箱即用的功能：

- **服务端渲染 (SSR)**：更好的 SEO 和首屏加载速度
- **静态生成 (SSG)**：博客文章可以预先生成静态页面
- **App Router**：更现代的路由系统，支持布局嵌套
- **图片优化**：自动优化图片加载

## 项目搭建

首先，我们需要创建一个新的 Next.js 项目：

\`\`\`bash
npx create-next-app@latest my-blog --typescript --tailwind --app
\`\`\`

## 页面设计

一个好的博客应该包含以下页面：

1. **首页**：展示个人信息和最新内容
2. **博客列表**：所有文章的索引
3. **博客详情**：文章的完整内容
4. **项目展示**：你的作品集
5. **关于页**：个人介绍

## 总结

使用 Next.js 搭建博客是一个很好的选择，它既能满足静态博客的性能需求，又具备动态渲染的灵活性。
    `,
  },
  {
    slug: "typescript-advanced-types",
    title: "TypeScript 高级类型体操",
    excerpt:
      "深入探讨 TypeScript 的高级类型特性，包括条件类型、映射类型、模板字面量类型等，提升你的类型编程能力。",
    date: "2024-01-10",
    readTime: "12 分钟",
    tags: ["TypeScript", "技巧", "前端"],
    category: "前端",
    content: `
## 为什么要学高级类型？

TypeScript 的类型系统是图灵完备的，这意味着你可以在类型层面实现复杂的逻辑。

## 条件类型

条件类型类似于三元表达式：

\`\`\`typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<42>;      // false
\`\`\`

## 映射类型

映射类型可以批量修改类型的属性：

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};
\`\`\`

## 模板字面量类型

TypeScript 4.1 引入了模板字面量类型：

\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`;
type ClickEvent = EventName<"click">; // "onClick"
\`\`\`

## 实战技巧

掌握这些高级类型特性，可以让你写出更安全、更易维护的代码。
    `,
  },
  {
    slug: "css-grid-layout-guide",
    title: "CSS Grid 布局完全指南",
    excerpt:
      "从基础到进阶，全面掌握 CSS Grid 布局技术，让你的页面布局更加灵活和高效。",
    date: "2024-01-05",
    readTime: "10 分钟",
    tags: ["CSS", "布局", "前端"],
    category: "前端",
    content: `
## CSS Grid 简介

CSS Grid 是一个二维布局系统，可以同时处理行和列。

## 基本概念

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 20px;
}
\`\`\`

## 常见布局模式

### 圣杯布局
### 瀑布流布局
### 响应式网格

## Grid vs Flexbox

- **Grid**：二维布局，适合整体页面结构
- **Flexbox**：一维布局，适合组件内部排列

## 浏览器支持

现代浏览器对 CSS Grid 的支持已经非常完善，可以放心使用。
    `,
  },
  {
    slug: "react-performance-optimization",
    title: "React 性能优化实战",
    excerpt:
      "分享 React 应用中常见的性能问题和优化方案，包括 memo、useMemo、useCallback 的正确使用方式。",
    date: "2023-12-28",
    readTime: "15 分钟",
    tags: ["React", "性能", "前端"],
    category: "前端",
    content: `
## 性能优化的重要性

在大型 React 应用中，性能优化是不可忽视的环节。

## React.memo

避免不必要的重新渲染：

\`\`\`typescript
const ExpensiveComponent = React.memo(({ data }) => {
  // 只有 data 变化时才会重新渲染
  return <div>{/* 复杂的渲染逻辑 */}</div>;
});
\`\`\`

## useMemo 和 useCallback

\`\`\`typescript
// 缓存计算结果
const expensiveResult = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// 缓存函数引用
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
\`\`\`

## 虚拟列表

对于长列表，使用虚拟滚动技术：

\`\`\`bash
npm install react-window
\`\`\`

## 总结

性能优化要适度，过度优化反而会增加代码复杂度。先测量，再优化。
    `,
  },
  {
    slug: "git-workflow-best-practices",
    title: "Git 工作流最佳实践",
    excerpt:
      "介绍团队协作中常用的 Git 工作流，包括 Git Flow、GitHub Flow 等，以及提交信息的规范写法。",
    date: "2023-12-20",
    readTime: "6 分钟",
    tags: ["Git", "工具", "协作"],
    category: "工具",
    content: `
## 为什么需要 Git 工作流？

良好的 Git 工作流可以提高团队协作效率，减少代码冲突。

## Git Flow

适合有明确发布周期的项目：

- **main**：生产环境代码
- **develop**：开发分支
- **feature/**：功能分支
- **release/**：发布分支
- **hotfix/**：紧急修复

## GitHub Flow

更简单的工作流，适合持续部署：

1. 从 main 创建分支
2. 提交修改
3. 开启 Pull Request
4. 代码审查
5. 合并到 main

## 提交信息规范

\`\`\`
<type>(<scope>): <subject>

feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
\`\`\`

## 总结

选择适合团队的工作流，并坚持执行。
    `,
  },
];

export const categories = ["全部", "前端", "后端", "工具", "生活"];
