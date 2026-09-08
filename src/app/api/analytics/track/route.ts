import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { container } from "@/lib/container";

const schema = z.object({
  articleId: z.string().uuid().optional(),
  path: z.string().min(1),
  referrer: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  }

  try {
    await container.recordPageView.execute(parsed.data);
    return NextResponse.json({ ok: true });
  } catch {
    // التتبع مش لازم يكسر تجربة المستخدم لو فشل
    return NextResponse.json({ ok: false });
  }
}
