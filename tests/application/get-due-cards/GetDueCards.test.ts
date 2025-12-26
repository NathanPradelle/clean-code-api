import { describe, it, expect } from 'vitest';
import { GetDueCards } from '@/application/use-cases/get-due-cards/GetDueCards';
import { CardRepository } from '@/application/ports/CardRepository';
import { Card } from '@/domain/card/Card';
import { BoxLevel } from '@/domain/card/BoxLevel';

class StubCardRepository implements CardRepository {
  lastOwnerId: string | null = null;
  lastAt: Date | null = null;

  constructor(private readonly cards: Card[]) {}

  async findDueByOwnerId(ownerId: string, at: Date): Promise<Card[]> {
    this.lastOwnerId = ownerId;
    this.lastAt = at;
    return this.cards;
  }

  async save(): Promise<void> {
    throw new Error('not implemented');
  }

  async findById(): Promise<Card | null> {
    throw new Error('not implemented');
  }

  async findByOwnerId(): Promise<Card[]> {
    throw new Error('not implemented');
  }

  async deleteById(): Promise<void> {
    throw new Error('not implemented');
  }
}

describe('GetDueCards', () => {
  it('returns due cards for the given owner and maps properties correctly', async () => {
    const createdAt = new Date('2025-01-01T00:00:00.000Z');
    const nextReviewAt1 = new Date('2025-01-02T00:00:00.000Z');
    const nextReviewAt2 = new Date('2025-01-03T00:00:00.000Z');
    const archivedAt = new Date('2025-01-10T00:00:00.000Z');

    const activeCard = Card.restore({
      id: 'card-1',
      ownerId: 'owner-1',
      question: 'Q1',
      answer: 'A1',
      tag: 'tag-1',
      boxLevel: 2 as BoxLevel,
      createdAt,
      updatedAt: createdAt,
      lastAnsweredAt: createdAt,
      nextReviewAt: nextReviewAt1,
      archivedAt: undefined,
    });

    const archivedCard = Card.restore({
      id: 'card-2',
      ownerId: 'owner-1',
      question: 'Q2',
      answer: 'A2',
      tag: 'tag-2',
      boxLevel: 5 as BoxLevel,
      createdAt,
      updatedAt: createdAt,
      lastAnsweredAt: createdAt,
      nextReviewAt: nextReviewAt2,
      archivedAt,
    });

    const at = new Date('2025-01-05T00:00:00.000Z');

    const repo = new StubCardRepository([activeCard, archivedCard]);
    const useCase = new GetDueCards(repo);

    const result = await useCase.execute({
      ownerId: 'owner-1',
      at,
    });

    expect(repo.lastOwnerId).toBe('owner-1');
    expect(repo.lastAt).toEqual(at);

    expect(result.cards).toHaveLength(2);

    const first = result.cards[0]!;
    const second = result.cards[1]!;

    expect(first.id).toBe('card-1');
    expect(first.ownerId).toBe('owner-1');
    expect(first.question).toBe('Q1');
    expect(first.answer).toBe('A1');
    expect(first.boxLevel).toBe(2);
    expect(first.nextReviewAt).toEqual(nextReviewAt1);
    expect(first.isArchived).toBe(false);

    expect(second.id).toBe('card-2');
    expect(second.ownerId).toBe('owner-1');
    expect(second.question).toBe('Q2');
    expect(second.answer).toBe('A2');
    expect(second.boxLevel).toBe(5);
    expect(second.nextReviewAt).toEqual(nextReviewAt2);
    expect(second.isArchived).toBe(true);
  });

  it('returns an empty list when there are no due cards', async () => {
    const at = new Date('2025-01-05T00:00:00.000Z');

    const repo = new StubCardRepository([]);
    const useCase = new GetDueCards(repo);

    const result = await useCase.execute({
      ownerId: 'owner-1',
      at,
    });

    expect(repo.lastOwnerId).toBe('owner-1');
    expect(repo.lastAt).toEqual(at);
    expect(result.cards).toHaveLength(0);
  });
});
