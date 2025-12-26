import { NotificationPreference } from '@/domain/quiz/NotificationPreference';

export interface NotificationPreferenceRepository {
  findByOwnerId(ownerId: string): Promise<NotificationPreference | null>;
  save(preference: NotificationPreference): Promise<void>;
}