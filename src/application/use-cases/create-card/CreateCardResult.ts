import { BoxLevel } from '@/domain/card/BoxLevel';

export interface CreateCardResult {
  id: string;
  question: string;
  answer: string;
  tag?: string;
  boxLevel: BoxLevel;
  ownerId: string;
}
