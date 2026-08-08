import { NextRequest, NextResponse } from "next/server";
import { listWorks, getWork, saveWork, deleteWork } from "@/lib/works/store";
import type { WorkInput } from "@/lib/works/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const includeDrafts = searchParams.get("includeDrafts") === "true";

    if (id) {
      const work = await getWork(id);
      if (!work) {
        return NextResponse.json({ error: "作品不存在" }, { status: 404 });
      }
      return NextResponse.json({ work });
    }

    const works = await listWorks(includeDrafts);
    return NextResponse.json({ works });
  } catch (error) {
    console.error("获取作品失败:", error);
    return NextResponse.json({ error: "获取作品失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as WorkInput;

    if (!body.title?.trim() || !body.summary?.trim()) {
      return NextResponse.json({ error: "标题和简介不能为空" }, { status: 400 });
    }

    const work = await saveWork(body);
    return NextResponse.json({ success: true, work });
  } catch (error) {
    console.error("保存作品失败:", error);
    return NextResponse.json({ error: "保存作品失败" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "缺少作品 ID" }, { status: 400 });
    }

    await deleteWork(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除作品失败:", error);
    return NextResponse.json({ error: "删除作品失败" }, { status: 500 });
  }
}
