'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { logStudySession } from '@/app/actions';

type Subject = {
  id: number;
  name: string;
  color: string;
};

export default function FocusTimer({ subjects }: { subjects: Subject[] }) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. NAČTENÍ PŘI STARTU
  useEffect(() => {
    audioRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    
    // Načtení z localStorage
    const savedSubject = localStorage.getItem('timerSubject');
    if (savedSubject) setSelectedSubjectId(savedSubject);

    // Pokud běžel časovač, dopočítáme rozdíl
    const savedTarget = localStorage.getItem('timerTarget');
    if (savedTarget) {
      const targetTime = parseInt(savedTarget, 10);
      const now = Date.now();
      const diff = Math.ceil((targetTime - now) / 1000);

      if (diff > 0) {
        setTimeLeft(diff);
        setIsActive(true);
      } else {
        localStorage.removeItem('timerTarget');
        setTimeLeft(0);
        // Tady nespouštíme finishTimer hned, aby se nezacyklil render,
        // necháme to na efektu níže (bod 3)
      }
    }
  }, []);

  // 2. TIKÁNÍ (Jen odečítá čas, nic jiného nedělá)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // 3. DETEKCE KONCE (Tohle je ta oprava!)
  // Tento efekt čeká, až se timeLeft změní. Pokud je 0 a bylo to aktivní, ukončí to.
  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      finishTimer();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isActive]); 


  // Funkce pro dokončení
  const finishTimer = async () => {
    setIsActive(false); // Zastavíme
    localStorage.removeItem('timerTarget');
    
    // Pípnutí 🔔
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio chyba", e));
    }

    // Uložení do DB (Server Action)
    if (mode === 'work' && selectedSubjectId) {
      try {
        await logStudySession(parseInt(selectedSubjectId), 25);
      } catch (err) {
        console.error("Chyba při ukládání:", err);
      }
    }

    alert(mode === 'work' ? "Hotovo! 🥳 Dej si pauzu." : "Pauza končí! 🚀 Zpátky do práce.");
    
    // Reset pro další kolo
    resetTimer(false); 
  };

  const toggleTimer = () => {
    if (!isActive) {
      const target = Date.now() + timeLeft * 1000;
      localStorage.setItem('timerTarget', target.toString());
      localStorage.setItem('timerSubject', selectedSubjectId);
      setIsActive(true);
    } else {
      localStorage.removeItem('timerTarget');
      setIsActive(false);
    }
  };

  const resetTimer = (stop = true) => {
    if (stop) {
      setIsActive(false);
      localStorage.removeItem('timerTarget');
    }
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchMode = () => {
    const newMode = mode === 'work' ? 'break' : 'work';
    setMode(newMode);
    setIsActive(false);
    localStorage.removeItem('timerTarget');
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`p-6 rounded-2xl shadow-sm border transition-colors ${
      mode === 'work' ? 'bg-white border-indigo-100' : 'bg-emerald-50 border-emerald-100'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
          {mode === 'work' ? '🧠 Focus Mode' : '☕ Pauza'}
        </h3>
        <button onClick={switchMode} className="text-xs px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium">
          {mode === 'work' ? 'Přepnout na Pauzu' : 'Přepnout na Práci'}
        </button>
      </div>

      {mode === 'work' && (
        <div className="mb-6">
          <select 
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isActive}
          >
            <option value="">-- Vyber předmět --</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="text-6xl font-mono font-bold text-center mb-8 text-slate-800 tracking-tighter">
        {formatTime(timeLeft)}
      </div>

      <div className="flex justify-center gap-4">
        <button 
          onClick={toggleTimer}
          disabled={mode === 'work' && !selectedSubjectId && !isActive}
          className={`px-8 py-3 rounded-xl text-white font-bold text-lg shadow-lg transition-transform active:scale-95 flex items-center gap-2 ${
            isActive ? 'bg-amber-500 hover:bg-amber-600' : 
            (!selectedSubjectId && mode === 'work') ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isActive ? <><Pause size={20}/> Pauza</> : <><Play size={20}/> Start</>}
        </button>
        
        <button 
          onClick={() => resetTimer(true)}
          className="p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <RotateCcw size={24} />
        </button>
      </div>

      {!selectedSubjectId && mode === 'work' && (
        <p className="text-center text-xs text-rose-500 mt-4 font-medium">
          ⚠️ Vyber předmět pro start.
        </p>
      )}
    </div>
  );
}