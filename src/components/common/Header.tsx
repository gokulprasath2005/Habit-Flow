import React from 'react';
import { useHabits } from '../../context/HabitContext';
import { getGreeting, formatDisplayDate, getTodayDateString } from '../../utils/dateUtils';
import { Plus, Sun, Moon, Calendar as CalendarIcon } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    settings,
    updateSettings,
    setIsAddModalOpen,
    selectedDate,
    setSelectedDate,
  } = useHabits();

  const greeting = getGreeting();
  const isToday = selectedDate === getTodayDateString();

  return (
    <header className="sticky top-0 z-30 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left Greeting & Date */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              {greeting}
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-indigo-500" />
            <span>{formatDisplayDate(selectedDate)}</span>
            {!isToday && (
              <button
                onClick={() => setSelectedDate(getTodayDateString())}
                className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
              >
                Jump to Today
              </button>
            )}
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Theme Quick Toggle */}
          <button
            onClick={() =>
              updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })
            }
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm hover:shadow transition-all"
            title="Toggle Light/Dark Theme"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {/* Add Habit Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Habit</span>
          </button>
        </div>
      </div>
    </header>
  );
};
