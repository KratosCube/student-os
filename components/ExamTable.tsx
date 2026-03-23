import Link from 'next/link';
import { deleteExamAction, toggleExamAction } from '@/app/actions';

type Exam = {
  id: number;
  date: Date | string;
  type: string;
  duration: number;
  isDone: boolean;
  subject: {
    id: number;
    name: string;
    color: string;
  } | null;
};

function formatDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
}

function formatTime(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleTimeString('cs-CZ', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ExamTable({ exams }: { exams: Exam[] }) {
  return (
    <div className="ui-card w-full p-6">
      <div className="mb-5">
        <h3 className="ui-section-title">Tabulka termínů</h3>
      </div>

      {exams.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-400">
          Zatím nejsou žádné termíny.
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/60"
            >
              <div className="grid gap-4 md:grid-cols-[minmax(160px,1fr)_auto_64px_120px] md:items-center">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: exam.subject?.color ?? '#6366f1' }}
                    />
                    <span className="truncate text-base font-semibold text-slate-800 dark:text-slate-100">
                      {exam.subject?.name ?? 'Bez předmětu'}
                    </span>
                  </div>

                  <div className="mt-2 pl-6 text-sm leading-5 text-slate-500 dark:text-slate-400">
                    <div>{formatDate(exam.date)}</div>
                    <div>{formatTime(exam.date)}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="ui-badge bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {exam.type === 'confirmed' ? 'Potvrzeno' : 'Možný'}
                  </span>

                  <span
                    className={`ui-badge ${
                      exam.isDone
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                    }`}
                  >
                    {exam.isDone ? 'Hotovo' : 'Aktivní'}
                  </span>
                </div>

                <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {exam.duration} min
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    href={`/planner?edit=${exam.id}`}
                    className="ui-btn-small ui-btn-secondary w-full"
                  >
                    Upravit
                  </Link>

                  <form action={toggleExamAction.bind(null, exam.id, exam.isDone)}>
                    <button className="ui-btn-small ui-btn-secondary w-full" type="submit">
                      Přepnout stav
                    </button>
                  </form>

                  <form action={deleteExamAction.bind(null, exam.id)}>
                    <button className="ui-btn-danger w-full" type="submit">
                      Smazat
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}