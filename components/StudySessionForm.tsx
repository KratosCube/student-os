'use client';

import { useActionState, useEffect, useMemo, useRef, useState } from 'react';
import { addStudySessionAction } from '@/app/actions';
import { INITIAL_FORM_STATE } from '@/lib/form-state';

type Subject = {
  id: number;
  name: string;
};

function nowAsParts() {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60_000;
  const local = new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 16);
  const [datePart, timePart] = local.split('T');

  return {
    datePart: datePart ?? '',
    timePart: timePart ?? '',
  };
}

export default function StudySessionForm({
  subjects,
}: {
  subjects: Subject[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const initialNow = useMemo(() => nowAsParts(), []);
  const [datePart, setDatePart] = useState(initialNow.datePart);
  const [timePart, setTimePart] = useState(initialNow.timePart);

  const [state, formAction, isPending] = useActionState(
    addStudySessionAction,
    INITIAL_FORM_STATE,
  );

  useEffect(() => {
    if (!state.success) return;

    formRef.current?.reset();
    const nextNow = nowAsParts();
    setDatePart(nextNow.datePart);
    setTimePart(nextNow.timePart);
  }, [state.success]);

  const combinedDateTime =
    datePart && timePart ? `${datePart}T${timePart}` : '';

  return (
    <div className="ui-card h-fit p-6">
      <h3 className="ui-section-title">Ruční záznam studia</h3>

      <form ref={formRef} action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="createdAt" value={combinedDateTime} readOnly />

        <div>
          <label className="ui-label">Předmět</label>
          <select name="subjectId" className="ui-select" defaultValue="">
            <option value="">Vyber předmět</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {state.errors.subjectId ? (
            <p className="mt-2 text-sm font-medium text-rose-400">
              {state.errors.subjectId}
            </p>
          ) : null}
        </div>

        <div>
          <label className="ui-label">Délka (min)</label>
          <input
            name="duration"
            type="number"
            min={5}
            max={600}
            defaultValue={45}
            className="ui-input"
          />
          {state.errors.duration ? (
            <p className="mt-2 text-sm font-medium text-rose-400">
              {state.errors.duration}
            </p>
          ) : null}
        </div>

        <div>
          <label className="ui-label">Datum</label>
          <input
            type="date"
            value={datePart}
            onChange={(e) => setDatePart(e.target.value)}
            className="ui-input"
          />
        </div>

        <div>
          <label className="ui-label">Čas</label>
          <input
            type="time"
            step={60}
            value={timePart}
            onChange={(e) => setTimePart(e.target.value)}
            className="ui-input"
          />
          {state.errors.createdAt ? (
            <p className="mt-2 text-sm font-medium text-rose-400">
              {state.errors.createdAt}
            </p>
          ) : null}
        </div>

        {state.message ? (
          <p
            className={`rounded-2xl px-4 py-3 text-sm ${
              state.success
                ? 'bg-emerald-900/20 text-emerald-300'
                : 'bg-rose-900/20 text-rose-300'
            }`}
          >
            {state.message}
          </p>
        ) : null}

        <button disabled={isPending} type="submit" className="ui-btn-primary">
          Uložit session
        </button>
      </form>
    </div>
  );
}