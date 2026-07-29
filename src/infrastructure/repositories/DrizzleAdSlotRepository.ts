import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { adSlots } from "../db/schema";
import { AdSlot } from "@/domain/entities/AdSlot";
import { AdSlotRepository } from "@/domain/repositories/AdSlotRepository";

function toDomain(row: typeof adSlots.$inferSelect): AdSlot {
  return new AdSlot(row.id, row.key, row.name, row.code, row.enabled, row.updatedAt);
}

export class DrizzleAdSlotRepository implements AdSlotRepository {
  async findByKey(key: string): Promise<AdSlot | null> {
    const [row] = await db.select().from(adSlots).where(eq(adSlots.key, key)).limit(1);
    return row ? toDomain(row) : null;
  }

  async list(): Promise<AdSlot[]> {
    const rows = await db.select().from(adSlots);
    return rows.map(toDomain);
  }

  async upsert(slot: {
    key: string;
    name: string;
    code: string | null;
    enabled: boolean;
  }): Promise<AdSlot> {
    const [row] = await db
      .insert(adSlots)
      .values(slot)
      .onConflictDoUpdate({
        target: adSlots.key,
        set: {
          name: slot.name,
          code: slot.code,
          enabled: slot.enabled,
          updatedAt: new Date(),
        },
      })
      .returning();
    return toDomain(row);
  }
}
