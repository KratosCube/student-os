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
          className={`${
            mode === 'week' ? 'ui-btn-primary' : 'ui-btn-secondary'
          }`}
        >
          Po dnech
        </button>

        <button
          type="button"
          onClick={() => setMode('subjects')}
          className={`${
            mode === 'subjects' ? 'ui-btn-primary' : 'ui-btn-secondary'
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