import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { categories } from "../db/schema";
import { Category } from "@/domain/entities/Category";
import { CategoryRepository } from "@/domain/repositories/CategoryRepository";

function toDomain(row: typeof categories.$inferSelect): Category {
  return new Category(row.id, row.name, row.slug, row.description, row.parentId);
}

export class DrizzleCategoryRepository implements CategoryRepository {
  async findBySlug(slug: string): Promise<Category | null> {
    const [row] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    return row ? toDomain(row) : null;
  }

  async findById(id: string): Promise<Category | null> {
    const [row] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return row ? toDomain(row) : null;
  }

  async list(): Promise<Category[]> {
    const rows = await db.select().from(categories);
    return rows.map(toDomain);
  }

  async create(category: Category): Promise<Category> {
    const [row] = await db
      .insert(categories)
      .values({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentId: category.parentId ?? undefined,
      })
      .returning();
    return toDomain(row);
  }
}
