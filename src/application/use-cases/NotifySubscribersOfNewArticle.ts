import { ArticleRepository } from "@/domain/repositories/ArticleRepository";
import { CategoryRepository } from "@/domain/repositories/CategoryRepository";
import { SubscriberRepository } from "@/domain/repositories/SubscriberRepository";
import { sendNewArticleNotification } from "@/lib/mailer";

export class NotifySubscribersOfNewArticleUseCase {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly subscriberRepository: SubscriberRepository
  ) {}

  async execute(articleId: string): Promise<{ notified: number }> {
    const article = await this.articleRepository.findById(articleId);
    if (!article || !article.categoryId) return { notified: 0 };

    const category = await this.categoryRepository.findById(article.categoryId);
    if (!category) return { notified: 0 };

    const subscribers = await this.subscriberRepository.listVerified([category.name]);

    // بيتبعتوا بالتتابع (مش كلهم مرة واحدة) عشان ميحصلش rate limit مع مزود SMTP
    for (const subscriber of subscribers) {
      try {
        await sendNewArticleNotification(subscriber.email, subscriber.unsubscribeToken, {
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
        });
      } catch {
        // فشل إرسال لمشترك واحد مش لازم يوقف الباقي
        continue;
      }
    }

    return { notified: subscribers.length };
  }
}
