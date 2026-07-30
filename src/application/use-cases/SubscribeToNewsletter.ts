import { randomUUID } from "crypto";
import { randomBytes } from "crypto";
import { Subscriber } from "@/domain/entities/Subscriber";
import { SubscriberRepository } from "@/domain/repositories/SubscriberRepository";
import { sendVerificationEmail } from "@/lib/mailer";

export interface SubscribeInput {
  email: string;
  preferredCategories?: string[];
}

const TOKEN_TTL_HOURS = 48;

export class SubscribeToNewsletterUseCase {
  constructor(private readonly subscriberRepository: SubscriberRepository) {}

  async execute(input: SubscribeInput): Promise<{ status: "sent" | "already_verified" }> {
    const existing = await this.subscriberRepository.findByEmail(input.email);

    if (existing?.status === "verified") {
      return { status: "already_verified" };
    }

    const verificationToken = randomBytes(24).toString("hex");
    const verificationTokenExpires = new Date(
      Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000
    );

    let subscriber: Subscriber;
    if (existing) {
      existing.verificationToken = verificationToken;
      existing.verificationTokenExpires = verificationTokenExpires;
      existing.preferredCategories = input.preferredCategories ?? existing.preferredCategories;
      subscriber = await this.subscriberRepository.update(existing);
    } else {
      subscriber = await this.subscriberRepository.create(
        new Subscriber(
          randomUUID(),
          input.email,
          "pending",
          randomBytes(16).toString("hex"), // unsubscribeToken
          input.preferredCategories ?? [],
          verificationToken,
          verificationTokenExpires
        )
      );
    }

    try {
      await sendVerificationEmail(subscriber.email, verificationToken);
    } catch (error) {
      // مش هنوقف عملية الاشتراك بسبب فشل الإيميل - البيانات اتخزنت بالفعل
      // ونقدر نبعت لينك التحقق يدويًا أو نعيد المحاولة لاحقًا
      console.error("Failed to send verification email:", error);
    }

    return { status: "sent" };
  }
}
