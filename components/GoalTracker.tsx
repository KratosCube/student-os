'use client';

import { useEffect, useState } from 'react';
import { Award, Settings, Save } from 'lucide-react';

export default function GoalTracker({ todayMinutes }: { todayMinutes: number }) {
  const [goalHours, setGoalHours] = useState(4);
  const [minutesPerCredit, setMinutesPerCredit] = useState(45);

  const [showSettings, setShowSettings] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedGoal = localStorage.getItem('userGoalHours');
    const savedRatio = localStorage.getItem('userRewardRatio');

    if (savedGoal) setGoalHours(parseFloat(savedGoal));
    if (savedRatio) setMinutesPerCredit(parseInt(savedRatio));
    setIsMounted(true);
  }, []);

  const saveSettings = () => {
    localStorage.setItem('userGoalHours', goalHours.toString());
    localStorage.setItem('userRewardRatio', minutesPerCredit.toString());
    setShowSettings(false);
  };

  if (!isMounted) return null;

  const goalMinutes = goalHours * 60;
  const progressPercent = Math.min((todayMinutes / goalMinutes) * 100, 100);
  const credits = Math.floor(todayMinutes / minutesPerCredit);
  const minutesToNext =
    todayMinutes === 0
      ? minutesPerCredit
      : minutesPerCredit - (todayMinutes % minutesPerCredit || minutesPerCredit);

  const hours = Math.floor(todayMinutes / 60);
  const minutes = todayMinutes % 60;

  return (
    <div className="ui-card p-5">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-400" />
          <h3 className="ui-card-title">Denní progress</h3>
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-slate-400 transition-colors hover:text-indigo-400"
          title="Nastavení cílů"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {showSettings ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="space-y-4">
            <div>
              <label className="ui-label">Denní cíl (hodiny)</label>
              <input
                type="number"
                min={1}
                max={24}
                value={goalHours}
                onChange={(e) => setGoalHours(Number(e.target.value))}
                className="ui-input"
              />
            </div>

            <div>
              <label className="ui-label">1 kredit za (minut)</label>
              <input
                type="number"
                min={5}
                max={600}
                value={minutesPerCredit}
                onChange={(e) => setMinutesPerCredit(Number(e.target.value))}
                className="ui-input"
              />
            </div>

            <button onClick={saveSettings} className="ui-btn-primary w-full">
              <Save className="mr-2 h-4 w-4" />
              Uložit
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="ui-text-helper">Dnes</p>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {hours}h {minutes}m
              </p>
            </div>

            <div className="text-right">
              <p className="ui-text-helper">Cíl</p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {goalHours}h
              </p>
            </div>
          </div>

          <div className="mb-5">
            <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex min-h-[162px] flex-col justify-between rounded-xl border border-amber-200/70 bg-amber-50/70 p-4 dark:border-amber-900/40 dark:bg-amber-900/10">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-300">
                  Kredity
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-amber-800 dark:text-amber-200">
                  {credits}
                </p>
              </div>

              <p className="text-sm leading-5 text-amber-700/80 dark:text-amber-300/80">
                Dnešní odměny
              </p>
            </div>

            <div className="flex min-h-[162px] flex-col justify-between rounded-xl border border-indigo-200/70 bg-indigo-50/70 p-4 dark:border-indigo-900/40 dark:bg-indigo-900/10">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                  Další za
                </p>

                <div className="mt-2 flex items-baseline gap-1 whitespace-nowrap">
                  <span className="text-3xl font-bold tracking-tight text-indigo-800 dark:text-indigo-200">
                    {minutesToNext}
                  </span>
                  <span className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                    m
                  </span>
                </div>
              </div>

              <p className="text-sm leading-5 text-indigo-700/80 dark:text-indigo-300/80">
                Do dalšího kreditu
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}