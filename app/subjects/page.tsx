import { prisma } from '@/lib/prisma';
import SubjectForm from '@/components/SubjectForm';
import StudySessionForm from '@/components/StudySessionForm';
import SubjectTree from '@/components/SubjectTree';

export const dynamic = 'force-dynamic';

type SubjectsPageProps = {
  searchParams?: Promise<{
    edit?: string;
  }>;
};

export default async function SubjectsPage({ searchParams }: SubjectsPageProps) {
  const resolvedSearchParams = await searchParams;
  const editId = Number(resolvedSearchParams?.edit);

  const subjects = await prisma.subject.findMany({
    include: {
      exams: {
        orderBy: { date: 'asc' },
      },
      sessions: {
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { name: 'asc' },
  });

  const selectedSubject = subjects.find((subject) => subject.id === editId) ?? null;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">
          Subjects
        </p>
        <h2 className="mt-2 text-3xl font-bold">Předměty a studijní historie</h2>
        <p className="mt-2 max-w-3xl text-slate-500 dark:text-slate-400">
          Třetí smysluplná obrazovka – správa předmětů, ruční zápis studijních session a
          hierarchický přehled navázaných dat.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <SubjectForm selectedSubject={selectedSubject} />
        <StudySessionForm subjects={subjects} />
      </div>

      <SubjectTree subjects={subjects} />
    </div>
  );
}