import { Card } from '@/domain/card/Card';

export interface CardRepository {
  save(card: Card): Promise<void>;
  findById(id: string): Promise<Card | null>;
  findByOwnerId(ownerId: string): Promise<Card[]>;
  findDueByOwnerId(ownerId: string, at: Date): Promise<Card[]>;
  deleteById(id: string): Promise<void>;
}
