import { SubscriberRepository } from "@/domain/repositories/SubscriberRepository";

export class UnsubscribeUseCase {
  constructor(private readonly subscriberRepository: SubscriberRepository) {}

  async execute(unsubscribeToken: string): Promise<void> {
    const subscriber = await this.subscriberRepository.findByUnsubscribeToken(
      unsubscribeToken
    );
    if (!subscriber) {
      throw new Error("رابط إلغاء الاشتراك غير صحيح");
    }

    subscriber.unsubscribe();
    await this.subscriberRepository.update(subscriber);
  }
}
