import { sql, gte, and } from "drizzle-orm";
import { db } from "../db/client";
import { pageViews, articles } from "../db/schema";
import {
  AnalyticsRepository,
  ArticleViewCount,
  DailyViewCount,
} from "@/domain/repositories/AnalyticsRepository";

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

export class DrizzleAnalyticsRepository implements AnalyticsRepository {
  async recordView(input: {
    articleId?: string | null;
    path: string;
    referrer?: string;
  }): Promise<void> {
    await db.insert(pageViews).values({
      articleId: input.articleId ?? null,
      path: input.path,
      referrer: input.referrer,
    });
  }

  async getTotalViews(sinceDays: number): Promise<number> {
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(pageViews)
      .where(gte(pageViews.createdAt, daysAgo(sinceDays)));
    return row?.count ?? 0;
  }

  async getTopArticles(sinceDays: number, limit: number): Promise<ArticleViewCount[]> {
    const rows = await db
      .select({
        articleId: pageViews.articleId,
        title: articles.title,
        slug: articles.slug,
        views: sql<number>`count(*)::int`,
      })
      .from(pageViews)
      .innerJoin(articles, sql`${pageViews.articleId} = ${articles.id}`)
      .where(gte(pageViews.createdAt, daysAgo(sinceDays)))
      .groupBy(pageViews.articleId, articles.title, articles.slug)
      .orderBy(sql`count(*) desc`)
      .limit(limit);

    return rows.map((r) => ({
      articleId: r.articleId as string,
      title: r.title,
      slug: r.slug,
      views: r.views,
    }));
  }

  async getDailyViews(sinceDays: number): Promise<DailyViewCount[]> {
    const rows = await db
      .select({
        date: sql<string>`to_char(${pageViews.createdAt}, 'YYYY-MM-DD')`,
        views: sql<number>`count(*)::int`,
      })
      .from(pageViews)
      .where(gte(pageViews.createdAt, daysAgo(sinceDays)))
      .groupBy(sql`to_char(${pageViews.createdAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${pageViews.createdAt}, 'YYYY-MM-DD')`);

    return rows;
  }
}
