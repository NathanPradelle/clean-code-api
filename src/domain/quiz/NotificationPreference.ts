export interface NotificationPreferenceProps {
  ownerId: string;
  timeOfDay: string;
  timezone?: string;
}

export class NotificationPreference {
  private constructor(private readonly props: NotificationPreferenceProps) {}

  static create(props: NotificationPreferenceProps): NotificationPreference {
    const { timeOfDay } = props;

    if (!/^\d{2}:\d{2}$/.test(timeOfDay)) {
      throw new Error('timeOfDay must be in HH:MM format');
    }

    const [hourStr, minuteStr] = timeOfDay.split(':');
    const hour = Number(hourStr);
    const minute = Number(minuteStr);

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      throw new Error('timeOfDay must represent a valid time');
    }

    return new NotificationPreference({ ...props });
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get timeOfDay(): string {
    return this.props.timeOfDay;
  }

  get timezone(): string | undefined {
    return this.props.timezone;
  }

  toPrimitives(): NotificationPreferenceProps {
    return { ...this.props };
  }
}
