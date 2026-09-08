import { eq, inArray, and } from "drizzle-orm";
import { db } from "../db/client";
import { tags, articleTags, articles } from "../db/schema";
import { Tag } from "@/domain/entities/Tag";
import { Article } from "@/domain/entities/Article";
import { TagRepository } from "@/domain/repositories/TagRepository";
import { articleRowToDomain } from "./DrizzleArticleRepository";
import { slugify } from "@/lib/slugify";

function toDomain(row: typeof tags.$inferSelect): Tag {
  return new Tag(row.id, row.name, row.slug);
}

export class DrizzleTagRepository implements TagRepository {
  async findBySlug(slug: string): Promise<Tag | null> {
    const [row] = await db.select().from(tags).where(eq(tags.slug, slug)).limit(1);
    return row ? toDomain(row) : null;
  }

  async findOrCreateByName(name: string): Promise<Tag> {
    const slug = slugify(name);
    const existing = await this.findBySlug(slug);
    if (existing) return existing;

    const [row] = await db.insert(tags).values({ name, slug }).returning();
    return toDomain(row);
  }

  async list(): Promise<Tag[]> {
    const rows = await db.select().from(tags);
    return rows.map(toDomain);
  }

  async setArticleTags(articleId: string, tagIds: string[]): Promise<void> {
    await db.delete(articleTags).where(eq(articleTags.articleId, articleId));
    if (tagIds.length === 0) return;

    await db.insert(articleTags).values(
      tagIds.map((tagId) => ({ articleId, tagId }))
    );
  }

  async getArticleTags(articleId: string): Promise<Tag[]> {
    const rows = await db
      .select({ tag: tags })
      .from(articleTags)
      .innerJoin(tags, eq(articleTags.tagId, tags.id))
      .where(eq(articleTags.articleId, articleId));

    return rows.map((r) => toDomain(r.tag));
  }

  async listArticlesByTagSlug(tagSlug: string): Promise<Article[]> {
    const tag = await this.findBySlug(tagSlug);
    if (!tag) return [];

    const rows = await db
      .select({ article: articles })
      .from(articleTags)
      .innerJoin(articles, eq(articleTags.articleId, articles.id))
      .where(and(eq(articleTags.tagId, tag.id), eq(articles.status, "published")));

    return rows.map((r) => articleRowToDomain(r.article));
  }
}
