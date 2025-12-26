import { QuizSessionRepository } from '@/application/ports/QuizSessionRepository';
import { QuizSession } from '@/domain/quiz/QuizSession';

export class InMemoryQuizSessionRepository implements QuizSessionRepository {
  private sessionsByKey = new Map<string, QuizSession>();

  private makeKey(ownerId: string, date: string): string {
    return `${ownerId}:${date}`;
  }

  async findByOwnerIdAndDate(ownerId: string, date: string): Promise<QuizSession | null> {
    const key = this.makeKey(ownerId, date);
    return this.sessionsByKey.get(key) ?? null;
  }

  async save(session: QuizSession): Promise<void> {
    const key = this.makeKey(session.ownerId, session.date);
    this.sessionsByKey.set(key, session);
  }
}
