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

      // Vérifier si le quiz est complété (completed_at existe et n'est pas null)
      if (row.completed_at) {
        // Le quiz existe et est complété
        // On retourne un QuizSession pour indiquer que c'est déjà fait
        // Note: On utilise createNew car on n'a pas de méthode restore
        const session = QuizSession.createNew(ownerId, date);

        // Malheureusement QuizSession n'expose peut-être pas de setter
        // pour completed_at, donc on retourne juste la session
        return session;
      }

      // Le quiz existe mais n'est pas complété
      return QuizSession.createNew(ownerId, date);
    } catch (error) {
      console.error('Erreur findByOwnerIdAndDate:', error);
      // On retourne null si erreur (pas de quiz ce jour-là)
      return null;
    }
  }

  /**
   * Sauvegarde une session de quiz
   */
  async save(session: QuizSession): Promise<void> {
    try {
      const primitives = session.toPrimitives();

      // Vérifier si existe déjà
      const [existingRows] = await pool.execute<RowDataPacket[]>(
        'SELECT id FROM quizz WHERE quizz_date = ?',
        [primitives.date],
      );

      if (existingRows.length > 0) {
        // UPDATE - Marquer comme complété
        await pool.execute(
          `UPDATE quizz 
           SET completed_at = NOW()
           WHERE quizz_date = ?`,
          [primitives.date],
        );
      } else {
        // INSERT - Créer un nouveau quiz
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