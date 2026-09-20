import React, { useState, useRef } from 'react';
import { useHabits } from '../../context/HabitContext';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  Sun,
  Moon,
  Calendar,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Settings,
  FileJson,
  ShieldAlert,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    exportData,
    importData,
    resetData,
    clearHistory,
  } = useHabits();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isClearHistoryConfirmOpen, setIsClearHistoryConfirmOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importData(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Title Header */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Application Settings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Customize preferences, theme appearance, and manage local data backups
          </p>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          General Preferences
        </h3>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {settings.theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Appearance Theme
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Switch between modern Dark mode and clean Light mode
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => updateSettings({ theme: 'light' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                settings.theme === 'light'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Light Mode
            </button>
            <button
              onClick={() => updateSettings({ theme: 'dark' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                settings.theme === 'dark'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Dark Mode
            </button>
          </div>
        </div>

        {/* Week Start Option */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Calendar className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Week Starts On
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose the first day of the week for calendars and charts
              </p>
            </div>
          </div>

          <select
            value={settings.weekStartsOn}
            onChange={(e) => updateSettings({ weekStartsOn: e.target.value as 'monday' | 'sunday' })}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
          >
            <option value="monday">Monday</option>
            <option value="sunday">Sunday</option>
          </select>
        </div>
      </div>

      {/* Data Backup & Export Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <FileJson className="w-5 h-5 text-indigo-500" />
          Data Backup & Portability
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export JSON */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-indigo-500" />
                Export Data
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Download a complete JSON backup of all your habits, history records, and settings.
              </p>
            </div>
            <button
              onClick={exportData}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Export Backup JSON</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-500" />
                Import Data
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Restore habits and completion history from a previously saved JSON backup file.
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold text-xs shadow-sm transition-all active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Select JSON File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone Section */}
      <div className="bg-rose-500/5 dark:bg-rose-950/20 p-6 rounded-3xl border border-rose-500/20 dark:border-rose-500/30 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-rose-600 dark:text-rose-400 pb-3 border-b border-rose-500/20 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" />
          Danger Zone
        </h3>

        <div className="space-y-4">
          {/* Clear History */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Clear Habit History
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Wipes all completion check-ins while preserving your habit definitions.
              </p>
            </div>
            <button
              onClick={() => setIsClearHistoryConfirmOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white text-xs font-bold transition-all shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          </div>

          {/* Reset App */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Reset All Data to Default Seed
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Resets the application state back to the initial 5 sample habits and 30-day history.
              </p>
            </div>
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white text-xs font-bold transition-all shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset All Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Reset All Application Data"
        message="Are you sure you want to reset HabitFlow? All custom habits and history will be replaced with initial 30-day sample data."
        confirmLabel="Reset Everything"
        onConfirm={resetData}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      <ConfirmModal
        isOpen={isClearHistoryConfirmOpen}
        title="Clear Completion History"
        message="Are you sure you want to clear all history records? Your habit list will remain, but all recorded check-ins will be erased."
        confirmLabel="Clear History"
        isDanger={false}
        onConfirm={clearHistory}
        onCancel={() => setIsClearHistoryConfirmOpen(false)}
      />
    </div>
  );
};
