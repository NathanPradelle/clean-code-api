import { describe, it, expect } from 'vitest';
import { AnswerCard } from '@/application/use-cases/answer-card/AnswerCard';
import { CardRepository } from '@/application/ports/CardRepository';
import { Card } from '@/domain/card/Card';
import { BoxLevel } from '@/domain/card/BoxLevel';

class FakeCardRepository implements CardRepository {
  savedCard: Card | null = null;
  cardToReturn: Card | null = null;
  findByIdCalls: string[] = [];

  async findById(id: string): Promise<Card | null> {
    this.findByIdCalls.push(id);
    return this.cardToReturn;
  }

  async save(card: Card): Promise<void> {
    this.savedCard = card;
  }

  async findByOwnerId(): Promise<Card[]> {
    throw new Error('not implemented');
  }

  async findDueByOwnerId(): Promise<Card[]> {
    throw new Error('not implemented');
  }

  async deleteById(): Promise<void> {
    throw new Error('not implemented');
  }
}

describe('AnswerCard', () => {
  it('returns false and does not save when card does not exist', async () => {
    const repo = new FakeCardRepository();
    repo.cardToReturn = null;

    const useCase = new AnswerCard(repo);

    const result = await useCase.execute({
      cardId: 'unknown',
      isValid: true,
    });

    expect(result).toBe(false);
    expect(repo.findByIdCalls).toEqual(['unknown']);
    expect(repo.savedCard).toBeNull();
  });

  it('marks card as correctly answered and saves it when isValid is true', async () => {
    const createdAt = new Date('2025-01-01T00:00:00.000Z');
    const nextReviewAt = new Date('2025-01-02T00:00:00.000Z');

    const card = Card.restore({
      id: 'card-1',
      ownerId: 'owner-1',
      question: 'Q',
      answer: 'A',
      tag: 'tag',
      boxLevel: 1 as BoxLevel,
      createdAt,
      updatedAt: createdAt,
      lastAnsweredAt: createdAt,
      nextReviewAt,
      archivedAt: undefined,
    });

    const repo = new FakeCardRepository();
    repo.cardToReturn = card;

    const useCase = new AnswerCard(repo);

    const result = await useCase.execute({
      cardId: 'card-1',
      isValid: true,
    });

    expect(result).toBe(true);
    expect(repo.savedCard).toBe(card);
    expect(card.boxLevel).toBe(2);
  });

  it('marks card as wrongly answered and saves it when isValid is false', async () => {
    const createdAt = new Date('2025-01-01T00:00:00.000Z');
    const nextReviewAt = new Date('2025-01-02T00:00:00.000Z');

    const card = Card.restore({
      id: 'card-1',
      ownerId: 'owner-1',
      question: 'Q',
      answer: 'A',
      tag: 'tag',
      boxLevel: 3 as BoxLevel,
      createdAt,
      updatedAt: createdAt,
      lastAnsweredAt: createdAt,
      nextReviewAt,
      archivedAt: undefined,
    });

    const repo = new FakeCardRepository();
    repo.cardToReturn = card;

    const useCase = new AnswerCard(repo);

    const result = await useCase.execute({
      cardId: 'card-1',
      isValid: false,
    });

    expect(result).toBe(true);
    expect(repo.savedCard).toBe(card);
    expect(card.boxLevel).toBe(1);
  });
});
