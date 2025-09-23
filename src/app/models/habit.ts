export interface Progress {
  date: Date;
  done: boolean;
  note: string;
}

export interface Habit {
  _id?: string;
  user: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'custom';
  daysOfWeek?: number[];
  reminderTime?: string;
  color?: string;
  icon?: string;
  startDate?: Date;
  endDate?: Date;
  archived?: boolean;
  progress?: Progress[];
  createdAt?: string;
  updatedAt?: string;
}
