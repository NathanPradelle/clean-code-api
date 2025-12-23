import { BoxLevel } from '@/domain/card/BoxLevel';

export interface GetDueCardsResult {
  cards: {
    id: string;
    ownerId: string;
    question: string;
    answer: string;
    boxLevel: BoxLevel;
    nextReviewAt: Date;
    isArchived: boolean;
  }[];
}
