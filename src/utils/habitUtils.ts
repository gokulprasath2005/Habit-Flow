import type { Habit, HabitRecord, HabitStats } from '../types/habit';
import { formatDateString, getPastNDays, getTodayDateString, parseDateString } from './dateUtils';

export const calculateStreak = (
  habitId: string,
  records: HabitRecord[]
): { currentStreak: number; bestStreak: number } => {
  const habitRecords = records
    .filter((r) => r.habitId === habitId && r.completed)
    .map((r) => r.date)
    .sort();

  if (habitRecords.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  const recordSet = new Set(habitRecords);
  const todayStr = getTodayDateString();
  const todayDate = parseDateString(todayStr);

  // 1. Calculate Current Streak
  let currentStreak = 0;
  let checkDate = new Date(todayDate);

  const isCompletedToday = recordSet.has(formatDateString(checkDate));
  
  if (!isCompletedToday) {
    // Check if completed yesterday
    checkDate.setDate(checkDate.getDate() - 1);
    const isCompletedYesterday = recordSet.has(formatDateString(checkDate));
    if (!isCompletedYesterday) {
      currentStreak = 0;
    } else {
      // Streak active up to yesterday
      while (recordSet.has(formatDateString(checkDate))) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }
  } else {
    // Completed today
    while (recordSet.has(formatDateString(checkDate))) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  // 2. Calculate Best Streak (longest consecutive run)
  let bestStreak = 0;
  let tempStreak = 0;
  
  // Create sorted dates array from earliest date in records to today
  if (habitRecords.length > 0) {
    const minDate = parseDateString(habitRecords[0]);
    const curr = new Date(minDate);
    const maxDate = new Date(todayDate);

    while (curr <= maxDate) {
      const dateStr = formatDateString(curr);
      if (recordSet.has(dateStr)) {
        tempStreak++;
        if (tempStreak > bestStreak) {
          bestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
      curr.setDate(curr.getDate() + 1);
    }
  }

  return { currentStreak, bestStreak };
};

export const calculateHabitCompletionRate = (
  habitId: string,
  records: HabitRecord[],
  days: number = 30
): number => {
  const pastDays = getPastNDays(days);
  const habitRecords = records.filter(
    (r) => r.habitId === habitId && pastDays.includes(r.date)
  );

  if (pastDays.length === 0) return 0;
  const completedCount = habitRecords.filter((r) => r.completed).length;
  return Math.round((completedCount / days) * 100);
};

export const getSingleHabitStats = (
  habit: Habit,
  records: HabitRecord[]
): HabitStats => {
  const { currentStreak, bestStreak } = calculateStreak(habit.id, records);
  
  const totalCompletions = records.filter(
    (r) => r.habitId === habit.id && r.completed
  ).length;

  const completionRate = calculateHabitCompletionRate(habit.id, records, 30);

  // Past 7 days history
  const past7Days = getPastNDays(7);
  const weeklyHistory = past7Days.map((dateStr) => {
    const rec = records.find((r) => r.habitId === habit.id && r.date === dateStr);
    return rec ? rec.completed : false;
  });

  return {
    currentStreak,
    bestStreak,
    totalCompletions,
    completionRate,
    weeklyHistory,
  };
};

export const getDailyCompletionPercentage = (
  dateStr: string,
  habits: Habit[],
  records: HabitRecord[]
): { completed: number; total: number; percentage: number } => {
  if (habits.length === 0) return { completed: 0, total: 0, percentage: 0 };

  const dayDate = parseDateString(dateStr);
  const dayOfWeek = dayDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

  // Filter habits active on this day based on frequency
  const activeHabits = habits.filter((h) => {
    if (h.startDate && h.startDate > dateStr) return false;
    if (h.frequency === 'daily') return true;
    if (h.frequency === 'weekdays') return isWeekday;
    if (h.frequency === 'custom' && h.customDays) {
      return h.customDays.includes(dayOfWeek);
    }
    return true;
  });

  if (activeHabits.length === 0) return { completed: 0, total: 0, percentage: 0 };

  const activeIds = new Set(activeHabits.map((h) => h.id));
  const completedCount = records.filter(
    (r) => r.date === dateStr && activeIds.has(r.habitId) && r.completed
  ).length;

  const percentage = Math.round((completedCount / activeHabits.length) * 100);

  return {
    completed: completedCount,
    total: activeHabits.length,
    percentage,
  };
};

export const getWeeklyChartData = (
  habits: Habit[],
  records: HabitRecord[]
): { day: string; date: string; completed: number; total: number; percentage: number }[] => {
  const past7Days = getPastNDays(7);

  return past7Days.map((dateStr) => {
    const dateObj = parseDateString(dateStr);
    const dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const stats = getDailyCompletionPercentage(dateStr, habits, records);

    return {
      day: dayLabel,
      date: dateStr,
      completed: stats.completed,
      total: stats.total,
      percentage: stats.percentage,
    };
  });
};

export const getMonthlyTrendData = (
  habits: Habit[],
  records: HabitRecord[]
): { date: string; label: string; percentage: number }[] => {
  const past30Days = getPastNDays(30);

  return past30Days.map((dateStr) => {
    const dateObj = parseDateString(dateStr);
    const label = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
    const stats = getDailyCompletionPercentage(dateStr, habits, records);

    return {
      date: dateStr,
      label,
      percentage: stats.percentage,
    };
  });
};
