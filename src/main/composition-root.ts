import { AnswerCard } from '@/application/use-cases/answer-card/AnswerCard';
import { CreateCard } from '@/application/use-cases/create-card/CreateCard';
import { DeleteCard } from '@/application/use-cases/delete-card/DeleteCard';
import { GetDueCards } from '@/application/use-cases/get-due-cards/GetDueCards';
import { GetQuizCards } from '@/application/use-cases/get-quiz-cards/GetQuizCards';
import { ListOwnerCards } from '@/application/use-cases/list-owner-cards/ListOwnerCards';
import { SetDailyQuizReminder } from '@/application/use-cases/set-daily-quiz-reminder/SetDailyQuizReminder';
import { UpdateCard } from '@/application/use-cases/update-card/UpdateCard';
import { ConsoleNotificationScheduler } from '@/infrastructure/persistence/in-memory/ConsoleNotificationScheduler';
import { InMemoryNotificationPreferenceRepository } from '@/infrastructure/persistence/in-memory/InMemoryNotificationPreferenceRepository';
import { MySQLCardRepository } from '@/infrastructure/persistence/MySql/MySQLCardRepository';
import { MySQLQuizSessionRepository } from '@/infrastructure/persistence/MySql/MySQLQuizSessionRepository';


export const createDeps = () => {
  // ============================================
  // REPOSITORIES - MYSQL (VRAIES DONNÉES)
  // ============================================
  const cardRepository = new MySQLCardRepository();
  const quizSessionRepository = new MySQLQuizSessionRepository();

  // ============================================
  // REPOSITORIES - IN-MEMORY (NOTIFICATIONS)
  // ============================================
  // Les notifications restent en mémoire pour l'instant
  const notificationPreferenceRepository = new InMemoryNotificationPreferenceRepository();
  const notificationScheduler = new ConsoleNotificationScheduler();

  // ============================================
  // USE CASES (inchangés, juste les dépendances changent)
  // ============================================

  // Cards
  const createCard = new CreateCard(cardRepository);
  const listOwnerCards = new ListOwnerCards(cardRepository);
  const updateCard = new UpdateCard(cardRepository);
  const deleteCard = new DeleteCard(cardRepository);
  const answerCard = new AnswerCard(cardRepository);

  const getDueCards = new GetDueCards(cardRepository);
  const getQuizCards = new GetQuizCards(getDueCards, quizSessionRepository);

  const setDailyQuizReminder = new SetDailyQuizReminder(
    notificationPreferenceRepository,
    notificationScheduler,
  );

  // ============================================
  // RETURN - Tous les use cases disponibles
  // ============================================
  return {
    // Cards
    createCard,
    listOwnerCards,
    updateCard,
    deleteCard,
    answerCard,

    getDueCards,
    getQuizCards,

    setDailyQuizReminder,
  };
};