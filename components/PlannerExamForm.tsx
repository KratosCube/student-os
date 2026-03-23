'use client';

import { useActionState, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

import { addExamAction, updateExamAction } from '@/app/actions';
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

function splitDateTimeValue(date: Date | string | null | undefined) {
  if (!date) {
    return { datePart: '', hourPart: '08', minutePart: '00' };
  }

  const value = new Date(date);
  const timezoneOffset = value.getTimezoneOffset() * 60_000;
  const local = new Date(value.getTime() - timezoneOffset).toISOString().slice(0, 16);
  const [datePart, timePart] = local.split('T');
  const [hourPart, minutePart] = (timePart ?? '08:00').split(':');

  return {
    datePart: datePart ?? '',
    hourPart: hourPart ?? '08',
    minutePart: minutePart ?? '00',
  };
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

export default function PlannerExamForm({
  subjects,
  selectedExam,
}: {
  subjects: Subject[];
  selectedExam: ExamWithSubject | null;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const initialParts = useMemo(
    () => splitDateTimeValue(selectedExam?.date),
    [selectedExam],
  );

  const [datePart, setDatePart] = useState(initialParts.datePart);
  const [hourPart, setHourPart] = useState(initialParts.hourPart);
  const [minutePart, setMinutePart] = useState(initialParts.minutePart);

  useEffect(() => {
    setDatePart(initialParts.datePart);
    setHourPart(initialParts.hourPart);
    setMinutePart(initialParts.minutePart);
  }, [initialParts]);

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
    setDatePart('');
    setHourPart('08');
    setMinutePart('00');
    router.refresh();
  }, [state.success, selectedExam, router]);

  const combinedDateTime =
    datePart && hourPart && minutePart ? `${datePart}T${hourPart}:${minutePart}` : '';

  return (
    <div className="ui-card h-fit p-6">
      <div className="mb-6">
        <h3 className="ui-section-title">
          {selectedExam ? 'Upravit termín' : 'Přidat nový termín'}
        </h3>
      </div>

      <form ref={formRef} action={formAction} className="space-y-4">
        {selectedExam ? <input type="hidden" name="examId" value={selectedExam.id} /> : null}
        <input type="hidden" name="date" value={combinedDateTime} readOnly />

        <div>
          <label className="ui-label">Předmět</label>
          <div className="relative">
            <select
              name="subjectId"
              defaultValue={selectedExam?.subjectId ?? ''}
              className="ui-select appearance-none pr-10"
            >
              <option value="">Vyber předmět</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
          {state.errors.subjectId ? (
            <p className="mt-2 text-sm font-medium text-rose-400">
              {state.errors.subjectId}
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
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <select
                value={hourPart}
                onChange={(e) => setHourPart(e.target.value)}
                className="ui-select appearance-none pr-10"
              >
                {HOURS.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="relative">
              <select
                value={minutePart}
                onChange={(e) => setMinutePart(e.target.value)}
                className="ui-select appearance-none pr-10"
              >
                {MINUTES.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {state.errors.date ? (
            <p className="mt-2 text-sm font-medium text-rose-400">
              {state.errors.date}
            </p>
          ) : null}
        </div>

        <div>
          <label className="ui-label">Typ termínu</label>
          <div className="relative">
            <select
              name="type"
              defaultValue={selectedExam?.type ?? 'confirmed'}
              className="ui-select appearance-none pr-10"
            >
              <option value="confirmed">Potvrzený</option>
              <option value="potential">Možný</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div>
          <label className="ui-label">Délka (min)</label>
          <input
            name="duration"
            type="number"
            min={15}
            max={480}
            step={15}
            defaultValue={selectedExam?.duration ?? 90}
            className="ui-input"
          />
          {state.errors.duration ? (
            <p className="mt-2 text-sm font-medium text-rose-400">
              {state.errors.duration}
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

        <div className="flex gap-3">
          <button disabled={isPending} type="submit" className="ui-btn-primary">
            {selectedExam ? 'Uložit změny' : 'Přidat termín'}
          </button>

          {selectedExam ? (
            <Link href="/planner" className="ui-btn-secondary">
              Zrušit editaci
            </Link>
          ) : null}
        </div>
      </form>
    </div>
  );
}