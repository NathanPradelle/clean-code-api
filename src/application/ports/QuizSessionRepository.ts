import { QuizSession } from '@/domain/quiz/QuizSession';

export interface QuizSessionRepository {
  findByOwnerIdAndDate(ownerId: string, date: string): Promise<QuizSession | null>;
  save(session: QuizSession): Promise<void>;
}