import { RequestHandler } from 'express';

import { CreateCard } from '@/application/use-cases/create-card/CreateCard';

export function createCardsController(createCard: CreateCard): RequestHandler {
  return async (req, res) => {
    const { ownerId, question, answer } = req.body ?? {};

    if (typeof ownerId !== 'string' || typeof question !== 'string' || typeof answer !== 'string') {
      return res
        .status(400)
        .json({ error: 'Invalid body. Expected { ownerId, question, answer }' });
    }

    try {
      const result = await createCard.execute({ ownerId, question, answer });
      return res.status(201).json(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      return res.status(400).json({ error: message });
    }
  };
}
