export interface SetDailyQuizReminderCommand {
  ownerId: string;
  timeOfDay: string;
  timezone?: string;
}