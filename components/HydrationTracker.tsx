'use client';

import { useState, useEffect } from 'react';
import { Droplets, Check, Settings, Save, Plus } from 'lucide-react';

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
        const percentage = 100 - (diff / currentIntervalMs * 100);
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
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center relative overflow-hidden group h-full transition-colors">
      
      <div className="flex justify-between w-full mb-4 z-10 relative items-start">
        <div>
          <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-sky-500" />
            Voda
          </h3>
          {!showSettings && (
             <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">Dnes: <span className="text-sky-600 dark:text-sky-400 font-bold">{totalMl} ml</span></p>
          )}
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="text-slate-300 dark:text-slate-600 hover:text-sky-500 dark:hover:text-sky-400 transition-colors p-1"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {showSettings ? (
        <div className="w-full flex-1 flex flex-col justify-center animate-in fade-in space-y-3">
           <div>
             <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 block">Interval (minuty)</label>
             <input 
               type="number" 
               value={intervalMinutes}
               onChange={(e) => setIntervalMinutes(parseInt(e.target.value) || 1)}
               className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500"
             />
           </div>
           <div>
             <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 block">Velikost sklenice (ml)</label>
             <input 
               type="number" 
               value={glassSize}
               onChange={(e) => setGlassSize(parseInt(e.target.value) || 0)}
               className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500"
             />
           </div>
           <button 
             onClick={saveSettings}
             className="w-full bg-sky-500 text-white rounded-xl py-2 text-sm font-bold flex items-center justify-center gap-2 hover:bg-sky-600 transition-colors shadow-lg shadow-sky-100 dark:shadow-none"
           >
             <Save className="w-4 h-4" /> Uložit
           </button>
        </div>
      ) : (
        <>
          <div className="relative w-20 h-28 bg-slate-100 dark:bg-slate-700/50 rounded-b-3xl rounded-t-lg border-2 border-slate-200 dark:border-slate-600 overflow-hidden mb-4 shadow-inner">
            <div 
              className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-sky-600 to-sky-400 transition-all duration-1000 ease-linear z-0"
              style={{ height: `${progress}%` }}
            >
              <div className="absolute -top-3 left-[-50%] w-[200%] h-6 bg-white/30 rounded-[50%] animate-wave"></div>
              <div className="absolute -top-3 left-[-50%] w-[200%] h-6 bg-sky-400/50 rounded-[50%] animate-wave-slow" style={{top: '-5px'}}></div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none flex-col">
              <span className={`font-bold text-sm ${progress > 50 ? 'text-white drop-shadow-md' : 'text-slate-500 dark:text-slate-400'}`}>
                {isEmpty ? '0%' : `${Math.round(progress)}%`}
              </span>
            </div>
          </div>

          <button 
            onClick={handleDrink}
            className={`
              w-full py-2 rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 mt-auto
              ${isEmpty 
                ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse' 
                : 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/50 border border-sky-200 dark:border-sky-800'}
            `}
            title={`Přičíst ${glassSize} ml`}
          >
            {isEmpty ? 'NAPÍT SE!' : `${glassSize} ml`} 
            {!isEmpty && <Plus className="w-3 h-3" />}
          </button>
        </>
      )}
      
      <style jsx>{`
        @keyframes wave { 0% { transform: translateX(0) rotate(0deg); } 50% { transform: translateX(-25%) rotate(5deg); } 100% { transform: translateX(0) rotate(0deg); } }
        @keyframes wave-slow { 0% { transform: translateX(0) rotate(0deg); } 50% { transform: translateX(25%) rotate(-5deg); } 100% { transform: translateX(0) rotate(0deg); } }
        .animate-wave { animation: wave 4s infinite ease-in-out; }
        .animate-wave-slow { animation: wave-slow 6s infinite ease-in-out; }
      `}</style>
    </div>
  );
}