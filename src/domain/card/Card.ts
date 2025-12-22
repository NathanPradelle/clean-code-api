import { BoxLevel } from './BoxLevel';

export type CardId = string;

export interface CardProps {
  id: CardId;
  ownerId: string;

  question: string;
  answer: string;

  boxLevel: BoxLevel;
  createdAt: Date;
  updatedAt: Date;
}

export class Card {
  private props: CardProps;

  private constructor(props: CardProps) {
    this.props = props;
  }

  static createNew(params: {
    id: CardId;
    ownerId: string;
    question: string;
    answer: string;
  }): Card {
    const now = new Date();

    if (!params.question.trim()) throw new Error('Question is required');
    if (!params.answer.trim()) throw new Error('Answer is required');

    return new Card({
      id: params.id,
      ownerId: params.ownerId,
      question: params.question.trim(),
      answer: params.answer.trim(),
      boxLevel: 1,
      createdAt: now,
      updatedAt: now,
    });
  }

  toPrimitives(): CardProps {
    return { ...this.props };
  }
}
