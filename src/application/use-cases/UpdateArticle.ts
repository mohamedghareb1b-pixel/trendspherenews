import { ArticleRepository } from "@/domain/repositories/ArticleRepository";

export interface UpdateArticleInput {
  id: string;
  title?: string;
  content?: string;
  contentPart2?: string;
  excerpt?: string;
  heroImageUrl?: string;
  secondaryImageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  categoryId?: string;
  aiSummary?: string;
  faq?: { question: string; answer: string }[];
}

export class UpdateArticleUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(input: UpdateArticleInput) {
    const article = await this.articleRepository.findById(input.id);
    if (!article) throw new Error("المقال غير موجود");

    if (input.title) article.title = input.title;
    if (input.content) {
      article.content = input.content;
    }
    if (input.contentPart2 !== undefined) {
      article.contentPart2 = input.contentPart2;
    }
    if (input.content || input.contentPart2 !== undefined) {
      article.calculateReadingTime();
    }
    if (input.excerpt !== undefined) article.excerpt = input.excerpt;
    if (input.heroImageUrl !== undefined) article.heroImageUrl = input.heroImageUrl;
    if (input.secondaryImageUrl !== undefined) article.secondaryImageUrl = input.secondaryImageUrl;
    if (input.metaTitle !== undefined) article.metaTitle = input.metaTitle;
    if (input.metaDescription !== undefined) article.metaDescription = input.metaDescription;
    if (input.categoryId !== undefined) article.categoryId = input.categoryId;
    if (input.aiSummary !== undefined) article.aiSummary = input.aiSummary;
    if (input.faq !== undefined) article.faq = input.faq;

    return this.articleRepository.update(article);
  }
}
