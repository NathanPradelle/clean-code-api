import { AnswerCardCommand } from './AnswerCardCommand';
import { CardRepository } from '@/application/ports/CardRepository';

export class AnswerCard {
  constructor(private readonly cardRepo: CardRepository) {}

  async execute(command: AnswerCardCommand): Promise<boolean> {
    const card = await this.cardRepo.findById(command.cardId);

    if (!card) {
      return false;
    }

    if (command.isValid) {
      card.answerCorrect();
    } else {
      card.answerWrong();
    }

    await this.cardRepo.save(card);

    return true;
  }
}
