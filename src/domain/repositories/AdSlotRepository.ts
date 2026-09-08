import { AdSlot } from "../entities/AdSlot";

export interface AdSlotRepository {
  findByKey(key: string): Promise<AdSlot | null>;
  list(): Promise<AdSlot[]>;
  upsert(slot: { key: string; name: string; code: string | null; enabled: boolean }): Promise<AdSlot>;
}
