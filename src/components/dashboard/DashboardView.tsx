import React from 'react';
import { useHabits } from '../../context/HabitContext';
import { ProgressOverview } from './ProgressOverview';
import { HabitFilter } from './HabitFilter';
import { HabitCard } from './HabitCard';
import { EmptyState } from '../common/EmptyState';
import { CheckSquare } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { habits, selectedCategory, searchQuery, setIsAddModalOpen } = useHabits();

  // Filter active habits for current view
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
      {/* Overview Progress & Metrics */}
      <ProgressOverview />

      {/* Filter & Search Toolbar */}
      <HabitFilter />

      {/* Today's Habits Section Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Today's Habits
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click checkmark to complete or increment progress counter
          </p>
        </div>
      </div>

      {/* Habits Grid */}
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
              ? 'No habits match your active filter or search query.'
              : 'Your habit dashboard is empty. Add a new habit to start tracking!'
          }
          actionLabel="Add a Habit"
          onAction={() => setIsAddModalOpen(true)}
        />
      )}
    </div>
  );
};
