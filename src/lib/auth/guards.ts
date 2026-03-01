import { type Session } from 'next-auth';
import { db } from '@/lib/db';

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export function requireAuth(session: Session | null): Session {
  if (!session?.user) {
    throw new AuthError('אנא התחבר למערכת');
  }
  return session;
}

export function requireRole(session: Session | null, ...roles: string[]): Session {
  const authed = requireAuth(session);
  if (!roles.includes(authed.user.role)) {
    throw new AuthError('אין לך הרשאה לבצע פעולה זו');
  }
  return authed;
}

export async function canAccessJob(session: Session, jobId: string): Promise<boolean> {
  if (['ADMIN', 'HR_MANAGER'].includes(session.user.role)) return true;

  if (session.user.role === 'RECRUITER') {
    const job = await db.job.findUnique({
      where: { id: jobId },
      select: { recruiterId: true },
    });
    return job?.recruiterId === session.user.id;
  }

  return session.user.role === 'VIEWER';
}

export async function canAccessApplication(session: Session, applicationId: string): Promise<boolean> {
  if (['ADMIN', 'HR_MANAGER'].includes(session.user.role)) return true;

  if (session.user.role === 'RECRUITER') {
    const application = await db.application.findUnique({
      where: { id: applicationId },
      include: { job: { select: { recruiterId: true } } },
    });
    return application?.job.recruiterId === session.user.id;
  }

  return session.user.role === 'VIEWER';
}

export function getRecruiterFilter(session: Session) {
  if (['ADMIN', 'HR_MANAGER', 'VIEWER'].includes(session.user.role)) {
    return {};
  }
  return { recruiterId: session.user.id };
}
