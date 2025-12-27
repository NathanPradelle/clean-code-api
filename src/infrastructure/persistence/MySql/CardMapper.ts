import { Category, CardRow, CardWithTagRow } from './mysql-types';

import { BoxLevel } from '@/domain/card/BoxLevel';
import { Card } from '@/domain/card/Card';


/**
 * Mapper pour convertir entre le domain (Card) et la base de données (card)
 * Adapté aux noms de colonnes ANGLAIS
 */
export class CardMapper {
  /**
   * Convertit un BoxLevel (domain) en Category (DB)
   */
  static boxLevelToCategory(boxLevel: BoxLevel): Category {
    return boxLevel as unknown as Category;
  }

  /**
   * Convertit une Category (DB) en BoxLevel (domain)
   */
  static categoryToBoxLevel(category: Category): BoxLevel {
    return category as unknown as BoxLevel;
  }

  /**
   * Convertit une entité Card (domain) en données pour INSERT/UPDATE MySQL
   */
  static toDatabaseInsert(card: Card): {
    id: string;
    user_id: string;
    question: string;
    answer: string;
    category: Category;
    last_answered_date: Date | null;
  } {
    const primitives = card.toPrimitives();

    return {
      id: primitives.id,
      user_id: primitives.ownerId,
      question: primitives.question,
      answer: primitives.answer,
      category: this.boxLevelToCategory(primitives.boxLevel),
      last_answered_date: primitives.lastAnsweredAt || null,
    };
  }

  /**
   * Convertit une ligne MySQL (card) en entité Card (domain)
   */
  static toDomain(row: CardRow, tag?: string): Card {
    return Card.restore({
      id: row.id,
      ownerId: row.user_id,
      question: row.question,
      answer: row.answer,
      tag: tag,
      boxLevel: this.categoryToBoxLevel(row.category),
      lastAnsweredAt: row.last_answered_date || undefined,
      nextReviewAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      archivedAt: undefined,
    });
  }

  /**
   * Convertit une ligne avec tag (JOIN) en entité Card
   */
  static toDomainWithTag(row: CardWithTagRow): Card {
    return this.toDomain(row, row.tag_label || undefined);
  }
}