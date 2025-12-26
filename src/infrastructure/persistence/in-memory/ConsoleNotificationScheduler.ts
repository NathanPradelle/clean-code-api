import { NotificationScheduler } from '@/application/ports/NotificationScheduler';

export class ConsoleNotificationScheduler implements NotificationScheduler {
  async scheduleDailyReminder(params: {
    ownerId: string;
    timeOfDay: string;
    timezone?: string | undefined;
  }): Promise<void> {
    console.log(
      `Scheduling daily quiz reminder for owner=${params.ownerId} at ${params.timeOfDay}` +
        (params.timezone ? ` (${params.timezone})` : ''),
    );
  }
}
