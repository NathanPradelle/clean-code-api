import { BoxLevel } from '@/domain/card/BoxLevel';

export interface ListOwnerCardsResult {
  cards: {
    id: string;
    ownerId: string;
    question: string;
    answer: string;
    tag?: string;
    boxLevel: BoxLevel;
  }[];
}
