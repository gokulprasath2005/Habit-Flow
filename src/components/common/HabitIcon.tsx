import React from 'react';
import * as Icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface HabitIconProps extends LucideProps {
  name: string;
}

export const HabitIcon: React.FC<HabitIconProps> = ({ name, ...props }) => {
  const IconComponent = ((Icons as unknown) as Record<string, React.FC<LucideProps>>)[name] || Icons.CheckCircle2;
  return <IconComponent {...props} />;
};

export const AVAILABLE_ICONS = [
  'Droplets',
  'BookOpen',
  'Activity',
  'Code',
  'Sparkles',
  'Moon',
  'Heart',
  'Zap',
  'Target',
  'Coffee',
  'Dumbbell',
  'Flame',
  'Smile',
  'Star',
  'Award',
  'Trophy',
  'Sun',
  'Utensils',
  'Brain',
  'Music',
  'Bike',
  'Footprints',
  'BedDouble',
  'PenTool',
];

export const COLOR_MAP = {
  emerald: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/30',
    ring: 'ring-emerald-500',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/80',
    accentBg: 'bg-emerald-500',
  },
  indigo: {
    bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-500/30',
    ring: 'ring-indigo-500',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-950/80',
    accentBg: 'bg-indigo-500',
  },
  amber: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/30',
    ring: 'ring-amber-500',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/80',
    accentBg: 'bg-amber-500',
  },
  rose: {
    bg: 'bg-rose-500/10 dark:bg-rose-500/20',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/30',
    ring: 'ring-rose-500',
    badgeBg: 'bg-rose-100 dark:bg-rose-950/80',
    accentBg: 'bg-rose-500',
  },
  sky: {
    bg: 'bg-sky-500/10 dark:bg-sky-500/20',
    text: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-500/30',
    ring: 'ring-sky-500',
    badgeBg: 'bg-sky-100 dark:bg-sky-950/80',
    accentBg: 'bg-sky-500',
  },
  purple: {
    bg: 'bg-purple-500/10 dark:bg-purple-500/20',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/30',
    ring: 'ring-purple-500',
    badgeBg: 'bg-purple-100 dark:bg-purple-950/80',
    accentBg: 'bg-purple-500',
  },
  violet: {
    bg: 'bg-violet-500/10 dark:bg-violet-500/20',
    text: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-500/30',
    ring: 'ring-violet-500',
    badgeBg: 'bg-violet-100 dark:bg-violet-950/80',
    accentBg: 'bg-violet-500',
  },
  orange: {
    bg: 'bg-orange-500/10 dark:bg-orange-500/20',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-500/30',
    ring: 'ring-orange-500',
    badgeBg: 'bg-orange-100 dark:bg-orange-950/80',
    accentBg: 'bg-orange-500',
  },
};
