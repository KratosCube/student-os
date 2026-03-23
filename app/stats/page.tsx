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
    <div className="space-y-5">
      <section className="ui-card p-6">
        <p className="ui-eyebrow">Stats</p>
        <h2 className="ui-page-title mt-2">Statistiky a odměny</h2>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="ui-card p-5">
          <p className="ui-metric-label">Týden celkem</p>
          <p className="ui-metric-value mt-3">
            {Math.floor(weekTotalMinutes / 60)}h {weekTotalMinutes % 60}m
          </p>
        </div>

        <div className="ui-card p-5">
          <p className="ui-metric-label">Celkem odstudováno</p>
          <p className="ui-metric-value mt-3">
            {Math.floor(lifetimeMinutes / 60)}h {lifetimeMinutes % 60}m
          </p>
        </div>

        <div className="ui-card p-5">
          <p className="ui-metric-label">Kredity</p>
          <p className="ui-metric-value mt-3">{totalLifetimeCredits}</p>
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