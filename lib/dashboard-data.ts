import { prisma } from '@/lib/prisma';
import {
  addDays,
  format,
  isSameDay,
  startOfDay,
  subDays,
} from 'date-fns';

export async function getDashboardData() {
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

  const exams = await prisma.exam.findMany({
    include: { subject: true },
    orderBy: { date: 'asc' },
  });

  const now = new Date();
  const todayStart = startOfDay(now);
  const sevenDaysAgo = subDays(todayStart, 6);

  const todayTotalMinutes = subjects.reduce((total, subject) => {
    return (
      total +
      subject.sessions
        .filter((session) => isSameDay(new Date(session.createdAt), now))
        .reduce((sum, session) => sum + session.duration, 0)
    );
  }, 0);

  const weekTotalMinutes = subjects.reduce((total, subject) => {
    return (
      total +
      subject.sessions
        .filter((session) => new Date(session.createdAt) >= sevenDaysAgo)
        .reduce((sum, session) => sum + session.duration, 0)
    );
  }, 0);

  const lifetimeMinutes = subjects.reduce((total, subject) => {
    return total + subject.sessions.reduce((sum, session) => sum + session.duration, 0);
  }, 0);

  const totalLifetimeCredits = Math.floor(lifetimeMinutes / 45);

  const activeExams = exams.filter((exam) => !exam.isDone);
  const todayExams = activeExams.filter((exam) => isSameDay(new Date(exam.date), now));

  const weeklySeries = Array.from({ length: 7 }, (_, index) => {
    const day = addDays(sevenDaysAgo, index);

    const minutes = subjects.reduce((total, subject) => {
      return (
        total +
        subject.sessions
          .filter((session) => isSameDay(new Date(session.createdAt), day))
          .reduce((sum, session) => sum + session.duration, 0)
      );
    }, 0);

    return {
      label: format(day, 'dd.MM'),
      value: minutes,
    };
  });

  const subjectSeries = subjects
    .map((subject) => ({
      label: subject.name,
      value: subject.sessions.reduce((sum, session) => sum + session.duration, 0),
      color: subject.color,
    }))
    .sort((a, b) => b.value - a.value);

  return {
    subjects,
    exams,
    activeExams,
    todayExams,
    todayTotalMinutes,
    weekTotalMinutes,
    lifetimeMinutes,
    totalLifetimeCredits,
    weeklySeries,
    subjectSeries,
  };
}