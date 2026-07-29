import { Article } from "../entities/Article";

export interface ArticleListFilters {
  categoryId?: string;
  authorId?: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * العقد اللي أي طبقة Infrastructure لازم تلتزم بيه.
 * ده اللي بيخلي الـ Application Layer متعرفش أو تهتم لو
 * البيانات جاية من Postgres أو Mongo أو حتى API خارجي.
 */
export interface ArticleRepository {
  findBySlug(slug: string): Promise<Article | null>;
  findById(id: string): Promise<Article | null>;
  list(filters: ArticleListFilters): Promise<Article[]>;
  create(article: Article): Promise<Article>;
  update(article: Article): Promise<Article>;
  delete(id: string): Promise<void>;
}
