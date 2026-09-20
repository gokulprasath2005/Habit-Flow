import React from 'react';
import { useHabits } from '../../context/HabitContext';
import type { NavigationTab } from '../../types/habit';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BarChart3,
  Settings,
  Zap,
  Flame,
} from 'lucide-react';
import { getSingleHabitStats } from '../../utils/habitUtils';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, habits, records } = useHabits();

  // Calculate top streak across habits
  const topStreak = habits.reduce((max, h) => {
    const stats = getSingleHabitStats(h, records);
    return Math.max(max, stats.currentStreak);
  }, 0);

  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'habits', label: 'All Habits', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 p-5 h-screen sticky top-0 justify-between">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 dark:from-white dark:via-indigo-200 dark:to-indigo-400 bg-clip-text text-transparent">
              HabitFlow
            </span>
            <span className="block text-[10px] uppercase font-extrabold tracking-wider text-indigo-500">
              Personal Tracker
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 w-full px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Streak Badge Widget */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20 dark:border-amber-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/30">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 block">
              Active Streak
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {topStreak} {topStreak === 1 ? 'Day' : 'Days'} 🔥
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
