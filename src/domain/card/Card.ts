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
  lastAnsweredAt?: Date;
  nextReviewAt: Date;
  archivedAt?: Date;
}

export interface CreateCardParams {
  id: CardId;
  ownerId: string;
  question: string;
  answer: string;
}

export class Card {
  private constructor(private props: CardProps) {}

  static createNew(params: CreateCardParams, now: Date = new Date()): Card {
    const question = params.question?.trim();
    const answer = params.answer?.trim();

    if (!params.ownerId || typeof params.ownerId !== 'string') {
      throw new Error('ownerId is required');
    }

    if (!question) {
      throw new Error('question is required');
    }

    if (!answer) {
      throw new Error('answer is required');
    }

    return new Card({
      id: params.id,
      ownerId: params.ownerId,
      question,
      answer,
      boxLevel: 1,
      createdAt: now,
      updatedAt: now,
      lastAnsweredAt: undefined,
      nextReviewAt: Card.computeNextReviewAt(1, now),
      archivedAt: undefined,
    });
  }

  static restore(props: CardProps): Card {
    return new Card({ ...props });
  }

  get id(): CardId {
    return this.props.id;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get question(): string {
    return this.props.question;
  }

  get answer(): string {
    return this.props.answer;
  }

  get boxLevel(): BoxLevel {
    return this.props.boxLevel;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get lastAnsweredAt(): Date | undefined {
    return this.props.lastAnsweredAt;
  }

  get nextReviewAt(): Date {
    return this.props.nextReviewAt;
  }

  get isArchived(): boolean {
    return !!this.props.archivedAt;
  }

  answerCorrect(now: Date = new Date()): void {
    if (this.isArchived) {
      return;
    }

    const currentLevel = this.props.boxLevel;
    const nextLevel = Math.min(currentLevel + 1, 7) as BoxLevel;

    this.props.boxLevel = nextLevel;
    this.props.lastAnsweredAt = now;
    this.props.updatedAt = now;
    this.props.nextReviewAt = Card.computeNextReviewAt(nextLevel, now);

    if (nextLevel === 7) {
      this.props.archivedAt = now;
    }
  }

  answerWrong(now: Date = new Date()): void {
    if (this.isArchived) {
      return;
    }

    this.props.boxLevel = 1;
    this.props.lastAnsweredAt = now;
    this.props.updatedAt = now;
    this.props.nextReviewAt = Card.computeNextReviewAt(1, now);
  }

  forceValidate(now: Date = new Date()): void {
    this.answerCorrect(now);
  }

  private static computeNextReviewAt(level: BoxLevel, from: Date): Date {
    const delaysInDays: Record<BoxLevel, number> = {
      1: 1,
      2: 2,
      3: 4,
      4: 8,
      5: 16,
      6: 32,
      7: 64,
    };

    const delay = delaysInDays[level];
    const result = new Date(from.getTime());
    result.setDate(result.getDate() + delay);
    return result;
  }

  toPrimitives(): CardProps {
    return { ...this.props };
  }
}
