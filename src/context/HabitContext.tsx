import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { Habit, HabitCategory, HabitRecord, NavigationTab, UserSettings } from '../types/habit';
import {
  loadHabitsFromStorage,
  saveHabitsToStorage,
  loadRecordsFromStorage,
  saveRecordsToStorage,
  loadSettingsFromStorage,
  saveSettingsToStorage,
  exportDataAsJSON,
  parseImportJSON,
  resetAllStorageData,
  clearHistoryStorageData,
} from '../utils/storage';
import { getTodayDateString } from '../utils/dateUtils';
import { useToast } from './ToastContext';

interface HabitContextType {
  habits: Habit[];
  records: HabitRecord[];
  settings: UserSettings;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedCategory: HabitCategory | 'All';
  setSelectedCategory: (cat: HabitCategory | 'All') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  
  // Modals & Active Items
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  editingHabit: Habit | null;
  setEditingHabit: (habit: Habit | null) => void;
  viewingHabitId: string | null;
  setViewingHabitId: (id: string | null) => void;

  // Actions
  createHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (habitId: string, dateStr?: string) => void;
  updateHabitProgress: (habitId: string, progress: number, dateStr?: string) => void;
  
  // Settings & Storage Actions
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  exportData: () => void;
  importData: (jsonString: string) => boolean;
  resetData: () => void;
  clearHistory: () => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [records, setRecords] = useState<HabitRecord[]>([]);
  const [settings, setSettings] = useState<UserSettings>(loadSettingsFromStorage);
  
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [viewingHabitId, setViewingHabitId] = useState<string | null>(null);

  // Load Initial Data
  useEffect(() => {
    const loadedHabits = loadHabitsFromStorage();
    const loadedRecords = loadRecordsFromStorage();
    const loadedSettings = loadSettingsFromStorage();

    setHabits(loadedHabits);
    setRecords(loadedRecords);
    setSettings(loadedSettings);

    // Apply dark mode class to html element
    if (loadedSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Save changes to localStorage
  const handleSaveHabits = (newHabits: Habit[]) => {
    setHabits(newHabits);
    saveHabitsToStorage(newHabits);
  };

  const handleSaveRecords = (newRecords: HabitRecord[]) => {
    setRecords(newRecords);
    saveRecordsToStorage(newRecords);
  };

  // Habit CRUD Actions
  const createHabit = (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: `habit-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newHabit, ...habits];
    handleSaveHabits(updated);
    showToast(`Habit "${newHabit.name}" created successfully!`, 'success');
  };

  const updateHabit = (updatedHabit: Habit) => {
    const updated = habits.map((h) => (h.id === updatedHabit.id ? updatedHabit : h));
    handleSaveHabits(updated);
    showToast(`Habit "${updatedHabit.name}" updated`, 'success');
  };

  const deleteHabit = (id: string) => {
    const habitToDelete = habits.find((h) => h.id === id);
    const updatedHabits = habits.filter((h) => h.id !== id);
    const updatedRecords = records.filter((r) => r.habitId !== id);

    handleSaveHabits(updatedHabits);
    handleSaveRecords(updatedRecords);

    if (viewingHabitId === id) setViewingHabitId(null);
    if (editingHabit?.id === id) setEditingHabit(null);

    showToast(`Habit "${habitToDelete?.name || 'Habit'}" deleted`, 'info');
  };

  // Completion Logic
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'],
      });
    } catch {
      // Ignore if confetti fails
    }
  };

  const toggleHabitCompletion = (habitId: string, dateStr: string = selectedDate) => {
    const targetHabit = habits.find((h) => h.id === habitId);
    if (!targetHabit) return;

    const existingIndex = records.findIndex((r) => r.habitId === habitId && r.date === dateStr);

    let newRecords = [...records];
    let isNowCompleted = false;

    if (existingIndex >= 0) {
      const existing = records[existingIndex];
      isNowCompleted = !existing.completed;
      newRecords[existingIndex] = {
        ...existing,
        completed: isNowCompleted,
        progress: isNowCompleted ? targetHabit.target : 0,
      };
    } else {
      isNowCompleted = true;
      newRecords.push({
        habitId,
        date: dateStr,
        completed: true,
        progress: targetHabit.target,
      });
    }

    handleSaveRecords(newRecords);

    if (isNowCompleted) {
      triggerConfetti();
      showToast(`✓ "${targetHabit.name}" marked as completed!`, 'success');
    } else {
      showToast(`Unmarked "${targetHabit.name}"`, 'info');
    }
  };

  const updateHabitProgress = (habitId: string, progress: number, dateStr: string = selectedDate) => {
    const targetHabit = habits.find((h) => h.id === habitId);
    if (!targetHabit) return;

    const existingIndex = records.findIndex((r) => r.habitId === habitId && r.date === dateStr);
    const newProgress = Math.max(0, progress);
    const isCompleted = newProgress >= targetHabit.target;

    let newRecords = [...records];

    if (existingIndex >= 0) {
      newRecords[existingIndex] = {
        ...newRecords[existingIndex],
        progress: newProgress,
        completed: isCompleted,
      };
    } else {
      newRecords.push({
        habitId,
        date: dateStr,
        progress: newProgress,
        completed: isCompleted,
      });
    }

    handleSaveRecords(newRecords);

    if (isCompleted && (!records[existingIndex] || !records[existingIndex].completed)) {
      triggerConfetti();
      showToast(`🎉 Goal reached for "${targetHabit.name}"!`, 'success');
    }
  };

  // Settings & Backup Logic
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettingsToStorage(updated);

    if (newSettings.theme) {
      if (newSettings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const exportData = () => {
    exportDataAsJSON(habits, records, settings);
    showToast('Habit data exported to JSON file', 'success');
  };

  const importData = (jsonString: string): boolean => {
    try {
      const parsed = parseImportJSON(jsonString);
      handleSaveHabits(parsed.habits);
      handleSaveRecords(parsed.records);
      if (parsed.settings) {
        updateSettings(parsed.settings);
      }
      showToast('Data imported successfully!', 'success');
      return true;
    } catch (err: any) {
      showToast(err?.message || 'Failed to import data', 'error');
      return false;
    }
  };

  const resetData = () => {
    const res = resetAllStorageData();
    setHabits(res.habits);
    setRecords(res.records);
    setSettings(res.settings);
    if (res.settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    showToast('App reset to initial sample habits', 'info');
  };

  const clearHistory = () => {
    const cleared = clearHistoryStorageData();
    setRecords(cleared);
    showToast('Habit completion history cleared', 'info');
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        records,
        settings,
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedDate,
        setSelectedDate,
        isAddModalOpen,
        setIsAddModalOpen,
        editingHabit,
        setEditingHabit,
        viewingHabitId,
        setViewingHabitId,
        createHabit,
        updateHabit,
        deleteHabit,
        toggleHabitCompletion,
        updateHabitProgress,
        updateSettings,
        exportData,
        importData,
        resetData,
        clearHistory,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = (): HabitContextType => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
