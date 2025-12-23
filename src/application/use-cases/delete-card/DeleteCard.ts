import { CardRepository } from '@/application/ports/CardRepository';
import { DeleteCardCommand } from './DeleteCardCommand';
import { DeleteCardResult } from './DeleteCardResult';

export class DeleteCard {
  constructor(private readonly cardRepo: CardRepository) {}

  async execute(command: DeleteCardCommand): Promise<DeleteCardResult> {
    const card = await this.cardRepo.findById(command.id);

    if (!card) {
      throw new Error('Card not found');
    }

    if (card.ownerId !== command.ownerId) {
      throw new Error('Forbidden');
    }

    await this.cardRepo.deleteById(card.id);

    return { id: card.id };
  }
}
