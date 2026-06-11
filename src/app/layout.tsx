import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
<<<<<<< HEAD
    default: "王景皓 - 技术博客",
    template: "%s | 王景皓",
  },
  description: "Agent 全栈开发者 · AIGC 架构师 — 专注于 AI Agent 应用开发与系统架构设计",
  keywords: ["Agent开发", "AIGC", "LangChain", "FastAPI", "Python", "系统架构"],
=======
    default: "MyBlog - 个人博客",
    template: "%s | MyBlog",
  },
  description: "分享技术、记录生活、展示作品的个人博客",
  keywords: ["博客", "前端开发", "技术分享", "个人作品集"],
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Header />
<<<<<<< HEAD
          <main className="flex-1 pt-16 relative z-10">{children}</main>
=======
          <main className="flex-1 pt-16">{children}</main>
>>>>>>> ceccea7d4b1b0185759feaad8a061764536e7fdd
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
