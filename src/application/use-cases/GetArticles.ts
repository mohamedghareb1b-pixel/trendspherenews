import { Article } from "@/domain/entities/Article";
import {
  ArticleListFilters,
  ArticleRepository,
} from "@/domain/repositories/ArticleRepository";

export class GetArticlesUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(filters: ArticleListFilters = {}): Promise<Article[]> {
    return this.articleRepository.list({
      status: "published",
      limit: 20,
      ...filters,
    });
  }
}

export class GetArticleBySlugUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(slug: string): Promise<Article | null> {
    return this.articleRepository.findBySlug(slug);
  }
}

export class GetArticleByIdUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(id: string): Promise<Article | null> {
    return this.articleRepository.findById(id);
  }
}

/**
 * لاستخدام لوحة التحكم فقط - بيرجع كل المقالات بكل حالاتها
 * (draft, review, published...) مش المنشورة بس زي الـ Homepage.
 */
export class GetAllArticlesForAdminUseCase {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async execute(filters: ArticleListFilters = {}): Promise<Article[]> {
    return this.articleRepository.list({ limit: 50, ...filters, status: filters.status });
  }
}
