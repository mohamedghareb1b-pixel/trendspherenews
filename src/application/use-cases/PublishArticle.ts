import { ArticleRepository } from "@/domain/repositories/ArticleRepository";

/**
 * ده المكان اللي هيتحط فيه لاحقًا نداء الـ Content Operating System:
 * لما مقال يتنشر، هنا هنطلق (events / queue jobs) لإنشاء:
 * Newsletter, Podcast script, Social posts, Sitemap update...
 * حاليًا بيعمل النشر الأساسي بس - وده مقصود، عشان نبني تدريجيًا.
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

    // TODO (Phase 2+): dispatch content-distribution events here
    // e.g. queue.publish("article.published", { articleId })
  }
}
