import { CardRepository } from '@/application/ports/CardRepository';
import { Card } from '@/domain/card/Card';

export class InMemoryCardRepository implements CardRepository {
  private cards = new Map<string, Card>();

  async save(card: Card): Promise<void> {
    this.cards.set(card.toPrimitives().id, card);
  }

  async findById(id: string): Promise<Card | null> {
    return this.cards.get(id) ?? null;
  }

  async findByOwnerId(ownerId: string): Promise<Card[]> {
    const all = Array.from(this.cards.values());
    return all.filter((c) => c.toPrimitives().ownerId === ownerId);
  }

  async findDueByOwnerId(ownerId: string, at: Date): Promise<Card[]> {
    const all = Array.from(this.cards.values());
    return all.filter(
      (c) => c.toPrimitives().ownerId === ownerId && c.isDueAt(at),
    );
  }
}
