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
  <div className="w-full space-y-5">
    <section className="ui-card p-6">
      <p className="ui-eyebrow">Planner</p>
      <h2 className="ui-page-title mt-2">Správa zkoušek a termínů</h2>
    </section>

    <div className="grid items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <PlannerExamForm subjects={subjects} selectedExam={selectedExam} />
      <div className="min-w-0">
        <ExamTable exams={exams} />
      </div>
    </div>
  </div>
);
}