import { Subscriber } from "../entities/Subscriber";

export interface SubscriberRepository {
  findByEmail(email: string): Promise<Subscriber | null>;
  findByVerificationToken(token: string): Promise<Subscriber | null>;
  findByUnsubscribeToken(token: string): Promise<Subscriber | null>;
  create(subscriber: Subscriber): Promise<Subscriber>;
  update(subscriber: Subscriber): Promise<Subscriber>;
  listVerified(categoryFilter?: string[]): Promise<Subscriber[]>;
}
