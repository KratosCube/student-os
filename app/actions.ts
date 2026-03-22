'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { FormState } from '@/lib/form-state';




const PATHS_TO_REVALIDATE = ['/', '/planner', '/subjects', '/stats'];

function revalidateAllPages() {
  PATHS_TO_REVALIDATE.forEach((path) => revalidatePath(path));
}

function zodErrorsToObject(error: z.ZodError) {
  return error.issues.reduce<Record<string, string>>((acc, issue) => {
    const key = String(issue.path[0] ?? 'form');
    acc[key] = issue.message;
    return acc;
  }, {});
}

const subjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Název předmětu musí mít alespoň 2 znaky.')
    .max(50, 'Název předmětu je příliš dlouhý.'),
  color: z.string().regex(/^#([A-Fa-f0-9]{6})$/, 'Barva musí být validní HEX kód.'),
});

const examSchema = z
  .object({
    subjectId: z.coerce.number().int().positive('Vyber předmět.'),
    date: z.string().min(1, 'Vyber datum a čas.'),
    type: z.enum(['confirmed', 'potential']),
    duration: z.coerce
      .number()
      .int()
      .min(15, 'Délka musí být alespoň 15 minut.')
      .max(480, 'Délka nesmí být větší než 480 minut.'),
  })
  .superRefine((data, ctx) => {
    const date = new Date(data.date);

    if (Number.isNaN(date.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['date'],
        message: 'Datum a čas nejsou platné.',
      });
    }
  });

const studySessionSchema = z
  .object({
    subjectId: z.coerce.number().int().positive('Vyber předmět.'),
    duration: z.coerce
      .number()
      .int()
      .min(5, 'Minimální délka je 5 minut.')
      .max(600, 'Maximální délka je 600 minut.'),
    createdAt: z.string().min(1, 'Vyber datum a čas.'),
  })
  .superRefine((data, ctx) => {
    const date = new Date(data.createdAt);

    if (Number.isNaN(date.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['createdAt'],
        message: 'Datum a čas nejsou platné.',
      });
    }
  });

export async function addSubjectAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = subjectSchema.safeParse({
    name: formData.get('name'),
    color: formData.get('color'),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: 'Formulář obsahuje chyby.',
      errors: zodErrorsToObject(parsed.error),
    };
  }

  await prisma.subject.create({
    data: parsed.data,
  });

  revalidateAllPages();

  return {
    success: true,
    message: 'Předmět byl vytvořen.',
    errors: {},
  };
}

export async function updateSubjectAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const subjectId = Number(formData.get('subjectId'));

  if (!subjectId) {
    return {
      success: false,
      message: 'Chybí ID předmětu.',
      errors: { form: 'Chybí ID předmětu.' },
    };
  }

  const parsed = subjectSchema.safeParse({
    name: formData.get('name'),
    color: formData.get('color'),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: 'Formulář obsahuje chyby.',
      errors: zodErrorsToObject(parsed.error),
    };
  }

  await prisma.subject.update({
    where: { id: subjectId },
    data: parsed.data,
  });

  revalidateAllPages();

  return {
    success: true,
    message: 'Předmět byl upraven.',
    errors: {},
  };
}

export async function deleteSubjectAction(id: number) {
  await prisma.subject.delete({
    where: { id },
  });

  revalidateAllPages();
}

export async function addExamAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = examSchema.safeParse({
    subjectId: formData.get('subjectId'),
    date: formData.get('date'),
    type: formData.get('type'),
    duration: formData.get('duration'),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: 'Formulář obsahuje chyby.',
      errors: zodErrorsToObject(parsed.error),
    };
  }

  await prisma.exam.create({
    data: {
      subjectId: parsed.data.subjectId,
      date: new Date(parsed.data.date),
      type: parsed.data.type,
      duration: parsed.data.duration,
    },
  });

  revalidateAllPages();

  return {
    success: true,
    message: 'Termín byl přidán.',
    errors: {},
  };
}

export async function updateExamAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const examId = Number(formData.get('examId'));

  if (!examId) {
    return {
      success: false,
      message: 'Chybí ID termínu.',
      errors: { form: 'Chybí ID termínu.' },
    };
  }

  const parsed = examSchema.safeParse({
    subjectId: formData.get('subjectId'),
    date: formData.get('date'),
    type: formData.get('type'),
    duration: formData.get('duration'),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: 'Formulář obsahuje chyby.',
      errors: zodErrorsToObject(parsed.error),
    };
  }

  await prisma.exam.update({
    where: { id: examId },
    data: {
      subjectId: parsed.data.subjectId,
      date: new Date(parsed.data.date),
      type: parsed.data.type,
      duration: parsed.data.duration,
    },
  });

  revalidateAllPages();

  return {
    success: true,
    message: 'Termín byl upraven.',
    errors: {},
  };
}

export async function toggleExamAction(id: number, isDone: boolean) {
  await prisma.exam.update({
    where: { id },
    data: { isDone: !isDone },
  });

  revalidateAllPages();
}

export async function deleteExamAction(id: number) {
  await prisma.exam.delete({
    where: { id },
  });

  revalidateAllPages();
}

export async function addStudySessionAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = studySessionSchema.safeParse({
    subjectId: formData.get('subjectId'),
    duration: formData.get('duration'),
    createdAt: formData.get('createdAt'),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: 'Formulář obsahuje chyby.',
      errors: zodErrorsToObject(parsed.error),
    };
  }

  await prisma.studySession.create({
    data: {
      subjectId: parsed.data.subjectId,
      duration: parsed.data.duration,
      createdAt: new Date(parsed.data.createdAt),
    },
  });

  revalidateAllPages();

  return {
    success: true,
    message: 'Studijní session byla uložena.',
    errors: {},
  };
}

export async function logStudySession(subjectId: number, minutes: number) {
  if (!Number.isInteger(subjectId) || subjectId <= 0) return;
  if (!Number.isInteger(minutes) || minutes <= 0) return;

  await prisma.studySession.create({
    data: {
      subjectId,
      duration: minutes,
    },
  });

  revalidateAllPages();
}