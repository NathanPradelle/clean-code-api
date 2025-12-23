import { CardRepository } from '@/application/ports/CardRepository';
import { ListOwnerCardsCommand } from './ListOwnerCardsCommand';
import { ListOwnerCardsResult } from './ListOwnerCardsResult';

export class ListOwnerCards {
  constructor(private readonly cardRepo: CardRepository) {}

  async execute(command: ListOwnerCardsCommand): Promise<ListOwnerCardsResult> {
    const cards = await this.cardRepo.findByOwnerId(command.ownerId);

    return {
      cards: cards.map((card) => {
        const props = card.toPrimitives();
        return {
          id: props.id,
          ownerId: props.ownerId,
          question: props.question,
          answer: props.answer,
          tag: props.tag,
          boxLevel: props.boxLevel,
        };
      }),
    };
  }
}
