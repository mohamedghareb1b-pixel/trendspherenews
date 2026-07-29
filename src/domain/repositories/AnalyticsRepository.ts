export interface ArticleViewCount {
  articleId: string;
  title: string;
  slug: string;
  views: number;
}

export interface DailyViewCount {
  date: string; // YYYY-MM-DD
  views: number;
}

export interface AnalyticsRepository {
  recordView(input: { articleId?: string | null; path: string; referrer?: string }): Promise<void>;
  getTotalViews(sinceDays: number): Promise<number>;
  getTopArticles(sinceDays: number, limit: number): Promise<ArticleViewCount[]>;
  getDailyViews(sinceDays: number): Promise<DailyViewCount[]>;
}
