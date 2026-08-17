import { unlink } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/auth/guard";
import { deleteMedia, listMedia } from "@/lib/content/media";
import { deleteNote, listNotes, saveNote } from "@/lib/content/notes";

const UPLOAD_DIR = resolve(process.cwd(), "public", "uploads");

export async function GET() {
  try {
    const files = listMedia().map((file) => ({
      type: "file",
      name: file.originalName,
      savedName: file.relativePath,
      size: file.size,
      url: file.url,
      uploadedAt: file.uploadedAt,
    }));
    const notes = listNotes().map((note) => ({
      type: "note",
      id: note.id,
      title: note.title,
      content: note.content,
      size: Buffer.byteLength(note.content, "utf8"),
      updatedAt: note.updatedAt,
    }));
    const all = [...files, ...notes].sort((left, right) => {
      const leftTime = "updatedAt" in left ? left.updatedAt : left.uploadedAt;
      const rightTime = "updatedAt" in right ? right.updatedAt : right.uploadedAt;
      return new Date(rightTime).getTime() - new Date(leftTime).getTime();
    });
    return NextResponse.json({ files: all });
  } catch {
    return NextResponse.json({ files: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireApiAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json() as { id?: unknown; title?: unknown; content?: unknown };
    if (typeof body.title !== "string" || !body.title.trim() || typeof body.content !== "string" || !body.content.trim()) {
      return NextResponse.json({ error: "标题和内容不能为空" }, { status: 400 });
    }
    const note = saveNote({
      id: typeof body.id === "string" ? body.id : undefined,
      title: body.title,
      content: body.content,
    });
    return NextResponse.json({ success: true, id: note.id, note });
  } catch {
    return NextResponse.json({ error: "保存失败" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireApiAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const name = searchParams.get("name");
  if (!name) return NextResponse.json({ error: "缺少参数" }, { status: 400 });

  try {
    if (type === "note") {
      deleteNote(name);
    } else {
      const filePath = resolve(UPLOAD_DIR, name);
      if (!filePath.startsWith(`${UPLOAD_DIR}${sep}`)) {
        return NextResponse.json({ error: "文件路径无效" }, { status: 400 });
      }
      await unlink(filePath).catch((error: NodeJS.ErrnoException) => {
        if (error.code !== "ENOENT") throw error;
      });
      deleteMedia(name);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
