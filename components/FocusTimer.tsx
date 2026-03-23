'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';
import { logStudySession } from '@/app/actions';

type Subject = {
  id: number;
  name: string;
  color: string;
};

export default function FocusTimer({ subjects }: { subjects: Subject[] }) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');

    const savedSubject = localStorage.getItem('timerSubject');
    if (savedSubject) setSelectedSubjectId(savedSubject);

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
        setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
      }
    }
  }, [mode]);

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

  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      void finishTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isActive]);

  const finishTimer = async () => {
    setIsActive(false);
    localStorage.removeItem('timerTarget');

    if (audioRef.current) {
      audioRef.current.play().catch(() => undefined);
    }

    if (mode === 'work' && selectedSubjectId) {
      try {
        await logStudySession(parseInt(selectedSubjectId), 25);
      } catch (err) {
        console.error('Chyba při ukládání session:', err);
      }
    }

    alert(mode === 'work' ? 'Hotovo! Dej si pauzu.' : 'Pauza končí. Zpátky do práce.');
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
    <div
      className={`ui-card p-5 ${
        mode === 'break'
          ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-900/20'
          : ''
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-indigo-500" />
          <h3 className="ui-card-title">
            {mode === 'work' ? 'Focus Mode' : 'Pauza'}
          </h3>
        </div>

        <button onClick={switchMode} className="ui-btn-small ui-btn-secondary px-3 text-xs">
          {mode === 'work' ? 'Pauza' : 'Práce'}
        </button>
      </div>

      {mode === 'work' && (
        <div className="mb-5">
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="ui-select"
            disabled={isActive}
          >
            <option value="">Vyber předmět</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-6 text-center">
        <div className="text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={toggleTimer}
          disabled={mode === 'work' && !selectedSubjectId && !isActive}
          className={`inline-flex h-12 min-w-[128px] items-center justify-center gap-2 rounded-xl px-5 text-lg font-semibold transition-colors ${
            isActive
              ? 'bg-amber-500 text-white hover:bg-amber-600'
              : !selectedSubjectId && mode === 'work'
              ? 'cursor-not-allowed bg-slate-300 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="h-5 w-5" />
              Pauza
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              Start
            </>
          )}
        </button>

        <button
          onClick={() => resetTimer(true)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          aria-label="Resetovat timer"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>

      {mode === 'work' && !selectedSubjectId && (
        <p className="mt-4 text-center text-sm font-medium text-amber-600 dark:text-rose-400">
          Vyber předmět pro start.
        </p>
      )}
    </div>
  );
}