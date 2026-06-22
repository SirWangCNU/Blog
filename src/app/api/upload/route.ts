import { NextRequest, NextResponse } from "next/server";
import { writeFile, readdir, stat } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "未选择文件" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 生成唯一文件名，保留原始扩展名
    const timestamp = Date.now();
    const originalName = file.name;
    const safeName = `${timestamp}-${originalName.replace(/[^a-zA-Z0-9.\-_\u4e00-\u9fa5]/g, "_")}`;
    const filePath = join(UPLOAD_DIR, safeName);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      file: {
        name: originalName,
        savedName: safeName,
        size: file.size,
        type: file.type,
        url: `/uploads/${safeName}`,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("上传失败:", error);
    return NextResponse.json({ error: "上传失败" }, { status: 500 });
  }
}
