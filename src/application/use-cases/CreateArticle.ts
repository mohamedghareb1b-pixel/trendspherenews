import { Article, FaqItem } from "@/domain/entities/Article";
import { ArticleRepository } from "@/domain/repositories/ArticleRepository";
import { randomUUID } from "crypto";

export interface CreateArticleInput {
  title: string;
  slug: string;
  content: string;
  contentPart2?: string;
  ticketLink?: string;
  authorId?: string;
  categoryId?: string;
  excerpt?: string;
  heroImageUrl?: string;
  secondaryImageUrl?: string;
  aiSummary?: string;
  faq?: FaqItem[];
  metaTitle?: string;
  metaDescription?: string;
}

/**
 * Use Case: إنشاء مقال جديد.
 * هنا بيتحط أي منطق عمل (business rules) قبل الحفظ،
 * زي حساب وقت القراءة أو التأكد من عدم تكرار الـ slug.
 */
export class CreateArticleUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(input: CreateArticleInput): Promise<Article> {
    const existing = await this.articleRepository.findBySlug(input.slug);
    if (existing) {
      throw new Error(`مقال بنفس الـ slug "${input.slug}" موجود بالفعل`);
    }

    const article = new Article(
      randomUUID(),
      input.title,
      input.slug,
      input.content,
      "draft",
      input.authorId ?? null,
      input.categoryId ?? null,
      input.excerpt ?? null,
      input.heroImageUrl ?? null,
      input.secondaryImageUrl ?? null,
      input.metaTitle ?? null,
      input.metaDescription ?? null,
      input.aiSummary ?? null,
      input.faq ?? [],
      null,
      null,
      new Date(),
      new Date(),
      input.contentPart2 ?? null,
      input.ticketLink ?? null
    );

    article.calculateReadingTime();

    return this.articleRepository.create(article);
  }
}
