import { CardRepository } from '@/application/ports/CardRepository';
import { UpdateCardCommand } from './UpdateCardCommand';
import { UpdateCardResult } from './UpdateCardResult';

export class UpdateCard {
  constructor(private readonly cardRepo: CardRepository) {}

  async execute(command: UpdateCardCommand): Promise<UpdateCardResult> {
    const card = await this.cardRepo.findById(command.id);

    if (!card) {
      throw new Error('Card not found');
    }

    if (card.ownerId !== command.ownerId) {
      throw new Error('Forbidden');
    }

    card.updateContent(command.question, command.answer);
    await this.cardRepo.save(card);

    const props = card.toPrimitives();

    return {
      id: props.id,
      ownerId: props.ownerId,
      question: props.question,
      answer: props.answer,
    };
  }
}
