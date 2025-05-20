export interface GeneratedHabit {
  name: string;
  category: string;
  icon: string;
  isRelapsable: boolean;
  order: number;
  timeBlock: string;
  minutes: number;
  criteria: string;
}

export interface GeneratedHabitsResponse {
  habits: GeneratedHabit[];
  explanation: string;
}
