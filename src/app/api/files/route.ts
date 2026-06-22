import { NextRequest, NextResponse } from "next/server";
import { readdir, stat, readFile, writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");
const NOTES_DIR = join(process.cwd(), "data", "notes");

// 确保目录存在
async function ensureDir(dir: string) {
  try {
    await mkdir(dir, { recursive: true });
  } catch {}
}

// GET: 获取文件列表 + 笔记列表
export async function GET() {
  try {
    await ensureDir(UPLOAD_DIR);
    await ensureDir(NOTES_DIR);

    // 上传文件
    let uploadFiles: object[] = [];
    try {
      const entries = await readdir(UPLOAD_DIR);
      uploadFiles = await Promise.all(
        entries
          .filter((name) => !name.startsWith("."))
          .map(async (name) => {
            const filePath = join(UPLOAD_DIR, name);
            const stats = await stat(filePath);
            const originalName = name.replace(/^\d+-/, "");
            return {
              type: "file",
              name: originalName,
              savedName: name,
              size: stats.size,
              url: `/uploads/${name}`,
              uploadedAt: stats.mtime.toISOString(),
            };
          })
      );
    } catch {}

    // Markdown 笔记
    let notes: object[] = [];
    try {
      const entries = await readdir(NOTES_DIR);
      notes = await Promise.all(
        entries
          .filter((name) => name.endsWith(".json"))
          .map(async (name) => {
            const filePath = join(NOTES_DIR, name);
            const stats = await stat(filePath);
            const content = await readFile(filePath, "utf-8");
            const data = JSON.parse(content);
            return {
              type: "note",
              id: name.replace(".json", ""),
              title: data.title,
              content: data.content,
              size: Buffer.byteLength(data.content, "utf-8"),
              updatedAt: stats.mtime.toISOString(),
            };
          })
      );
    } catch {}

    // 合并按时间倒序
    const all = [...uploadFiles, ...notes].sort(
      (a: any, b: any) =>
        new Date(b.updatedAt || b.uploadedAt).getTime() -
        new Date(a.updatedAt || a.uploadedAt).getTime()
    );

    return NextResponse.json({ files: all });
  } catch (error) {
    return NextResponse.json({ files: [] });
  }
}

// POST: 保存/更新 Markdown 笔记
export async function POST(request: NextRequest) {
  try {
    await ensureDir(NOTES_DIR);
    const body = await request.json();
    const { id, title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "标题和内容不能为空" },
        { status: 400 }
      );
    }

    const noteId = id || `${Date.now()}`;
    const filePath = join(NOTES_DIR, `${noteId}.json`);
    await writeFile(
      filePath,
      JSON.stringify({ title, content, updatedAt: new Date().toISOString() }, null, 2)
    );

    return NextResponse.json({ success: true, id: noteId });
  } catch (error) {
    return NextResponse.json({ error: "保存失败" }, { status: 500 });
  }
}

// DELETE: 删除文件或笔记
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json({ error: "缺少参数" }, { status: 400 });
    }

    if (type === "note") {
      const filePath = join(NOTES_DIR, `${name}.json`);
      await unlink(filePath);
    } else {
      const filePath = join(UPLOAD_DIR, name);
      await unlink(filePath);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
