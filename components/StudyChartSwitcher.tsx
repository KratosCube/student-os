'use client';

import { useMemo, useState } from 'react';
import StudyBarChart from '@/components/StudyBarChart';

type ChartItem = {
  label: string;
  value: number;
  color?: string;
};

export default function StudyChartSwitcher({
  weeklySeries,
  subjectSeries,
}: {
  weeklySeries: ChartItem[];
  subjectSeries: ChartItem[];
}) {
  const [mode, setMode] = useState<'week' | 'subjects'>('week');

  const chartConfig = useMemo(() => {
    if (mode === 'week') {
      return {
        title: 'Studium za posledních 7 dní',
        description: 'Přehled vytížení po dnech.',
        items: weeklySeries,
      };
    }

    return {
      title: 'Studium podle předmětů',
      description: 'Přehled celkové investice času po předmětech.',
      items: subjectSeries,
    };
  }, [mode, weeklySeries, subjectSeries]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setMode('week')}
          className={`rounded-2xl px-4 py-2 text-sm font-semibold transition-colors ${
            mode === 'week'
              ? 'bg-indigo-600 text-white'
              : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          Po dnech
        </button>

        <button
          type="button"
          onClick={() => setMode('subjects')}
          className={`rounded-2xl px-4 py-2 text-sm font-semibold transition-colors ${
            mode === 'subjects'
              ? 'bg-indigo-600 text-white'
              : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          Podle předmětů
        </button>
      </div>

      <StudyBarChart
        title={chartConfig.title}
        description={chartConfig.description}
        items={chartConfig.items}
      />
    </div>
  );
}