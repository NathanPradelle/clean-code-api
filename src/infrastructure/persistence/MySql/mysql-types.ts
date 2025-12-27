
export type Category =
  | 'FIRST'
  | 'SECOND'
  | 'THIRD'
  | 'FOURTH'
  | 'FIFTH'
  | 'SIXTH'
  | 'SEVENTH'
  | 'DONE';

/**
 * Structure de la table `card` (anglais)
 */
export interface CardRow {
  id: string;
  user_id: string;
  quizz_id: string | null;
  question: string;
  answer: string;
  category: Category;
  last_answered_date: Date | null;
}

/**
 * Structure de la table `tag`
 */
export interface TagRow {
  id: string;
  label: string;
}

/**
 * Structure de la table `card_tag`
 */
export interface CardTagRow {
  card_id: string;
  tag_id: string;
}

/**
 * Résultat de requête avec tag
 */
export interface CardWithTagRow extends CardRow {
  tag_label: string | null;
}

/**
 * Structure de la table `quizz`
 */
export interface QuizzRow {
  id: string;
  quizz_date: string;
  started_at: Date;
  completed_at: Date | null;
}