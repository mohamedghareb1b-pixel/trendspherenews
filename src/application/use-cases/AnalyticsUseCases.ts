import { AnalyticsRepository } from "@/domain/repositories/AnalyticsRepository";

export class RecordPageViewUseCase {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async execute(input: { articleId?: string | null; path: string; referrer?: string }) {
    return this.analyticsRepository.recordView(input);
  }
}

export class GetAnalyticsSummaryUseCase {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async execute(sinceDays = 30) {
    const [totalViews, topArticles, dailyViews] = await Promise.all([
      this.analyticsRepository.getTotalViews(sinceDays),
      this.analyticsRepository.getTopArticles(sinceDays, 10),
      this.analyticsRepository.getDailyViews(sinceDays),
    ]);

    return { totalViews, topArticles, dailyViews, sinceDays };
  }
}
