import { SetDailyQuizReminderCommand } from './SetDailyQuizReminderCommand';

import { NotificationPreferenceRepository } from '@/application/ports/NotificationPreferenceRepository';
import { NotificationScheduler } from '@/application/ports/NotificationScheduler';
import { NotificationPreference } from '@/domain/quiz/NotificationPreference';

export class SetDailyQuizReminder {
  constructor(
    private readonly preferenceRepo: NotificationPreferenceRepository,
    private readonly scheduler: NotificationScheduler,
  ) {}

  async execute(command: SetDailyQuizReminderCommand): Promise<void> {
    const preference = NotificationPreference.create({
      ownerId: command.ownerId,
      timeOfDay: command.timeOfDay,
      timezone: command.timezone,
    });

    await this.preferenceRepo.save(preference);

    await this.scheduler.scheduleDailyReminder({
      ownerId: preference.ownerId,
      timeOfDay: preference.timeOfDay,
      timezone: preference.timezone,
    });
  }
}
