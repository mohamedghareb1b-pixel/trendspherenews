export type SubscriberStatus = "pending" | "verified" | "unsubscribed";

/**
 * Subscriber - كيان نقي لمشترك النشرة البريدية.
 * بيحمل قواعد العمل الخاصة بدورة حياة الاشتراك (Double Opt-in).
 */
export class Subscriber {
  constructor(
    public readonly id: string,
    public email: string,
    public status: SubscriberStatus,
    public unsubscribeToken: string,
    public preferredCategories: string[] = [],
    public verificationToken: string | null = null,
    public verificationTokenExpires: Date | null = null,
    public verifiedAt: Date | null = null,
    public createdAt: Date = new Date()
  ) {}

  confirmVerification(token: string): void {
    if (this.status === "unsubscribed") {
      throw new Error("لا يمكن تأكيد اشتراك تم إلغاؤه");
    }
    if (!this.verificationToken || this.verificationToken !== token) {
      throw new Error("رابط التأكيد غير صحيح");
    }
    if (this.verificationTokenExpires && this.verificationTokenExpires < new Date()) {
      throw new Error("انتهت صلاحية رابط التأكيد");
    }
    this.status = "verified";
    this.verifiedAt = new Date();
    this.verificationToken = null;
    this.verificationTokenExpires = null;
  }

  unsubscribe(): void {
    this.status = "unsubscribed";
  }

  isActive(): boolean {
    return this.status === "verified";
  }
}
