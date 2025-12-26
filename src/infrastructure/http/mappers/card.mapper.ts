import { Card } from '@/domain/card/Card';

export type ApiCategory =
  | 'FIRST'
  | 'SECOND'
  | 'THIRD'
  | 'FOURTH'
  | 'FIFTH'
  | 'SIXTH'
  | 'SEVENTH'
  | 'DONE';

export interface ApiCard {
  id: string;
  question: string;
  answer: string;
  tag?: string;
  category: ApiCategory;
}

const boxLevelToCategory = (card: Card): ApiCategory => {
  if (card.isArchived) {
    return 'DONE';
  }

  switch (card.boxLevel) {
    case 1:
      return 'FIRST';
    case 2:
      return 'SECOND';
    case 3:
      return 'THIRD';
    case 4:
      return 'FOURTH';
    case 5:
      return 'FIFTH';
    case 6:
      return 'SIXTH';
    case 7:
      return 'SEVENTH';
    default:
      return 'FIRST';
  }
};

export const toApiCard = (card: Card): ApiCard => {
  const props = card.toPrimitives();

  return {
    id: props.id,
    question: props.question,
    answer: props.answer,
    tag: props.tag,
    category: boxLevelToCategory(card),
  };
};
