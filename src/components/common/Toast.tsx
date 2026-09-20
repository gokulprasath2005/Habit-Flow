import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              isSuccess
                ? 'bg-slate-900/90 text-emerald-400 border-emerald-500/30 dark:bg-slate-800/95 dark:text-emerald-300 dark:border-emerald-500/40'
                : isError
                ? 'bg-slate-900/90 text-rose-400 border-rose-500/30 dark:bg-slate-800/95 dark:text-rose-300 dark:border-rose-500/40'
                : 'bg-slate-900/90 text-indigo-300 border-indigo-500/30 dark:bg-slate-800/95 dark:text-indigo-200 dark:border-indigo-500/40'
            }`}
          >
            <div className="flex items-center gap-3">
              {isSuccess && <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />}
              {isError && <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 shrink-0 text-indigo-400" />}
              <span className="text-sm font-medium text-slate-100">{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
