import { randomUUID } from "crypto";
import { randomBytes } from "crypto";
import { Subscriber } from "@/domain/entities/Subscriber";
import { SubscriberRepository } from "@/domain/repositories/SubscriberRepository";
import { sendWelcomeEmail } from "@/lib/mailer";

export interface SubscribeInput {
  email: string;
  preferredCategories?: string[];
}

// ملاحظة: النظام كان شغال Double Opt-in (يبعت إيميل تأكيد قبل التفعيل).
// اتحول لـ Single Opt-in - المشترك بيتفعل فورًا من غير أي تأكيد.
// ده مسموح قانونيًا في أمريكا تحت CAN-SPAM Act (على عكس أوروبا/GDPR اللي بتفضل double opt-in).
// لو يومًا ما احتجت ترجع للـ double opt-in (مثلاً لما توسع لجمهور أوروبي)، استخدم النسخة القديمة من الملف ده.

export class SubscribeToNewsletterUseCase {
  constructor(private readonly subscriberRepository: SubscriberRepository) {}

  async execute(input: SubscribeInput): Promise<{ status: "verified" | "already_verified" }> {
    const existing = await this.subscriberRepository.findByEmail(input.email);

    if (existing?.status === "verified") {
      return { status: "already_verified" };
    }

    let subscriber: Subscriber;
    if (existing) {
      existing.status = "verified";
      existing.verifiedAt = new Date();
      existing.verificationToken = null;
      existing.verificationTokenExpires = null;
      existing.preferredCategories = input.preferredCategories ?? existing.preferredCategories;
      subscriber = await this.subscriberRepository.update(existing);
    } else {
      subscriber = await this.subscriberRepository.create(
        new Subscriber(
          randomUUID(),
          input.email,
          "verified",
          randomBytes(16).toString("hex"), // unsubscribeToken
          input.preferredCategories ?? [],
          null, // verificationToken - مش محتاجينه في single opt-in
          null, // verificationTokenExpires
          new Date() // verifiedAt
        )
      );
    }

    try {
      await sendWelcomeEmail(subscriber.email, subscriber.unsubscribeToken);
    } catch (error) {
      // مش هنوقف عملية الاشتراك بسبب فشل الإيميل - البيانات اتخزنت بالفعل كـ verified
      console.error("Failed to send welcome email:", error);
    }

    return { status: "verified" };
  }
}
