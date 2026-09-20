export type HabitCategory = 'Health' | 'Productivity' | 'Mindfulness' | 'Fitness' | 'Lifestyle' | 'Learning';

export type HabitColor = 'emerald' | 'indigo' | 'amber' | 'rose' | 'sky' | 'purple' | 'violet' | 'orange';

export type HabitFrequencyType = 'daily' | 'weekdays' | 'custom';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string;
  category: HabitCategory;
  color: HabitColor;
  frequency: HabitFrequencyType;
  customDays?: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  target: number;
  targetUnit?: string;
  reminder?: string;
  startDate: string; // YYYY-MM-DD
  createdAt: string;
}

export interface HabitRecord {
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  progress: number;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  weekStartsOn: 'monday' | 'sunday';
}

export type NavigationTab = 'dashboard' | 'habits' | 'calendar' | 'analytics' | 'settings';

export interface HabitStats {
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  completionRate: number; // 0 - 100
  weeklyHistory: boolean[]; // 7 days (Mon-Sun or past 7 days)
}
