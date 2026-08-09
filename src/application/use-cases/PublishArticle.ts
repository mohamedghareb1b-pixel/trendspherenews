import { ArticleRepository } from "@/domain/repositories/ArticleRepository";
import { notifyGoogleIndexing } from "@/lib/googleIndexing";
import { getSiteUrl } from "@/lib/site";

/**
 * ده المكان اللي هيتحط فيه لاحقًا نداء الـ Content Operating System:
 * لما مقال يتنشر، هنا هنطلق (events / queue jobs) لإنشاء:
 * Newsletter, Podcast script, Social posts, Sitemap update...
 * حاليًا بيعمل النشر الأساسي + إشعار Google Indexing API.
 */
export class PublishArticleUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(articleId: string): Promise<void> {
    const article = await this.articleRepository.findById(articleId);
    if (!article) {
      throw new Error("المقال غير موجود");
    }

    article.publish();
    await this.articleRepository.update(article);

    // بنبعت إشعار Google Indexing من غير await - عشان زرار "نشر" يرد فورًا
    const url = `${getSiteUrl()}/articles/${article.slug}`;
    notifyGoogleIndexing(url, "URL_UPDATED").catch((error) => {
      console.error("Failed to notify Google Indexing:", error);
    });

    // TODO (Phase 2+): dispatch content-distribution events here
    // e.g. queue.publish("article.published", { articleId })
  }
}