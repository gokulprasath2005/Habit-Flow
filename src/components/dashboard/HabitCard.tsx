import React, { useState } from 'react';
import type { Habit } from '../../types/habit';
import { useHabits } from '../../context/HabitContext';
import { COLOR_MAP, HabitIcon } from '../common/HabitIcon';
import { getSingleHabitStats } from '../../utils/habitUtils';
import { Check, Flame, Edit3, Trash2, Plus, Minus, Calendar } from 'lucide-react';
import { ConfirmModal } from '../common/ConfirmModal';

interface HabitCardProps {
  habit: Habit;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  const {
    records,
    selectedDate,
    toggleHabitCompletion,
    updateHabitProgress,
    setEditingHabit,
    setViewingHabitId,
    deleteHabit,
  } = useHabits();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Find record for current selected date
  const record = records.find((r) => r.habitId === habit.id && r.date === selectedDate);
  const isCompleted = record ? record.completed : false;
  const currentProgress = record ? record.progress : 0;

  // Stats
  const stats = getSingleHabitStats(habit, records);

  // Styling palette
  const colorStyle = COLOR_MAP[habit.color] || COLOR_MAP.indigo;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleHabitCompletion(habit.id, selectedDate);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateHabitProgress(habit.id, currentProgress + 1, selectedDate);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentProgress > 0) {
      updateHabitProgress(habit.id, currentProgress - 1, selectedDate);
    }
  };

  const progressPercent = Math.min(100, Math.round((currentProgress / habit.target) * 100));

  return (
    <>
      <div
        onClick={() => setViewingHabitId(habit.id)}
        className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
          isCompleted
            ? 'bg-emerald-500/5 dark:bg-emerald-950/30 border-emerald-500/40 shadow-sm dark:border-emerald-500/30 ring-1 ring-emerald-500/20'
            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 shadow-sm hover:shadow-md'
        }`}
      >
        {/* Top Header: Icon, Info, & Actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Habit Icon Container */}
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                isCompleted ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : `${colorStyle.bg} ${colorStyle.text}`
              }`}
            >
              <HabitIcon name={habit.icon} className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${colorStyle.badgeBg} ${colorStyle.text}`}
                >
                  {habit.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                  <Calendar className="w-3 h-3" />
                  {habit.frequency}
                </span>
              </div>
              <h3
                className={`text-base font-bold mt-0.5 transition-colors ${
                  isCompleted
                    ? 'text-slate-700 dark:text-slate-300 line-through decoration-emerald-500 decoration-2'
                    : 'text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                }`}
              >
                {habit.name}
              </h3>
            </div>
          </div>

          {/* Edit & Delete Action Buttons (Stop Propagation) */}
          <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingHabit(habit);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Habit"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteConfirmOpen(true);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Delete Habit"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Habit Description */}
        {habit.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
            {habit.description}
          </p>
        )}

        {/* Progress Controls & Target Counter */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
          {/* Progress Controls */}
          <div className="flex items-center gap-2">
            {habit.target > 1 ? (
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
                <button
                  onClick={handleDecrement}
                  disabled={currentProgress <= 0}
                  className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-slate-900 dark:text-white px-2">
                  {currentProgress} / {habit.target} {habit.targetUnit || ''}
                </span>
                <button
                  onClick={handleIncrement}
                  className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Target: 1 {habit.targetUnit || 'time'} / day
              </span>
            )}

            {/* Streak Counter */}
            <div className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
              <span>{stats.currentStreak}d streak</span>
            </div>
          </div>

          {/* Checkbox / Complete Toggle Button */}
          <button
            onClick={handleToggle}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs shadow-sm transition-all duration-200 active:scale-95 ${
              isCompleted
                ? 'bg-emerald-500 text-white shadow-emerald-500/30 hover:bg-emerald-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600'
            }`}
          >
            <Check className={`w-4 h-4 ${isCompleted ? 'stroke-[3]' : ''}`} />
            <span>{isCompleted ? 'Done' : 'Mark Complete'}</span>
          </button>
        </div>

        {/* Card Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isCompleted ? 'bg-emerald-500' : `${colorStyle.accentBg}`
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        title="Delete Habit"
        message={`Are you sure you want to delete "${habit.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => deleteHabit(habit.id)}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      />
    </>
  );
};
