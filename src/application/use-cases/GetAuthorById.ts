import { eq } from "drizzle-orm";
import { db } from "@/infrastructure/db/client";
import { authors } from "@/infrastructure/db/schema";

export interface AuthorDTO {
  id: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
}

export class GetAuthorByIdUseCase {
  async execute(authorId: string): Promise<AuthorDTO | null> {
    const [row] = await db.select().from(authors).where(eq(authors.id, authorId)).limit(1);
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      bio: row.bio,
      avatarUrl: row.avatarUrl,
    };
  }
}

/**
 * بيرجع الكاتب الافتراضي للموقع (شيندي) - بيتستخدم لأي مقال ملوش
 * author محدد صراحة، عشان كل المقالات تظهر تحت اسمه من غير ما تحتاج
 * تختار author يدويًا كل مرة وانت بتنشر مقال.
 */
export class GetDefaultAuthorUseCase {
  async execute(): Promise<AuthorDTO | null> {
    const [row] = await db
      .select()
      .from(authors)
      .where(eq(authors.slug, "shindy"))
      .limit(1);
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      bio: row.bio,
      avatarUrl: row.avatarUrl,
    };
  }
}
