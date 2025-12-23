import { AnswerCard } from '@/application/use-cases/answer-card/AnswerCard';
import { CreateCard } from '@/application/use-cases/create-card/CreateCard';
import { GetDueCards } from '@/application/use-cases/get-due-cards/GetDueCards';
import { ListOwnerCards } from '@/application/use-cases/list-owner-cards/ListOwnerCards';
import { InMemoryCardRepository } from '@/infrastructure/persistence/in-memory/InMemoryCardRepository';

export const createDeps = () => {
  const cardRepository = new InMemoryCardRepository();

  const createCard = new CreateCard(cardRepository);
  const listOwnerCards = new ListOwnerCards(cardRepository);
  const getDueCards = new GetDueCards(cardRepository);
  const answerCard = new AnswerCard(cardRepository);

  return {
    createCard,
    listOwnerCards,
    getDueCards,
    answerCard,
  };
};
