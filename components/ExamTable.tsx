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

export default function ExamTable({ exams }: { exams: Exam[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4">
        <h3 className="text-xl font-bold">Tabulka termínů</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Smysluplná tabulka nad datovým modelem – ne jen seznam tlačítek.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-sm text-slate-500 dark:text-slate-400">
              <th className="px-4 py-2">Předmět</th>
              <th className="px-4 py-2">Datum</th>
              <th className="px-4 py-2">Typ</th>
              <th className="px-4 py-2">Délka</th>
              <th className="px-4 py-2">Stav</th>
              <th className="px-4 py-2">Akce</th>
            </tr>
          </thead>

          <tbody>
            {exams.map((exam) => (
              <tr
                key={exam.id}
                className="rounded-2xl bg-slate-50 text-sm dark:bg-slate-950"
              >
                <td className="rounded-l-2xl px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: exam.subject?.color ?? '#6366f1' }}
                    />
                    <span className="font-semibold">{exam.subject?.name ?? 'Bez předmětu'}</span>
                  </div>
                </td>

                <td className="px-4 py-4">
                  {new Date(exam.date).toLocaleString('cs-CZ')}
                </td>

                <td className="px-4 py-4">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold dark:bg-slate-900">
                    {exam.type === 'confirmed' ? 'Potvrzeno' : 'Možný'}
                  </span>
                </td>

                <td className="px-4 py-4">{exam.duration} min</td>

                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      exam.isDone
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
                    }`}
                  >
                    {exam.isDone ? 'Hotovo' : 'Aktivní'}
                  </span>
                </td>

                <td className="rounded-r-2xl px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/planner?edit=${exam.id}`}
                      className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold hover:bg-white dark:border-slate-700 dark:hover:bg-slate-900"
                    >
                      Upravit
                    </Link>

                    <form action={toggleExamAction.bind(null, exam.id, exam.isDone)}>
                      <button
                        className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold hover:bg-white dark:border-slate-700 dark:hover:bg-slate-900"
                        type="submit"
                      >
                        Přepnout stav
                      </button>
                    </form>

                    <form action={deleteExamAction.bind(null, exam.id)}>
                      <button
                        className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700"
                        type="submit"
                      >
                        Smazat
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {exams.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="rounded-2xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400"
                >
                  Zatím nejsou žádné termíny.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}