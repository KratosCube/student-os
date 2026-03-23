'use client';

import { useEffect, useMemo, useState } from 'react';
import { Droplets, Settings, Save, Plus } from 'lucide-react';

export default function HydrationTracker() {
  const [progress, setProgress] = useState(100);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [totalMl, setTotalMl] = useState(0);

  const [showSettings, setShowSettings] = useState(false);
  const [intervalMinutes, setIntervalMinutes] = useState(60);
  const [glassSize, setGlassSize] = useState(250);

  useEffect(() => {
    setIsMounted(true);

    const savedInterval = localStorage.getItem('hydrationInterval');
    const savedGlassSize = localStorage.getItem('hydrationGlassSize');
    const savedTotalMl = localStorage.getItem('hydrationTotalMl');
    const savedDate = localStorage.getItem('hydrationDate');

    if (savedInterval) setIntervalMinutes(parseInt(savedInterval));
    if (savedGlassSize) setGlassSize(parseInt(savedGlassSize));

    const todayStr = new Date().toDateString();
    if (savedDate !== todayStr) {
      setTotalMl(0);
      localStorage.setItem('hydrationDate', todayStr);
      localStorage.setItem('hydrationTotalMl', '0');
    } else if (savedTotalMl) {
      setTotalMl(parseInt(savedTotalMl));
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const updateWaterLevel = () => {
      const lastDrinkStr = localStorage.getItem('hydrationLastDrink');
      const currentIntervalMs = intervalMinutes * 60 * 1000;

      if (!lastDrinkStr) {
        localStorage.setItem('hydrationLastDrink', Date.now().toString());
        setProgress(100);
        setIsEmpty(false);
        return;
      }

      const lastDrink = parseInt(lastDrinkStr);
      const now = Date.now();
      const diff = now - lastDrink;

      if (diff >= currentIntervalMs) {
        setProgress(0);
        setIsEmpty(true);
      } else {
        const percentage = 100 - (diff / currentIntervalMs) * 100;
        setProgress(Math.max(0, percentage));
        setIsEmpty(false);
      }
    };

    updateWaterLevel();
    const intervalId = setInterval(updateWaterLevel, 1000);

    return () => clearInterval(intervalId);
  }, [intervalMinutes, isMounted]);

  const handleDrink = () => {
    localStorage.setItem('hydrationLastDrink', Date.now().toString());

    const newTotal = totalMl + glassSize;
    setTotalMl(newTotal);

    localStorage.setItem('hydrationTotalMl', newTotal.toString());
    localStorage.setItem('hydrationDate', new Date().toDateString());

    setProgress(100);
    setIsEmpty(false);
  };

  const saveSettings = () => {
    localStorage.setItem('hydrationInterval', intervalMinutes.toString());
    localStorage.setItem('hydrationGlassSize', glassSize.toString());
    setShowSettings(false);

    localStorage.setItem('hydrationLastDrink', Date.now().toString());
    setProgress(100);
    setIsEmpty(false);
  };

  const remainingMinutes = useMemo(() => {
    const total = intervalMinutes;
    const left = Math.round((progress / 100) * total);
    return Math.max(0, left);
  }, [progress, intervalMinutes]);

  if (!isMounted) return null;

  return (
    <div className="ui-card p-5">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-sky-500" />
          <h3 className="ui-card-title">Voda</h3>
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-slate-400 transition-colors hover:text-sky-500 dark:hover:text-sky-400"
          title="Nastavení pitného režimu"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {showSettings ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="space-y-4">
            <div>
              <label className="ui-label">Interval (minuty)</label>
              <input
                type="number"
                min={5}
                max={240}
                value={intervalMinutes}
                onChange={(e) => setIntervalMinutes(parseInt(e.target.value) || 1)}
                className="ui-input"
              />
            </div>

            <div>
              <label className="ui-label">Velikost sklenice (ml)</label>
              <input
                type="number"
                min={50}
                max={1000}
                value={glassSize}
                onChange={(e) => setGlassSize(parseInt(e.target.value) || 0)}
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
                {totalMl} ml
              </p>
            </div>

            <div className="text-right">
              <p className="ui-text-helper">Další připomenutí</p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {remainingMinutes} min
              </p>
            </div>
          </div>

          <div className="mb-5 flex flex-col items-center">
            <div className="relative h-32 w-24 overflow-hidden rounded-b-[26px] rounded-t-xl border-2 border-slate-300 bg-slate-100 shadow-inner dark:border-slate-600 dark:bg-slate-700/50">
              <div
                className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-sky-600 to-sky-400 transition-all duration-1000 ease-linear"
                style={{ height: `${progress}%` }}
              >
                <div className="animate-wave absolute -top-3 left-[-50%] h-6 w-[200%] rounded-[50%] bg-white/30" />
                <div
                  className="animate-wave-slow absolute -top-3 left-[-50%] h-6 w-[200%] rounded-[50%] bg-sky-400/50"
                  style={{ top: '-5px' }}
                />
              </div>

              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <span
                  className={`text-sm font-bold ${
                    progress > 50
                      ? 'text-white drop-shadow-md'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {isEmpty ? '0%' : `${Math.round(progress)}%`}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleDrink}
            className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              isEmpty
                ? 'bg-rose-500 text-white hover:bg-rose-600 animate-pulse'
                : 'border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-900/30 dark:text-sky-400 dark:hover:bg-sky-900/50'
            }`}
            title={`Přičíst ${glassSize} ml`}
          >
            {isEmpty ? 'NAPÍT SE!' : `${glassSize} ml`}
            {!isEmpty && <Plus className="h-4 w-4" />}
          </button>
        </>
      )}

      <style jsx>{`
        @keyframes wave {
          0% {
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(-25%) rotate(5deg);
          }
          100% {
            transform: translateX(0) rotate(0deg);
          }
        }

        @keyframes wave-slow {
          0% {
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(25%) rotate(-5deg);
          }
          100% {
            transform: translateX(0) rotate(0deg);
          }
        }

        .animate-wave {
          animation: wave 4s infinite ease-in-out;
        }

        .animate-wave-slow {
          animation: wave-slow 6s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}