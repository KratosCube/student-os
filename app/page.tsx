import { Clock3, GraduationCap, CalendarRange } from 'lucide-react';

import FocusTimer from '@/components/FocusTimer';
import GoalTracker from '@/components/GoalTracker';
import HydrationTracker from '@/components/HydrationTracker';
import QuickNotes from '@/components/QuickNotes';
import StudyBarChart from '@/components/StudyBarChart';
import { getDashboardData } from '@/lib/dashboard-data';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const {
    subjects,
    todayExams,
    todayTotalMinutes,
    weekTotalMinutes,
    lifetimeMinutes,
    weeklySeries,
  } = await getDashboardData();

  return (
    <div className="space-y-5">
      <section className="ui-card p-6">
        <p className="ui-eyebrow">Dashboard</p>
        <h2 className="ui-page-title mt-2">Přehled dne</h2>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="ui-card p-5">
          <div className="flex items-center gap-3">
            <Clock3 className="h-5 w-5 text-indigo-500" />
            <p className="ui-metric-label">Dnes odstudováno</p>
          </div>
          <p className="ui-metric-value mt-4">
            {Math.floor(todayTotalMinutes / 60)}h {todayTotalMinutes % 60}m
          </p>
        </div>

        <div className="ui-card p-5">
          <div className="flex items-center gap-3">
            <CalendarRange className="h-5 w-5 text-indigo-500" />
            <p className="ui-metric-label">Týden celkem</p>
          </div>
          <p className="ui-metric-value mt-4">
            {Math.floor(weekTotalMinutes / 60)}h {weekTotalMinutes % 60}m
          </p>
        </div>

        <div className="ui-card p-5">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-indigo-500" />
            <p className="ui-metric-label">Celkem</p>
          </div>
          <p className="ui-metric-value mt-4">
            {Math.floor(lifetimeMinutes / 60)}h {lifetimeMinutes % 60}m
          </p>
        </div>
      </section>

      <section className="grid items-start gap-5 xl:grid-cols-[260px,1fr]">
        <div className="space-y-5">
          <FocusTimer subjects={subjects} />
          <GoalTracker todayMinutes={todayTotalMinutes} />
          <HydrationTracker />
        </div>

        <div className="space-y-5">
          <StudyBarChart
            title="Studium za posledních 7 dní"
            description="Přehled aktivity po dnech."
            items={weeklySeries}
          />

          <div className="ui-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="ui-section-title">Dnešní termíny</h3>
            </div>

            {todayExams.length === 0 ? (
              <p className="ui-text-secondary">Dnes nemáš žádný aktivní termín.</p>
            ) : (
              <div className="space-y-3">
                {todayExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="h-11 w-1.5 rounded-full"
                        style={{ backgroundColor: exam.subject?.color ?? '#6366f1' }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-lg font-semibold">
                          {exam.subject?.name ?? 'Bez předmětu'}
                        </p>
                        <p className="ui-text-secondary">
                          {new Date(exam.date).toLocaleString('cs-CZ')} · {exam.duration} min
                        </p>
                      </div>
                      <span className="ui-badge bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {exam.type === 'confirmed' ? 'Potvrzeno' : 'Možné'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <QuickNotes />
        </div>
      </section>
    </div>
  );
}