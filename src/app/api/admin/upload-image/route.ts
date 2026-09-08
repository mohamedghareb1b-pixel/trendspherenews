import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { container } from "@/lib/container";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session || !ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number])) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "مفيش ملف" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "الملف لازم يكون صورة" }, { status: 400 });
  }

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB قبل التحويل
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "الصورة أكبر من 10MB" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await container.uploadArticleImage.execute({
      buffer,
      filenameHint: file.name.replace(/\.[^.]+$/, ""),
    });
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "فشل رفع الصورة";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
