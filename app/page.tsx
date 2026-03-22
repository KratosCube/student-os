import Link from 'next/link';
import { Clock3, GraduationCap, CalendarRange, ArrowRight } from 'lucide-react';

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
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">
              Dashboard
            </p>
            <h2 className="mt-2 text-3xl font-bold">Přehled dne</h2>
            <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">
              Tohle je první smysluplná obrazovka: rychlý přehled, co mě dnes čeká,
              kolik jsem se učil a kam se můžu prokliknout dál.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/planner"
              className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Otevřít Planner
            </Link>
            <Link
              href="/stats"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Statistiky
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <Clock3 className="h-5 w-5 text-indigo-500" />
            <p className="text-sm font-semibold">Dnes odstudováno</p>
          </div>
          <p className="mt-4 text-3xl font-bold">
            {Math.floor(todayTotalMinutes / 60)}h {todayTotalMinutes % 60}m
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <CalendarRange className="h-5 w-5 text-indigo-500" />
            <p className="text-sm font-semibold">Týden celkem</p>
          </div>
          <p className="mt-4 text-3xl font-bold">
            {Math.floor(weekTotalMinutes / 60)}h {weekTotalMinutes % 60}m
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-indigo-500" />
            <p className="text-sm font-semibold">Celkem</p>
          </div>
          <p className="mt-4 text-3xl font-bold">
            {Math.floor(lifetimeMinutes / 60)}h {lifetimeMinutes % 60}m
          </p>
        </div>
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-1">
          <FocusTimer subjects={subjects} />
          <GoalTracker todayMinutes={todayTotalMinutes} />
          <HydrationTracker />
        </div>

        <div className="space-y-6 xl:col-span-2">
          <StudyBarChart
            title="Studium za posledních 7 dní"
            description="Vlastní vykreslovaná komponenta grafu bez cizí knihovny."
            items={weeklySeries}
          />

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Dnešní termíny</h3>
              <Link
                href="/planner"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Spravovat termíny
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {todayExams.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Dnes nemáš žádný aktivní termín.
              </p>
            ) : (
              <div className="space-y-3">
                {todayExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
                  >
                    <div
                      className="h-10 w-2 rounded-full"
                      style={{ backgroundColor: exam.subject?.color ?? '#6366f1' }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{exam.subject?.name ?? 'Bez předmětu'}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(exam.date).toLocaleString('cs-CZ')} · {exam.duration} min
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-slate-800">
                      {exam.type === 'confirmed' ? 'Potvrzeno' : 'Možná'}
                    </span>
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