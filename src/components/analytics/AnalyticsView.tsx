import React from 'react';
import { useHabits } from '../../context/HabitContext';
import { StatsCard } from '../common/StatsCard';
import { WeeklyChart } from './WeeklyChart';
import { MonthlyChart } from './MonthlyChart';
import { HabitStatsTable } from './HabitStatsTable';
import { getSingleHabitStats, calculateHabitCompletionRate } from '../../utils/habitUtils';
import { Flame, Trophy, CheckCircle2, TrendingUp, BarChart2 } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

export const AnalyticsView: React.FC = () => {
  const { habits, records, setIsAddModalOpen } = useHabits();

  if (habits.length === 0) {
    return (
      <EmptyState
        icon={BarChart2}
        title="No Analytics Available"
        description="Create habits and record your daily routines to unlock rich performance charts, streak comparisons, and historical trends."
        actionLabel="Create Your First Habit"
        onAction={() => setIsAddModalOpen(true)}
      />
    );
  }

  // Global calculations
  let topCurrentStreak = 0;
  let topBestStreak = 0;
  let totalCompletions = 0;

  habits.forEach((h) => {
    const s = getSingleHabitStats(h, records);
    if (s.currentStreak > topCurrentStreak) topCurrentStreak = s.currentStreak;
    if (s.bestStreak > topBestStreak) topBestStreak = s.bestStreak;
    totalCompletions += s.totalCompletions;
  });

  const avg30DayRate = Math.round(
    habits.reduce((acc, h) => acc + calculateHabitCompletionRate(h.id, records, 30), 0) / habits.length
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Habit Analytics & Insights
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Track consistency rates, longest active streaks, and overall completion trends
            </p>
          </div>
        </div>
      </div>

      {/* Top Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Top Active Streak"
          value={`${topCurrentStreak} Days`}
          subtitle="Highest current streak"
          icon={Flame}
          iconColor="text-amber-500 bg-amber-50 dark:bg-amber-950/70"
        />
        <StatsCard
          title="Longest Best Streak"
          value={`${topBestStreak} Days`}
          subtitle="All-time habit record"
          icon={Trophy}
          iconColor="text-purple-500 bg-purple-50 dark:bg-purple-950/70"
        />
        <StatsCard
          title="Total Habits Done"
          value={totalCompletions}
          subtitle="Lifetime check-ins"
          icon={CheckCircle2}
          iconColor="text-emerald-500 bg-emerald-50 dark:bg-emerald-950/70"
        />
        <StatsCard
          title="30-Day Rate"
          value={`${avg30DayRate}%`}
          subtitle="Average completion rate"
          icon={TrendingUp}
          iconColor="text-sky-500 bg-sky-50 dark:bg-sky-950/70"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyChart habits={habits} records={records} />
        <MonthlyChart habits={habits} records={records} />
      </div>

      {/* Leaderboard Table */}
      <HabitStatsTable habits={habits} records={records} />
    </div>
  );
};
