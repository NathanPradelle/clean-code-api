import { GetQuizCardsResult } from './GetQuizCardsResult';

import { QuizSessionRepository } from '@/application/ports/QuizSessionRepository';
import { GetDueCards } from '@/application/use-cases/get-due-cards/GetDueCards';
import { GetDueCardsCommand } from '@/application/use-cases/get-due-cards/GetDueCardsCommand';
import { QuizSession } from '@/domain/quiz/QuizSession';

export class GetQuizCards {
  constructor(
    private readonly getDueCards: GetDueCards,
    private readonly quizSessionRepo: QuizSessionRepository,
  ) {}

  async execute(command: GetDueCardsCommand): Promise<GetQuizCardsResult> {
    const dateKey = this.toDateKey(command.at);

    const existing = await this.quizSessionRepo.findByOwnerIdAndDate(command.ownerId, dateKey);

    if (existing) {
      return {
        cards: [],
        alreadyCompleted: true,
      };
    }

    const dueCardsResult = await this.getDueCards.execute(command);

    if (dueCardsResult.cards.length > 0) {
      const session = QuizSession.createNew(command.ownerId, dateKey);
      await this.quizSessionRepo.save(session);
    }

    return {
      ...dueCardsResult,
      alreadyCompleted: false,
    };
  }

  private toDateKey(date: Date): string {
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
