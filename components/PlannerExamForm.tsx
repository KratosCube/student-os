'use client';

import { useActionState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  addExamAction,
  updateExamAction,
} from '@/app/actions';
import { INITIAL_FORM_STATE } from '@/lib/form-state';
type Subject = {
  id: number;
  name: string;
};

type ExamWithSubject = {
  id: number;
  subjectId: number | null;
  date: Date | string;
  type: string;
  duration: number;
};

function toDatetimeLocalValue(date: Date | string | null | undefined) {
  if (!date) return '';

  const value = new Date(date);
  const timezoneOffset = value.getTimezoneOffset() * 60_000;
  return new Date(value.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

export default function PlannerExamForm({
  subjects,
  selectedExam,
}: {
  subjects: Subject[];
  selectedExam: ExamWithSubject | null;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const action = useMemo(
    () => (selectedExam ? updateExamAction : addExamAction),
    [selectedExam],
  );

  const [state, formAction, isPending] = useActionState(action, INITIAL_FORM_STATE);

  useEffect(() => {
    if (!state.success) return;

    if (selectedExam) {
      router.push('/planner');
      return;
    }

    formRef.current?.reset();
    router.refresh();
  }, [state.success, selectedExam, router]);

  return (
    <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6">
        <h3 className="text-xl font-bold">
          {selectedExam ? 'Upravit termín' : 'Přidat nový termín'}
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Formulář má plnou validaci a dává smysl jako samostatná pracovní plocha.
        </p>
      </div>

      <form ref={formRef} action={formAction} className="space-y-4">
        {selectedExam ? <input type="hidden" name="examId" value={selectedExam.id} /> : null}

        <div>
          <label className="mb-1 block text-sm font-semibold">Předmět</label>
          <select
            name="subjectId"
            defaultValue={selectedExam?.subjectId ?? ''}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="">Vyber předmět</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {state.errors.subjectId ? (
            <p className="mt-1 text-sm text-rose-500">{state.errors.subjectId}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">Datum a čas</label>
          <input
            name="date"
            type="datetime-local"
            defaultValue={toDatetimeLocalValue(selectedExam?.date)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />
          {state.errors.date ? (
            <p className="mt-1 text-sm text-rose-500">{state.errors.date}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">Typ termínu</label>
          <select
            name="type"
            defaultValue={selectedExam?.type ?? 'confirmed'}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="confirmed">Potvrzený</option>
            <option value="potential">Možný</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">Délka (min)</label>
          <input
            name="duration"
            type="number"
            min={15}
            max={480}
            step={15}
            defaultValue={selectedExam?.duration ?? 90}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />
          {state.errors.duration ? (
            <p className="mt-1 text-sm text-rose-500">{state.errors.duration}</p>
          ) : null}
        </div>

        {state.message ? (
          <p
            className={`rounded-2xl px-4 py-3 text-sm ${
              state.success
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
            }`}
          >
            {state.message}
          </p>
        ) : null}

        <div className="flex gap-3">
          <button
            disabled={isPending}
            type="submit"
            className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {selectedExam ? 'Uložit změny' : 'Přidat termín'}
          </button>

          {selectedExam ? (
            <Link
              href="/planner"
              className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Zrušit editaci
            </Link>
          ) : null}
        </div>
      </form>
    </div>
  );
}