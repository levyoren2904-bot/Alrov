'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { requireRole } from '@/lib/auth/guards';
import { jobSchema, type JobInput } from '@/lib/validations/job';

export async function createJob(input: JobInput) {
  const session = await auth();
  requireRole(session, 'ADMIN', 'HR_MANAGER');

  const validated = jobSchema.parse(input);

  const job = await db.job.create({
    data: {
      ...validated,
      publishedAt: validated.status === 'PUBLISHED' ? new Date() : null,
    },
  });

  return { success: true, job };
}

export async function updateJob(id: string, input: JobInput) {
  const session = await auth();
  requireRole(session, 'ADMIN', 'HR_MANAGER');

  const validated = jobSchema.parse(input);

  const existing = await db.job.findUnique({ where: { id } });
  if (!existing) return { error: 'משרה לא נמצאה' };

  const publishedAt =
    validated.status === 'PUBLISHED' && existing.status !== 'PUBLISHED'
      ? new Date()
      : existing.publishedAt;

  const closedAt =
    validated.status === 'CLOSED' && existing.status !== 'CLOSED'
      ? new Date()
      : existing.closedAt;

  const job = await db.job.update({
    where: { id },
    data: {
      ...validated,
      publishedAt,
      closedAt,
    },
  });

  return { success: true, job };
}

export async function publishJob(id: string) {
  const session = await auth();
  requireRole(session, 'ADMIN', 'HR_MANAGER');

  const job = await db.job.update({
    where: { id },
    data: {
      status: 'PUBLISHED',
      publishedAt: new Date(),
      closedAt: null,
    },
  });

  return { success: true, job };
}

export async function closeJob(id: string) {
  const session = await auth();
  requireRole(session, 'ADMIN', 'HR_MANAGER');

  const job = await db.job.update({
    where: { id },
    data: {
      status: 'CLOSED',
      closedAt: new Date(),
    },
  });

  return { success: true, job };
}
