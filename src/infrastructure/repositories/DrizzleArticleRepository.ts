import { and, eq, ilike, desc } from "drizzle-orm";
import { db } from "../db/client";
import { articles } from "../db/schema";
import { Article, ArticleStatus, FaqItem } from "@/domain/entities/Article";
import {
  ArticleListFilters,
  ArticleRepository,
} from "@/domain/repositories/ArticleRepository";

type ArticleRow = typeof articles.$inferSelect;

export function articleRowToDomain(row: ArticleRow): Article {
  return new Article(
    row.id,
    row.title,
    row.slug,
    row.content,
    row.status as ArticleStatus,
    row.authorId,
    row.categoryId,
    row.excerpt,
    row.heroImageUrl,
    row.secondaryImageUrl,
    row.metaTitle,
    row.metaDescription,
    row.aiSummary,
    (row.faq as FaqItem[]) ?? [],
    row.readingTimeMinutes,
    row.publishedAt,
    row.createdAt,
    row.updatedAt,
    row.contentPart2,
    row.ticketLink,
    row.matchesData
  );
}

export class DrizzleArticleRepository implements ArticleRepository {
  async findBySlug(slug: string): Promise<Article | null> {
    const [row] = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
    return row ? articleRowToDomain(row) : null;
  }

  async findById(id: string): Promise<Article | null> {
    const [row] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
    return row ? articleRowToDomain(row) : null;
  }

  async list(filters: ArticleListFilters): Promise<Article[]> {
    const conditions = [];
    if (filters.status) conditions.push(eq(articles.status, filters.status as ArticleStatus));
    if (filters.categoryId) conditions.push(eq(articles.categoryId, filters.categoryId));
    if (filters.authorId) conditions.push(eq(articles.authorId, filters.authorId));
    if (filters.search) conditions.push(ilike(articles.title, `%${filters.search}%`));

    const rows = await db
      .select()
      .from(articles)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(articles.publishedAt))
      .limit(filters.limit ?? 20)
      .offset(filters.offset ?? 0);

    return rows.map(articleRowToDomain);
  }

  async create(article: Article): Promise<Article> {
    const [row] = await db
      .insert(articles)
      .values({
        id: article.id,
        title: article.title,
        slug: article.slug,
        content: article.content,
        contentPart2: article.contentPart2,
        ticketLink: article.ticketLink,
        matchesData: article.matchesData,
        status: article.status,
        authorId: article.authorId ?? undefined,
        categoryId: article.categoryId ?? undefined,
        excerpt: article.excerpt,
        heroImageUrl: article.heroImageUrl,
        secondaryImageUrl: article.secondaryImageUrl,
        metaTitle: article.metaTitle,
        metaDescription: article.metaDescription,
        aiSummary: article.aiSummary,
        faq: article.faq,
        readingTimeMinutes: article.readingTimeMinutes,
      })
      .returning();
    return articleRowToDomain(row);
  }

  async update(article: Article): Promise<Article> {
    const [row] = await db
      .update(articles)
      .set({
        title: article.title,
        content: article.content,
        contentPart2: article.contentPart2,
        ticketLink: article.ticketLink,
        matchesData: article.matchesData,
        status: article.status,
        excerpt: article.excerpt,
        heroImageUrl: article.heroImageUrl,
        secondaryImageUrl: article.secondaryImageUrl,
        metaTitle: article.metaTitle,
        metaDescription: article.metaDescription,
        aiSummary: article.aiSummary,
        faq: article.faq,
        readingTimeMinutes: article.readingTimeMinutes,
        publishedAt: article.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, article.id))
      .returning();
    return articleRowToDomain(row);
  }

  async delete(id: string): Promise<void> {
    await db.delete(articles).where(eq(articles.id, id));
  }
}
