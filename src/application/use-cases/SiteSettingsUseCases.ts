import { SiteSettingsRepository } from "@/domain/repositories/SiteSettingsRepository";

/** المفاتيح المعروفة اللي بتتحكم فيها من لوحة التحكم */
export const SITE_SETTING_KEYS = {
  GA_MEASUREMENT_ID: "ga_measurement_id",
  CLARITY_ID: "clarity_id",
  GOOGLE_SITE_VERIFICATION: "google_site_verification",
  BING_SITE_VERIFICATION: "bing_site_verification",
  ADSENSE_PUBLISHER_ID: "adsense_publisher_id",
  SOCIAL_THREADS_URL: "social_threads_url",
  SOCIAL_FACEBOOK_URL: "social_facebook_url",
  SOCIAL_TWITTER_URL: "social_twitter_url",
  SOCIAL_SUBSTACK_URL: "social_substack_url",
  HEADER_BADGE_TEXT: "header_badge_text",
  BACKGROUND_MUSIC_URL: "background_music_url",
} as const;

export class GetSiteSettingsUseCase {
  constructor(private readonly repo: SiteSettingsRepository) {}

  /**
   * بيرجع القيم من قاعدة البيانات، ولو مفيش قيمة محفوظة لمفتاح معين
   * بيرجع لمتغير البيئة المقابل كـ fallback (عشان مفيش حاجة تتكسر).
   */
  async execute(): Promise<Record<string, string>> {
    const dbSettings = await this.repo.getAll();

    return {
      [SITE_SETTING_KEYS.GA_MEASUREMENT_ID]:
        dbSettings[SITE_SETTING_KEYS.GA_MEASUREMENT_ID] ??
        process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ??
        "",
      [SITE_SETTING_KEYS.CLARITY_ID]:
        dbSettings[SITE_SETTING_KEYS.CLARITY_ID] ?? process.env.NEXT_PUBLIC_CLARITY_ID ?? "",
      [SITE_SETTING_KEYS.GOOGLE_SITE_VERIFICATION]:
        dbSettings[SITE_SETTING_KEYS.GOOGLE_SITE_VERIFICATION] ??
        process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ??
        "",
      [SITE_SETTING_KEYS.BING_SITE_VERIFICATION]:
        dbSettings[SITE_SETTING_KEYS.BING_SITE_VERIFICATION] ??
        process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ??
        "",
      [SITE_SETTING_KEYS.ADSENSE_PUBLISHER_ID]:
        dbSettings[SITE_SETTING_KEYS.ADSENSE_PUBLISHER_ID] ??
        process.env.ADSENSE_PUBLISHER_ID ??
        "",
      [SITE_SETTING_KEYS.SOCIAL_THREADS_URL]:
        dbSettings[SITE_SETTING_KEYS.SOCIAL_THREADS_URL] ?? "",
      [SITE_SETTING_KEYS.SOCIAL_FACEBOOK_URL]:
        dbSettings[SITE_SETTING_KEYS.SOCIAL_FACEBOOK_URL] ?? "",
      [SITE_SETTING_KEYS.SOCIAL_TWITTER_URL]:
        dbSettings[SITE_SETTING_KEYS.SOCIAL_TWITTER_URL] ?? "",
      [SITE_SETTING_KEYS.SOCIAL_SUBSTACK_URL]:
        dbSettings[SITE_SETTING_KEYS.SOCIAL_SUBSTACK_URL] ?? "",
      [SITE_SETTING_KEYS.HEADER_BADGE_TEXT]:
        dbSettings[SITE_SETTING_KEYS.HEADER_BADGE_TEXT] ?? "",
      [SITE_SETTING_KEYS.BACKGROUND_MUSIC_URL]:
        dbSettings[SITE_SETTING_KEYS.BACKGROUND_MUSIC_URL] ?? "",
    };
  }
}

export class UpsertSiteSettingUseCase {
  constructor(private readonly repo: SiteSettingsRepository) {}

  async execute(key: string, value: string): Promise<void> {
    await this.repo.set(key, value);
  }
}