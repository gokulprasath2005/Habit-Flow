import React, { useState } from 'react';
import { useHabits } from '../../context/HabitContext';
import { COLOR_MAP, HabitIcon } from '../common/HabitIcon';
import { getSingleHabitStats } from '../../utils/habitUtils';
import { getPastNDays, formatDisplayDate, parseDateString } from '../../utils/dateUtils';
import { X, Flame, Trophy, CheckCircle2, TrendingUp, Edit3, Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { ConfirmModal } from '../common/ConfirmModal';

export const HabitDetailsModal: React.FC = () => {
  const { habits, records, viewingHabitId, setViewingHabitId, setEditingHabit, deleteHabit } = useHabits();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (!viewingHabitId) return null;

  const habit = habits.find((h) => h.id === viewingHabitId);
  if (!habit) return null;

  const stats = getSingleHabitStats(habit, records);
  const colorStyle = COLOR_MAP[habit.color] || COLOR_MAP.indigo;

  const past30Days = getPastNDays(30);

  const handleClose = () => {
    setViewingHabitId(null);
  };

  const handleEdit = () => {
    handleClose();
    setEditingHabit(habit);
  };

  const handleDelete = () => {
    deleteHabit(habit.id);
    handleClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Banner */}
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${colorStyle.bg} ${colorStyle.text}`}
            >
              <HabitIcon name={habit.icon} className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${colorStyle.badgeBg} ${colorStyle.text}`}
                >
                  {habit.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {habit.frequency}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {habit.name}
              </h2>
              {habit.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {habit.description}
                </p>
              )}
            </div>
          </div>

          {/* Key Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold">
                <Flame className="w-4 h-4 fill-current" />
                <span>Current Streak</span>
              </div>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-2 block">
                {stats.currentStreak} Days
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 text-xs font-bold">
                <Trophy className="w-4 h-4" />
                <span>Best Streak</span>
              </div>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-2 block">
                {stats.bestStreak} Days
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Completions</span>
              </div>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-2 block">
                {stats.totalCompletions} Times
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20">
              <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 text-xs font-bold">
                <TrendingUp className="w-4 h-4" />
                <span>30D Rate</span>
              </div>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-2 block">
                {stats.completionRate}%
              </span>
            </div>
          </div>

          {/* Frequency & Reminder Meta Info */}
          <div className="flex flex-wrap items-center gap-6 my-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-indigo-500" />
              <span>Target: {habit.target} {habit.targetUnit || 'times'} / day</span>
            </div>
            {habit.reminder && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>Daily Reminder: {habit.reminder}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Created: {formatDisplayDate(habit.startDate)}</span>
            </div>
          </div>

          {/* Past 30 Days Activity Heatmap */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              30-Day Activity History
            </h4>
            <div className="grid grid-cols-10 gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
              {past30Days.map((dateStr) => {
                const rec = records.find((r) => r.habitId === habit.id && r.date === dateStr);
                const isDone = rec ? rec.completed : false;
                const dateObj = parseDateString(dateStr);
                const dayLabel = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

                return (
                  <div
                    key={dateStr}
                    title={`${dayLabel}: ${isDone ? 'Completed ✓' : 'Missed'}`}
                    className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-bold transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {dateObj.getDate()}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Habit</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        title="Delete Habit"
        message={`Are you sure you want to delete "${habit.name}"? This will remove all habit history.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      />
    </>
  );
};
