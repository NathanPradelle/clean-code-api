import { randomUUID } from 'crypto';
import { RowDataPacket } from 'mysql2';

import { CardMapper } from './CardMapper';
import pool from './db';
import { CardWithTagRow } from './mysql-types';

import { CardRepository } from '@/application/ports/CardRepository';
import { Card } from '@/domain/card/Card';

/**
 * Implémentation MySQL du CardRepository (Adapter)
 * Adapté aux noms de tables ANGLAIS : card, tag, card_tag
 */
export class MySQLCardRepository implements CardRepository {
  /**
   * Sauvegarde une carte (INSERT ou UPDATE)
   */
  async save(card: Card): Promise<void> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const data = CardMapper.toDatabaseInsert(card);
      const primitives = card.toPrimitives();

      const [existingRows] = await connection.execute<RowDataPacket[]>(
        'SELECT id FROM card WHERE id = ?',
        [data.id],
      );

      if (existingRows.length > 0) {
        await connection.execute(
          `UPDATE card 
           SET question = ?, answer = ?, category = ?, last_answered_date = ?
           WHERE id = ?`,
          [data.question, data.answer, data.category, data.last_answered_date, data.id],
        );
      } else {
        await connection.execute(
          `INSERT INTO card (id, user_id, question, answer, category, last_answered_date)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            data.id,
            data.user_id,
            data.question,
            data.answer,
            data.category,
            data.last_answered_date,
          ],
        );
      }

      if (primitives.tag) {
        await this.associateTag(connection, data.id, primitives.tag);
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      console.error('Erreur save carte:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Trouve une carte par ID
   */
  async findById(id: string): Promise<Card | null> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT 
          c.*,
          t.label as tag_label
         FROM card c
         LEFT JOIN card_tag ct ON c.id = ct.card_id
         LEFT JOIN tag t ON ct.tag_id = t.id
         WHERE c.id = ?
         LIMIT 1`,
        [id],
      );

      if (rows.length === 0) {
        return null;
      }

      const row = rows[0] as CardWithTagRow;
      return CardMapper.toDomainWithTag(row);
    } catch (error) {
      console.error('Erreur findById:', error);
      throw error;
    }
  }

  /**
   * Trouve toutes les cartes d'un propriétaire
   */
  async findByOwnerId(ownerId: string): Promise<Card[]> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT 
          c.*,
          t.label as tag_label
         FROM card c
         LEFT JOIN card_tag ct ON c.id = ct.card_id
         LEFT JOIN tag t ON ct.tag_id = t.id
         WHERE c.user_id = ?
         ORDER BY c.id DESC`,
        [ownerId],
      );

      return rows.map((row) => CardMapper.toDomainWithTag(row as CardWithTagRow));
    } catch (error) {
      console.error('Erreur findByOwnerId:', error);
      throw error;
    }
  }

  /**
   * Trouve les cartes dues à réviser (système Leitner)
   * Les cartes dont la category != 'DONE'
   */
  async findDueByOwnerId(ownerId: string, _at: Date): Promise<Card[]> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT 
          c.*,
          t.label as tag_label
         FROM card c
         LEFT JOIN card_tag ct ON c.id = ct.card_id
         LEFT JOIN tag t ON ct.tag_id = t.id
         WHERE c.user_id = ?
           AND c.category != 'DONE'
         ORDER BY c.category, c.id`,
        [ownerId],
      );

      return rows.map((row) => CardMapper.toDomainWithTag(row as CardWithTagRow));
    } catch (error) {
      console.error('Erreur findDueByOwnerId:', error);
      throw error;
    }
  }

  /**
   * Supprime une carte par ID
   */
  async deleteById(id: string): Promise<void> {
    try {
      // CASCADE va automatiquement supprimer les entrées dans card_tag
      await pool.execute('DELETE FROM card WHERE id = ?', [id]);
    } catch (error) {
      console.error('Erreur deleteById:', error);
      throw error;
    }
  }

  /**
   * Méthode privée : associe un tag à une carte
   * Crée le tag s'il n'existe pas
   */
  private async associateTag(connection: any, cardId: string, tagLabel: string): Promise<void> {
    await connection.execute('DELETE FROM card_tag WHERE card_id = ?', [cardId]);

    const [tagRows] = await connection.execute<RowDataPacket[]>(
      'SELECT id FROM tag WHERE label = ?',
      [tagLabel],
    );

    let tagId: string;

    if (tagRows.length > 0) {
      tagId = tagRows[0].id;
    } else {
      tagId = randomUUID();
      await connection.execute('INSERT INTO tag (id, label) VALUES (?, ?)', [tagId, tagLabel]);
    }

    await connection.execute('INSERT INTO card_tag (card_id, tag_id) VALUES (?, ?)', [
      cardId,
      tagId,
    ]);
  }
}