import React from 'react';
import { getWeeklyChartData } from '../../utils/habitUtils';
import type { Habit, HabitRecord } from '../../types/habit';

interface WeeklyChartProps {
  habits: Habit[];
  records: HabitRecord[];
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ habits, records }) => {
  const weeklyData = getWeeklyChartData(habits, records);

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Weekly Completion Performance
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Completion rate over the past 7 days
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
          Last 7 Days
        </span>
      </div>

      {/* Bar Chart Container */}
      <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
        {weeklyData.map((d) => {
          const barHeightPercent = Math.max(8, d.percentage); // Min height so 0% shows pill

          return (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              {/* Tooltip Percentage */}
              <span className="text-[11px] font-extrabold text-slate-600 dark:text-slate-300 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                {d.percentage}%
              </span>

              {/* Bar Outer Track */}
              <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800/80 rounded-2xl h-full flex items-end p-1 overflow-hidden">
                {/* Bar Inner Fill */}
                <div
                  className={`w-full rounded-xl transition-all duration-700 ease-out group-hover:brightness-110 ${
                    d.percentage === 100
                      ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-md shadow-emerald-500/20'
                      : d.percentage >= 50
                      ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-md shadow-indigo-500/20'
                      : 'bg-gradient-to-t from-slate-400 to-slate-300 dark:from-slate-700 dark:to-slate-600'
                  }`}
                  style={{ height: `${barHeightPercent}%` }}
                />
              </div>

              {/* Day Label */}
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                {d.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
