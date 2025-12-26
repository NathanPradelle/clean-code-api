import { AnswerCard } from '@/application/use-cases/answer-card/AnswerCard';
import { CreateCard } from '@/application/use-cases/create-card/CreateCard';
import { GetDueCards } from '@/application/use-cases/get-due-cards/GetDueCards';
import { GetQuizCards } from '@/application/use-cases/get-quiz-cards/GetQuizCards';
import { ListOwnerCards } from '@/application/use-cases/list-owner-cards/ListOwnerCards';
import { SetDailyQuizReminder } from '@/application/use-cases/set-daily-quiz-reminder/SetDailyQuizReminder';
import { ConsoleNotificationScheduler } from '@/infrastructure/persistence/in-memory/ConsoleNotificationScheduler';
import { InMemoryCardRepository } from '@/infrastructure/persistence/in-memory/InMemoryCardRepository';
import { InMemoryNotificationPreferenceRepository } from '@/infrastructure/persistence/in-memory/InMemoryNotificationPreferenceRepository';
import { InMemoryQuizSessionRepository } from '@/infrastructure/persistence/in-memory/InMemoryQuizSessionRepository';

export const createDeps = () => {
  const cardRepository = new InMemoryCardRepository();
  const quizSessionRepository = new InMemoryQuizSessionRepository();
  const notificationPreferenceRepository = new InMemoryNotificationPreferenceRepository();
  const notificationScheduler = new ConsoleNotificationScheduler();

  const createCard = new CreateCard(cardRepository);
  const listOwnerCards = new ListOwnerCards(cardRepository);
  const getDueCards = new GetDueCards(cardRepository);
  const answerCard = new AnswerCard(cardRepository);

  const getQuizCards = new GetQuizCards(getDueCards, quizSessionRepository);
  const setDailyQuizReminder = new SetDailyQuizReminder(
    notificationPreferenceRepository,
    notificationScheduler,
  );

  return {
    createCard,
    listOwnerCards,
    getDueCards,
    answerCard,
    getQuizCards,
    setDailyQuizReminder,
  };
};
