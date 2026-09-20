import React, { useState } from 'react';
import { useHabits } from '../../context/HabitContext';
import { getDaysInMonth, formatDateString, getTodayDateString, formatDisplayDate } from '../../utils/dateUtils';
import { getDailyCompletionPercentage } from '../../utils/habitUtils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, XCircle } from 'lucide-react';
import { COLOR_MAP, HabitIcon } from '../common/HabitIcon';

export const CalendarView: React.FC = () => {
  const { habits, records, selectedDate, setSelectedDate, toggleHabitCompletion } = useHabits();

  const initialDate = selectedDate ? new Date(selectedDate) : new Date();
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth()); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const days = getDaysInMonth(currentYear, currentMonth);

  // Day of week of 1st day of month (0 = Sun, 1 = Mon...)
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Selected date breakdown stats
  const activeDateStats = getDailyCompletionPercentage(selectedDate, habits, records);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Click any date to inspect and manage habit records
            </p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => {
              const now = new Date();
              setCurrentYear(now.getFullYear());
              setCurrentMonth(now.getMonth());
              setSelectedDate(getTodayDateString());
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-800 rounded-xl p-1 bg-slate-50 dark:bg-slate-800/50">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-2 text-center mb-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <span
              key={d}
              className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 py-1"
            >
              {d}
            </span>
          ))}
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty Padding Cells */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[70px] sm:min-h-[85px] rounded-2xl bg-slate-50/50 dark:bg-slate-950/20" />
          ))}

          {/* Actual Month Days */}
          {days.map((date) => {
            const dateStr = formatDateString(date);
            const isSelected = selectedDate === dateStr;
            const isToday = dateStr === getTodayDateString();
            const dailyStats = getDailyCompletionPercentage(dateStr, habits, records);

            let heatBg = 'bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300';
            if (dailyStats.total > 0) {
              if (dailyStats.percentage === 100) {
                heatBg = 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30';
              } else if (dailyStats.percentage >= 50) {
                heatBg = 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30';
              } else if (dailyStats.percentage > 0) {
                heatBg = 'bg-sky-500/10 dark:bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-500/30';
              }
            }

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`min-h-[70px] sm:min-h-[85px] p-2 rounded-2xl flex flex-col justify-between items-start transition-all relative ${heatBg} ${
                  isSelected
                    ? 'ring-2 ring-indigo-600 dark:ring-indigo-400 shadow-md scale-[1.02] z-10'
                    : 'hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                      isToday
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {date.getDate()}
                  </span>

                  {dailyStats.total > 0 && (
                    <span className="text-[10px] font-extrabold">
                      {dailyStats.percentage}%
                    </span>
                  )}
                </div>

                {dailyStats.total > 0 && (
                  <div className="w-full mt-2">
                    <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      {dailyStats.completed}/{dailyStats.total}
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-0.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          dailyStats.percentage === 100
                            ? 'bg-emerald-500'
                            : dailyStats.percentage >= 50
                            ? 'bg-amber-500'
                            : 'bg-indigo-500'
                        }`}
                        style={{ width: `${dailyStats.percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Breakdown for Selected Date */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Habits Log for {formatDisplayDate(selectedDate)}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeDateStats.completed} completed, {activeDateStats.total - activeDateStats.completed} pending/missed
            </p>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
            {activeDateStats.percentage}% Rate
          </div>
        </div>

        {/* Habits Checklist for Selected Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {habits.map((h) => {
            const rec = records.find((r) => r.habitId === h.id && r.date === selectedDate);
            const isDone = rec ? rec.completed : false;
            const colorStyle = COLOR_MAP[h.color] || COLOR_MAP.indigo;

            return (
              <div
                key={h.id}
                onClick={() => toggleHabitCompletion(h.id, selectedDate)}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                  isDone
                    ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isDone ? 'bg-emerald-500 text-white' : `${colorStyle.bg} ${colorStyle.text}`
                    }`}
                  >
                    <HabitIcon name={h.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                      {h.name}
                    </h4>
                    <span className="text-xs text-slate-400 font-medium">
                      Goal: {h.target} {h.targetUnit || 'times'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isDone ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950">
                      <CheckCircle2 className="w-4 h-4" /> Completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-400 px-3 py-1 rounded-xl bg-slate-200/60 dark:bg-slate-800">
                      <XCircle className="w-4 h-4" /> Missed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
