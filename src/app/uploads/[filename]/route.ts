import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { UPLOAD_DIR } from "@/lib/paths";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(_req: Request, ctx: { params: Promise<{ filename: string }> }) {
  const { filename } = await ctx.params;
  if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const filePath = path.join(UPLOAD_DIR, filename);
  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filename).toLowerCase();
    return new NextResponse(data, {
      headers: {
        "Content-Type": TYPES[ext] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
