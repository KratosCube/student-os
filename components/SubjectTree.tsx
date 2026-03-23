import Link from 'next/link';
import { deleteSubjectAction } from '@/app/actions';

type Subject = {
  id: number;
  name: string;
  color: string;
  exams: {
    id: number;
    date: Date | string;
    type: string;
    duration: number;
    isDone: boolean;
  }[];
  sessions: {
    id: number;
    createdAt: Date | string;
    duration: number;
  }[];
};

export default function SubjectTree({ subjects }: { subjects: Subject[] }) {
  return (
    <div className="ui-card p-6">
      <div className="mb-6">
        <h3 className="ui-section-title">Hierarchický přehled dat</h3>
      </div>

      <div className="space-y-4">
        {subjects.map((subject) => (
          <details
            key={subject.id}
            className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
            open
          >
            <summary className="cursor-pointer list-none">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: subject.color }}
                  />
                  <div>
                    <p className="font-semibold">{subject.name}</p>
                    <p className="ui-text-secondary">
                      {subject.exams.length} termínů · {subject.sessions.length} session
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/subjects?edit=${subject.id}`}
                    className="ui-btn-small ui-btn-secondary"
                  >
                    Upravit
                  </Link>

                  <form action={deleteSubjectAction.bind(null, subject.id)}>
                    <button type="submit" className="ui-btn-danger">
                      Smazat
                    </button>
                  </form>
                </div>
              </div>
            </summary>

            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="mb-3 text-sm font-semibold">Termíny</p>
                <div className="space-y-2 text-sm">
                  {subject.exams.length === 0 ? (
                    <p className="ui-text-secondary">Žádné termíny</p>
                  ) : (
                    subject.exams.map((exam) => (
                      <div
                        key={exam.id}
                        className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
                      >
                        <p className="font-medium">
                          {new Date(exam.date).toLocaleString('cs-CZ')}
                        </p>
                        <p className="ui-text-secondary">
                          {exam.duration} min ·{' '}
                          {exam.type === 'confirmed' ? 'Potvrzený' : 'Možný'} ·{' '}
                          {exam.isDone ? 'Hotovo' : 'Aktivní'}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="mb-3 text-sm font-semibold">Studijní session</p>
                <div className="space-y-2 text-sm">
                  {subject.sessions.length === 0 ? (
                    <p className="ui-text-secondary">Žádné session</p>
                  ) : (
                    subject.sessions.slice(0, 10).map((session) => (
                      <div
                        key={session.id}
                        className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
                      >
                        <p className="font-medium">
                          {new Date(session.createdAt).toLocaleString('cs-CZ')}
                        </p>
                        <p className="ui-text-secondary">
                          {session.duration} minut
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </details>
        ))}

        {subjects.length === 0 ? (
          <p className="ui-text-secondary">Nejprve přidej alespoň jeden předmět.</p>
        ) : null}
      </div>
    </div>
  );
}