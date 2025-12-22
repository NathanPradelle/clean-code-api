import { CreateCard } from '@/application/use-cases/create-card/CreateCard';
import { InMemoryCardRepository } from '@/infrastructure/persistence/in-memory/InMemoryCardRepository';

export function buildDependencies() {
  const cardRepository = new InMemoryCardRepository();

  const createCard = new CreateCard(cardRepository);

  return {
    createCard,
  };
}
