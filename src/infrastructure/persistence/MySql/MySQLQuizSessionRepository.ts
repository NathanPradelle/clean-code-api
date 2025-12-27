import { randomUUID } from 'crypto';
import { RowDataPacket } from 'mysql2';

import pool from './db';

import { QuizSessionRepository } from '@/application/ports/QuizSessionRepository';
import { QuizSession } from '@/domain/quiz/QuizSession';

/**
 * Implémentation MySQL de QuizSessionRepository
 * Correspond à la table `quizz` dans leitner_db (anglais)
 */
export class MySQLQuizSessionRepository implements QuizSessionRepository {
  /**
   * Trouve une session de quiz par ownerId et date
   * ATTENTION: Ton schéma n'a PAS de colonne user_id dans quizz !
   * On ne peut donc pas filtrer par utilisateur.
   * Cette implémentation cherche juste par date.
   */
  async findByOwnerIdAndDate(ownerId: string, date: string): Promise<QuizSession | null> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM quizz WHERE quizz_date = ? LIMIT 1',
        [date],
      );

      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];

      if (row.completed_at) {
        const session = QuizSession.createNew(ownerId, date);


        return session;
      }

      return QuizSession.createNew(ownerId, date);
    } catch (error) {
      console.error('Erreur findByOwnerIdAndDate:', error);
      return null;
    }
  }

  /**
   * Sauvegarde une session de quiz
   */
  async save(session: QuizSession): Promise<void> {
    try {
      const primitives = session.toPrimitives();

      const [existingRows] = await pool.execute<RowDataPacket[]>(
        'SELECT id FROM quizz WHERE quizz_date = ?',
        [primitives.date],
      );

      if (existingRows.length > 0) {
        await pool.execute(
          `UPDATE quizz 
           SET completed_at = NOW()
           WHERE quizz_date = ?`,
          [primitives.date],
        );
      } else {
        const id = randomUUID();
        await pool.execute(
          `INSERT INTO quizz (id, quizz_date, started_at)
           VALUES (?, ?, NOW())`,
          [id, primitives.date],
        );
      }
    } catch (error) {
      console.error('Erreur save quiz session:', error);
      throw error;
    }
  }
}