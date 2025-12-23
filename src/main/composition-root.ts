import { CreateCard } from '@/application/use-cases/create-card/CreateCard';
import { ListOwnerCards } from '@/application/use-cases/list-owner-cards/ListOwnerCards';
import { InMemoryCardRepository } from '@/infrastructure/persistence/in-memory/InMemoryCardRepository';

export const createDeps = () => {
  const cardRepository = new InMemoryCardRepository();

  const createCard = new CreateCard(cardRepository);
  const listOwnerCards = new ListOwnerCards(cardRepository);

  return {
    createCard,
    listOwnerCards,
  };
};
