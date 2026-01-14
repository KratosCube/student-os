'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// --- PŘEDMĚTY ---
export async function addSubject(formData: FormData) {
  const name = formData.get('name')?.toString() || "Bez názvu";
  const color = formData.get('color')?.toString() || "#cccccc";

  await prisma.subject.create({
    data: { name, color },
  });
  revalidatePath('/');
}

// --- ZKOUŠKY ---
export async function addExam(formData: FormData) {
  // Bezpečný převod na číslo
  const subjectIdRaw = formData.get('subjectId');
  const subjectId = subjectIdRaw ? parseInt(subjectIdRaw.toString()) : null;

  const dateStr = formData.get('date')?.toString();
  const type = formData.get('type')?.toString() || 'potential';
  const durationRaw = formData.get('duration');
  const duration = durationRaw ? parseInt(durationRaw.toString()) : 90;

  if (!subjectId || !dateStr) {
    // Tady by to chtělo vrátit error, ale pro teď to jen ignorujeme
    return;
  }

  await prisma.exam.create({
    data: {
      date: new Date(dateStr),
      type,
      duration,
      subjectId,
    },
  });
  revalidatePath('/');
}

export async function toggleExam(id: number, isDone: boolean) {
  await prisma.exam.update({ where: { id }, data: { isDone: !isDone } });
  revalidatePath('/');
}

export async function deleteExam(id: number) {
  await prisma.exam.delete({ where: { id } });
  revalidatePath('/');
}

// --- LOGOVÁNÍ UČENÍ ---
export async function logStudySession(subjectId: number, minutes: number) {
  await prisma.studySession.create({
    data: {
      subjectId,
      duration: minutes,
    },
  });
  revalidatePath('/');
}