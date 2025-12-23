import { describe, it, expect } from 'vitest';
import { Card, CardProps } from '@/domain/card/Card';
import { BoxLevel } from '@/domain/card/BoxLevel';

describe('Card domain', () => {
  it('creates a new card with trimmed fields and default values', () => {
    const now = new Date('2025-01-01T00:00:00.000Z');

    const card = Card.createNew(
      {
        id: 'card-1',
        ownerId: 'user-1',
        question: '  Question ?  ',
        answer: '  Answer  ',
        tag: '  Tag  ',
      },
      now,
    );

    expect(card.id).toBe('card-1');
    expect(card.ownerId).toBe('user-1');
    expect(card.question).toBe('Question ?');
    expect(card.answer).toBe('Answer');
    expect(card.tag).toBe('Tag');
    expect(card.boxLevel).toBe(1);
    expect(card.createdAt).toEqual(now);
    expect(card.updatedAt).toEqual(now);
    expect(card.lastAnsweredAt).toBeUndefined();
    const diffMs = card.nextReviewAt.getTime() - now.getTime();
    expect(diffMs).toBe(1 * 24 * 60 * 60 * 1000);
    expect(card.isArchived).toBe(false);
  });

  it('throws when creating a card with empty question or answer', () => {
    const now = new Date('2025-01-01T00:00:00.000Z');

    expect(() =>
      Card.createNew(
        {
          id: 'card-1',
          ownerId: 'user-1',
          question: '   ',
          answer: 'Answer',
        },
        now,
      ),
    ).toThrow('question is required');

    expect(() =>
      Card.createNew(
        {
          id: 'card-1',
          ownerId: 'user-1',
          question: 'Question',
          answer: '   ',
        },
        now,
      ),
    ).toThrow('answer is required');
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
      tag: 'Tag',
      boxLevel: 7 as BoxLevel,
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
      tag: 'Tag',
      boxLevel: 3 as BoxLevel,
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

  it('knows if it is due at a given date', () => {
    const createdAt = new Date('2025-01-01T00:00:00.000Z');
    const nextReview = new Date('2025-01-05T00:00:00.000Z');

    const props: CardProps = {
      id: 'card-1',
      ownerId: 'user-1',
      question: 'Q',
      answer: 'A',
      tag: 'Tag',
      boxLevel: 2 as BoxLevel,
      createdAt,
      updatedAt: createdAt,
      lastAnsweredAt: createdAt,
      nextReviewAt: nextReview,
      archivedAt: undefined,
    };

    const card = Card.restore(props);

    expect(card.isDueAt(new Date('2025-01-04T23:59:59.000Z'))).toBe(false);
    expect(card.isDueAt(new Date('2025-01-05T00:00:00.000Z'))).toBe(true);
    expect(card.isDueAt(new Date('2025-01-06T00:00:00.000Z'))).toBe(true);
  });

  it('updateContent changes question, answer and tag', () => {
    const createdAt = new Date('2025-01-01T00:00:00.000Z');
    const updateDate = new Date('2025-01-02T00:00:00.000Z');

    const card = Card.createNew(
      {
        id: 'card-1',
        ownerId: 'user-1',
        question: 'Q',
        answer: 'A',
        tag: 'Tag',
      },
      createdAt,
    );

    card.updateContent('  New Q  ', '  New A  ', '  NewTag  ', updateDate);

    expect(card.question).toBe('New Q');
    expect(card.answer).toBe('New A');
    expect(card.tag).toBe('NewTag');
    expect(card.updatedAt).toEqual(updateDate);
  });

  it('does not change an archived card when answering', () => {
    const createdAt = new Date('2025-01-01T00:00:00.000Z');
    const archivedAt = new Date('2025-01-10T00:00:00.000Z');
    const later = new Date('2025-01-20T00:00:00.000Z');

    const props: CardProps = {
      id: 'card-1',
      ownerId: 'user-1',
      question: 'Q',
      answer: 'A',
      tag: 'Tag',
      boxLevel: 7 as BoxLevel,
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
