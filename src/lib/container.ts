import { DrizzleArticleRepository } from "@/infrastructure/repositories/DrizzleArticleRepository";
import { DrizzleSubscriberRepository } from "@/infrastructure/repositories/DrizzleSubscriberRepository";
import { CreateArticleUseCase } from "@/application/use-cases/CreateArticle";
import {
  GetArticlesUseCase,
  GetRelatedArticlesUseCase,
  GetArticleBySlugUseCase,
  GetArticleByIdUseCase,
  GetAllArticlesForAdminUseCase,
} from "@/application/use-cases/GetArticles";
import { PublishArticleUseCase } from "@/application/use-cases/PublishArticle";
import { UpdateArticleUseCase } from "@/application/use-cases/UpdateArticle";
import { SubscribeToNewsletterUseCase } from "@/application/use-cases/SubscribeToNewsletter";
import { VerifySubscriptionUseCase } from "@/application/use-cases/VerifySubscription";
import { UnsubscribeUseCase } from "@/application/use-cases/Unsubscribe";
import { GenerateArticleAIMetadataUseCase } from "@/application/use-cases/GenerateArticleAIMetadata";
import { AnthropicContentAI } from "@/infrastructure/ai/AnthropicContentAI";
import {
  CreateCategoryUseCase,
  ListCategoriesUseCase,
  GetCategoryBySlugUseCase,
  GetCategoryByIdUseCase,
} from "@/application/use-cases/CategoryUseCases";
import {
  ListTagsUseCase,
  GetArticlesByTagUseCase,
  SetArticleTagsUseCase,
  GetArticleTagsUseCase,
} from "@/application/use-cases/TagUseCases";
import { DrizzleCategoryRepository } from "@/infrastructure/repositories/DrizzleCategoryRepository";
import { DrizzleTagRepository } from "@/infrastructure/repositories/DrizzleTagRepository";
import {
  RecordPageViewUseCase,
  GetAnalyticsSummaryUseCase,
} from "@/application/use-cases/AnalyticsUseCases";
import { DrizzleAnalyticsRepository } from "@/infrastructure/repositories/DrizzleAnalyticsRepository";
import {
  GetAdSlotUseCase,
  ListAdSlotsUseCase,
  UpsertAdSlotUseCase,
} from "@/application/use-cases/AdSlotUseCases";
import { DrizzleAdSlotRepository } from "@/infrastructure/repositories/DrizzleAdSlotRepository";
import { UploadArticleImageUseCase } from "@/application/use-cases/UploadArticleImage";
import { SupabaseImageStorage } from "@/infrastructure/storage/SupabaseImageStorage";
import {
  GetSiteSettingsUseCase,
  UpsertSiteSettingUseCase,
} from "@/application/use-cases/SiteSettingsUseCases";
import { DrizzleSiteSettingsRepository } from "@/infrastructure/repositories/DrizzleSiteSettingsRepository";
import { NotifySubscribersOfNewArticleUseCase } from "@/application/use-cases/NotifySubscribersOfNewArticle";

/**
 * نقطة واحدة لتجميع الـ Use Cases مع تنفيذاتها.
 * لو غيرنا Postgres بحاجة تانية يوم ما، هنغير هنا بس.
 */
const articleRepository = new DrizzleArticleRepository();
const subscriberRepository = new DrizzleSubscriberRepository();
const contentAI = new AnthropicContentAI();
const categoryRepository = new DrizzleCategoryRepository();
const tagRepository = new DrizzleTagRepository();
const analyticsRepository = new DrizzleAnalyticsRepository();
const adSlotRepository = new DrizzleAdSlotRepository();
const imageStorage = new SupabaseImageStorage();
const siteSettingsRepository = new DrizzleSiteSettingsRepository();

export const container = {
  createArticle: new CreateArticleUseCase(articleRepository),
  getArticles: new GetArticlesUseCase(articleRepository),
  getRelatedArticles: new GetRelatedArticlesUseCase(),
  getArticleBySlug: new GetArticleBySlugUseCase(articleRepository),
  getArticleById: new GetArticleByIdUseCase(articleRepository),
  getAllArticlesForAdmin: new GetAllArticlesForAdminUseCase(articleRepository),
  publishArticle: new PublishArticleUseCase(articleRepository),
  updateArticle: new UpdateArticleUseCase(articleRepository),
  generateArticleAIMetadata: new GenerateArticleAIMetadataUseCase(
    articleRepository,
    contentAI
  ),

  subscribeToNewsletter: new SubscribeToNewsletterUseCase(subscriberRepository),
  verifySubscription: new VerifySubscriptionUseCase(subscriberRepository),
  unsubscribe: new UnsubscribeUseCase(subscriberRepository),

  createCategory: new CreateCategoryUseCase(categoryRepository),
  listCategories: new ListCategoriesUseCase(categoryRepository),
  getCategoryBySlug: new GetCategoryBySlugUseCase(categoryRepository),
  getCategoryById: new GetCategoryByIdUseCase(categoryRepository),

  listTags: new ListTagsUseCase(tagRepository),
  getArticlesByTag: new GetArticlesByTagUseCase(tagRepository),
  setArticleTags: new SetArticleTagsUseCase(tagRepository),
  getArticleTags: new GetArticleTagsUseCase(tagRepository),

  recordPageView: new RecordPageViewUseCase(analyticsRepository),
  getAnalyticsSummary: new GetAnalyticsSummaryUseCase(analyticsRepository),

  getAdSlot: new GetAdSlotUseCase(adSlotRepository),
  listAdSlots: new ListAdSlotsUseCase(adSlotRepository),
  upsertAdSlot: new UpsertAdSlotUseCase(adSlotRepository),

  uploadArticleImage: new UploadArticleImageUseCase(imageStorage),

  getSiteSettings: new GetSiteSettingsUseCase(siteSettingsRepository),
  upsertSiteSetting: new UpsertSiteSettingUseCase(siteSettingsRepository),

  notifySubscribersOfNewArticle: new NotifySubscribersOfNewArticleUseCase(
    articleRepository,
    categoryRepository,
    subscriberRepository
  ),
};