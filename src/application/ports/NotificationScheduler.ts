export interface NotificationScheduler {
  scheduleDailyReminder(params: {
    ownerId: string;
    timeOfDay: string;
    timezone?: string;
  }): Promise<void>;
}