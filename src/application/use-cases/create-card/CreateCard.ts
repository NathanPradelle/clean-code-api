import { randomUUID } from 'crypto';

import { CreateCardCommand } from './CreateCardCommand';
import { CreateCardResult } from './CreateCardResult';

import { CardRepository } from '@/application/ports/CardRepository';
import { Card } from '@/domain/card/Card';

const DEFAULT_OWNER_ID = 'default-owner';

export class CreateCard {
  constructor(private readonly cardRepo: CardRepository) {}

  async execute(command: CreateCardCommand): Promise<CreateCardResult> {
    const card = Card.createNew({
      id: randomUUID(),
      ownerId: DEFAULT_OWNER_ID,
      question: command.question,
      answer: command.answer,
      tag: command.tag,
    });

    await this.cardRepo.save(card);

    const props = card.toPrimitives();

    return {
      id: props.id,
      question: props.question,
      answer: props.answer,
      tag: props.tag,
      boxLevel: props.boxLevel,
      ownerId: props.ownerId,
    };
  }
}
