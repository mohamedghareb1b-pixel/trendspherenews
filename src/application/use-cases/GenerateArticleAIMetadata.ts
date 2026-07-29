import { ArticleRepository } from "@/domain/repositories/ArticleRepository";
import { ContentAIPort } from "@/application/ports/ContentAIPort";

export class GenerateArticleAIMetadataUseCase {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly contentAI: ContentAIPort
  ) {}

  async execute(articleId: string) {
    const article = await this.articleRepository.findById(articleId);
    if (!article) throw new Error("المقال غير موجود");

    const generated = await this.contentAI.generateArticleMetadata({
      title: article.title,
      content: article.content,
    });

    article.metaTitle = generated.metaTitle;
    article.metaDescription = generated.metaDescription;
    article.aiSummary = generated.summary;
    article.faq = generated.faq;

    await this.articleRepository.update(article);

    // ملحوظة: الـ tags المولدة (generated.tags) هترتبط بجدول tags
    // فعليًا في Phase 6 لما نبني Categories/Tags UI الكامل.
    return { article, suggestedTags: generated.tags };
  }
}
