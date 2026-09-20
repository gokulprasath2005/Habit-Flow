import type { Habit, HabitRecord } from '../types/habit';
import { getPastNDays } from './dateUtils';

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    name: 'Drink 2L Water',
    description: 'Stay hydrated throughout the day for optimal energy & health.',
    icon: 'Droplets',
    category: 'Health',
    color: 'sky',
    frequency: 'daily',
    target: 2,
    targetUnit: 'L',
    reminder: '09:00',
    startDate: '2026-08-20',
    createdAt: '2026-08-20T08:00:00.000Z',
  },
  {
    id: 'habit-2',
    name: 'Read 30 Minutes',
    description: 'Read a book, article, or technical documentation daily.',
    icon: 'BookOpen',
    category: 'Learning',
    color: 'indigo',
    frequency: 'daily',
    target: 30,
    targetUnit: 'Mins',
    reminder: '20:30',
    startDate: '2026-08-20',
    createdAt: '2026-08-20T08:00:00.000Z',
  },
  {
    id: 'habit-3',
    name: 'Morning Exercise',
    description: 'Cardio, strength training, or stretching routine.',
    icon: 'Activity',
    category: 'Fitness',
    color: 'emerald',
    frequency: 'weekdays',
    target: 45,
    targetUnit: 'Mins',
    reminder: '07:00',
    startDate: '2026-08-20',
    createdAt: '2026-08-20T08:00:00.000Z',
  },
  {
    id: 'habit-4',
    name: 'Code for 1 Hour',
    description: 'Focus on personal coding projects, learning, or open source.',
    icon: 'Code',
    category: 'Productivity',
    color: 'purple',
    frequency: 'daily',
    target: 60,
    targetUnit: 'Mins',
    reminder: '14:00',
    startDate: '2026-08-20',
    createdAt: '2026-08-20T08:00:00.000Z',
  },
  {
    id: 'habit-5',
    name: 'Daily Meditation',
    description: 'Mindful breathing and relaxation exercise.',
    icon: 'Sparkles',
    category: 'Mindfulness',
    color: 'amber',
    frequency: 'daily',
    target: 15,
    targetUnit: 'Mins',
    reminder: '08:00',
    startDate: '2026-08-20',
    createdAt: '2026-08-20T08:00:00.000Z',
  },
  {
    id: 'habit-6',
    name: 'Sleep Before 11 PM',
    description: 'Consistent sleep schedule for better recovery and focus.',
    icon: 'Moon',
    category: 'Lifestyle',
    color: 'rose',
    frequency: 'daily',
    target: 1,
    targetUnit: 'Time',
    reminder: '22:30',
    startDate: '2026-08-20',
    createdAt: '2026-08-20T08:00:00.000Z',
  },
];

export const generateSampleRecords = (): HabitRecord[] => {
  const past30Days = getPastNDays(30);
  const records: HabitRecord[] = [];

  INITIAL_HABITS.forEach((habit) => {
    past30Days.forEach((dateStr, index) => {
      // Create a deterministic pseudo-random completion pattern with solid streaks
      // Make the last 5 days consistently completed to ensure high current streak
      const dayNum = index + parseInt(habit.id.replace('habit-', ''), 10) * 3;
      const isRecent = index >= 25; // past 5 days completed
      const isRandomCompleted = (dayNum % 5) !== 0 || (dayNum % 7) === 0;
      const completed = isRecent || isRandomCompleted;

      let progress = habit.target;
      if (!completed) {
        progress = Math.floor(habit.target * (0.2 + (dayNum % 4) * 0.15));
      }

      records.push({
        habitId: habit.id,
        date: dateStr,
        completed,
        progress,
      });
    });
  });

  return records;
};
