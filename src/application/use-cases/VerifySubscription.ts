import { SubscriberRepository } from "@/domain/repositories/SubscriberRepository";
import { sendWelcomeEmail } from "@/lib/mailer";

export class VerifySubscriptionUseCase {
  constructor(private readonly subscriberRepository: SubscriberRepository) {}

  async execute(token: string): Promise<void> {
    const subscriber = await this.subscriberRepository.findByVerificationToken(token);
    if (!subscriber) {
      throw new Error("رابط التأكيد غير صحيح أو منتهي");
    }

    subscriber.confirmVerification(token);
    await this.subscriberRepository.update(subscriber);
    await sendWelcomeEmail(subscriber.email, subscriber.unsubscribeToken);
  }
}
