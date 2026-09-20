import React from 'react';
import { getMonthlyTrendData } from '../../utils/habitUtils';
import type { Habit, HabitRecord } from '../../types/habit';

interface MonthlyChartProps {
  habits: Habit[];
  records: HabitRecord[];
}

export const MonthlyChart: React.FC<MonthlyChartProps> = ({ habits, records }) => {
  const trendData = getMonthlyTrendData(habits, records);

  if (trendData.length === 0) return null;

  // Compute SVG Points
  const width = 600;
  const height = 180;
  const padding = 20;

  const points = trendData.map((d, index) => {
    const x = padding + (index / (trendData.length - 1)) * (width - 2 * padding);
    const y = height - padding - (d.percentage / 100) * (height - 2 * padding);
    return { x, y, percentage: d.percentage, label: d.label, date: d.date };
  });

  const pathD = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            30-Day Completion Trend
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daily completion percentage trajectory
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
          Monthly View
        </span>
      </div>

      {/* SVG Container */}
      <div className="relative w-full overflow-hidden pt-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="4 4" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="4 4" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />

          {/* Area Fill */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Trend Line */}
          <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Dots on key points */}
          {points.map((p, i) => (
            <g key={i} className="group cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                className="fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-slate-900 stroke-2 group-hover:r-6 transition-all"
              />
            </g>
          ))}
        </svg>

        {/* X-Axis Dates */}
        <div className="flex justify-between text-[10px] font-bold text-slate-400 px-2 mt-2">
          <span>{trendData[0]?.label}</span>
          <span>{trendData[Math.floor(trendData.length / 2)]?.label}</span>
          <span>{trendData[trendData.length - 1]?.label}</span>
        </div>
      </div>
    </div>
  );
};
