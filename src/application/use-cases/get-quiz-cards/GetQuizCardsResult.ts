import { GetDueCardsResult } from '@/application/use-cases/get-due-cards/GetDueCardsResult';

export interface GetQuizCardsResult extends GetDueCardsResult {
  alreadyCompleted: boolean;
}
