import { GetDueCardsCommand } from './GetDueCardsCommand';
import { GetDueCardsResult } from './GetDueCardsResult';

import { CardRepository } from '@/application/ports/CardRepository';

export class GetDueCards {
  constructor(private readonly cardRepo: CardRepository) {}

  async execute(command: GetDueCardsCommand): Promise<GetDueCardsResult> {
    const cards = await this.cardRepo.findDueByOwnerId(
      command.ownerId,
      command.at,
    );

    return {
      cards: cards.map((card) => {
        const props = card.toPrimitives();
        return {
          id: props.id,
          ownerId: props.ownerId,
          question: props.question,
          answer: props.answer,
          boxLevel: props.boxLevel,
          nextReviewAt: props.nextReviewAt,
          isArchived: !!props.archivedAt,
        };
      }),
    };
  }
}
