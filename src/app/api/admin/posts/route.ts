import { NextRequest, NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/auth/guard";
import { deletePost, getPostById, listPosts, savePost } from "@/lib/content/posts";
import type { ContentStatus } from "@/lib/content/types";

function plainExcerpt(content: string): string {
  return content.replace(/[#>*_`\[\]()!-]/g, " ").replace(/\s+/g, " ").trim().slice(0, 180);
}

export async function GET(request: NextRequest) {
  const auth = await requireApiAdmin(request);
  if (auth instanceof NextResponse) return auth;
  const rawId = new URL(request.url).searchParams.get("id");
  if (rawId) {
    const post = getPostById(Number(rawId));
    return post
      ? NextResponse.json({ post })
      : NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }
  return NextResponse.json({ posts: listPosts({ includeDrafts: true }) });
}

export async function POST(request: NextRequest) {
  const auth = await requireApiAdmin(request);
  if (auth instanceof NextResponse) return auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content : "";
  if (!title || !content.trim()) {
    return NextResponse.json({ error: "文章标题和正文不能为空" }, { status: 400 });
  }
  const status: ContentStatus = body.status === "published" ? "published" : "draft";
  const tags = Array.isArray(body.tags)
    ? body.tags.filter((tag): tag is string => typeof tag === "string").map((tag) => tag.trim()).filter(Boolean)
    : [];

  try {
    const post = savePost({
      id: typeof body.id === "number" ? body.id : undefined,
      slug: typeof body.slug === "string" ? body.slug : undefined,
      title,
      excerpt: typeof body.excerpt === "string" && body.excerpt.trim() ? body.excerpt.trim() : plainExcerpt(content),
      content,
      category: typeof body.category === "string" ? body.category.trim() : "未分类",
      tags,
      readTime: typeof body.readTime === "string" && body.readTime.trim() ? body.readTime.trim() : `${Math.max(1, Math.ceil(content.length / 500))} 分钟`,
      status,
    });
    return NextResponse.json({ success: true, post });
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed: posts.slug")) {
      return NextResponse.json({ error: "文章链接已存在，请修改 slug" }, { status: 409 });
    }
    if (error instanceof Error && error.message === "Post not found") {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }
    return NextResponse.json({ error: "保存文章失败" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireApiAdmin(request);
  if (auth instanceof NextResponse) return auth;
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "文章 ID 无效" }, { status: 400 });
  }
  return deletePost(id)
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: "文章不存在" }, { status: 404 });
}
