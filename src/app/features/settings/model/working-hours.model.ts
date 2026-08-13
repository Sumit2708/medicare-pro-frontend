export interface WorkingDay {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export interface WorkingHours {
  days: WorkingDay[];
}