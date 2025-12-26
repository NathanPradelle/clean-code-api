export class Tag {
  private constructor(private readonly value: string) {}

  static create(raw: string): Tag {
    const trimmed = raw.trim();

    if (!trimmed) {
      throw new Error('Tag cannot be empty');
    }

    if (trimmed.length > 50) {
      throw new Error('Tag cannot be longer than 50 characters');
    }

    return new Tag(trimmed);
  }

  toString(): string {
    return this.value;
  }
}
