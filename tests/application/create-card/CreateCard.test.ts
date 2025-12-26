import { describe, it, expect } from 'vitest';
import { InMemoryCardRepository } from '@/infrastructure/persistence/in-memory/InMemoryCardRepository';
import { CreateCard } from '@/application/use-cases/create-card/CreateCard';

describe('CreateCard use case', () => {
  it('creates a card in category 1 with default owner and trims fields', async () => {
    const repo = new InMemoryCardRepository();
    const useCase = new CreateCard(repo);

    const result = await useCase.execute({
      question: '  Question ?  ',
      answer: '  Answer  ',
      tag: '  Tag  ',
    });

    expect(result.id).toBeTypeOf('string');
    expect(result.question).toBe('Question ?');
    expect(result.answer).toBe('Answer');
    expect(result.tag).toBe('Tag');
    expect(result.boxLevel).toBe(1);
    expect(result.ownerId).toBe('default-owner');

    const card = await repo.findById(result.id);
    expect(card).not.toBeNull();
    expect(card?.question).toBe('Question ?');
    expect(card?.answer).toBe('Answer');
    expect(card?.tag).toBe('Tag');
    expect(card?.boxLevel).toBe(1);
  });
});
