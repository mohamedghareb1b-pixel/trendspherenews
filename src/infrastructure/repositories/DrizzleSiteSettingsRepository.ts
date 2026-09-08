import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { siteSettings } from "../db/schema";
import { SiteSettingsRepository } from "@/domain/repositories/SiteSettingsRepository";

export class DrizzleSiteSettingsRepository implements SiteSettingsRepository {
  async getAll(): Promise<Record<string, string>> {
    const rows = await db.select().from(siteSettings);
    const map: Record<string, string> = {};
    for (const row of rows) {
      if (row.value) map[row.key] = row.value;
    }
    return map;
  }

  async set(key: string, value: string): Promise<void> {
    await db
      .insert(siteSettings)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value, updatedAt: new Date() },
      });
  }
}
