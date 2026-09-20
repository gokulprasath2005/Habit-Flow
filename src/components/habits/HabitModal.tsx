import React, { useState, useEffect } from 'react';
import type { HabitCategory, HabitColor, HabitFrequencyType } from '../../types/habit';
import { useHabits } from '../../context/HabitContext';
import { AVAILABLE_ICONS, COLOR_MAP, HabitIcon } from '../common/HabitIcon';
import { X, Check } from 'lucide-react';

const CATEGORIES: HabitCategory[] = [
  'Health',
  'Productivity',
  'Mindfulness',
  'Fitness',
  'Lifestyle',
  'Learning',
];

const COLORS: HabitColor[] = ['emerald', 'indigo', 'amber', 'rose', 'sky', 'purple', 'violet', 'orange'];

export const HabitModal: React.FC = () => {
  const { isAddModalOpen, setIsAddModalOpen, editingHabit, setEditingHabit, createHabit, updateHabit } = useHabits();

  const isOpen = isAddModalOpen || editingHabit !== null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Sparkles');
  const [category, setCategory] = useState<HabitCategory>('Health');
  const [color, setColor] = useState<HabitColor>('indigo');
  const [frequency, setFrequency] = useState<HabitFrequencyType>('daily');
  const [target, setTarget] = useState(1);
  const [targetUnit, setTargetUnit] = useState('times');
  const [reminder, setReminder] = useState('08:00');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name);
      setDescription(editingHabit.description || '');
      setIcon(editingHabit.icon);
      setCategory(editingHabit.category);
      setColor(editingHabit.color);
      setFrequency(editingHabit.frequency);
      setTarget(editingHabit.target);
      setTargetUnit(editingHabit.targetUnit || 'times');
      setReminder(editingHabit.reminder || '08:00');
      setStartDate(editingHabit.startDate || new Date().toISOString().split('T')[0]);
    } else {
      setName('');
      setDescription('');
      setIcon('Sparkles');
      setCategory('Health');
      setColor('indigo');
      setFrequency('daily');
      setTarget(1);
      setTargetUnit('times');
      setReminder('08:00');
      setStartDate(new Date().toISOString().split('T')[0]);
    }
    setErrors({});
  }, [editingHabit, isAddModalOpen]);

  const handleClose = () => {
    setIsAddModalOpen(false);
    setEditingHabit(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrors({ name: 'Habit name is required' });
      return;
    }

    if (editingHabit) {
      updateHabit({
        ...editingHabit,
        name: name.trim(),
        description: description.trim(),
        icon,
        category,
        color,
        frequency,
        target: Math.max(1, Number(target)),
        targetUnit: targetUnit.trim(),
        reminder,
        startDate,
      });
    } else {
      createHabit({
        name: name.trim(),
        description: description.trim(),
        icon,
        category,
        color,
        frequency,
        target: Math.max(1, Number(target)),
        targetUnit: targetUnit.trim(),
        reminder,
        startDate,
      });
    }

    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
          {editingHabit ? 'Edit Habit' : 'Create New Habit'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
          Define your target routine, daily frequency, and color theme.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Habit Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({});
              }}
              placeholder="e.g., Read 30 Minutes"
              className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-sm text-slate-900 dark:text-white outline-none transition-all ${
                errors.name
                  ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
              }`}
            />
            {errors.name && (
              <span className="text-xs text-rose-500 mt-1 block font-medium">
                {errors.name}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why are you building this habit?"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-sm text-slate-900 dark:text-white outline-none transition-all"
            />
          </div>

          {/* Icon Picker Grid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Choose Icon
            </label>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/80">
              {AVAILABLE_ICONS.map((ic) => {
                const isSelected = icon === ic;
                return (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setIcon(ic)}
                    className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 scale-105'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <HabitIcon name={ic} className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HabitCategory)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-sm text-slate-900 dark:text-white outline-none transition-all"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Color Theme
              </label>
              <div className="flex items-center gap-2 py-1 overflow-x-auto">
                {COLORS.map((c) => {
                  const style = COLOR_MAP[c];
                  const isSelected = color === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full ${style.accentBg} flex items-center justify-center transition-all ${
                        isSelected ? 'ring-4 ring-indigo-500/40 scale-110' : 'opacity-80 hover:opacity-100'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Frequency & Targets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as HabitFrequencyType)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-sm text-slate-900 dark:text-white outline-none transition-all"
              >
                <option value="daily">Every Day</option>
                <option value="weekdays">Weekdays Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Daily Goal Target
              </label>
              <input
                type="number"
                min="1"
                value={target}
                onChange={(e) => setTarget(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-sm text-slate-900 dark:text-white outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Unit
              </label>
              <input
                type="text"
                value={targetUnit}
                onChange={(e) => setTargetUnit(e.target.value)}
                placeholder="L, Mins, Times"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-sm text-slate-900 dark:text-white outline-none transition-all"
              />
            </div>
          </div>

          {/* Reminder & Start Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Reminder Time
              </label>
              <input
                type="time"
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-sm text-slate-900 dark:text-white outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 text-sm text-slate-900 dark:text-white outline-none transition-all"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
            >
              {editingHabit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
