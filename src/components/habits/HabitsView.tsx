import React from 'react';
import { useHabits } from '../../context/HabitContext';
import { HabitFilter } from '../dashboard/HabitFilter';
import { HabitCard } from '../dashboard/HabitCard';
import { EmptyState } from '../common/EmptyState';
import { Plus, CheckSquare } from 'lucide-react';

export const HabitsView: React.FC = () => {
  const { habits, selectedCategory, searchQuery, setIsAddModalOpen } = useHabits();

  // Filter habits
  const filteredHabits = habits.filter((h) => {
    const matchesCategory = selectedCategory === 'All' || h.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.description && h.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Habits Management ({habits.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              View, edit, filter, and track all your active routines in one place
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-indigo-500/20 active:scale-95 transition-all self-end sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <HabitFilter />

      {/* Habit Cards Grid */}
      {filteredHabits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHabits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CheckSquare}
          title="No Habits Found"
          description={
            searchQuery || selectedCategory !== 'All'
              ? 'No habits match your active category or search filter.'
              : 'You have not created any habits yet. Start building your daily routine!'
          }
          actionLabel="Create New Habit"
          onAction={() => setIsAddModalOpen(true)}
        />
      )}
    </div>
  );
};
