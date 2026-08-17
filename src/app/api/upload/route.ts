import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { resolve, sep } from "path";
import { requireApiAdmin } from "@/lib/auth/guard";
import { saveMedia } from "@/lib/content/media";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  const auth = await requireApiAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const rawFolder = (formData.get("folder") as string) || "";
    const folder = rawFolder.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");

    if (folder.split("/").includes("..") || !/^[\w\-/]*$/.test(folder)) {
      return NextResponse.json({ error: "上传目录无效" }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: "未选择文件" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "仅支持 JPG/PNG/GIF/WebP/SVG 图片" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "文件大小不能超过 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const originalName = file.name;
    const safeName = `${timestamp}-${originalName.replace(/[^a-zA-Z0-9.\-_\u4e00-\u9fa5]/g, "_")}`;

    const uploadRoot = resolve(process.cwd(), "public", "uploads");
    const uploadDir = resolve(uploadRoot, folder);
    if (uploadDir !== uploadRoot && !uploadDir.startsWith(`${uploadRoot}${sep}`)) {
      return NextResponse.json({ error: "上传目录无效" }, { status: 400 });
    }
    await mkdir(uploadDir, { recursive: true });

    const filePath = resolve(uploadDir, safeName);
    await writeFile(filePath, buffer);

    const url = folder ? `/uploads/${folder}/${safeName}` : `/uploads/${safeName}`;
    const relativePath = folder ? `${folder}/${safeName}` : safeName;
    const uploadedAt = new Date().toISOString();
    saveMedia({
      originalName,
      savedName: safeName,
      relativePath,
      url,
      mimeType: file.type,
      size: file.size,
      uploadedAt,
    });

    return NextResponse.json({
      success: true,
      file: {
        name: originalName,
        savedName: relativePath,
        size: file.size,
        type: file.type,
        url,
        uploadedAt,
      },
    });
  } catch (error) {
    console.error("上传失败:", error);
    return NextResponse.json({ error: "上传失败" }, { status: 500 });
  }
}
