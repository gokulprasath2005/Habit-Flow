import React from 'react';
import type { Habit, HabitRecord } from '../../types/habit';
import { useHabits } from '../../context/HabitContext';
import { COLOR_MAP, HabitIcon } from '../common/HabitIcon';
import { getSingleHabitStats } from '../../utils/habitUtils';
import { Flame, Trophy, CheckCircle2, ChevronRight } from 'lucide-react';

interface HabitStatsTableProps {
  habits: Habit[];
  records: HabitRecord[];
}

export const HabitStatsTable: React.FC<HabitStatsTableProps> = ({ habits, records }) => {
  const { setViewingHabitId } = useHabits();

  if (habits.length === 0) return null;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Habit Performance Leaderboard
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Individual habit completion breakdown, streaks, and all-time records
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              <th className="pb-3 pl-2">Habit</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Current Streak</th>
              <th className="pb-3">Best Streak</th>
              <th className="pb-3">Total Done</th>
              <th className="pb-3">30D Rate</th>
              <th className="pb-3 pr-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium">
            {habits.map((h) => {
              const stats = getSingleHabitStats(h, records);
              const colorStyle = COLOR_MAP[h.color] || COLOR_MAP.indigo;

              return (
                <tr
                  key={h.id}
                  onClick={() => setViewingHabitId(h.id)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 pl-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colorStyle.bg} ${colorStyle.text}`}
                      >
                        <HabitIcon name={h.icon} className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {h.name}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${colorStyle.badgeBg} ${colorStyle.text}`}
                    >
                      {h.category}
                    </span>
                  </td>

                  <td className="py-3.5">
                    <span className="flex items-center gap-1 font-extrabold text-amber-600 dark:text-amber-400">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      {stats.currentStreak}d
                    </span>
                  </td>

                  <td className="py-3.5">
                    <span className="flex items-center gap-1 font-extrabold text-purple-600 dark:text-purple-400">
                      <Trophy className="w-3.5 h-3.5" />
                      {stats.bestStreak}d
                    </span>
                  </td>

                  <td className="py-3.5 font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {stats.totalCompletions}
                    </span>
                  </td>

                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white w-8">
                        {stats.completionRate}%
                      </span>
                      <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            stats.completionRate >= 80
                              ? 'bg-emerald-500'
                              : stats.completionRate >= 50
                              ? 'bg-indigo-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${stats.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 pr-2 text-right">
                    <button className="p-1.5 rounded-lg text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
