import { describe, it, expect } from 'vitest';
import { Card, CardProps } from '@/domain/card/Card';

describe('Card', () => {
  it('creates a new card with trimmed fields and initial state', () => {
    const now = new Date('2025-01-01T00:00:00.000Z');

    const card = Card.createNew(
      {
        id: 'card-1',
        ownerId: 'user-1',
        question: '  Question ?  ',
        answer: '  Answer  ',
      },
      now,
    );

    expect(card.id).toBe('card-1');
    expect(card.ownerId).toBe('user-1');
    expect(card.question).toBe('Question ?');
    expect(card.answer).toBe('Answer');
    expect(card.boxLevel).toBe(1);
    expect(card.createdAt).toEqual(now);
    expect(card.updatedAt).toEqual(now);
    expect(card.lastAnsweredAt).toBeUndefined();
    const diffMs = card.nextReviewAt.getTime() - now.getTime();
    expect(diffMs).toBe(1 * 24 * 60 * 60 * 1000);
    expect(card.isArchived).toBe(false);
  });

  it('increments box on correct answer and schedules next review', () => {
    const createdAt = new Date('2025-01-01T00:00:00.000Z');
    const answerDate = new Date('2025-01-02T00:00:00.000Z');

    const card = Card.createNew(
      {
        id: 'card-1',
        ownerId: 'user-1',
        question: 'Q',
        answer: 'A',
      },
      createdAt,
    );

    card.answerCorrect(answerDate);

    expect(card.boxLevel).toBe(2);
    expect(card.lastAnsweredAt).toEqual(answerDate);
    expect(card.updatedAt).toEqual(answerDate);
    const diffMs = card.nextReviewAt.getTime() - answerDate.getTime();
    expect(diffMs).toBe(2 * 24 * 60 * 60 * 1000);
    expect(card.isArchived).toBe(false);
  });

  it('does not go over box 7 and archives card', () => {
    const createdAt = new Date('2025-01-01T00:00:00.000Z');
    const answerDate = new Date('2025-01-10T00:00:00.000Z');

    const props: CardProps = {
      id: 'card-1',
      ownerId: 'user-1',
      question: 'Q',
      answer: 'A',
      boxLevel: 7,
      createdAt,
      updatedAt: createdAt,
      lastAnsweredAt: createdAt,
      nextReviewAt: createdAt,
      archivedAt: undefined,
    };

    const card = Card.restore(props);

    card.answerCorrect(answerDate);

    expect(card.boxLevel).toBe(7);
    expect(card.isArchived).toBe(true);
    expect(card.lastAnsweredAt).toEqual(answerDate);
    expect(card.updatedAt).toEqual(answerDate);
    const diffMs = card.nextReviewAt.getTime() - answerDate.getTime();
    expect(diffMs).toBe(64 * 24 * 60 * 60 * 1000);
  });

  it('resets to box 1 on wrong answer', () => {
    const createdAt = new Date('2025-01-01T00:00:00.000Z');
    const answerDate = new Date('2025-01-05T00:00:00.000Z');

    const props: CardProps = {
      id: 'card-1',
      ownerId: 'user-1',
      question: 'Q',
      answer: 'A',
      boxLevel: 3,
      createdAt,
      updatedAt: createdAt,
      lastAnsweredAt: createdAt,
      nextReviewAt: createdAt,
      archivedAt: undefined,
    };

    const card = Card.restore(props);

    card.answerWrong(answerDate);

    expect(card.boxLevel).toBe(1);
    expect(card.lastAnsweredAt).toEqual(answerDate);
    expect(card.updatedAt).toEqual(answerDate);
    const diffMs = card.nextReviewAt.getTime() - answerDate.getTime();
    expect(diffMs).toBe(1 * 24 * 60 * 60 * 1000);
    expect(card.isArchived).toBe(false);
  });

  it('forceValidate behaves like correct answer', () => {
    const createdAt = new Date('2025-01-01T00:00:00.000Z');
    const answerDate = new Date('2025-01-02T00:00:00.000Z');

    const card = Card.createNew(
      {
        id: 'card-1',
        ownerId: 'user-1',
        question: 'Q',
        answer: 'A',
      },
      createdAt,
    );

    card.forceValidate(answerDate);

    expect(card.boxLevel).toBe(2);
    expect(card.lastAnsweredAt).toEqual(answerDate);
    expect(card.updatedAt).toEqual(answerDate);
    const diffMs = card.nextReviewAt.getTime() - answerDate.getTime();
    expect(diffMs).toBe(2 * 24 * 60 * 60 * 1000);
  });

  it('does not change an archived card', () => {
    const createdAt = new Date('2025-01-01T00:00:00.000Z');
    const archivedAt = new Date('2025-01-10T00:00:00.000Z');
    const later = new Date('2025-01-20T00:00:00.000Z');

    const props: CardProps = {
      id: 'card-1',
      ownerId: 'user-1',
      question: 'Q',
      answer: 'A',
      boxLevel: 7,
      createdAt,
      updatedAt: archivedAt,
      lastAnsweredAt: archivedAt,
      nextReviewAt: archivedAt,
      archivedAt,
    };

    const card = Card.restore(props);

    card.answerCorrect(later);
    card.answerWrong(later);

    expect(card.boxLevel).toBe(7);
    expect(card.isArchived).toBe(true);
    expect(card.lastAnsweredAt).toEqual(archivedAt);
    expect(card.updatedAt).toEqual(archivedAt);
    expect(card.nextReviewAt).toEqual(archivedAt);
  });
});
