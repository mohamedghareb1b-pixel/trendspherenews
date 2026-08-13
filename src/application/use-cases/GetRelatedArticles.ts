import { inArray, and, eq, ne, sql, desc } from "drizzle-orm";
import { db } from "@/infrastructure/db/client";
import { articles, articleTags } from "@/infrastructure/db/schema";
import { articleRowToDomain } from "@/infrastructure/repositories/DrizzleArticleRepository";
import { Article } from "@/domain/entities/Article";

/**
 * بيجيب "مقالات ذات صلة" لمقال معين، بالأولوية دي (لتقوية بنية السيو
 * الداخلية عن طريق تجميع مواضيعي حقيقي - Topical Clustering):
 *
 * 1) نفس التصنيف + تاج مشترك واحد على الأقل (أقوى صلة موضوعية)
 * 2) لو النتائج أقل من المطلوب: نكمّل بنفس التصنيف بس (من غير شرط التاج)
 * 3) لو لسه أقل من المطلوب (تصنيف جديد لسه مفيهوش مقالات كتير):
 *    نكمّل بأحدث المقالات المنشورة عمومًا
 *
 * دايمًا بيستبعد المقال نفسه، وبيرجع بس مقالات منشورة (published).
 */
export class GetRelatedArticlesUseCase {
  async execute(articleId: string, categoryId: string | null, limit = 4): Promise<Article[]> {
    const results: Article[] = [];
    const excludedIds = new Set<string>([articleId]);

    // 1) نفس التصنيف + تاج مشترك
    if (categoryId) {
      const sharedTagIds = await db
        .select({ tagId: articleTags.tagId })
        .from(articleTags)
        .where(eq(articleTags.articleId, articleId));

      if (sharedTagIds.length > 0) {
        const tagIds = sharedTagIds.map((t) => t.tagId);

        const rows = await db
          .selectDistinct({ article: articles })
          .from(articles)
          .innerJoin(articleTags, eq(articleTags.articleId, articles.id))
          .where(
            and(
              eq(articles.categoryId, categoryId),
              eq(articles.status, "published"),
              ne(articles.id, articleId),
              inArray(articleTags.tagId, tagIds)
            )
          )
          .orderBy(desc(articles.publishedAt))
          .limit(limit);

        for (const { article } of rows) {
          if (!excludedIds.has(article.id)) {
            results.push(articleRowToDomain(article));
            excludedIds.add(article.id);
          }
        }
      }
    }

    // 2) نفس التصنيف بس (احتياطي لو النتايج مش كفاية)
    if (results.length < limit && categoryId) {
      const rows = await db
        .select()
        .from(articles)
        .where(
          and(
            eq(articles.categoryId, categoryId),
            eq(articles.status, "published"),
            ne(articles.id, articleId),
            sql`${articles.id} NOT IN (${sql.join(
              [...excludedIds].map((id) => sql`${id}`),
              sql`, `
            )})`
          )
        )
        .orderBy(desc(articles.publishedAt))
        .limit(limit - results.length);

      for (const row of rows) {
        if (!excludedIds.has(row.id)) {
          results.push(articleRowToDomain(row));
          excludedIds.add(row.id);
        }
      }
    }

    // 3) أحدث المقالات عمومًا (احتياطي أخير)
    if (results.length < limit) {
      const rows = await db
        .select()
        .from(articles)
        .where(
          and(
            eq(articles.status, "published"),
            sql`${articles.id} NOT IN (${sql.join(
              [...excludedIds].map((id) => sql`${id}`),
              sql`, `
            )})`
          )
        )
        .orderBy(desc(articles.publishedAt))
        .limit(limit - results.length);

      for (const row of rows) {
        results.push(articleRowToDomain(row));
      }
    }

    return results;
  }
}