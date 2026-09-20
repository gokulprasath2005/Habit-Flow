import React from 'react';
import { useHabits } from '../../context/HabitContext';
import { getDailyCompletionPercentage, getSingleHabitStats, calculateHabitCompletionRate } from '../../utils/habitUtils';
import { StatsCard } from '../common/StatsCard';
import { CheckCircle2, Flame, Trophy, TrendingUp } from 'lucide-react';

export const ProgressOverview: React.FC = () => {
  const { habits, records, selectedDate } = useHabits();

  const dailyStats = getDailyCompletionPercentage(selectedDate, habits, records);

  // Highest streaks across active habits
  let maxCurrentStreak = 0;
  let maxBestStreak = 0;

  habits.forEach((h) => {
    const s = getSingleHabitStats(h, records);
    if (s.currentStreak > maxCurrentStreak) maxCurrentStreak = s.currentStreak;
    if (s.bestStreak > maxBestStreak) maxBestStreak = s.bestStreak;
  });

  // Average weekly completion rate across past 7 days
  const overallCompletionRate = habits.length === 0 ? 0 : Math.round(
    habits.reduce((acc, h) => acc + calculateHabitCompletionRate(h.id, records, 7), 0) / habits.length
  );

  return (
    <div className="space-y-6">
      {/* Today's Progress Card Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-xl relative overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-36 -top-12 w-48 h-48 rounded-full bg-purple-500/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">
              Today's Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
              {dailyStats.percentage === 100
                ? 'All Habits Completed! 🎉'
                : dailyStats.percentage >= 50
                ? 'Great progress today! 💪'
                : 'Ready to build your streaks? ✨'}
            </h2>
            <p className="text-sm text-indigo-100 mt-1 max-w-md">
              You have completed <strong className="font-bold text-white">{dailyStats.completed}</strong> out of{' '}
              <strong className="font-bold text-white">{dailyStats.total}</strong> active habits for this date.
            </p>
          </div>

          {/* Large Ring / Bar Completion Metric */}
          <div className="flex items-center gap-4 bg-white/10 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-white/20"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-white transition-all duration-700 ease-out"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 26}
                  strokeDashoffset={
                    2 * Math.PI * 26 * (1 - dailyStats.percentage / 100)
                  }
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-sm font-extrabold text-white">
                {dailyStats.percentage}%
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-indigo-200 uppercase block">
                Completion Rate
              </span>
              <span className="text-lg font-bold text-white">
                {dailyStats.completed} / {dailyStats.total} Done
              </span>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-white/20 h-2.5 rounded-full mt-6 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${dailyStats.percentage}%` }}
          />
        </div>
      </div>

      {/* Grid of Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today Completed"
          value={`${dailyStats.completed} / ${dailyStats.total}`}
          subtitle={`${dailyStats.percentage}% achieved`}
          icon={CheckCircle2}
          iconColor="text-emerald-500 bg-emerald-50 dark:bg-emerald-950/70"
        />
        <StatsCard
          title="Current Streak"
          value={`${maxCurrentStreak} Days`}
          subtitle="Top active streak"
          icon={Flame}
          iconColor="text-amber-500 bg-amber-50 dark:bg-amber-950/70"
        />
        <StatsCard
          title="Best Streak"
          value={`${maxBestStreak} Days`}
          subtitle="All-time personal record"
          icon={Trophy}
          iconColor="text-purple-500 bg-purple-50 dark:bg-purple-950/70"
        />
        <StatsCard
          title="Weekly Completion"
          value={`${overallCompletionRate}%`}
          subtitle="Past 7-day average"
          icon={TrendingUp}
          iconColor="text-sky-500 bg-sky-50 dark:bg-sky-950/70"
        />
      </div>
    </div>
  );
};
