import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { container } from "@/lib/container";

const schema = z.object({
  email: z.string().email(),
  preferredCategories: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "إيميل غير صحيح" }, { status: 400 });
  }

  try {
    const result = await container.subscribeToNewsletter.execute(parsed.data);
    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json({ error: "حصل خطأ، حاول تاني" }, { status: 500 });
  }
}
