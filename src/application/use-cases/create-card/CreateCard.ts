import { randomUUID } from 'crypto';

import { CreateCardCommand } from './CreateCardCommand';
import { CreateCardResult } from './CreateCardResult';

import { CardRepository } from '@/application/ports/CardRepository';
import { Card } from '@/domain/card/Card';

export class CreateCard {
  constructor(private readonly cardRepo: CardRepository) {}

  async execute(command: CreateCardCommand): Promise<CreateCardResult> {
    const card = Card.createNew({
      id: randomUUID(),
      ownerId: command.ownerId,
      question: command.question,
      answer: command.answer,
    });

    await this.cardRepo.save(card);

    return { id: card.toPrimitives().id };
  }
}
