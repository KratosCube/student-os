import RewardShop from '@/components/RewardShop';
import StudyChartSwitcher from '@/components/StudyChartSwitcher';
import { getDashboardData } from '@/lib/dashboard-data';

export const dynamic = 'force-dynamic';

export default async function StatsPage() {
  const {
    weeklySeries,
    subjectSeries,
    weekTotalMinutes,
    lifetimeMinutes,
    totalLifetimeCredits,
  } = await getDashboardData();

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">
          Stats
        </p>
        <h2 className="mt-2 text-3xl font-bold">Statistiky a odměny</h2>
        <p className="mt-2 max-w-3xl text-slate-500 dark:text-slate-400">
          Jedna pracovní obrazovka pro statistiky a reward shop. Graf se přepíná
          mezi pohledem po dnech a podle předmětů.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Týden celkem
          </p>
          <p className="mt-3 text-3xl font-bold">
            {Math.floor(weekTotalMinutes / 60)}h {weekTotalMinutes % 60}m
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Celkem odstudováno
          </p>
          <p className="mt-3 text-3xl font-bold">
            {Math.floor(lifetimeMinutes / 60)}h {lifetimeMinutes % 60}m
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Kredity
          </p>
          <p className="mt-3 text-3xl font-bold">{totalLifetimeCredits}</p>
        </div>
      </section>

      <StudyChartSwitcher
        weeklySeries={weeklySeries}
        subjectSeries={subjectSeries}
      />

      <RewardShop totalLifetimeCredits={totalLifetimeCredits} />
    </div>
  );
}