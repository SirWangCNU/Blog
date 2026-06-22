import { NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

export async function GET() {
  try {
    const entries = await readdir(UPLOAD_DIR);
    const files = await Promise.all(
      entries
        .filter((name) => !name.startsWith("."))
        .map(async (name) => {
          const filePath = join(UPLOAD_DIR, name);
          const stats = await stat(filePath);
          // 从文件名中提取原始名称（去掉时间戳前缀）
          const originalName = name.replace(/^\d+-/, "");
          return {
            name: originalName,
            savedName: name,
            size: stats.size,
            url: `/uploads/${name}`,
            uploadedAt: stats.mtime.toISOString(),
          };
        })
    );

    // 按上传时间倒序
    files.sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    return NextResponse.json({ files });
  } catch (error) {
    // 目录不存在时返回空列表
    return NextResponse.json({ files: [] });
  }
}
