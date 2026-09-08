export type ArticleStatus = "draft" | "review" | "scheduled" | "published" | "archived";

/**
 * "standard" = مقال عادي بيتعرض على /articles/slug
 * "tour" = مقال "ارتيكل 2" (روند حفلات كامل) بيتعرض على /tours/slug
 */
export type ArticleType = "standard" | "tour";

export interface FaqItem {
  question: string;
  answer: string;
}

/** حفلة واحدة جوه جدول الروند بتاع مقال الـ "tour" */
export interface TourEvent {
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM" (24 ساعة، بتوقيت المكان)
  venue: string;
  city: string;
  state: string;
  ticketLink: string;
}

/**
 * Article - الكيان الأساسي في النظام.
 * لا يعرف أي حاجة عن قاعدة البيانات أو الـ HTTP أو Next.js.
 * ده الـ Single Source of Truth لقواعد العمل الخاصة بالمقال.
 */
export class Article {
  constructor(
    public readonly id: string,
    public title: string,
    public slug: string,
    public content: string,
    public status: ArticleStatus,
    public authorId: string | null = null,
    public categoryId: string | null = null,
    public excerpt: string | null = null,
    public heroImageUrl: string | null = null,
    public secondaryImageUrl: string | null = null,
    public metaTitle: string | null = null,
    public metaDescription: string | null = null,
    public aiSummary: string | null = null,
    public faq: FaqItem[] = [],
    public readingTimeMinutes: number | null = null,
    public publishedAt: Date | null = null,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public contentPart2: string | null = null,
    public ticketLink: string | null = null,
    public type: ArticleType = "standard",
    public tourEvents: TourEvent[] = []
  ) {}

  publish(): void {
    if (this.status === "published") return;
    if (!this.title || !this.content) {
      throw new Error("لا يمكن نشر مقال بدون عنوان أو محتوى");
    }
    this.status = "published";
    this.publishedAt = new Date();
  }

  archive(): void {
    this.status = "archived";
  }

  calculateReadingTime(wordsPerMinute = 200): number {
    const fullText = `${this.content} ${this.contentPart2 ?? ""}`.trim();
    const wordCount = fullText.split(/\s+/).length;
    this.readingTimeMinutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
    return this.readingTimeMinutes;
  }

  isPublished(): boolean {
    return this.status === "published";
  }

  /** بيرجع true لو ميعاد الحفلة ده فات (بيتقارن وقت السيرفر وقت العرض، مش وقت وقت الحفظ) */
  static isTourEventEnded(event: TourEvent, now: Date = new Date()): boolean {
    const eventDateTime = new Date(`${event.date}T${event.time || "23:59"}`);
    if (Number.isNaN(eventDateTime.getTime())) return false;
    return eventDateTime.getTime() < now.getTime();
  }
}
