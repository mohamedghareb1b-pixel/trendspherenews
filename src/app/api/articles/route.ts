import { NextRequest, NextResponse } from "next/server";
import { container } from "@/lib/container";
import { z } from "zod";

const createArticleSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  content: z.string().min(10),
  authorId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  excerpt: z.string().optional(),
  heroImageUrl: z.string().url().optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const categoryId = searchParams.get("categoryId") ?? undefined;

  try {
    const articles = await container.getArticles.execute({
      search,
      categoryId,
    });
    return NextResponse.json({ data: articles });
  } catch (error) {
    return NextResponse.json({ error: "فشل في جلب المقالات" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createArticleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const article = await container.createArticle.execute(parsed.data);
    return NextResponse.json({ data: article }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "خطأ غير متوقع";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
