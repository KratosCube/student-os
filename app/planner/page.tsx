import { prisma } from '@/lib/prisma';
import PlannerExamForm from '@/components/PlannerExamForm';
import ExamTable from '@/components/ExamTable';

export const dynamic = 'force-dynamic';

type PlannerPageProps = {
  searchParams?: Promise<{
    edit?: string;
  }>;
};

export default async function PlannerPage({ searchParams }: PlannerPageProps) {
  const resolvedSearchParams = await searchParams;
  const editId = Number(resolvedSearchParams?.edit);

  const subjects = await prisma.subject.findMany({
    orderBy: { name: 'asc' },
  });

  const exams = await prisma.exam.findMany({
    include: { subject: true },
    orderBy: { date: 'asc' },
  });

  const selectedExam = exams.find((exam) => exam.id === editId) ?? null;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">
          Planner
        </p>
        <h2 className="mt-2 text-3xl font-bold">Správa zkoušek a termínů</h2>
        <p className="mt-2 max-w-3xl text-slate-500 dark:text-slate-400">
          Tohle je druhá hlavní obrazovka. Obsahuje formulář a hlavně tabulku termínů,
          která je pro seminárku nejdůležitější datová komponenta.
        </p>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[380px,1fr]">
        <PlannerExamForm subjects={subjects} selectedExam={selectedExam} />
        <ExamTable exams={exams} />
      </div>
    </div>
  );
}