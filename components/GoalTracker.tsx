'use client';

import { useState, useEffect } from 'react';
import { Trophy, Beer, Gamepad2, Settings, X, Save } from 'lucide-react';

export default function GoalTracker({ todayMinutes }: { todayMinutes: number }) {
  // Výchozí hodnoty (když uživatel nic nenastaví)
  const [goalHours, setGoalHours] = useState(4);
  const [minutesPerCredit, setMinutesPerCredit] = useState(45);
  
  const [showSettings, setShowSettings] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Načtení nastavení z prohlížeče
  useEffect(() => {
    const savedGoal = localStorage.getItem('userGoalHours');
    const savedRatio = localStorage.getItem('userRewardRatio');
    if (savedGoal) setGoalHours(parseFloat(savedGoal));
    if (savedRatio) setMinutesPerCredit(parseInt(savedRatio));
    setIsMounted(true);
  }, []);

  // Uložení nastavení
  const saveSettings = () => {
    localStorage.setItem('userGoalHours', goalHours.toString());
    localStorage.setItem('userRewardRatio', minutesPerCredit.toString());
    setShowSettings(false);
  };

  if (!isMounted) return null; // Prevence probliknutí

  // Výpočty
  const goalMinutes = goalHours * 60;
  const progressPercent = Math.min((todayMinutes / goalMinutes) * 100, 100);
  const credits = Math.floor(todayMinutes / minutesPerCredit);
  const minutesToNext = minutesPerCredit - (todayMinutes % minutesPerCredit);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group">
      
      {/* Hlavička */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Denní progress
        </h3>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="text-slate-300 hover:text-indigo-600 transition-colors"
          title="Nastavení cílů"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Nastavení (Modal uvnitř karty) */}
      {showSettings ? (
        <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-200 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Denní cíl (hodiny)</label>
              <input 
                type="number" 
                value={goalHours}
                onChange={(e) => setGoalHours(Number(e.target.value))}
                className="w-full mt-1 p-2 rounded border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">1 Kredit za (minut)</label>
              <input 
                type="number" 
                value={minutesPerCredit}
                onChange={(e) => setMinutesPerCredit(Number(e.target.value))}
                className="w-full mt-1 p-2 rounded border border-slate-200 text-sm"
              />
            </div>
            <button 
              onClick={saveSettings}
              className="w-full bg-indigo-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <Save className="w-3 h-3" /> Uložit
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
              <span>{Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m</span>
              <span>Cíl: {goalHours}h</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-100">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            {progressPercent >= 100 && (
              <p className="text-center text-xs text-emerald-600 font-bold mt-2">🎉 Denní cíl splněn! Jsi stroj!</p>
            )}
          </div>

          {/* Odměny */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 text-center relative overflow-hidden">
              <Beer className="w-5 h-5 mx-auto text-amber-500 mb-1" />
              <div className="text-2xl font-bold text-amber-700">{credits}</div>
              <div className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Kreditů</div>
            </div>

            <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100 text-center flex flex-col justify-center items-center">
              <div className="text-xs text-indigo-400 font-medium mb-1">Další za</div>
              <div className="text-xl font-bold text-indigo-700">{minutesToNext} m</div>
              <div className="h-1 w-full bg-indigo-200 mt-2 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-500" style={{ width: `${((minutesPerCredit - minutesToNext) / minutesPerCredit) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}