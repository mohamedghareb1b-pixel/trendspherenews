import { AdSlotRepository } from "@/domain/repositories/AdSlotRepository";
import { DEFAULT_AD_SLOTS } from "@/domain/entities/AdSlot";

export class GetAdSlotUseCase {
  constructor(private readonly adSlotRepository: AdSlotRepository) {}

  async execute(key: string) {
    return this.adSlotRepository.findByKey(key);
  }
}

/**
 * بترجع كل السلوتات، وبتضمن وجود السلوتات الافتراضية (معطلة) لو أول مرة.
 * ده بيخلي شاشة الأدمن دايمًا عارضة كل الأماكن المتاحة حتى لو محدش ضبطها لسه.
 */
export class ListAdSlotsUseCase {
  constructor(private readonly adSlotRepository: AdSlotRepository) {}

  async execute() {
    const existing = await this.adSlotRepository.list();
    const existingKeys = new Set(existing.map((s) => s.key));

    const missingDefaults = DEFAULT_AD_SLOTS.filter((d) => !existingKeys.has(d.key));
    const created = await Promise.all(
      missingDefaults.map((d) =>
        this.adSlotRepository.upsert({ key: d.key, name: d.name, code: null, enabled: false })
      )
    );

    return [...existing, ...created].sort((a, b) => a.key.localeCompare(b.key));
  }
}

export class UpsertAdSlotUseCase {
  constructor(private readonly adSlotRepository: AdSlotRepository) {}

  async execute(input: { key: string; name: string; code: string | null; enabled: boolean }) {
    return this.adSlotRepository.upsert(input);
  }
}
