'use client';

import { useState, useEffect } from 'react';
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

    const updateWaterLevel = () => {
      const lastDrinkStr = localStorage.getItem('hydrationLastDrink');
      const currentIntervalMs = (savedInterval ? parseInt(savedInterval) : 60) * 60 * 1000;

      if (!lastDrinkStr) {
        localStorage.setItem('hydrationLastDrink', Date.now().toString());
        setProgress(100);
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
  }, [intervalMinutes]);

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

  if (!isMounted) return null;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
            <Droplets className="h-5 w-5 text-sky-500" />
            Voda
          </h3>
          {!showSettings && (
            <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">
              Dnes:{' '}
              <span className="font-bold text-sky-600 dark:text-sky-400">
                {totalMl} ml
              </span>
            </p>
          )}
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-1 text-slate-300 transition-colors hover:text-sky-500 dark:text-slate-600 dark:hover:text-sky-400"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {showSettings ? (
        <div className="mt-5 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-400 dark:text-slate-500">
              Interval (minuty)
            </label>
            <input
              type="number"
              value={intervalMinutes}
              onChange={(e) => setIntervalMinutes(parseInt(e.target.value) || 1)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-slate-400 dark:text-slate-500">
              Velikost sklenice (ml)
            </label>
            <input
              type="number"
              value={glassSize}
              onChange={(e) => setGlassSize(parseInt(e.target.value) || 0)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>

          <button
            onClick={saveSettings}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-2 text-sm font-bold text-white transition-colors hover:bg-sky-600"
          >
            <Save className="h-4 w-4" />
            Uložit
          </button>
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center">
          <div className="relative mb-5 h-28 w-20 overflow-hidden rounded-b-3xl rounded-t-lg border-2 border-slate-200 bg-slate-100 shadow-inner dark:border-slate-600 dark:bg-slate-700/50">
            <div
              className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-sky-600 to-sky-400 transition-all duration-1000 ease-linear"
              style={{ height: `${progress}%` }}
            >
              <div className="absolute -top-3 left-[-50%] h-6 w-[200%] rounded-[50%] bg-white/30 animate-wave" />
              <div
                className="absolute -top-3 left-[-50%] h-6 w-[200%] rounded-[50%] bg-sky-400/50 animate-wave-slow"
                style={{ top: '-5px' }}
              />
            </div>

            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
              <span
                className={`text-sm font-bold ${
                  progress > 50
                    ? 'text-white drop-shadow-md'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {isEmpty ? '0%' : `${Math.round(progress)}%`}
              </span>
            </div>
          </div>

          <button
            onClick={handleDrink}
            className={`w-full rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              isEmpty
                ? 'bg-rose-500 text-white hover:bg-rose-600 animate-pulse'
                : 'border border-sky-200 bg-sky-50 text-sky-600 hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-900/30 dark:text-sky-400 dark:hover:bg-sky-900/50'
            }`}
            title={`Přičíst ${glassSize} ml`}
          >
            {isEmpty ? 'NAPÍT SE!' : `${glassSize} ml`}
            {!isEmpty && <Plus className="h-3 w-3" />}
          </button>
        </div>
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