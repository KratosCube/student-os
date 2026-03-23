'use client';

import { useActionState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { addSubjectAction, updateSubjectAction } from '@/app/actions';
import { INITIAL_FORM_STATE } from '@/lib/form-state';

const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#0ea5e9', '#f59e0b', '#8b5cf6'];

type Subject = {
  id: number;
  name: string;
  color: string;
};

export default function SubjectForm({
  selectedSubject,
}: {
  selectedSubject: Subject | null;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const action = useMemo(
    () => (selectedSubject ? updateSubjectAction : addSubjectAction),
    [selectedSubject],
  );

  const [state, formAction, isPending] = useActionState(action, INITIAL_FORM_STATE);

  useEffect(() => {
    if (!state.success) return;

    if (selectedSubject) {
      router.push('/subjects');
      return;
    }

    formRef.current?.reset();
    router.refresh();
  }, [state.success, selectedSubject, router]);

  return (
    <div className="ui-card h-fit p-6">
      <h3 className="ui-section-title">
        {selectedSubject ? 'Upravit předmět' : 'Přidat předmět'}
      </h3>

      <form ref={formRef} action={formAction} className="mt-6 space-y-4">
        {selectedSubject ? (
          <input type="hidden" name="subjectId" value={selectedSubject.id} />
        ) : null}

        <div>
          <label className="ui-label">Název</label>
          <input
            name="name"
            defaultValue={selectedSubject?.name ?? ''}
            className="ui-input"
            placeholder="Např. Algoritmy"
          />
          {state.errors.name ? (
            <p className="mt-2 text-sm font-medium text-rose-400">
              {state.errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label className="ui-label">Barva</label>
          <div className="flex flex-wrap gap-3">
            {COLORS.map((color) => (
              <label key={color} className="cursor-pointer">
                <input
                  className="sr-only"
                  type="radio"
                  name="color"
                  value={color}
                  defaultChecked={(selectedSubject?.color ?? '#6366f1') === color}
                />
                <span
                  className="block h-10 w-10 rounded-full border-4 border-white shadow ring-1 ring-slate-300 dark:ring-slate-700"
                  style={{ backgroundColor: color }}
                />
              </label>
            ))}
          </div>
          {state.errors.color ? (
            <p className="mt-2 text-sm font-medium text-rose-400">
              {state.errors.color}
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
            {selectedSubject ? 'Uložit změny' : 'Přidat předmět'}
          </button>

          {selectedSubject ? (
            <Link href="/subjects" className="ui-btn-secondary">
              Zrušit editaci
            </Link>
          ) : null}
        </div>
      </form>
    </div>
  );
}