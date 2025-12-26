import { NotificationPreferenceRepository } from '@/application/ports/NotificationPreferenceRepository';
import { NotificationPreference } from '@/domain/quiz/NotificationPreference';

export class InMemoryNotificationPreferenceRepository
  implements NotificationPreferenceRepository
{
  private prefsByOwner = new Map<string, NotificationPreference>();

  async findByOwnerId(ownerId: string): Promise<NotificationPreference | null> {
    return this.prefsByOwner.get(ownerId) ?? null;
  }

  async save(preference: NotificationPreference): Promise<void> {
    this.prefsByOwner.set(preference.ownerId, preference);
  }
}
