export type QuizSessionId = string;

export interface QuizSessionProps {
  id: QuizSessionId;
  ownerId: string;

  date: string;
  createdAt: Date;
}

export class QuizSession {
  private constructor(private readonly props: QuizSessionProps) {}

  static create(props: QuizSessionProps): QuizSession {
    return new QuizSession(props);
  }

  static createNew(ownerId: string, date: string): QuizSession {
    return new QuizSession({
      id: `${ownerId}-${date}`,
      ownerId,
      date,
      createdAt: new Date(),
    });
  }

  get id(): QuizSessionId {
    return this.props.id;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get date(): string {
    return this.props.date;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toPrimitives(): QuizSessionProps {
    return { ...this.props };
  }
}