import React from 'react';
import { ToastProvider } from './context/ToastContext';
import { HabitProvider, useHabits } from './context/HabitContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';
import { ToastContainer } from './components/common/Toast';
import { DashboardView } from './components/dashboard/DashboardView';
import { HabitsView } from './components/habits/HabitsView';
import { CalendarView } from './components/calendar/CalendarView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { HabitModal } from './components/habits/HabitModal';
import { HabitDetailsModal } from './components/habits/HabitDetailsModal';

const MainContent: React.FC = () => {
  const { activeTab } = useHabits();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 md:pb-12">
        <Header />

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'habits' && <HabitsView />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Navigation for Mobile */}
      <MobileNav />

      {/* Global Modals & Notifications */}
      <HabitModal />
      <HabitDetailsModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <HabitProvider>
        <MainContent />
      </HabitProvider>
    </ToastProvider>
  );
}

export default App;
