import type { Habit, HabitRecord, UserSettings } from '../types/habit';
import { generateSampleRecords, INITIAL_HABITS } from './seedData';

const STORAGE_KEYS = {
  HABITS: 'habitflow_habits',
  RECORDS: 'habitflow_records',
  SETTINGS: 'habitflow_settings',
};

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  weekStartsOn: 'monday',
};

export const loadHabitsFromStorage = (): Habit[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (!raw) {
      saveHabitsToStorage(INITIAL_HABITS);
      return INITIAL_HABITS;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load habits from localStorage:', error);
    return INITIAL_HABITS;
  }
};

export const saveHabitsToStorage = (habits: Habit[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  } catch (error) {
    console.error('Failed to save habits to localStorage:', error);
  }
};

export const loadRecordsFromStorage = (): HabitRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (!raw) {
      const sampleRecords = generateSampleRecords();
      saveRecordsToStorage(sampleRecords);
      return sampleRecords;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load records from localStorage:', error);
    return generateSampleRecords();
  }
};

export const saveRecordsToStorage = (records: HabitRecord[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  } catch (error) {
    console.error('Failed to save records to localStorage:', error);
  }
};

export const loadSettingsFromStorage = (): UserSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      saveSettingsToStorage(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load settings from localStorage:', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettingsToStorage = (settings: UserSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
  }
};

export const exportDataAsJSON = (habits: Habit[], records: HabitRecord[], settings: UserSettings): void => {
  const exportPayload = {
    appName: 'HabitFlow',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    habits,
    records,
    settings,
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `HabitFlow_Backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

export const parseImportJSON = (
  jsonText: string
): { habits: Habit[]; records: HabitRecord[]; settings?: UserSettings } => {
  const parsed = JSON.parse(jsonText);
  if (!parsed || !Array.isArray(parsed.habits) || !Array.isArray(parsed.records)) {
    throw new Error('Invalid HabitFlow backup format. File must contain "habits" and "records" arrays.');
  }
  return {
    habits: parsed.habits,
    records: parsed.records,
    settings: parsed.settings || DEFAULT_SETTINGS,
  };
};

export const resetAllStorageData = (): { habits: Habit[]; records: HabitRecord[]; settings: UserSettings } => {
  const sampleRecords = generateSampleRecords();
  saveHabitsToStorage(INITIAL_HABITS);
  saveRecordsToStorage(sampleRecords);
  saveSettingsToStorage(DEFAULT_SETTINGS);
  return {
    habits: INITIAL_HABITS,
    records: sampleRecords,
    settings: DEFAULT_SETTINGS,
  };
};

export const clearHistoryStorageData = (): HabitRecord[] => {
  saveRecordsToStorage([]);
  return [];
};
