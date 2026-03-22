'use client';

import { useActionState, useEffect, useRef } from 'react';
import { addStudySessionAction } from '@/app/actions';
import { INITIAL_FORM_STATE } from '@/lib/form-state';
type Subject = {
  id: number;
  name: string;
};

function nowAsDatetimeLocal() {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

export default function StudySessionForm({
  subjects,
}: {
  subjects: Subject[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    addStudySessionAction,
    INITIAL_FORM_STATE,
  );

  useEffect(() => {
    if (!state.success) return;
    formRef.current?.reset();
  }, [state.success]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-xl font-bold">Ruční záznam studia</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Hodí se pro doplnění starších session a působí dobře i při prezentaci.
      </p>

      <form ref={formRef} action={formAction} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold">Předmět</label>
          <select
            name="subjectId"
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
            defaultValue=""
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
          <label className="mb-1 block text-sm font-semibold">Délka (min)</label>
          <input
            name="duration"
            type="number"
            min={5}
            max={600}
            defaultValue={45}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />
          {state.errors.duration ? (
            <p className="mt-1 text-sm text-rose-500">{state.errors.duration}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">Datum a čas</label>
          <input
            name="createdAt"
            type="datetime-local"
            defaultValue={nowAsDatetimeLocal()}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
          />
          {state.errors.createdAt ? (
            <p className="mt-1 text-sm text-rose-500">{state.errors.createdAt}</p>
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

        <button
          disabled={isPending}
          type="submit"
          className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          Uložit session
        </button>
      </form>
    </div>
  );
}