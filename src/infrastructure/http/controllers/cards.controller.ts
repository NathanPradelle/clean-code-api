import { Request, Response } from 'express';

import { AnswerCard } from '@/application/use-cases/answer-card/AnswerCard';
import { CreateCard } from '@/application/use-cases/create-card/CreateCard';
import { GetDueCards } from '@/application/use-cases/get-due-cards/GetDueCards';
import { ListOwnerCards } from '@/application/use-cases/list-owner-cards/ListOwnerCards';
import { Card } from '@/domain/card/Card';
import { toApiCard } from '@/infrastructure/http/mappers/card.mapper';

const DEFAULT_OWNER_ID = 'default-owner';

export const createCardsController =
  (createCard: CreateCard) => async (req: Request, res: Response) => {
    const { question, answer, tag } = req.body ?? {};

    if (typeof question !== 'string' || typeof answer !== 'string') {
      res.status(400).json({ message: 'question and answer are required' });
      return;
    }

    if (tag !== undefined && typeof tag !== 'string') {
      res.status(400).json({ message: 'tag must be a string if provided' });
      return;
    }

    const result = await createCard.execute({
      question,
      answer,
      tag,
    });

    const card = Card.restore({
      id: result.id,
      ownerId: result.ownerId,
      question: result.question,
      answer: result.answer,
      tag: result.tag,
      boxLevel: result.boxLevel,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastAnsweredAt: undefined,
      nextReviewAt: new Date(),
      archivedAt: undefined,
    });

    const apiCard = toApiCard(card);

    res.status(201).json(apiCard);
  };

export const getCardsController =
  (listOwnerCards: ListOwnerCards) => async (req: Request, res: Response) => {
    const rawTags = req.query.tags;
    let tags: string[] | undefined;

    if (typeof rawTags === 'string') {
      tags = rawTags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
    } else if (Array.isArray(rawTags)) {
      tags = rawTags
        .flatMap((value) => (typeof value === 'string' ? value.split(',') : []))
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
    }

    const result = await listOwnerCards.execute({
      ownerId: DEFAULT_OWNER_ID,
    });

    const cards = result.cards
      .filter((c) => {
        if (!tags || tags.length === 0) {
          return true;
        }
        if (!c.tag) {
          return false;
        }
        return tags.includes(c.tag);
      })
      .map((cardProps) =>
        toApiCard(
          Card.restore({
            id: cardProps.id,
            ownerId: cardProps.ownerId,
            question: cardProps.question,
            answer: cardProps.answer,
            tag: cardProps.tag,
            boxLevel: cardProps.boxLevel,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastAnsweredAt: undefined,
            nextReviewAt: new Date(),
            archivedAt: undefined,
          }),
        ),
      );

    res.status(200).json(cards);
  };

export const getQuizzCardsController =
  (getDueCards: GetDueCards) => async (req: Request, res: Response) => {
    const { date } = req.query;

    let at: Date;

    if (typeof date === 'string' && date.trim().length > 0) {
      const parsed = new Date(date);

      if (Number.isNaN(parsed.getTime())) {
        res.status(400).json({ message: 'date must be a valid ISO date (yyyy-mm-dd)' });
        return;
      }

      at = parsed;
    } else if (date === undefined) {
      at = new Date();
    } else {
      res.status(400).json({ message: 'date must be a string if provided' });
      return;
    }

    const result = await getDueCards.execute({
      ownerId: DEFAULT_OWNER_ID,
      at,
    });

    const cards = result.cards.map((cardProps) =>
      toApiCard(
        Card.restore({
          id: cardProps.id,
          ownerId: cardProps.ownerId,
          question: cardProps.question,
          answer: cardProps.answer,
          tag: undefined,
          boxLevel: cardProps.boxLevel,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastAnsweredAt: undefined,
          nextReviewAt: cardProps.nextReviewAt,
          archivedAt: cardProps.isArchived ? new Date() : undefined,
        }),
      ),
    );

    res.status(200).json(cards);
  };

export const answerCardController =
  (answerCard: AnswerCard) => async (req: Request, res: Response) => {
    const { cardId } = req.params;
    const { isValid } = req.body ?? {};

    if (!cardId) {
      res.status(400).json({ message: 'cardId is required' });
      return;
    }

    if (typeof isValid !== 'boolean') {
      res.status(400).json({ message: 'isValid must be a boolean' });
      return;
    }

    const ok = await answerCard.execute({
      cardId,
      isValid,
    });

    if (!ok) {
      res.status(404).json({ message: 'Card not found' });
      return;
    }

    res.status(204).send();
  };
