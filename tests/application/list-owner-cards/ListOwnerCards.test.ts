import { describe, it, expect } from 'vitest';
import { InMemoryCardRepository } from '@/infrastructure/persistence/in-memory/InMemoryCardRepository';
import { Card } from '@/domain/card/Card';
import { ListOwnerCards } from '@/application/use-cases/list-owner-cards/ListOwnerCards';

describe('ListOwnerCards use case', () => {
  it('returns only cards for the given owner', async () => {
    const repo = new InMemoryCardRepository();
    const useCase = new ListOwnerCards(repo);

    const cardOwner1 = Card.createNew({
      id: 'card-1',
      ownerId: 'owner-1',
      question: 'Q1',
      answer: 'A1',
      tag: 'Tag1',
    });

    const cardOwner2 = Card.createNew({
      id: 'card-2',
      ownerId: 'owner-2',
      question: 'Q2',
      answer: 'A2',
      tag: 'Tag2',
    });

    await repo.save(cardOwner1);
    await repo.save(cardOwner2);

    const result = await useCase.execute({ ownerId: 'owner-1' });

    expect(result.cards).toHaveLength(1);

    const card = result.cards[0]!;

    expect(card.id).toBe('card-1');
    expect(card.ownerId).toBe('owner-1');
    expect(card.question).toBe('Q1');
    expect(card.answer).toBe('A1');
    expect(card.tag).toBe('Tag1');
  });
});
