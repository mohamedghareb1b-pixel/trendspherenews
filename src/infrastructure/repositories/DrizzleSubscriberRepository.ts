import { eq, and, isNull, sql } from "drizzle-orm";
import { db } from "../db/client";
import { subscribers } from "../db/schema";
import { Subscriber, SubscriberStatus } from "@/domain/entities/Subscriber";
import { SubscriberRepository } from "@/domain/repositories/SubscriberRepository";

type SubscriberRow = typeof subscribers.$inferSelect;

function toDomain(row: SubscriberRow): Subscriber {
  return new Subscriber(
    row.id,
    row.email,
    row.status as SubscriberStatus,
    row.unsubscribeToken,
    (row.preferredCategories as string[]) ?? [],
    row.verificationToken,
    row.verificationTokenExpires,
    row.verifiedAt,
    row.createdAt
  );
}

export class DrizzleSubscriberRepository implements SubscriberRepository {
  async findByEmail(email: string): Promise<Subscriber | null> {
    const [row] = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, email))
      .limit(1);
    return row ? toDomain(row) : null;
  }

  async findByVerificationToken(token: string): Promise<Subscriber | null> {
    const [row] = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.verificationToken, token))
      .limit(1);
    return row ? toDomain(row) : null;
  }

  async findByUnsubscribeToken(token: string): Promise<Subscriber | null> {
    const [row] = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.unsubscribeToken, token))
      .limit(1);
    return row ? toDomain(row) : null;
  }

  async create(subscriber: Subscriber): Promise<Subscriber> {
    const [row] = await db
      .insert(subscribers)
      .values({
        id: subscriber.id,
        email: subscriber.email,
        status: subscriber.status,
        preferredCategories: subscriber.preferredCategories,
        verificationToken: subscriber.verificationToken,
        verificationTokenExpires: subscriber.verificationTokenExpires,
        unsubscribeToken: subscriber.unsubscribeToken,
      })
      .returning();
    return toDomain(row);
  }

  async update(subscriber: Subscriber): Promise<Subscriber> {
    const [row] = await db
      .update(subscribers)
      .set({
        status: subscriber.status,
        preferredCategories: subscriber.preferredCategories,
        verificationToken: subscriber.verificationToken,
        verificationTokenExpires: subscriber.verificationTokenExpires,
        verifiedAt: subscriber.verifiedAt,
      })
      .where(eq(subscribers.id, subscriber.id))
      .returning();
    return toDomain(row);
  }

  async listVerified(categoryFilter?: string[]): Promise<Subscriber[]> {
    const rows = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.status, "verified"));

    const all = rows.map(toDomain);
    if (!categoryFilter || categoryFilter.length === 0) return all;

    // مشترك من غير تصنيفات مفضلة (preferredCategories فاضية) = مهتم بكل حاجة،
    // بيحصل ده حاليًا لأن اختيار التصنيف اتشال مؤقتًا من فورم الاشتراك.
    return all.filter(
      (s) =>
        s.preferredCategories.length === 0 ||
        s.preferredCategories.some((c) => categoryFilter.includes(c))
    );
  }
}
