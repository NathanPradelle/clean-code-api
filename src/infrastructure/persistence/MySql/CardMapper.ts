import { Category, CardRow, CardWithTagRow } from './mysql-types';

import { BoxLevel } from '@/domain/card/BoxLevel';
import { Card } from '@/domain/card/Card';


/**
 * Mapper pour convertir entre le domain (Card) et la base de données (card)
 *
 * IMPORTANT : BoxLevel utilise des NOMBRES (1, 2, 3, ...)
 *             Category utilise des STRINGS ('FIRST', 'SECOND', 'THIRD', ...)
 */
export class CardMapper {
  /**
   * Convertit un BoxLevel (1-7 nombre) en Category (FIRST-SEVENTH string)
   */
  static boxLevelToCategory(boxLevel: BoxLevel): Category {
    const mapping: Record<BoxLevel, Category> = {
      1: 'FIRST',
      2: 'SECOND',
      3: 'THIRD',
      4: 'FOURTH',
      5: 'FIFTH',
      6: 'SIXTH',
      7: 'SEVENTH',
    };

    const category = mapping[boxLevel];

    if (!category) {
      console.error(`❌ BoxLevel invalide: ${boxLevel}`);
      throw new Error(`BoxLevel invalide: ${boxLevel}. Valeurs acceptées: 1-7`);
    }

    console.log(`✅ Mapping BoxLevel: ${boxLevel} → Category: ${category}`);
    return category;
  }

  /**
   * Convertit une Category (FIRST-SEVENTH string) en BoxLevel (1-7 nombre)
   */
  static categoryToBoxLevel(category: Category): BoxLevel {
    const mapping: Record<Category, BoxLevel> = {
      'FIRST': 1,
      'SECOND': 2,
      'THIRD': 3,
      'FOURTH': 4,
      'FIFTH': 5,
      'SIXTH': 6,
      'SEVENTH': 7,
      'DONE': 7,
    };

    const boxLevel = mapping[category];

    if (!boxLevel) {
      console.error(`❌ Category invalide: ${category}`);
      throw new Error(`Category invalide: ${category}`);
    }

    return boxLevel;
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

    const category = this.boxLevelToCategory(primitives.boxLevel);

    return {
      id: primitives.id,
      user_id: primitives.ownerId,
      question: primitives.question,
      answer: primitives.answer,
      category: category,
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