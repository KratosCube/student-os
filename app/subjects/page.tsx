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
    <div className="space-y-5">
      <section className="ui-card p-6">
        <p className="ui-eyebrow">Subjects</p>
        <h2 className="ui-page-title mt-2">Předměty a studijní historie</h2>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-2">
        <SubjectForm selectedSubject={selectedSubject} />
        <StudySessionForm subjects={subjects} />
      </div>

      <SubjectTree subjects={subjects} />
    </div>
  );
}